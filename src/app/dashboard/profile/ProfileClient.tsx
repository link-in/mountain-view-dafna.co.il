'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

const ProfileClient = () => {
  const { data: session, update } = useSession()
  const [editing, setEditing] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [landingPageUrl, setLandingPageUrl] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Update form fields when session loads
  useEffect(() => {
    if (session?.user) {
      setDisplayName(session.user.displayName ?? '')
      setEmail(session.user.email ?? '')
      setLandingPageUrl(session.user.landingPageUrl ?? '')
      setPhoneNumber(session.user.phoneNumber ?? '')
    }
  }, [session])

  const handleSave = async () => {
    setError(null)
    setSuccess(null)

    if (!displayName.trim()) {
      setError('יש להזין שם תצוגה')
      return
    }

    if (newPassword && newPassword !== confirmPassword) {
      setError('הסיסמאות אינן תואמות')
      return
    }

    if (newPassword && newPassword.length < 6) {
      setError('סיסמה חדשה חייבת להכיל לפחות 6 תווים')
      return
    }

    setSaving(true)

    try {
      const response = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          displayName: displayName.trim(),
          email: email.trim(),
          landingPageUrl: landingPageUrl.trim(),
          phoneNumber: phoneNumber.trim(),
          ...(newPassword ? { currentPassword, newPassword } : {}),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'עדכון נכשל')
      }

      const responseData = await response.json()
      
      // Update session with new data
      await update({ 
        displayName: displayName.trim(),
        landingPageUrl: landingPageUrl.trim(),
        phoneNumber: phoneNumber.trim()
      })
      
      setSuccess('הפרטים עודכנו בהצלחה')
      setEditing(false)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'עדכון נכשל')
    } finally {
      setSaving(false)
    }
  }

  if (!session?.user) {
    return (
      <main className="bg-light" style={{ minHeight: '100vh' }} dir="rtl">
        <div className="container py-5">
          <div className="text-center">טוען...</div>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-light" style={{ minHeight: '100vh' }} dir="rtl">
      <div className="container py-5">
        <div className="mb-4">
          <Link href="/dashboard" className="btn btn-outline-secondary btn-sm">
            ← חזרה לדשבורד
          </Link>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h1 className="h4 fw-bold mb-4">איזור אישי</h1>

                {error ? (
                  <div className="alert alert-danger py-2 mb-3" role="alert">
                    {error}
                  </div>
                ) : null}

                {success ? (
                  <div className="alert alert-success py-2 mb-3" role="alert">
                    {success}
                  </div>
                ) : null}

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">שם תצוגה</label>
                    <input
                      type="text"
                      className="form-control"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      disabled={!editing}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">אימייל</label>
                    <input
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={!editing}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">כתובת דף נחיתה</label>
                    <input
                      type="url"
                      className="form-control"
                      value={landingPageUrl}
                      onChange={(e) => setLandingPageUrl(e.target.value)}
                      disabled={!editing}
                      placeholder="https://example.com"
                    />
                    <small className="text-muted">כתובת URL של דף הנחיתה של היחידה</small>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">
                      מספר WhatsApp לקבלת התראות 
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      disabled={!editing}
                      placeholder="+972501234567"
                      dir="ltr"
                    />
                    <small className="text-muted">
                      📱 מספר טלפון עם קידומת מדינה (לדוגמה: +972501234567) לקבלת התראות על הזמנות חדשות ב-WhatsApp
                    </small>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small text-muted">Property ID</label>
                    <input
                      type="text"
                      className="form-control bg-light"
                      value={session.user.propertyId}
                      disabled
                      readOnly
                    />
                    <small className="text-muted">לא ניתן לעריכה - קשור ל-Beds24</small>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small text-muted">Room ID</label>
                    <input
                      type="text"
                      className="form-control bg-light"
                      value={session.user.roomId}
                      disabled
                      readOnly
                    />
                    <small className="text-muted">לא ניתן לעריכה - קשור ל-Beds24</small>
                  </div>

                  {editing ? (
                    <>
                      <div className="col-12">
                        <hr className="my-3" />
                        <h3 className="h6 fw-semibold mb-3">שינוי סיסמה (אופציונלי)</h3>
                      </div>

                      <div className="col-12">
                        <label className="form-label small fw-semibold">סיסמה נוכחית</label>
                        <input
                          type="password"
                          className="form-control"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="הזן סיסמה נוכחית"
                        />
                      </div>

                      <div className="col-12 col-md-6">
                        <label className="form-label small fw-semibold">סיסמה חדשה</label>
                        <input
                          type="password"
                          className="form-control"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="לפחות 6 תווים"
                        />
                      </div>

                      <div className="col-12 col-md-6">
                        <label className="form-label small fw-semibold">אימות סיסמה</label>
                        <input
                          type="password"
                          className="form-control"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="הזן שוב"
                        />
                      </div>
                    </>
                  ) : null}

                  <div className="col-12 d-flex gap-2 mt-3">
                    {editing ? (
                      <>
                        <button
                          type="button"
                          className="btn btn-success"
                          onClick={handleSave}
                          disabled={saving}
                        >
                          {saving ? 'שומר...' : 'שמירה'}
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => {
                            setEditing(false)
                            setDisplayName(session?.user?.displayName ?? '')
                            setEmail(session?.user?.email ?? '')
                            setLandingPageUrl(session?.user?.landingPageUrl ?? '')
                            setPhoneNumber(session?.user?.phoneNumber ?? '')
                            setCurrentPassword('')
                            setNewPassword('')
                            setConfirmPassword('')
                            setError(null)
                            setSuccess(null)
                          }}
                        >
                          ביטול
                        </button>
                      </>
                    ) : (
                      <button type="button" className="btn btn-primary" onClick={() => setEditing(true)}>
                        עריכת פרטים
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default ProfileClient
