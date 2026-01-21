'use client'

import React, { useState } from 'react'
import type { Reservation } from '@/lib/dashboard/types'
import { formatCurrency, formatDate, formatStatus } from '@/lib/dashboard/utils'

// Add styles for nearest reservation
const styles = `
  .nearest-reservation {
    background-color: #e3f2fd !important;
    border-left: 4px solid #764ba2 !important;
  }
  .nearest-reservation td {
    background-color: #e3f2fd !important;
    font-weight: 500 !important;
  }
`

const getStatusClass = (status: Reservation['status']) => {
  switch (status) {
    case 'confirmed':
      return 'bg-success'
    case 'pending':
      return 'bg-warning text-dark'
    case 'cancelled':
      return 'bg-secondary'
    default:
      return 'bg-light text-dark'
  }
}

type ReservationsTableProps = {
  reservations: Reservation[]
}

const ReservationsTable = ({ reservations }: ReservationsTableProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (!reservations.length) {
    return <div className="text-muted">אין הזמנות להצגה כרגע.</div>
  }

  // Find the nearest upcoming reservation
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const upcomingReservations = reservations
    .filter(r => {
      const checkInDate = new Date(r.checkIn)
      checkInDate.setHours(0, 0, 0, 0)
      return checkInDate >= today && r.status !== 'cancelled'
    })
    .sort((a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime())
  
  const nearestReservationId = upcomingReservations.length > 0 ? upcomingReservations[0].id : null

  const toggleExpanded = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  const isNearestReservation = (id: string) => id === nearestReservationId

  return (
    <div className="table-responsive">
      <style>{styles}</style>
      <table className="table align-middle">
        <thead>
          <tr className="text-muted small">
            <th style={{ width: '30px' }}></th>
            <th>אורח</th>
            <th>תאריכים</th>
            <th>לילות</th>
            <th>מקור</th>
            <th>סה״כ</th>
            <th>סטטוס</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation) => (
            <React.Fragment key={reservation.id}>
              <tr 
                onClick={() => toggleExpanded(reservation.id)}
                style={{ cursor: 'pointer' }}
                className={`${expandedId === reservation.id ? 'table-active' : ''} ${isNearestReservation(reservation.id) ? 'nearest-reservation' : ''}`}
              >
                <td>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    style={{
                      transform: expandedId === reservation.id ? 'rotate(90deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s',
                    }}
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </td>
                <td>
                  <div className="fw-semibold">{reservation.guestName}</div>
                  <div className="text-muted small">{reservation.unitName ?? '—'}</div>
                </td>
                <td className="small">
                  {formatDate(reservation.checkIn)} - {formatDate(reservation.checkOut)}
                </td>
                <td>{reservation.nights}</td>
                <td className="small">{reservation.source ?? '—'}</td>
                <td className="fw-semibold">{formatCurrency(reservation.total)}</td>
                <td>
                  <span className={`badge ${getStatusClass(reservation.status)}`}>
                    {formatStatus(reservation.status)}
                  </span>
                </td>
              </tr>
              {expandedId === reservation.id ? (
                <tr>
                  <td colSpan={7} style={{ backgroundColor: '#f8f9fa' }}>
                    <div className="p-3">
                      <div className="row g-3">
                        <div className="col-md-6">
                          <div className="small text-muted mb-1">מזהה הזמנה</div>
                          <div className="fw-semibold">{reservation.id}</div>
                        </div>
                        <div className="col-md-6">
                          <div className="small text-muted mb-1">שם אורח מלא</div>
                          <div className="fw-semibold">{reservation.guestName}</div>
                        </div>
                        <div className="col-md-6">
                          <div className="small text-muted mb-1">תאריך כניסה</div>
                          <div>{formatDate(reservation.checkIn)}</div>
                        </div>
                        <div className="col-md-6">
                          <div className="small text-muted mb-1">תאריך יציאה</div>
                          <div>{formatDate(reservation.checkOut)}</div>
                        </div>
                        <div className="col-md-6">
                          <div className="small text-muted mb-1">מספר לילות</div>
                          <div>{reservation.nights}</div>
                        </div>
                        <div className="col-md-6">
                          <div className="small text-muted mb-1">מספר אורחים</div>
                          <div>
                            {reservation.adults || reservation.children ? (
                              <>
                                {reservation.adults ? `${reservation.adults} מבוגרים` : ''}
                                {reservation.adults && reservation.children ? ' + ' : ''}
                                {reservation.children ? `${reservation.children} ילדים` : ''}
                              </>
                            ) : reservation.guests ? (
                              reservation.guests
                            ) : (
                              '—'
                            )}
                          </div>
                        </div>
                        {reservation.phone ? (
                          <div className="col-md-6">
                            <div className="small text-muted mb-1">טלפון</div>
                            <div>
                              <a href={`tel:${reservation.phone}`} className="text-decoration-none">
                                {reservation.phone}
                              </a>
                            </div>
                          </div>
                        ) : null}
                        {reservation.email ? (
                          <div className="col-md-6">
                            <div className="small text-muted mb-1">אימייל</div>
                            <div>
                              <a href={`mailto:${reservation.email}`} className="text-decoration-none">
                                {reservation.email}
                              </a>
                            </div>
                          </div>
                        ) : null}
                        <div className="col-md-6">
                          <div className="small text-muted mb-1">מקור הזמנה</div>
                          <div>{reservation.source ?? '—'}</div>
                        </div>
                        <div className="col-md-6">
                          <div className="small text-muted mb-1">סכום כולל</div>
                          <div className="fw-bold">{formatCurrency(reservation.total)}</div>
                        </div>
                        {reservation.notes ? (
                          <div className="col-12">
                            <div className="small text-muted mb-1">הערות</div>
                            <div className="border rounded p-2 bg-white">{reservation.notes}</div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </td>
                </tr>
              ) : null}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ReservationsTable
