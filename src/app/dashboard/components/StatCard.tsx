import React from 'react'

type StatCardProps = {
  title: string
  value: string
  helper?: string
}

const StatCard = ({ title, value, helper }: StatCardProps) => {
  return (
    <div className="card h-100 border-0 shadow-sm">
      <div className="card-body">
        <div className="text-muted text-uppercase fw-semibold small mb-2">{title}</div>
        <div className="fs-3 fw-bold">{value}</div>
        {helper ? <div className="text-muted small mt-1">{helper}</div> : null}
      </div>
    </div>
  )
}

export default StatCard
