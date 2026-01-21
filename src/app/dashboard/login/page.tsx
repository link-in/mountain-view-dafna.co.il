'use client'

import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'

const LoginPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('אימייל או סיסמה שגויים')
        setLoading(false)
        return
      }

      if (result?.ok) {
        const callbackUrl = searchParams.get('callbackUrl') ?? '/dashboard'
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (err) {
      setError('שגיאה בהתחברות. נסה שוב.')
      setLoading(false)
    }
  }

  return (
    <main className="bg-light d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }} dir="rtl">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6 col-lg-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <div className="text-center mb-4">
                  <h1 className="h4 fw-bold mb-2">התחברות לדשבורד</h1>
                  <p className="text-muted small">הזן את פרטי ההתחברות שלך</p>
                </div>

                {error ? (
                  <div className="alert alert-danger py-2 mb-3" role="alert">
                    {error}
                  </div>
                ) : null}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label small fw-semibold">
                      אימייל <span className="text-danger">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="form-control"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      disabled={loading}
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label small fw-semibold">
                      סיסמה <span className="text-danger">*</span>
                    </label>
                    <input
                      id="password"
                      type="password"
                      className="form-control"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      disabled={loading}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                    {loading ? 'מתחבר...' : 'התחבר'}
                  </button>
                </form>

                <div className="text-center mt-3">
                  <a href="/" className="small text-muted text-decoration-none">
                    חזרה לדף הבית
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default LoginPage
