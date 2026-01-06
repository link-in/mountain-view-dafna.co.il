'use client'

import { useState, useEffect } from 'react'
import { Col, Row } from 'react-bootstrap'
import CalendarView from './CalendarView'

const FloatingAvailability = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(2)

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @media (max-width: 768px) {
        .floating-availability-button {
          bottom: 20px !important;
          left: 20px !important;
          width: 50px !important;
          height: 50px !important;
          font-size: 20px !important;
        }
        .floating-availability-window {
          bottom: 80px !important;
          left: 20px !important;
          right: 20px !important;
          width: auto !important;
          max-width: calc(100vw - 40px) !important;
        }
      }
      @media (max-width: 480px) {
        .floating-availability-window {
          bottom: 70px !important;
          left: 10px !important;
          right: 10px !important;
          max-width: calc(100vw - 20px) !important;
          max-height: 85vh !important;
        }
      }
    `
    document.head.appendChild(style)
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style)
      }
    }
  }, [])

  const handleCheckAvailability = () => {
    if (checkIn && checkOut) {
      const airbnbUrl = `https://www.airbnb.com/rooms/YOUR_LISTING_ID?check_in=${checkIn}&check_out=${checkOut}&guests=${guests}`
      window.open(airbnbUrl, '_blank')
    } else {
      alert('אנא מלא את כל השדות')
    }
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <>

      {/* כפתור צף */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="floating-availability-button"
        style={{
          position: 'fixed',
          bottom: '30px',
          left: '30px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: '#2e2e2e',
          color: 'white',
          border: 'none',
          fontSize: '24px',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)'
          e.currentTarget.style.boxShadow = '0 6px 25px rgba(0, 0, 0, 0.4)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)'
        }}
      >
        {isOpen ? '✕' : '📅'}
      </button>

      {/* חלון צף */}
      {isOpen && (
        <>
          {/* רקע כהה */}
          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.3)',
              zIndex: 998,
            }}
          />
          <div
            className="floating-availability-window"
            style={{
              position: 'fixed',
              bottom: '100px',
              left: '30px',
              width: '400px',
              maxWidth: 'calc(100vw - 60px)',
              maxHeight: '80vh',
              background: 'white',
              borderRadius: '16px',
              boxShadow: '0 8px 40px rgba(0, 0, 0, 0.3)',
              zIndex: 999,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              animation: 'slideIn 0.3s ease-out',
            }}
          >
          {/* כותרת */}
          <div
            style={{
              background: '#2e2e2e',
              color: 'white',
              padding: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>
              בדיקת זמינות
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: '24px',
                cursor: 'pointer',
                padding: '0',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ✕
            </button>
          </div>

          {/* תוכן עם גלילה */}
          <div
            style={{
              padding: '20px',
              overflowY: 'auto',
              maxHeight: 'calc(80vh - 80px)',
            }}
          >
            {/* לוח שנה */}
            <div style={{ marginBottom: '20px' }}>
              <CalendarView />
            </div>

            {/* טופס הזמנה */}
            <Row className="g-3">
              <Col xs={12}>
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
              <Col xs={12}>
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
              <Col xs={12}>
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

            {/* כפתור בדיקה */}
            <div style={{ marginTop: '20px' }}>
              <button
                onClick={handleCheckAvailability}
                style={{
                  width: '100%',
                  background: '#2e2e2e',
                  color: 'white',
                  border: 'none',
                  padding: '14px',
                  borderRadius: '8px',
                  fontSize: '16px',
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
        </div>
        </>
      )}

    </>
  )
}

export default FloatingAvailability




