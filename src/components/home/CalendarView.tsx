'use client'

import { useState, useEffect } from 'react'

interface BookedDate {
  start: Date
  end: Date
}

// כתובות ה-URL של קבצי ה-iCal
const AIRBNB_ICAL_URL = 'https://www.airbnb.com/calendar/ical/1491057188555346537.ics?s=2c713733855705f1fad44dac7265f995&locale=he'
const BOOKING_ICAL_URL = 'https://ical.booking.com/v1/export?t=ef24eeab-5528-4e3c-9922-25a7c313426f'

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [bookedDates, setBookedDates] = useState<BookedDate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [debugMode, setDebugMode] = useState(false)
  const [debugInfo, setDebugInfo] = useState<{
    airbnbLoaded: boolean
    airbnbCount: number
    bookingLoaded: boolean
    bookingCount: number
    totalCount: number
    errors: string[]
  }>({
    airbnbLoaded: false,
    airbnbCount: 0,
    bookingLoaded: false,
    bookingCount: 0,
    totalCount: 0,
    errors: [],
  })

  useEffect(() => {
    loadAllICalFiles()
  }, [])

  // פונקציה עזר לעיבוד תגובת API
  const processApiResponse = (
    apiData: any,
    allBookedDates: BookedDate[],
    errors: string[],
    setDebugInfo: React.Dispatch<React.SetStateAction<any>>
  ) => {
    for (const result of apiData.results || []) {
      if (result.error) {
        const errorMsg = `${result.source}: ${result.error}`
        errors.push(errorMsg)
        console.error('🔴 [DEBUG]', errorMsg)
        setDebugInfo((prev: any) => ({
          ...prev,
          [result.source === 'airbnb' ? 'airbnbLoaded' : 'bookingLoaded']: false,
          errors: [...prev.errors, errorMsg],
        }))
      } else if (result.content) {
        console.log(`🟢 [DEBUG] ${result.source} iCal נטען, אורך:`, result.content.length)
        const booked = parseICalFile(result.content)
        console.log(`🟢 [DEBUG] ${result.source} הזמנות שפורשו:`, booked.length)
        allBookedDates.push(...booked)
        
        if (result.source === 'airbnb') {
          setDebugInfo((prev: any) => ({
            ...prev,
            airbnbLoaded: true,
            airbnbCount: booked.length,
          }))
        } else if (result.source === 'booking') {
          setDebugInfo((prev: any) => ({
            ...prev,
            bookingLoaded: true,
            bookingCount: booked.length,
          }))
        }
      }
    }
  }

  const loadAllICalFiles = async () => {
    setIsLoading(true)
    const allBookedDates: BookedDate[] = []
    const errors: string[] = []

    // קביעת ה-URL לפי סביבה: בלוקאלי Next.js API route, בשרת PHP endpoint
    const isLocalhost = typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    
    // אם יש environment variable, השתמש בו. אחרת, בחר לפי סביבה
    let apiUrl = process.env.NEXT_PUBLIC_ICAL_API_URL
    if (!apiUrl) {
      apiUrl = isLocalhost ? '/api/ical' : '/api/ical.php'
    }

    console.log(`🟢 [DEBUG] מתחיל טעינת iCal דרך ${isLocalhost ? 'Next.js API' : 'PHP endpoint'}...`)
    console.log(`🟢 [DEBUG] URL: ${apiUrl}`)

    try {
      const apiResponse = await fetch(apiUrl)
      
      if (!apiResponse.ok) {
        throw new Error(`API Error: ${apiResponse.status} ${apiResponse.statusText}`)
      }

      const apiData = await apiResponse.json()
      
      if (apiData.error) {
        throw new Error(apiData.error)
      }

      // עיבוד תוצאות מ-API
      processApiResponse(apiData, allBookedDates, errors, setDebugInfo)
    } catch (error) {
      const errorMsg = `API: ${error instanceof Error ? error.message : String(error)}`
      errors.push(errorMsg)
      console.error('🔴 [DEBUG]', errorMsg)
      setDebugInfo((prev) => ({
        ...prev,
        errors: [...prev.errors, errorMsg],
      }))
    }

    setBookedDates(allBookedDates)
    setDebugInfo((prev) => ({
      ...prev,
      totalCount: allBookedDates.length,
      errors,
    }))
    setIsLoading(false)
    console.log('🟡 [DEBUG] סה"כ הזמנות:', allBookedDates.length)
  }

  // פרסור קובץ iCal
  const parseICalFile = (content: string): BookedDate[] => {
    const booked: BookedDate[] = []
    const lines = content.split('\n')
    let currentEvent: { start?: string; end?: string } = {}

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()

      if (line === 'BEGIN:VEVENT') {
        currentEvent = {}
      } else if (line === 'END:VEVENT') {
        if (currentEvent.start && currentEvent.end) {
          const startDate = parseICalDate(currentEvent.start)
          const endDate = parseICalDate(currentEvent.end)
          if (startDate && endDate) {
            booked.push({ start: startDate, end: endDate })
          }
        }
        currentEvent = {}
      } else if (line.startsWith('DTSTART')) {
        const dateStr = extractDateFromLine(line)
        if (dateStr) {
          currentEvent.start = dateStr
        }
      } else if (line.startsWith('DTEND')) {
        const dateStr = extractDateFromLine(line)
        if (dateStr) {
          currentEvent.end = dateStr
        }
      }
    }

    console.log('🔵 [DEBUG] סה"כ הזמנות שפורשו:', booked.length)
    
    return booked
  }

  // חילוץ תאריך משורת iCal (תומך גם בפורמט של Booking.com: DTSTART;VALUE=DATE:20251230)
  const extractDateFromLine = (line: string): string | null => {
    const lastColonIndex = line.lastIndexOf(':')
    if (lastColonIndex !== -1) {
      return line.substring(lastColonIndex + 1).trim()
    }
    return null
  }

  // המרת תאריך מ-iCal format
  const parseICalDate = (dateStr: string): Date | null => {
    try {
      const cleanDate = dateStr.replace(/[TZ]/g, '').substring(0, 8)
      if (cleanDate.length === 8) {
        const year = parseInt(cleanDate.substring(0, 4))
        const month = parseInt(cleanDate.substring(4, 6)) - 1
        const day = parseInt(cleanDate.substring(6, 8))
        return new Date(year, month, day)
      }
    } catch (error) {
      console.error('Error parsing date:', error)
    }
    return null
  }

  // בדיקה אם תאריך תפוס
  const isDateBooked = (date: Date): boolean => {
    return bookedDates.some((booking) => {
      const checkDate = new Date(date)
      checkDate.setHours(0, 0, 0, 0)
      const start = new Date(booking.start)
      start.setHours(0, 0, 0, 0)
      const end = new Date(booking.end)
      end.setHours(0, 0, 0, 0)
      
      return checkDate >= start && checkDate < end
    })
  }

  // מעבר לחודש הקודם
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  // מעבר לחודש הבא
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  // יצירת ימי החודש
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // ימים ריקים לפני תחילת החודש
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // ימי החודש
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const days = getDaysInMonth()
  const monthNames = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר']
  const dayNames = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש']

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
        טוען לוח שנה...
      </div>
    )
  }

  return (
    <div
      style={{
        background: 'transparent',
        borderRadius: '12px',
        padding: '10px',
        maxWidth: '100%',
        margin: '0',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <button
          onClick={goToPreviousMonth}
          style={{
            background: 'transparent',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            color: '#2e2e2e',
            padding: '5px 10px',
          }}
        >
          ‹
        </button>
        <h4 style={{ margin: 0, color: '#2e2e2e', fontSize: '18px', fontWeight: 'bold' }}>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h4>
        <button
          onClick={goToNextMonth}
          style={{
            background: 'transparent',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            color: '#2e2e2e',
            padding: '5px 10px',
          }}
        >
          ›
        </button>
      </div>

      {/* שמות הימים */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px', marginBottom: '10px' }}>
        {dayNames.map((day) => (
          <div
            key={day}
            style={{
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '12px',
              color: '#666',
              padding: '5px',
            }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* ימי החודש */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px' }}>
        {days.map((date, index) => {
          if (!date) {
            return <div key={index} style={{ padding: '8px' }} />
          }

          const isBooked = isDateBooked(date)
          const isToday = date.toDateString() === new Date().toDateString()
          const isPast = date < new Date() && !isToday

          return (
            <div
              key={index}
              style={{
                padding: '8px',
                textAlign: 'center',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: isToday ? 'bold' : 'normal',
                background: isBooked
                  ? '#e74c3c'
                  : isPast
                  ? '#f0f0f0'
                  : isToday
                  ? '#2e2e2e'
                  : '#f8f9fa',
                color: isBooked
                  ? 'white'
                  : isPast
                  ? '#999'
                  : isToday
                  ? 'white'
                  : '#2e2e2e',
                cursor: isPast ? 'default' : 'pointer',
                transition: 'all 0.2s ease',
                border: isToday ? '2px solid #2e2e2e' : 'none',
              }}
              title={isBooked ? 'תפוס' : 'פנוי'}
            >
              {date.getDate()}
            </div>
          )
        })}
      </div>

      {/* מקרא */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '15px', fontSize: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={{ width: '15px', height: '15px', background: '#f8f9fa', borderRadius: '3px', border: '1px solid #ddd' }} />
          <span style={{ color: '#666' }}>פנוי</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={{ width: '15px', height: '15px', background: '#e74c3c', borderRadius: '3px' }} />
          <span style={{ color: '#666' }}>תפוס</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={{ width: '15px', height: '15px', background: '#2e2e2e', borderRadius: '3px' }} />
          <span style={{ color: '#666' }}>היום</span>
        </div>
      </div>

      {/* כפתור דיבוג */}
      <div style={{ marginTop: '15px', textAlign: 'center' }}>
        <button
          onClick={() => setDebugMode(!debugMode)}
          style={{
            background: debugMode ? '#e74c3c' : '#4a90e2',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '12px',
            cursor: 'pointer',
          }}
        >
          {debugMode ? '🔴 סגור דיבוג' : '🔵 מצב דיבוג'}
        </button>
      </div>

      {/* מידע דיבוג */}
      {debugMode && (
        <div
          style={{
            marginTop: '15px',
            padding: '15px',
            background: '#f8f9fa',
            borderRadius: '8px',
            fontSize: '12px',
            maxHeight: '300px',
            overflowY: 'auto',
          }}
        >
          <h5 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 'bold' }}>מידע דיבוג:</h5>
          <div style={{ marginBottom: '8px' }}>
            <strong>Airbnb:</strong>{' '}
            {debugInfo.airbnbLoaded ? (
              <span style={{ color: '#27ae60' }}>✓ נטען ({debugInfo.airbnbCount} הזמנות)</span>
            ) : (
              <span style={{ color: '#e74c3c' }}>✗ לא נטען</span>
            )}
          </div>
          <div style={{ marginBottom: '8px' }}>
            <strong>Booking.com:</strong>{' '}
            {debugInfo.bookingLoaded ? (
              <span style={{ color: '#27ae60' }}>✓ נטען ({debugInfo.bookingCount} הזמנות)</span>
            ) : (
              <span style={{ color: '#e74c3c' }}>✗ לא נטען</span>
            )}
          </div>
          <div style={{ marginBottom: '8px' }}>
            <strong>סה"כ הזמנות:</strong> {debugInfo.totalCount}
          </div>
          {debugInfo.errors.length > 0 && (
            <div style={{ marginTop: '10px' }}>
              <strong style={{ color: '#e74c3c' }}>שגיאות:</strong>
              <ul style={{ margin: '5px 0', paddingRight: '20px' }}>
                {debugInfo.errors.map((error, index) => (
                  <li key={index} style={{ color: '#e74c3c', marginBottom: '5px' }}>
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {bookedDates.length > 0 && (
            <div style={{ marginTop: '10px' }}>
              <strong>רשימת הזמנות:</strong>
              <div style={{ marginTop: '5px', maxHeight: '150px', overflowY: 'auto' }}>
                {bookedDates.map((booking, index) => (
                  <div key={index} style={{ marginBottom: '3px', fontSize: '11px' }}>
                    {booking.start.toLocaleDateString('he-IL')} - {booking.end.toLocaleDateString('he-IL')}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div style={{ marginTop: '10px', fontSize: '11px', color: '#666' }}>
            <strong>טיפ:</strong> פתח את הקונסול בדפדפן (F12) כדי לראות מידע מפורט יותר
          </div>
        </div>
      )}
    </div>
  )
}

export default CalendarView

