'use client'

import { useState } from 'react'
import { Col, Row } from 'react-bootstrap'

const AvailabilityCheck = () => {
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(2)

  const handleCheckAvailability = () => {
    // כאן תוכל להוסיף לוגיקה לבדיקת זמינות
    // לדוגמה: קישור ל-Airbnb או API call
    if (checkIn && checkOut) {
      // דוגמה לקישור ל-Airbnb - יש להחליף ב-URL האמיתי שלך
      const airbnbUrl = `https://www.airbnb.com/rooms/YOUR_LISTING_ID?check_in=${checkIn}&check_out=${checkOut}&guests=${guests}`
      window.open(airbnbUrl, '_blank')
    } else {
      alert('אנא מלא את כל השדות')
    }
  }

  // קבלת תאריך מינימלי (היום)
  const today = new Date().toISOString().split('T')[0]

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '12px',
        padding: '30px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(10px)',
        maxWidth: '800px',
        margin: '40px auto',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <h3
        style={{
          textAlign: 'center',
          marginBottom: '25px',
          color: '#2e2e2e',
          fontSize: '28px',
          fontWeight: 'bold',
        }}
      >
        בדיקת זמינות
      </h3>
      <Row className="g-3">
        <Col md={4}>
          <label
            style={{
              display: 'block',
              marginBottom: '8px',
              color: '#2e2e2e',
              fontWeight: '600',
              fontSize: '14px',
            }}
          >
            תאריך כניסה
          </label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            min={today}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '16px',
              transition: 'all 0.3s ease',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#2e2e2e'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e0e0e0'
            }}
          />
        </Col>
        <Col md={4}>
          <label
            style={{
              display: 'block',
              marginBottom: '8px',
              color: '#2e2e2e',
              fontWeight: '600',
              fontSize: '14px',
            }}
          >
            תאריך יציאה
          </label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            min={checkIn || today}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '16px',
              transition: 'all 0.3s ease',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#2e2e2e'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e0e0e0'
            }}
          />
        </Col>
        <Col md={4}>
          <label
            style={{
              display: 'block',
              marginBottom: '8px',
              color: '#2e2e2e',
              fontWeight: '600',
              fontSize: '14px',
            }}
          >
            מספר אורחים
          </label>
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '16px',
              backgroundColor: 'white',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#2e2e2e'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e0e0e0'
            }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? 'אורח' : 'אורחים'}
              </option>
            ))}
          </select>
        </Col>
      </Row>
      <div style={{ marginTop: '25px', textAlign: 'center' }}>
        <button
          onClick={handleCheckAvailability}
          style={{
            background: '#2e2e2e',
            color: 'white',
            border: 'none',
            padding: '14px 40px',
            borderRadius: '8px',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(46, 46, 46, 0.3)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#1a1a1a'
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(46, 46, 46, 0.4)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#2e2e2e'
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(46, 46, 46, 0.3)'
          }}
        >
          בדוק זמינות
        </button>
      </div>
    </div>
  )
}

export default AvailabilityCheck

