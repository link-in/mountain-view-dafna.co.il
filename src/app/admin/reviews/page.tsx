'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Container, Row, Col, Card, Button, Table, Badge, Alert, Spinner } from 'react-bootstrap'
import { Icon } from '@iconify/react'

interface SyncStats {
  booking: { fetched: number; saved: number; errors: number }
  airbnb: { fetched: number; saved: number; errors: number }
  google: { fetched: number; saved: number; errors: number }
  total: { fetched: number; saved: number; errors: number }
  timestamp: string
}

interface DatabaseStats {
  totalReviews: number
  bySource: { [key: string]: number }
  averageRating: number
  lastSync: string | null
}

export default function ReviewsManagementPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [syncing, setSyncing] = useState(false)
  const [syncStats, setSyncStats] = useState<SyncStats | null>(null)
  const [dbStats, setDbStats] = useState<DatabaseStats | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loadingStats, setLoadingStats] = useState(true)

  // Fetch database stats
  useEffect(() => {
    if (status === 'authenticated') {
      fetchStats()
    }
  }, [status])

  const fetchStats = async () => {
    try {
      setLoadingStats(true)
      const response = await fetch('/api/admin/reviews/sync')
      const data = await response.json()

      if (data.success) {
        setDbStats(data.stats)
      }
    } catch (err) {
      console.error('Error fetching stats:', err)
    } finally {
      setLoadingStats(false)
    }
  }

  const handleSync = async () => {
    setSyncing(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/admin/reviews/sync', {
        method: 'POST',
      })

      const data = await response.json()

      if (data.success) {
        setSyncStats(data.stats)
        setSuccess(`סנכרון הושלם בהצלחה! ${data.stats.total.saved} ביקורות נשמרו מתוך ${data.stats.total.fetched}`)
        await fetchStats() // Refresh stats
      } else {
        setError(data.error || 'שגיאה בסנכרון')
      }
    } catch (err) {
      setError('שגיאה בחיבור לשרת')
      console.error('Error syncing reviews:', err)
    } finally {
      setSyncing(false)
    }
  }

  // Redirect if not authenticated
  if (status === 'loading') {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    )
  }

  if (status === 'unauthenticated') {
    router.push('/auth/signin')
    return null
  }

  return (
    <Container fluid className="py-4" style={{ direction: 'rtl' }}>
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center gap-3 mb-3">
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon icon="mdi:comment-quote" style={{ fontSize: '24px', color: 'white' }} />
            </div>
            <div>
              <h1 className="mb-0" style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827' }}>
                ניהול ביקורות
              </h1>
              <p className="text-muted mb-0">סנכרון וניהול ביקורות אורחים מכל הפלטפורמות</p>
            </div>
          </div>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          <Icon icon="mdi:alert-circle" className="me-2" />
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess(null)}>
          <Icon icon="mdi:check-circle" className="me-2" />
          {success}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'rgba(13, 148, 136, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon icon="mdi:comment-multiple" style={{ fontSize: '20px', color: '#0d9488' }} />
                </div>
                <Badge bg="success" className="px-3 py-2">
                  פעיל
                </Badge>
              </div>
              <h3 className="mb-1" style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>
                {loadingStats ? '...' : dbStats?.totalReviews || 0}
              </h3>
              <p className="text-muted mb-0" style={{ fontSize: '14px' }}>
                סך הכל ביקורות
              </p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'rgba(245, 158, 11, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon icon="mdi:star" style={{ fontSize: '20px', color: '#f59e0b' }} />
                </div>
              </div>
              <h3 className="mb-1" style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>
                {loadingStats ? '...' : dbStats?.averageRating.toFixed(1) || '0.0'}
              </h3>
              <p className="text-muted mb-0" style={{ fontSize: '14px' }}>
                דירוג ממוצע
              </p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'rgba(59, 130, 246, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon icon="mdi:clock-outline" style={{ fontSize: '20px', color: '#3b82f6' }} />
                </div>
              </div>
              <h3 className="mb-1" style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                {loadingStats
                  ? '...'
                  : dbStats?.lastSync
                    ? new Date(dbStats.lastSync).toLocaleDateString('he-IL')
                    : 'לא בוצע'}
              </h3>
              <p className="text-muted mb-0" style={{ fontSize: '14px' }}>
                סנכרון אחרון
              </p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex flex-column justify-content-center">
              <Button
                variant="primary"
                size="lg"
                onClick={handleSync}
                disabled={syncing}
                className="w-100 mb-2"
                style={{
                  background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
                  border: 'none',
                  fontWeight: 'bold',
                }}
              >
                {syncing ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    מסנכרן...
                  </>
                ) : (
                  <>
                    <Icon icon="mdi:sync" className="me-2" />
                    סנכרן ביקורות
                  </>
                )}
              </Button>
              <div className="text-muted" style={{ fontSize: '11px', textAlign: 'center' }}>
                סנכרון אוטומטי של הזמנות + ביקורות
              </div>
              
              <Button
                variant="outline-primary"
                onClick={() => router.push('/admin/reviews/update-names')}
                className="w-100 mt-3"
                style={{
                  fontWeight: '600',
                }}
              >
                <Icon icon="mdi:account-edit" className="me-2" />
                עדכון שמות ידני
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* By Source Statistics */}
      <Row className="mb-4">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-bottom" style={{ padding: '20px' }}>
              <h5 className="mb-0" style={{ fontWeight: 'bold', color: '#111827' }}>
                <Icon icon="mdi:source-branch" className="me-2" />
                התפלגות לפי מקור
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4}>
                  <div className="d-flex align-items-center gap-3 p-3 rounded" style={{ background: '#f8fafc' }}>
                    <img src="/logos/booking.svg" alt="Booking.com" style={{ height: '24px', width: 'auto' }} />
                    <div className="flex-grow-1">
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#003580' }}>
                        {loadingStats ? '...' : dbStats?.bySource?.booking || 0}
                      </div>
                      <div className="text-muted" style={{ fontSize: '14px' }}>
                        Booking.com
                      </div>
                    </div>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="d-flex align-items-center gap-3 p-3 rounded" style={{ background: '#f8fafc' }}>
                    <img src="/logos/airbnb.png" alt="Airbnb" style={{ height: '24px', width: 'auto' }} />
                    <div className="flex-grow-1">
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#FF5A5F' }}>
                        {loadingStats ? '...' : dbStats?.bySource?.airbnb || 0}
                      </div>
                      <div className="text-muted" style={{ fontSize: '14px' }}>
                        Airbnb
                      </div>
                    </div>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="d-flex align-items-center gap-3 p-3 rounded" style={{ background: '#f8fafc' }}>
                    <Icon icon="mdi:google" style={{ fontSize: '24px', color: '#4285F4' }} />
                    <div className="flex-grow-1">
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4285F4' }}>
                        {loadingStats ? '...' : dbStats?.bySource?.google || 0}
                      </div>
                      <div className="text-muted" style={{ fontSize: '14px' }}>
                        Google
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Last Sync Results */}
      {syncStats && (
        <Row>
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-bottom" style={{ padding: '20px' }}>
                <h5 className="mb-0" style={{ fontWeight: 'bold', color: '#111827' }}>
                  <Icon icon="mdi:information-outline" className="me-2" />
                  תוצאות סנכרון אחרון
                </h5>
              </Card.Header>
              <Card.Body>
                <Table responsive className="mb-0">
                  <thead>
                    <tr>
                      <th>מקור</th>
                      <th>נמשכו</th>
                      <th>נשמרו</th>
                      <th>שגיאות</th>
                      <th>סטטוס</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <img src="/logos/booking.svg" alt="Booking.com" style={{ height: '16px' }} className="me-2" />
                        Booking.com
                      </td>
                      <td>{syncStats.booking.fetched}</td>
                      <td>{syncStats.booking.saved}</td>
                      <td>{syncStats.booking.errors}</td>
                      <td>
                        {syncStats.booking.errors > 0 ? (
                          <Badge bg="warning">שגיאה</Badge>
                        ) : (
                          <Badge bg="success">הצלחה</Badge>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <img src="/logos/airbnb.png" alt="Airbnb" style={{ height: '16px' }} className="me-2" />
                        Airbnb
                      </td>
                      <td>{syncStats.airbnb.fetched}</td>
                      <td>{syncStats.airbnb.saved}</td>
                      <td>{syncStats.airbnb.errors}</td>
                      <td>
                        {syncStats.airbnb.errors > 0 ? (
                          <Badge bg="warning">שגיאה</Badge>
                        ) : syncStats.airbnb.fetched === 0 ? (
                          <Badge bg="secondary">לא זמין</Badge>
                        ) : (
                          <Badge bg="success">הצלחה</Badge>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Icon icon="mdi:google" className="me-2" style={{ fontSize: '16px', color: '#4285F4' }} />
                        Google
                      </td>
                      <td>{syncStats.google.fetched}</td>
                      <td>{syncStats.google.saved}</td>
                      <td>{syncStats.google.errors}</td>
                      <td>
                        {syncStats.google.errors > 0 ? (
                          <Badge bg="warning">שגיאה</Badge>
                        ) : syncStats.google.fetched === 0 ? (
                          <Badge bg="secondary">לא מוגדר</Badge>
                        ) : (
                          <Badge bg="success">הצלחה</Badge>
                        )}
                      </td>
                    </tr>
                    <tr style={{ fontWeight: 'bold', background: '#f8fafc' }}>
                      <td>סה"כ</td>
                      <td>{syncStats.total.fetched}</td>
                      <td>{syncStats.total.saved}</td>
                      <td>{syncStats.total.errors}</td>
                      <td>
                        {syncStats.total.errors > 0 ? (
                          <Badge bg="warning">עם שגיאות</Badge>
                        ) : (
                          <Badge bg="success">הצלחה</Badge>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </Table>
                <div className="mt-3 text-muted" style={{ fontSize: '13px' }}>
                  <Icon icon="mdi:clock-outline" className="me-1" />
                  זמן סנכרון: {new Date(syncStats.timestamp).toLocaleString('he-IL')}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Information Card */}
      <Row className="mt-4">
        <Col>
          <Card className="border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 100%)' }}>
            <Card.Body>
              <div className="d-flex gap-3">
                <Icon icon="mdi:information" style={{ fontSize: '24px', color: '#0d9488' }} />
                <div>
                  <h6 style={{ fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
                    מידע על סנכרון ביקורות
                  </h6>
                  <ul className="mb-0" style={{ fontSize: '14px', color: '#4b5563' }}>
                    <li>הסנכרון מושך ביקורות מ-Booking.com, Airbnb (דרך BEDS24) וגוגל</li>
                    <li>ביקורות קיימות מתעדכנות אוטומטית, ביקורות חדשות נוספות למערכת</li>
                    <li>הביקורות מוצגות אוטומטית באתר לאחר הסנכרון</li>
                    <li>יש להגדיר את מפתחות Google API ב-.env.local כדי למשוך ביקורות מגוגל</li>
                  </ul>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}
