'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface Subscription {
  id: string
  userId: string
  planId: string
  status: string
  billingCycle: string
  startedAt: string
  expiresAt: string
  autoRenew: boolean
  user: {
    displayName: string
    email: string
  }
  plan: {
    displayName: string
    monthlyPrice: number
  }
  usage: {
    whatsappSent: number
    whatsappLimit: number
  }
}

export default function AdminSubscriptionsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    totalRevenue: 0,
    activeSubscriptions: 0,
    trialSubscriptions: 0,
    expiredSubscriptions: 0,
  })

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

  // Fetch subscriptions
  useEffect(() => {
    if (session?.user?.role === 'admin') {
      fetchSubscriptions()
    }
  }, [session])

  const fetchSubscriptions = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/subscriptions')
      if (!response.ok) throw new Error('Failed to fetch subscriptions')
      const data = await response.json()
      setSubscriptions(data.subscriptions)
      setStats(data.stats)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load subscriptions')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { text: string; class: string }> = {
      active: { text: 'פעיל', class: 'bg-success' },
      trial: { text: 'ניסיון', class: 'bg-info' },
      expired: { text: 'פג תוקף', class: 'bg-danger' },
      cancelled: { text: 'בוטל', class: 'bg-secondary' },
      suspended: { text: 'מושעה', class: 'bg-warning' },
    }
    const badge = badges[status] || { text: status, class: 'bg-secondary' }
    return <span className={`badge ${badge.class}`}>{badge.text}</span>
  }

  if (status === 'loading' || loading) {
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
    <div className="container mt-5" style={{ maxWidth: '1400px', direction: 'rtl' }}>
      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card border-primary shadow-sm">
            <div className="card-body text-center">
              <div className="display-6 text-primary mb-2">₪{stats.totalRevenue.toLocaleString()}</div>
              <div className="text-muted">הכנסות חודשיות</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-success shadow-sm">
            <div className="card-body text-center">
              <div className="display-6 text-success mb-2">{stats.activeSubscriptions}</div>
              <div className="text-muted">מנויים פעילים</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-info shadow-sm">
            <div className="card-body text-center">
              <div className="display-6 text-info mb-2">{stats.trialSubscriptions}</div>
              <div className="text-muted">תקופות ניסיון</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-danger shadow-sm">
            <div className="card-body text-center">
              <div className="display-6 text-danger mb-2">{stats.expiredSubscriptions}</div>
              <div className="text-muted">פגי תוקף</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="mb-0">💰 ניהול מנויים</h3>
            <button className="btn btn-light btn-sm" onClick={fetchSubscriptions}>
              🔄 רענן
            </button>
          </div>
        </div>

        <div className="card-body">
          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {error}
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setError(null)}
              ></button>
            </div>
          )}

          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>משתמש</th>
                  <th>תוכנית</th>
                  <th>סטטוס</th>
                  <th>מחזור</th>
                  <th>מחיר</th>
                  <th>שימוש WhatsApp</th>
                  <th>תוקף עד</th>
                  <th>חידוש אוטומטי</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((sub) => (
                  <tr key={sub.id}>
                    <td>
                      <div className="fw-bold">{sub.user.displayName}</div>
                      <small className="text-muted">{sub.user.email}</small>
                    </td>
                    <td>
                      <span className="badge bg-primary">{sub.plan.displayName}</span>
                    </td>
                    <td>{getStatusBadge(sub.status)}</td>
                    <td>
                      {sub.billingCycle === 'monthly' ? 'חודשי' : 'שנתי'}
                    </td>
                    <td className="fw-bold">₪{sub.plan.monthlyPrice}</td>
                    <td>
                      <div className="progress" style={{ height: '20px' }}>
                        <div
                          className={`progress-bar ${
                            sub.usage.whatsappSent / sub.usage.whatsappLimit > 0.9
                              ? 'bg-danger'
                              : sub.usage.whatsappSent / sub.usage.whatsappLimit > 0.7
                              ? 'bg-warning'
                              : 'bg-success'
                          }`}
                          style={{
                            width: `${(sub.usage.whatsappSent / sub.usage.whatsappLimit) * 100}%`,
                          }}
                        >
                          {sub.usage.whatsappSent}/{sub.usage.whatsappLimit}
                        </div>
                      </div>
                    </td>
                    <td>
                      <small>
                        {new Date(sub.expiresAt).toLocaleDateString('he-IL')}
                      </small>
                    </td>
                    <td>
                      {sub.autoRenew ? (
                        <span className="text-success">✓</span>
                      ) : (
                        <span className="text-danger">✗</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {subscriptions.length === 0 && !loading && (
            <div className="text-center text-muted py-4">
              אין מנויים במערכת
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
