'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Container, Card, Form, Button, Alert, Spinner, Table } from 'react-bootstrap'
import { Icon } from '@iconify/react'

interface Review {
  id: string
  userName: string
  rating: number
  comment: string
  date: string
  source: string
}

export default function UpdateReviewNamesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [names, setNames] = useState<Record<string, string>>({})

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    fetchAirbnbGuestReviews()
  }, [])

  const fetchAirbnbGuestReviews = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/reviews?source=airbnb')
      const data = await response.json()
      
      // Filter only "Airbnb Guest" reviews
      const guestReviews = data.filter((r: Review) => 
        r.userName && r.userName.startsWith('Airbnb Guest')
      )
      
      setReviews(guestReviews)
      
      // Initialize names object
      const initialNames: Record<string, string> = {}
      guestReviews.forEach((r: Review) => {
        initialNames[r.id] = ''
      })
      setNames(initialNames)
      
    } catch (err) {
      setError('Failed to load reviews')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleNameChange = (externalId: string, name: string) => {
    setNames(prev => ({
      ...prev,
      [externalId]: name
    }))
  }

  const handleSave = async (externalId: string) => {
    const name = names[externalId]?.trim()
    
    if (!name) {
      setError('Please enter a name')
      return
    }

    try {
      setSaving(true)
      setError('')
      setSuccess('')

      const response = await fetch('/api/admin/reviews/update-name', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          external_id: externalId,
          user_name: name,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update name')
      }

      setSuccess(`✅ שם עודכן בהצלחה: ${name}`)
      
      // Refresh reviews after 1 second
      setTimeout(() => {
        fetchAirbnbGuestReviews()
        setSuccess('')
      }, 1500)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveAll = async () => {
    try {
      setSaving(true)
      setError('')
      setSuccess('')

      let updated = 0
      let failed = 0

      for (const review of reviews) {
        const name = names[review.id]?.trim()
        
        if (!name) continue

        try {
          const response = await fetch('/api/admin/reviews/update-name', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              external_id: review.id,
              user_name: name,
            }),
          })

          if (response.ok) {
            updated++
          } else {
            failed++
          }
        } catch {
          failed++
        }
      }

      setSuccess(`✅ ${updated} שמות עודכנו, ${failed} נכשלו`)
      
      setTimeout(() => {
        fetchAirbnbGuestReviews()
        setSuccess('')
      }, 2000)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setSaving(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    )
  }

  if (!session) {
    return null
  }

  return (
    <Container className="py-5" dir="rtl">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          <h3 className="mb-0">
            <Icon icon="mdi:account-edit" className="me-2" />
            עדכון שמות אורחים - Airbnb
          </h3>
        </Card.Header>
        <Card.Body>
          {error && (
            <Alert variant="danger" onClose={() => setError('')} dismissible>
              {error}
            </Alert>
          )}

          {success && (
            <Alert variant="success" onClose={() => setSuccess('')} dismissible>
              {success}
            </Alert>
          )}

          {reviews.length === 0 ? (
            <Alert variant="info">
              <Icon icon="mdi:check-circle" className="me-2" />
              כל הביקורות כבר עם שמות אמיתיים! 🎉
            </Alert>
          ) : (
            <>
              <p className="text-muted mb-4">
                נמצאו <strong>{reviews.length}</strong> ביקורות ללא שם אמיתי.
                מלא את השמות על פי התוכן של הביקורת או השאר כ-"אורח Airbnb".
              </p>

              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th style={{ width: '15%' }}>תאריך</th>
                    <th style={{ width: '40%' }}>תוכן הביקורת</th>
                    <th style={{ width: '20%' }}>שם חדש</th>
                    <th style={{ width: '10%' }}>דירוג</th>
                    <th style={{ width: '15%' }}>פעולה</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((review) => (
                    <tr key={review.id}>
                      <td>
                        <small>
                          {review.date}
                        </small>
                      </td>
                      <td>
                        <small style={{ fontSize: '13px', lineHeight: '1.4' }}>
                          {review.comment.substring(0, 120)}...
                        </small>
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          size="sm"
                          placeholder="הכנס שם..."
                          value={names[review.id] || ''}
                          onChange={(e) => handleNameChange(review.id, e.target.value)}
                          disabled={saving}
                        />
                      </td>
                      <td>
                        <div style={{ color: '#ff9500', fontSize: '16px' }}>
                          {'★'.repeat(review.rating)}
                        </div>
                      </td>
                      <td>
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => handleSave(review.id)}
                          disabled={saving || !names[review.id]?.trim()}
                        >
                          <Icon icon="mdi:check" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <div className="text-center mt-4">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleSaveAll}
                  disabled={saving || Object.values(names).every(n => !n.trim())}
                  style={{
                    background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
                    border: 'none',
                    fontWeight: 'bold',
                  }}
                >
                  {saving ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      שומר...
                    </>
                  ) : (
                    <>
                      <Icon icon="mdi:content-save-all" className="me-2" />
                      שמור הכל
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  )
}
