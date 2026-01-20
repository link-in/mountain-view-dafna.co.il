'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import type { Reservation, RoomPrice } from '@/lib/dashboard/types'
import { formatCurrency } from '@/lib/dashboard/utils'
import { getDashboardProvider } from '@/lib/dashboard/getDashboardProvider'
import ReservationsTable from './components/ReservationsTable'
import StatCard from './components/StatCard'
import CalendarPricing from './components/CalendarPricing'

const DashboardClient = () => {
  const [{ provider, meta }] = useState(() => getDashboardProvider())
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [roomPrices, setRoomPrices] = useState<RoomPrice[]>([])
  const [loadingReservations, setLoadingReservations] = useState(true)
  const [loadingRoomPrices, setLoadingRoomPrices] = useState(true)
  const [reservationsError, setReservationsError] = useState<string | null>(null)
  const [roomPricesError, setRoomPricesError] = useState<string | null>(null)
  const [logoSrc, setLogoSrc] = useState('/photos/logo.png')
  const [logoVisible, setLogoVisible] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)

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

  const priceSummary = useMemo(() => {
    if (!roomPrices.length) {
      return null
    }

    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    const toLocalKey = (value: Date) => {
      const year = value.getFullYear()
      const month = String(value.getMonth() + 1).padStart(2, '0')
      const day = String(value.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }
    const startKey = toLocalKey(monthStart)
    const endKey = toLocalKey(monthEnd)

    const monthPrices = roomPrices.filter((entry) => entry.date >= startKey && entry.date <= endKey)
    if (!monthPrices.length) {
      return null
    }

    const prices = monthPrices.map((entry) => entry.price).filter((value) => Number.isFinite(value))
    if (!prices.length) {
      return null
    }

    const total = prices.reduce((sum, value) => sum + value, 0)
    const uniqueDays = new Set(monthPrices.map((entry) => entry.date)).size
    const roomsCount = new Set(monthPrices.map((entry) => entry.roomId ?? 'unknown')).size
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    const avgPrice = total / prices.length
    const formatMonth = (value: Date) => {
      return new Intl.DateTimeFormat('he-IL', { month: 'long', year: 'numeric' }).format(value)
    }

    return {
      uniqueDays,
      roomsCount,
      minPrice,
      maxPrice,
      avgPrice,
      monthLabel: formatMonth(monthStart),
      monthRange: `${startKey} - ${endKey}`,
    }
  }, [roomPrices])

  return (
    <main className="bg-light" style={{ minHeight: '100vh' }} dir="rtl">
      <div className="container py-5">
        <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between mb-4 gap-3">
          <div className="d-flex align-items-center gap-3">
            {logoVisible ? (
              <img
                src={logoSrc}
                alt="נוף הרים בדפנה"
                style={{ width: '56px', height: '56px', objectFit: 'contain' }}
                onError={() => {
                  if (logoSrc.startsWith('/')) {
                    setLogoSrc('https://mountain-view-dafna.co.il/photos/logo.png')
                  } else {
                    setLogoVisible(false)
                  }
                }}
              />
            ) : null}
            <div>
              <h1 className="fw-bold mb-1 text-dark">נוף הרים בדפנה</h1>
            </div>
          </div>
          <div className="d-flex align-items-center gap-2 position-relative">
            <span className="text-muted small">מקור נתונים:</span>
            <span className={`badge ${meta.isMock ? 'bg-warning text-dark' : 'bg-success'}`}>{meta.label}</span>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm d-flex align-items-center justify-content-center"
              style={{ width: '36px', height: '36px' }}
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

        {meta.isMock ? (
          <div className="alert alert-warning">
            מוצגים נתוני דוגמה בלבד. כדי להתחבר ל-Beds24, הגדר את משתני הסביבה של ספק ה-API.
          </div>
        ) : null}

        {reservationsError ? (
          <div className="alert alert-danger" role="alert">
            {reservationsError}
          </div>
        ) : null}

        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <StatCard title="סה״כ הכנסות" value={formatCurrency(stats.totalRevenue)} helper="מתוך ההזמנות במערכת" />
          </div>
          <div className="col-md-4">
            <StatCard title="הזמנות מאושרות" value={`${stats.confirmedCount}`} helper="כולל הזמנות עתידיות" />
          </div>
          <div className="col-md-4">
            <StatCard title="הזמנות קרובות" value={`${stats.upcomingCount}`} helper="כניסות קרובות" />
          </div>
        </div>

        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h2 className="h5 fw-bold mb-0">הזמנות</h2>
              <button type="button" className="btn btn-outline-secondary btn-sm" disabled>
                ייצוא CSV
              </button>
            </div>
            {loadingReservations ? (
              <div className="text-muted">טוען נתונים...</div>
            ) : (
              <ReservationsTable reservations={reservations} />
            )}
          </div>
        </div>

        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h2 className="h5 fw-bold mb-0">לוח שנה ותמחור</h2>
              <button type="button" className="btn btn-outline-secondary btn-sm" disabled>
                סנכרון מחירים
              </button>
            </div>
            {roomPricesError ? (
              <div className="alert alert-warning mb-3" role="alert">
                {roomPricesError}
              </div>
            ) : null}
            {loadingRoomPrices ? (
              <div className="text-muted">טוען מחירי לילה...</div>
            ) : (
              <CalendarPricing reservations={reservations} prices={roomPrices} />
            )}
          </div>
        </div>

        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h2 className="h5 fw-bold mb-0">סיכום מחירים</h2>
            </div>
            {loadingRoomPrices ? (
              <div className="text-muted">טוען נתונים...</div>
            ) : priceSummary ? (
              <div className="row g-3">
                <div className="col-md-4">
                  <StatCard title="חודש" value={priceSummary.monthLabel} helper={priceSummary.monthRange} />
                </div>
                <div className="col-md-4">
                  <StatCard title="ימים מתומחרים" value={`${priceSummary.uniqueDays}`} helper="מספר הימים עם מחיר" />
                </div>
                <div className="col-md-4">
                  <StatCard title="מספר חדרים" value={`${priceSummary.roomsCount}`} helper="חדרים שנכללו בנתונים" />
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
