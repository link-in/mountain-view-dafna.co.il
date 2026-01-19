import React from 'react'
import type { Reservation } from '@/lib/dashboard/types'
import { formatCurrency, formatDate, formatStatus } from '@/lib/dashboard/utils'

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
  if (!reservations.length) {
    return <div className="text-muted">אין הזמנות להצגה כרגע.</div>
  }

  return (
    <div className="table-responsive">
      <table className="table align-middle">
        <thead>
          <tr className="text-muted small">
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
            <tr key={reservation.id}>
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
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ReservationsTable
