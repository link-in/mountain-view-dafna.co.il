'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface AdminUser {
  id: string
  email: string
  displayName: string
  propertyId: string
  roomId: string
  landingPageUrl?: string
  phoneNumber?: string
  role: 'admin' | 'owner'
  createdAt: string
  updatedAt: string
}

interface UserFormData {
  email: string
  password: string
  displayName: string
  propertyId: string
  roomId: string
  landingPageUrl?: string
  phoneNumber?: string
  role: 'admin' | 'owner'
}

export default function AdminUsersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [formData, setFormData] = useState<UserFormData>({
    email: '',
    password: '',
    displayName: '',
    propertyId: '',
    roomId: '',
    landingPageUrl: '',
    phoneNumber: '',
    role: 'owner',
  })
  const [submitting, setSubmitting] = useState(false)

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

  // Fetch users
  useEffect(() => {
    if (session?.user?.role === 'admin') {
      fetchUsers()
    }
  }, [session])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/users')
      if (!response.ok) throw new Error('Failed to fetch users')
      const data = await response.json()
      setUsers(data.users)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting) return

    try {
      setSubmitting(true)
      setError(null)

      const url = editingUser 
        ? `/api/admin/users/${editingUser.id}`
        : '/api/admin/users'
      
      const method = editingUser ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save user')
      }

      // Reset form and refresh
      setShowForm(false)
      setEditingUser(null)
      setFormData({
        email: '',
        password: '',
        displayName: '',
        propertyId: '',
        roomId: '',
        landingPageUrl: '',
        phoneNumber: '',
        role: 'owner',
      })
      fetchUsers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save user')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (user: AdminUser) => {
    setEditingUser(user)
    setFormData({
      email: user.email,
      password: '', // Don't pre-fill password
      displayName: user.displayName,
      propertyId: user.propertyId,
      roomId: user.roomId,
      landingPageUrl: user.landingPageUrl || '',
      phoneNumber: user.phoneNumber || '',
      role: user.role,
    })
    setShowForm(true)
  }

  const handleDelete = async (userId: string, userEmail: string) => {
    if (!confirm(`האם אתה בטוח שברצונך למחוק את המשתמש ${userEmail}?`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete user')
      }

      fetchUsers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user')
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingUser(null)
    setFormData({
      email: '',
      password: '',
      displayName: '',
      propertyId: '',
      roomId: '',
      landingPageUrl: '',
      phoneNumber: '',
      role: 'owner',
    })
    setError(null)
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
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="mb-0">ניהול משתמשים - HOSTLY</h3>
            <button
              className="btn btn-light"
              onClick={() => setShowForm(true)}
              disabled={showForm}
            >
              + הוסף משתמש
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

          {showForm && (
            <div className="card mb-4 border-primary">
              <div className="card-header bg-light">
                <h5 className="mb-0">{editingUser ? 'ערוך משתמש' : 'משתמש חדש'}</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">אימייל *</label>
                      <input
                        type="email"
                        className="form-control"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        סיסמה {editingUser ? '(השאר ריק לשמור קיימת)' : '*'}
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required={!editingUser}
                        placeholder={editingUser ? 'השאר ריק לשמור קיימת' : ''}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">שם תצוגה *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.displayName}
                        onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">טלפון</label>
                      <input
                        type="tel"
                        className="form-control"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Property ID *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.propertyId}
                        onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Room ID *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.roomId}
                        onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">כתובת אתר נחיתה</label>
                      <input
                        type="url"
                        className="form-control"
                        value={formData.landingPageUrl}
                        onChange={(e) => setFormData({ ...formData, landingPageUrl: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">תפקיד *</label>
                      <select
                        className="form-select"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'owner' })}
                      >
                        <option value="owner">בעל יחידה (Owner)</option>
                        <option value="admin">אדמין (Admin)</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-3 d-flex gap-2">
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={submitting}
                    >
                      {submitting ? 'שומר...' : (editingUser ? 'עדכן' : 'צור משתמש')}
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={handleCancel}
                      disabled={submitting}
                    >
                      ביטול
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>שם תצוגה</th>
                  <th>אימייל</th>
                  <th>טלפון</th>
                  <th>Property ID</th>
                  <th>Room ID</th>
                  <th>תפקיד</th>
                  <th>פעולות</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.displayName}</td>
                    <td>{user.email}</td>
                    <td>{user.phoneNumber || '-'}</td>
                    <td><code>{user.propertyId}</code></td>
                    <td><code>{user.roomId}</code></td>
                    <td>
                      <span className={`badge ${user.role === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                        {user.role === 'admin' ? 'אדמין' : 'בעל יחידה'}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => handleEdit(user)}
                      >
                        ערוך
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(user.id, user.email)}
                        disabled={user.id === session?.user?.id}
                      >
                        מחק
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && !loading && (
            <div className="text-center text-muted py-4">
              אין משתמשים במערכת
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
