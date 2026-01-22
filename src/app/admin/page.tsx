'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminDashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Redirect if not admin
  useEffect(() => {
    if (status === 'loading') return
    if (status === 'unauthenticated') {
      router.push('/dashboard/login')
      return
    }
    if (session?.user?.role !== 'admin') {
      router.push('/dashboard')
      return
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    )
  }

  if (session?.user?.role !== 'admin') {
    return null
  }

  return (
    <div className="container mt-5" style={{ maxWidth: '1200px', direction: 'rtl' }}>
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">
            🏔️ HOSTLY - לוח בקרה אדמין
          </h1>
          <p className="text-muted mb-5">
            שלום {session.user.displayName}, ברוך הבא למערכת הניהול!
          </p>
        </div>
      </div>

      <div className="row g-4">
        {/* Users Management Card */}
        <div className="col-md-6">
          <Link href="/admin/users" className="text-decoration-none">
            <div className="card h-100 border-primary shadow-sm hover-shadow" style={{ cursor: 'pointer', transition: 'all 0.3s' }}>
              <div className="card-body text-center p-4">
                <div className="display-1 text-primary mb-3">👥</div>
                <h3 className="card-title">ניהול משתמשים</h3>
                <p className="card-text text-muted">
                  הוסף, ערוך ומחק משתמשים במערכת
                </p>
                <button className="btn btn-primary mt-3">
                  עבור לניהול משתמשים →
                </button>
              </div>
            </div>
          </Link>
        </div>

        {/* Notifications Log Card */}
        <div className="col-md-6">
          <div className="card h-100 border-info shadow-sm" style={{ opacity: 0.7 }}>
            <div className="card-body text-center p-4">
              <div className="display-1 text-info mb-3">📱</div>
              <h3 className="card-title">לוג הודעות</h3>
              <p className="card-text text-muted">
                צפייה בהודעות WhatsApp שנשלחו
              </p>
              <button className="btn btn-outline-info mt-3" disabled>
                בקרוב...
              </button>
            </div>
          </div>
        </div>

        {/* System Settings Card */}
        <div className="col-md-6">
          <div className="card h-100 border-success shadow-sm" style={{ opacity: 0.7 }}>
            <div className="card-body text-center p-4">
              <div className="display-1 text-success mb-3">⚙️</div>
              <h3 className="card-title">הגדרות מערכת</h3>
              <p className="card-text text-muted">
                ניהול הגדרות כלליות של המערכת
              </p>
              <button className="btn btn-outline-success mt-3" disabled>
                בקרוב...
              </button>
            </div>
          </div>
        </div>

        {/* Analytics Card */}
        <div className="col-md-6">
          <div className="card h-100 border-warning shadow-sm" style={{ opacity: 0.7 }}>
            <div className="card-body text-center p-4">
              <div className="display-1 text-warning mb-3">📊</div>
              <h3 className="card-title">סטטיסטיקות</h3>
              <p className="card-text text-muted">
                צפייה בנתונים ודוחות
              </p>
              <button className="btn btn-outline-warning mt-3" disabled>
                בקרוב...
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Dashboard */}
      <div className="row mt-5">
        <div className="col-12 text-center">
          <Link href="/dashboard" className="btn btn-outline-secondary">
            ← חזור לדשבורד רגיל
          </Link>
        </div>
      </div>

      <style jsx>{`
        .hover-shadow:hover {
          transform: translateY(-5px);
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
        }
      `}</style>
    </div>
  )
}
