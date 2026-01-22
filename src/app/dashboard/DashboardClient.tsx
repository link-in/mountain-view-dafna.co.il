'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import type { Reservation, RoomPrice } from '@/lib/dashboard/types'
import { formatCurrency } from '@/lib/dashboard/utils'
import { getDashboardProvider } from '@/lib/dashboard/getDashboardProvider'
import ReservationsTable from './components/ReservationsTable'
import StatCard from './components/StatCard'
import CalendarPricing from './components/CalendarPricing'

const toLocalKey = (value: Date) => {
  const year = value.getFullYear()
  const month = String(value.getMonth() + 1).padStart(2, '0')
  const day = String(value.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const normalizeDate = (value: Date) => {
  const normalized = new Date(value)
  normalized.setHours(0, 0, 0, 0)
  return normalized
}

const addDays = (value: Date, days: number) => {
  const next = new Date(value)
  next.setDate(next.getDate() + days)
  return next
}

const DashboardClient = () => {
  const { data: session } = useSession()
  const [{ provider }] = useState(() => getDashboardProvider())
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [roomPrices, setRoomPrices] = useState<RoomPrice[]>([])
  const [loadingReservations, setLoadingReservations] = useState(true)
  const [loadingRoomPrices, setLoadingRoomPrices] = useState(true)
  const [reservationsError, setReservationsError] = useState<string | null>(null)
  const [roomPricesError, setRoomPricesError] = useState<string | null>(null)
  const [logoSrc, setLogoSrc] = useState('/photos/hostly-logo.png')
  const [logoVisible, setLogoVisible] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showNewReservation, setShowNewReservation] = useState(false)
  const [savingReservation, setSavingReservation] = useState(false)
  const [saveReservationError, setSaveReservationError] = useState<string | null>(null)
  const [saveReservationSuccess, setSaveReservationSuccess] = useState<string | null>(null)
  const [newReservation, setNewReservation] = useState({
    firstName: '',
    lastName: '',
    contact: '',
    arrival: '',
    departure: '',
    guests: 2,
    total: '',
    notes: '',
  })

  const updateReservationField = (field: keyof typeof newReservation, value: string | number) => {
    setNewReservation((prev) => ({ ...prev, [field]: value }))
  }

  const resetReservationForm = () => {
    setNewReservation({
      firstName: '',
      lastName: '',
      contact: '',
      arrival: '',
      departure: '',
      guests: 2,
      total: '',
      notes: '',
    })
  }

  const refreshRoomPrices = async () => {
    setLoadingRoomPrices(true)
    try {
      const prices = await provider.getRoomPrices()
      setRoomPrices(prices)
      setRoomPricesError(null)
    } catch (error) {
      setRoomPricesError(error instanceof Error ? error.message : 'טעינת מחירי לילה נכשלה')
    } finally {
      setLoadingRoomPrices(false)
    }
  }

  const refreshReservations = async () => {
    setLoadingReservations(true)
    try {
      const reservationsResult = await provider.getReservations()
      setReservations(reservationsResult)
      setReservationsError(null)
    } catch (error) {
      setReservationsError(error instanceof Error ? error.message : 'טעינת הזמנות נכשלה')
    } finally {
      setLoadingReservations(false)
    }
  }

  const handleCreateReservation = async () => {
    if (savingReservation) {
      return
    }

    setSaveReservationError(null)
    setSaveReservationSuccess(null)

    if (!newReservation.firstName.trim() || !newReservation.lastName.trim()) {
      setSaveReservationError('יש להזין שם מלא.')
      return
    }
    if (!newReservation.contact.trim()) {
      setSaveReservationError('יש להזין טלפון או אימייל.')
      return
    }
    if (!newReservation.arrival || !newReservation.departure) {
      setSaveReservationError('יש לבחור תאריכי כניסה ויציאה.')
      return
    }
    const arrivalDate = normalizeDate(new Date(newReservation.arrival))
    const departureDate = normalizeDate(new Date(newReservation.departure))
    if (Number.isNaN(arrivalDate.getTime()) || Number.isNaN(departureDate.getTime())) {
      setSaveReservationError('תאריכים לא תקינים.')
      return
    }
    if (arrivalDate >= departureDate) {
      setSaveReservationError('תאריך היציאה חייב להיות אחרי תאריך הכניסה.')
      return
    }
    const hasConflict = reservations.some((reservation) => {
      if (reservation.status === 'cancelled' || !reservation.checkIn || !reservation.checkOut) {
        return false
      }
      const checkIn = normalizeDate(new Date(reservation.checkIn))
      const checkOut = normalizeDate(new Date(reservation.checkOut))
      if (Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime())) {
        return false
      }
      return arrivalDate < checkOut && departureDate > checkIn
    })
    if (hasConflict) {
      setSaveReservationError('קיימת הזמנה בתאריכים שנבחרו.')
      return
    }
    if (!newReservation.total) {
      setSaveReservationError('יש להזין סכום לתשלום.')
      return
    }

    const payload = [
      {
        arrival: newReservation.arrival,
        departure: newReservation.departure,
        firstName: newReservation.firstName.trim(),
        lastName: newReservation.lastName.trim(),
        status: 'confirmed',
        notes: newReservation.notes.trim() || undefined,
        invoice: [
          {
            description: 'Total Room Price',
            amount: Number(newReservation.total),
            qty: 1,
            type: 'item',
          },
        ],
      },
    ]
    console.log('Dashboard create booking payload', payload)

    try {
      setSavingReservation(true)
      const response = await fetch('/api/dashboard/bookings', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      })
      console.log('Dashboard create booking response', response.status)
      if (!response.ok) {
        const details = await response.text()
        throw new Error(details || 'Failed to create reservation')
      }
      setSaveReservationSuccess('ההזמנה נשמרה בהצלחה.')
      await refreshReservations()
      resetReservationForm()
      setShowNewReservation(false)
    } catch (error) {
      setSaveReservationError(error instanceof Error ? error.message : 'שמירת ההזמנה נכשלה')
    } finally {
      setSavingReservation(false)
    }
  }

  useEffect(() => {
    let isActive = true

    const load = async () => {
      const [reservationsResult, roomPricesResult] = await Promise.allSettled([
        provider.getReservations(),
        provider.getRoomPrices(),
      ])

      if (!isActive) {
        return
      }

      if (reservationsResult.status === 'fulfilled') {
        setReservations(reservationsResult.value)
        setReservationsError(null)
      } else {
        setReservationsError(
          reservationsResult.reason instanceof Error ? reservationsResult.reason.message : 'טעינת הזמנות נכשלה'
        )
      }

      if (roomPricesResult.status === 'fulfilled') {
        setRoomPrices(roomPricesResult.value)
        setRoomPricesError(null)
      } else {
        setRoomPricesError(
          roomPricesResult.reason instanceof Error ? roomPricesResult.reason.message : 'טעינת מחירי לילה נכשלה'
        )
      }

      setLoadingReservations(false)
      setLoadingRoomPrices(false)
    }

    load()
    return () => {
      isActive = false
    }
  }, [provider])

  const stats = useMemo(() => {
    const totalRevenue = reservations.reduce((sum, reservation) => sum + reservation.total, 0)
    const confirmedCount = reservations.filter((reservation) => reservation.status === 'confirmed').length
    const upcomingCount = reservations.filter((reservation) => {
      const checkIn = new Date(reservation.checkIn)
      if (Number.isNaN(checkIn.getTime())) {
        return false
      }
      return checkIn >= new Date()
    }).length

    return {
      totalRevenue,
      confirmedCount,
      upcomingCount,
    }
  }, [reservations])

  const monthRange = useMemo(() => {
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    return {
      monthStart,
      monthEnd,
      startKey: toLocalKey(monthStart),
      endKey: toLocalKey(monthEnd),
      daysInMonth: monthEnd.getDate(),
      label: new Intl.DateTimeFormat('he-IL', { month: 'long', year: 'numeric' }).format(monthStart),
    }
  }, [])

  const priceSummary = useMemo(() => {
    if (!roomPrices.length) {
      return null
    }

    const monthPrices = roomPrices.filter((entry) => entry.date >= monthRange.startKey && entry.date <= monthRange.endKey)
    if (!monthPrices.length) {
      return null
    }

    const prices = monthPrices.map((entry) => entry.price).filter((value) => Number.isFinite(value))
    if (!prices.length) {
      return null
    }

    const total = prices.reduce((sum, value) => sum + value, 0)
    const roomsCount = new Set(monthPrices.map((entry) => entry.roomId ?? 'unknown')).size
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    const avgPrice = total / prices.length

    return {
      roomsCount,
      minPrice,
      maxPrice,
      avgPrice,
      monthLabel: monthRange.label,
      monthRange: `${monthRange.startKey} - ${monthRange.endKey}`,
    }
  }, [roomPrices, monthRange])

  const bookingSummary = useMemo(() => {
    if (!reservations.length) {
      return null
    }

    const bookedDates = new Set<string>()
    let monthRevenue = 0

    reservations.forEach((reservation) => {
      if (!reservation.checkIn || !reservation.checkOut) {
        return
      }
      const checkIn = normalizeDate(new Date(reservation.checkIn))
      const checkOut = normalizeDate(new Date(reservation.checkOut))
      if (Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime())) {
        return
      }
      const checkInKey = toLocalKey(checkIn)
      if (checkInKey >= monthRange.startKey && checkInKey <= monthRange.endKey) {
        monthRevenue += reservation.total
      }

      let cursor = checkIn
      while (cursor < checkOut) {
        const key = toLocalKey(cursor)
        if (key >= monthRange.startKey && key <= monthRange.endKey) {
          bookedDates.add(key)
        }
        cursor = addDays(cursor, 1)
      }
    })

    const bookedDays = bookedDates.size
    const availableDays = Math.max(0, monthRange.daysInMonth - bookedDays)

    return {
      bookedDays,
      availableDays,
      monthRevenue,
    }
  }, [reservations, monthRange])

  return (
    <main 
      style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      }} 
      dir="rtl"
    >
      <div className="container py-5">
        <div 
          className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between mb-4 gap-3"
          style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div className="d-flex align-items-center gap-3">
            {logoVisible ? (
              <img
                src={logoSrc}
                alt="Hostly"
                style={{ height: '48px', objectFit: 'contain' }}
                onError={() => {
                  setLogoVisible(false)
                }}
              />
            ) : null}
            <div>
              <h1 
                className="fw-bold mb-1"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {session?.user?.displayName ?? 'נוף הרים בדפנה'}
              </h1>
              {session?.user?.email ? (
                <p className="text-muted small mb-0">{session.user.email}</p>
              ) : null}
            </div>
          </div>
          <div className="d-flex align-items-center gap-2 position-relative justify-content-center justify-content-lg-start">
            {session?.user?.landingPageUrl ? (
              <button
                type="button"
                className="btn btn-sm d-flex align-items-center justify-content-center"
                style={{ 
                  width: '36px',
                  height: '36px',
                  border: '1px solid #f093fb',
                  color: '#f093fb',
                  backgroundColor: 'transparent',
                  padding: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f093fb'
                  e.currentTarget.style.color = 'white'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = '#f093fb'
                }}
                onClick={() => window.open(session.user.landingPageUrl, '_blank')}
                title="צפה באתר"
                aria-label="צפה באתר"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="18" 
                  height="18" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </button>
            ) : null}
            <button
              type="button"
              className="btn btn-sm d-flex align-items-center justify-content-center"
              style={{ 
                width: '36px',
                height: '36px',
                border: '1px solid #764ba2',
                color: '#764ba2',
                backgroundColor: 'transparent',
                padding: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#764ba2'
                e.currentTarget.style.color = 'white'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = '#764ba2'
              }}
              onClick={() => signOut({ callbackUrl: '/dashboard/login' })}
              title="התנתק"
              aria-label="התנתק"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
            <button
              type="button"
              className="btn btn-sm d-flex align-items-center justify-content-center"
              style={{ 
                width: '36px', 
                height: '36px',
                border: '1px solid #667eea',
                color: '#667eea',
                backgroundColor: 'transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#667eea'
                e.currentTarget.style.color = 'white'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = '#667eea'
              }}
              aria-label="תפריט"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <span style={{ display: 'inline-block', lineHeight: 1 }}>☰</span>
            </button>
            {menuOpen ? (
              <div
                className="position-absolute bg-white border rounded-3 shadow-sm p-2"
                style={{ top: '46px', right: 0, minWidth: '200px', zIndex: 10 }}
              >
                <Link className="dropdown-item py-2" href="/dashboard" onClick={() => setMenuOpen(false)}>
                  ניהול זמינות/מחירים
                </Link>
                <Link className="dropdown-item py-2" href="/dashboard/profile" onClick={() => setMenuOpen(false)}>
                  איזור אישי
                </Link>
                <Link className="dropdown-item py-2" href="/dashboard/landing" onClick={() => setMenuOpen(false)}>
                  ניהול דף נחיתה
                </Link>
                <Link className="dropdown-item py-2" href="/dashboard/payments" onClick={() => setMenuOpen(false)}>
                  סליקת אשראי
                </Link>
              </div>
            ) : null}
          </div>
        </div>

        {reservationsError ? (
          <div className="alert alert-danger" role="alert">
            {reservationsError}
          </div>
        ) : null}

        <div className="row g-3 mb-4">
          <div className="col-4">
            <StatCard title="סה״כ הכנסות" value={formatCurrency(stats.totalRevenue)} helper="מתוך ההזמנות במערכת" />
          </div>
          <div className="col-4">
            <StatCard title="הזמנות מאושרות" value={`${stats.confirmedCount}`} helper="כולל הזמנות עתידיות" />
          </div>
          <div className="col-4">
            <StatCard title="הזמנות קרובות" value={`${stats.upcomingCount}`} helper="כניסות קרובות" />
          </div>
        </div>

        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
          <div 
            className="card-body"
            style={{
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(249, 147, 251, 0.05) 100%)',
            }}
          >
            <div className="d-flex flex-row align-items-center justify-content-between mb-3 gap-2">
              <div className="d-flex align-items-center gap-2">
                <h2 
                  className="h5 fw-bold mb-0"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  הזמנות
                </h2>
                {loadingReservations && reservations.length ? (
                  <span className="text-muted small">מרענן...</span>
                ) : null}
              </div>
              <div className="d-flex align-items-center gap-2">
                <button
                  type="button"
                  className="btn btn-sm d-flex align-items-center gap-2"
                  style={{ 
                    backgroundColor: 'transparent',
                    border: '1px solid #764ba2',
                    color: '#764ba2',
                    padding: '0.375rem 0.75rem',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#764ba2'
                    e.currentTarget.style.color = 'white'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = '#764ba2'
                  }}
                  onClick={() => setShowNewReservation((prev) => !prev)}
                >
                  {showNewReservation ? 'סגור טופס' : 'הזמנה חדשה'}
                </button>
              </div>
            </div>
            {showNewReservation ? (
              <form
                className="border rounded-3 p-3 mb-3 bg-white"
                onSubmit={(event) => event.preventDefault()}
              >
                <div className="row g-2">
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold">
                      שם אורח <span className="text-danger">*</span>
                    </label>
                    <div className="row g-2">
                      <div className="col-12 col-sm-6">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="שם פרטי"
                          value={newReservation.firstName}
                          onChange={(event) => updateReservationField('firstName', event.target.value)}
                          required
                        />
                      </div>
                      <div className="col-12 col-sm-6">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="שם משפחה"
                          value={newReservation.lastName}
                          onChange={(event) => updateReservationField('lastName', event.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold">
                      טלפון / אימייל <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="טלפון או אימייל"
                      value={newReservation.contact}
                      onChange={(event) => updateReservationField('contact', event.target.value)}
                      required
                    />
                  </div>
                  <div className="col-6 col-md-3">
                    <label className="form-label small fw-semibold">
                      תאריך כניסה <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      value={newReservation.arrival}
                      onChange={(event) => updateReservationField('arrival', event.target.value)}
                      required
                    />
                  </div>
                  <div className="col-6 col-md-3">
                    <label className="form-label small fw-semibold">
                      תאריך יציאה <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      value={newReservation.departure}
                      onChange={(event) => updateReservationField('departure', event.target.value)}
                      required
                    />
                  </div>
                  <div className="col-6 col-md-3">
                    <label className="form-label small fw-semibold">
                      מספר אורחים <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      min={1}
                      className="form-control"
                      value={newReservation.guests}
                      onChange={(event) => updateReservationField('guests', Number(event.target.value))}
                      required
                    />
                  </div>
                  <div className="col-6 col-md-3">
                    <label className="form-label small fw-semibold">
                      סה״כ לתשלום <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      min={0}
                      className="form-control"
                      placeholder="₪"
                      value={newReservation.total}
                      onChange={(event) => updateReservationField('total', event.target.value)}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-semibold">הערות</label>
                    <textarea
                      className="form-control"
                      rows={2}
                      placeholder="פרטים נוספים"
                      value={newReservation.notes}
                      onChange={(event) => updateReservationField('notes', event.target.value)}
                    ></textarea>
                  </div>
                  {saveReservationError ? (
                    <div className="col-12">
                      <div className="alert alert-danger py-2 mb-0" role="alert">
                        {saveReservationError}
                      </div>
                    </div>
                  ) : null}
                  {saveReservationSuccess ? (
                    <div className="col-12">
                      <div className="alert alert-success py-2 mb-0" role="alert">
                        {saveReservationSuccess}
                      </div>
                    </div>
                  ) : null}
                  <div className="col-12 d-flex flex-column flex-sm-row gap-2">
                    <button 
                      type="button" 
                      className="btn"
                      style={{ 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                        color: 'white',
                      }}
                      onClick={handleCreateReservation} 
                      disabled={savingReservation}
                    >
                      {savingReservation ? 'שומר הזמנה...' : 'שמירת הזמנה'}
                    </button>
                    <button
                      type="button"
                      className="btn"
                      style={{
                        border: '1px solid #cbd5e1',
                        color: '#64748b',
                        backgroundColor: 'transparent',
                      }}
                      onClick={() => {
                        setShowNewReservation(false)
                        resetReservationForm()
                      }}
                    >
                      ביטול
                    </button>
                  </div>
                </div>
              </form>
            ) : null}
            {loadingReservations && !reservations.length ? (
              <div className="text-muted">טוען נתונים...</div>
            ) : (
              <ReservationsTable reservations={reservations} />
            )}
          </div>
        </div>

        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
          <div 
            className="card-body"
            style={{
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(249, 147, 251, 0.05) 100%)',
            }}
          >
            <div className="mb-3">
              <h2 
                className="h5 fw-bold mb-0"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #f093fb 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                לוח שנה ותמחור
              </h2>
            </div>
            {roomPricesError ? (
              <div className="alert alert-warning mb-3" role="alert">
                {roomPricesError}
              </div>
            ) : null}
            {loadingRoomPrices ? (
              <div className="text-muted">טוען מחירי לילה...</div>
            ) : (
              <CalendarPricing reservations={reservations} prices={roomPrices} onPricesUpdated={refreshRoomPrices} />
            )}
          </div>
        </div>

        <div className="card border-0 shadow-sm" style={{ borderRadius: '12px', background: 'transparent' }}>
          <div className="card-body">
            {loadingRoomPrices ? (
              <div className="text-muted">טוען נתונים...</div>
            ) : priceSummary ? (
              <div className="row g-3">
                <div className="col-md-4">
                  <StatCard title="חודש" value={priceSummary.monthLabel} helper={priceSummary.monthRange} />
                </div>
                <div className="col-md-4">
                  <StatCard
                    title="סה״כ הכנסה"
                    value={formatCurrency(bookingSummary?.monthRevenue ?? 0)}
                    helper="הזמנות בחודש הנוכחי"
                  />
                </div>
                <div className="col-md-4">
                  <StatCard title="ימים עם הזמנה" value={`${bookingSummary?.bookedDays ?? 0}`} helper="במהלך החודש" />
                </div>
                <div className="col-md-4">
                  <StatCard title="ימים פנויים" value={`${bookingSummary?.availableDays ?? 0}`} helper="ללא הזמנה" />
                </div>
                <div className="col-md-4">
                  <StatCard title="מחיר מינימום" value={formatCurrency(priceSummary.minPrice)} />
                </div>
                <div className="col-md-4">
                  <StatCard title="מחיר ממוצע" value={formatCurrency(priceSummary.avgPrice)} />
                </div>
                <div className="col-md-4">
                  <StatCard title="מחיר מקסימום" value={formatCurrency(priceSummary.maxPrice)} />
                </div>
              </div>
            ) : (
              <div className="text-muted">אין מחירים להצגה.</div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

export default DashboardClient
