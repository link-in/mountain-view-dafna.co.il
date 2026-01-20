import React, { useMemo, useState } from 'react'
import type { Reservation, RoomPrice } from '@/lib/dashboard/types'
import { formatCurrency } from '@/lib/dashboard/utils'

type CalendarPricingProps = {
  reservations: Reservation[]
  prices: RoomPrice[]
}

const DEFAULT_PRICE = 650

const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1)
const endOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0)

const normalizeDate = (value: Date) => {
  const normalized = new Date(value)
  normalized.setHours(0, 0, 0, 0)
  return normalized
}

const toKey = (value: Date) => value.toISOString().slice(0, 10)

const isSameDay = (a: Date, b: Date) => a.getTime() === b.getTime()

const addDays = (date: Date, days: number) => {
  const copy = new Date(date)
  copy.setDate(copy.getDate() + days)
  return copy
}

const buildBookingMap = (reservations: Reservation[]) => {
  const booked = new Map<string, Reservation[]>()

  reservations.forEach((reservation) => {
    if (!reservation.checkIn || !reservation.checkOut) {
      return
    }

    const checkIn = normalizeDate(new Date(reservation.checkIn))
    const checkOut = normalizeDate(new Date(reservation.checkOut))

    if (Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime())) {
      return
    }

    let cursor = checkIn
    while (cursor < checkOut) {
      const key = toKey(cursor)
      const list = booked.get(key) ?? []
      list.push(reservation)
      booked.set(key, list)
      cursor = addDays(cursor, 1)
    }
  })

  return booked
}

const isBookedOn = (bookingMap: Map<string, Reservation[]>, date: Date) => {
  const key = toKey(date)
  return bookingMap.has(key)
}

type BookingSegment = {
  id: string
  row: number
  startCol: number
  endCol: number
  label: string
}

const buildBookingSegments = (reservations: Reservation[], days: Date[]) => {
  const indexMap = new Map<string, number>()
  days.forEach((date, index) => {
    indexMap.set(toKey(date), index)
  })

  const segments = new Map<string, BookingSegment>()

  reservations.forEach((reservation) => {
    if (!reservation.checkIn || !reservation.checkOut) {
      return
    }

    const checkIn = normalizeDate(new Date(reservation.checkIn))
    const checkOut = normalizeDate(new Date(reservation.checkOut))
    if (Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime())) {
      return
    }

    let cursor = checkIn
    while (cursor < checkOut) {
      const key = toKey(cursor)
      const index = indexMap.get(key)
      if (index !== undefined) {
        const row = Math.floor(index / 7)
        const col = index % 7
        const segmentKey = `${reservation.id}-${row}`
        const existing = segments.get(segmentKey)
        if (existing) {
          existing.startCol = Math.min(existing.startCol, col)
          existing.endCol = Math.max(existing.endCol, col)
        } else {
          segments.set(segmentKey, {
            id: segmentKey,
            row,
            startCol: col,
            endCol: col,
            label: reservation.guestName,
          })
        }
      }
      cursor = addDays(cursor, 1)
    }
  })

  return Array.from(segments.values())
}

