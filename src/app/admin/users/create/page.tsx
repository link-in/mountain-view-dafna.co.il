'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CreateUserPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    firstName: '',
    lastName: '',
    propertyId: '',
    roomId: '',
    landingPageUrl: '',
    phoneNumber: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch('/api/admin/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create user')
      }

      setSuccess(true)
      // Reset form
      setFormData({
        email: '',
        password: '',
        displayName: '',
        firstName: '',
        lastName: '',
        propertyId: '',
        roomId: '',
        landingPageUrl: '',
        phoneNumber: '',
      })

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/admin/users')
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה ביצירת משתמש')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div dir="rtl" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)' }}>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card border-0 shadow-lg" style={{ borderRadius: '16px' }}>
              <div 
                className="card-header border-0 text-white"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '16px 16px 0 0',
                  padding: '1.5rem',
                }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <h1 className="h4 mb-0 fw-bold">הוספת לקוח חדש (יחידת אירוח)</h1>
                  <Link href="/admin/users">
                    <button className="btn btn-light btn-sm">
                      ← חזרה לרשימה
                    </button>
                  </Link>
                </div>
              </div>

              <div className="card-body p-4">
                {error && (
                  <div className="alert alert-danger mb-4" role="alert">
                    <strong>שגיאה:</strong> {error}
                  </div>
                )}

                {success && (
                  <div className="alert alert-success mb-4" role="alert">
                    <strong>הצלחה!</strong> המשתמש נוצר בהצלחה. מעביר לרשימת משתמשים...
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-12">
                      <div className="alert alert-info">
                        <strong>📋 מה אתה צריך מ-Beds24:</strong>
                        <ul className="mb-0 mt-2">
                          <li>Property ID - Beds24 → Settings → Property</li>
                          <li>Room ID - Beds24 → Settings → Rooms</li>
                        </ul>
                      </div>
                    </div>

                    <div className="col-12">
                      <h5 className="text-muted mb-3">פרטי חשבון</h5>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        אימייל <span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        required
                        placeholder="user@example.com"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        סיסמה <span className="text-danger">*</span>
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        value={formData.password}
                        onChange={(e) => handleChange('password', e.target.value)}
                        required
                        minLength={6}
                        placeholder="לפחות 6 תווים"
                      />
                    </div>

                    <div className="col-12">
                      <h5 className="text-muted mb-3 mt-3">פרטים אישיים</h5>
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold">
                        שם תצוגה (שם היחידה) <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.displayName}
                        onChange={(e) => handleChange('displayName', e.target.value)}
                        required
                        placeholder="למשל: דירת נופש בתל אביב"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">שם פרטי</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.firstName}
                        onChange={(e) => handleChange('firstName', e.target.value)}
                        placeholder="שם פרטי"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">שם משפחה</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.lastName}
                        onChange={(e) => handleChange('lastName', e.target.value)}
                        placeholder="שם משפחה"
                      />
                    </div>

                    <div className="col-12">
                      <h5 className="text-muted mb-3 mt-3">חיבור ל-Beds24</h5>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Property ID <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.propertyId}
                        onChange={(e) => handleChange('propertyId', e.target.value)}
                        required
                        placeholder="306559"
                      />
                      <small className="text-muted">מ-Beds24: Settings → Property</small>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Room ID <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.roomId}
                        onChange={(e) => handleChange('roomId', e.target.value)}
                        required
                        placeholder="638851"
                      />
                      <small className="text-muted">מ-Beds24: Settings → Rooms</small>
                    </div>

                    <div className="col-12">
                      <h5 className="text-muted mb-3 mt-3">פרטים נוספים (אופציונלי)</h5>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">כתובת אתר</label>
                      <input
                        type="url"
                        className="form-control"
                        value={formData.landingPageUrl}
                        onChange={(e) => handleChange('landingPageUrl', e.target.value)}
                        placeholder="https://example.com"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">טלפון</label>
                      <input
                        type="tel"
                        className="form-control"
                        value={formData.phoneNumber}
                        onChange={(e) => handleChange('phoneNumber', e.target.value)}
                        placeholder="+972501234567"
                      />
                    </div>

                    <div className="col-12 mt-4">
                      <div className="d-flex gap-2 justify-content-end">
                        <Link href="/admin/users">
                          <button type="button" className="btn btn-secondary">
                            ביטול
                          </button>
                        </Link>
                        <button 
                          type="submit" 
                          className="btn btn-primary"
                          disabled={loading}
                          style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            border: 'none',
                          }}
                        >
                          {loading ? 'יוצר משתמש...' : '✅ צור משתמש'}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div className="alert alert-warning mt-4">
              <strong>⚠️ חשוב:</strong> לאחר יצירת המשתמש, שלח למשתמש את:
              <ul className="mb-0 mt-2">
                <li>כתובת הכניסה: <code>https://mountain-view-dafna.co.il/dashboard/login</code></li>
                <li>אימייל ההתחברות</li>
                <li>הסיסמה שהגדרת</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