const CalendarPricing = ({ reservations, prices }: CalendarPricingProps) => {
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(new Date()))
  const [selectedDates, setSelectedDates] = useState<Date[]>([])
  const [priceOverrides, setPriceOverrides] = useState<Record<string, number>>({})
  const [priceInput, setPriceInput] = useState(DEFAULT_PRICE)
  const todayKey = toKey(normalizeDate(new Date()))

  const bookingMap = useMemo(() => buildBookingMap(reservations), [reservations])
  const priceMap = useMemo(() => {
    const map: Record<string, number> = {}
    prices.forEach((entry) => {
      if (!entry?.date || typeof entry.price !== 'number') {
        return
      }
      const existing = map[entry.date]
      if (existing === undefined) {
        map[entry.date] = entry.price
      } else {
        map[entry.date] = Math.min(existing, entry.price)
      }
    })
    return map
  }, [prices])

  const days = useMemo(() => {
    const start = startOfMonth(currentMonth)
    const end = endOfMonth(currentMonth)
    const leading = (start.getDay() + 6) % 7
    const totalCells = leading + end.getDate()
    const rows = Math.ceil(totalCells / 7) * 7

    const result: Date[] = []
    const firstCell = addDays(start, -leading)
    for (let i = 0; i < rows; i += 1) {
      result.push(addDays(firstCell, i))
    }
    return result
  }, [currentMonth])

  const bookingSegments = useMemo(() => buildBookingSegments(reservations, days), [reservations, days])
  const weeksCount = Math.ceil(days.length / 7)

  const handleDateToggle = (date: Date) => {
    const key = toKey(date)
    if (bookingMap.has(key)) {
      return
    }
    setSelectedDates((prev) => {
      const exists = prev.some((item) => isSameDay(item, date))
      if (exists) {
        return prev.filter((item) => !isSameDay(item, date))
      }
      return [...prev, date]
    })
  }

  const applyPrice = () => {
    if (!selectedDates.length) {
      return
    }
    setPriceOverrides((prev) => {
      const next = { ...prev }
      selectedDates.forEach((date) => {
        next[toKey(date)] = priceInput
      })
      return next
    })
    setSelectedDates([])
  }

  const clearSelection = () => {
    setSelectedDates([])
  }

  const monthLabel = new Intl.DateTimeFormat('he-IL', { month: 'long', year: 'numeric' }).format(currentMonth)

  return (
    <div className="row g-4">
      <div className="col-lg-8">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="fw-semibold">{monthLabel}</div>
          <div className="btn-group">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={() => setCurrentMonth(addDays(currentMonth, -30))}
            >
              הקודם
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={() => setCurrentMonth(addDays(currentMonth, 30))}
            >
              הבא
            </button>
          </div>
        </div>
        <div className="border rounded-4 overflow-hidden bg-white">
          <div className="d-grid" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
            {['ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳', 'א׳'].map((day) => (
              <div key={day} className="text-center py-2 border-bottom text-muted small fw-semibold">
                {day}
              </div>
            ))}
          </div>
          <div className="position-relative">
            <div className="d-grid" style={{ gridTemplateColumns: 'repeat(7, 1fr)', gridAutoRows: '90px' }}>
              {days.map((date) => {
                const isCurrentMonth = date.getMonth() === currentMonth.getMonth()
                const key = toKey(date)
                const isBooked = bookingMap.has(key)
                const isSelected = selectedDates.some((item) => isSameDay(item, date))
                const price = priceOverrides[key] ?? priceMap[key] ?? DEFAULT_PRICE
                const isToday = key === todayKey
                const showTodayHighlight = isToday && !isSelected
                const isBookingStart = isBooked && !isBookedOn(bookingMap, addDays(date, -1))
                const isBookingEnd = isBooked && !isBookedOn(bookingMap, addDays(date, 1))
                const bookingRadius = isBooked
                  ? `${isBookingStart ? '12px' : '0'} ${isBookingEnd ? '12px' : '0'} ${isBookingEnd ? '12px' : '0'} ${
                      isBookingStart ? '12px' : '0'
                    }`
                  : '12px'

                return (
                  <button
                    key={key}
                    type="button"
                    className="border-0 text-start p-2"
                    style={{
                      position: 'relative',
                      minHeight: '90px',
                      background: isSelected ? '#0d9488' : showTodayHighlight ? 'rgba(13, 148, 136, 0.12)' : 'transparent',
                      color: isSelected ? '#fff' : 'inherit',
                      opacity: isCurrentMonth ? 1 : 0.4,
                      cursor: isBooked ? 'not-allowed' : 'pointer',
                      border: isToday ? '2px solid #0d9488' : '1px solid transparent',
                      borderRadius: bookingRadius,
                    }}
                    onClick={() => handleDateToggle(date)}
                    disabled={isBooked}
                  >
                    <span
                      className="fw-semibold"
                      style={{ position: 'absolute', top: '8px', left: '8px', fontSize: '14px' }}
                    >
                      {date.getDate()}
                    </span>
                    {isToday ? (
                      <span
                        className="badge bg-success"
                        style={{ position: 'absolute', top: '8px', right: '8px' }}
                      >
                        היום
                      </span>
                    ) : null}
                    <div className="small text-muted mt-1">{formatCurrency(price)}</div>
                  </button>
                )
              })}
            </div>
            <div
              className="position-absolute top-0 start-0 w-100 h-100"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gridTemplateRows: `repeat(${weeksCount}, 1fr)`,
                gap: '6px',
                padding: '8px',
                pointerEvents: 'none',
              }}
            >
              {bookingSegments.map((segment) => (
                <div
                  key={segment.id}
                  style={{
                    gridColumn: `${segment.startCol + 1} / ${segment.endCol + 2}`,
                    gridRow: segment.row + 1,
                    alignSelf: 'center',
                    justifySelf: 'stretch',
                    height: '20px',
                    background: 'rgba(239, 68, 68, 0.12)',
                    borderRadius: '999px',
                    padding: '0 10px',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '12px',
                    color: '#991b1b',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    marginTop: '52px',
                  }}
                >
                  {segment.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-4">
        <div className="card border-0 shadow-sm h-100">
          <div className="card-body">
            <h3 className="h6 fw-bold mb-3">שינוי מחיר לפי תאריך</h3>
            <div className="small text-muted mb-3">
              בחר תאריכים בלוח משמאל, ועדכן מחיר ללילה.
            </div>
            <label className="form-label small fw-semibold">מחיר ללילה (₪)</label>
            <input
              type="number"
              min={0}
              className="form-control mb-3"
              value={priceInput}
              onChange={(event) => setPriceInput(Number(event.target.value))}
            />
            <button type="button" className="btn btn-success w-100" onClick={applyPrice} disabled={!selectedDates.length}>
              עדכן מחיר לתאריכים שנבחרו
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary w-100 mt-2"
              onClick={clearSelection}
              disabled={!selectedDates.length}
            >
              איפוס בחירה
            </button>
            <div className="mt-4">
              <div className="small fw-semibold mb-2">תאריכים שנבחרו</div>
              {selectedDates.length ? (
                <div className="d-flex flex-wrap gap-2">
                  {selectedDates.map((date) => (
                    <span key={toKey(date)} className="badge bg-secondary">
                      {new Intl.DateTimeFormat('he-IL', { day: '2-digit', month: 'short' }).format(date)}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="small text-muted">לא נבחרו תאריכים.</div>
              )}
            </div>
            <div className="mt-4">
              <div className="small fw-semibold mb-2">מקרא</div>
              <div className="d-flex flex-column gap-2 small">
                <div>
                  <span className="badge bg-danger me-2">תפוס</span>
                  תאריך עם הזמנה קיימת
                </div>
                <div>
                  <span className="badge bg-success me-2">נבחר</span>
                  תאריך שנבחר לעדכון מחיר
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CalendarPricing
