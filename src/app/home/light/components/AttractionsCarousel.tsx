'use client'

import React, { useRef, useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Container } from 'react-bootstrap'
import { Icon } from '@iconify/react'

interface Attraction {
  id: number
  title: string
  distance: string
  image: string
  description: string
  wazeQuery: string
}

// רשימת אטרקציות עם תיאורים ארוכים יותר
const attractions: Attraction[] = [
  { 
    id: 1, 
    title: "נחל שניר (חצבאני)", 
    distance: "5 דק' נסיעה", 
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800",
    description: "נחל שניר הוא אחד משלושת מקורות הירדן, זורם כל השנה במים צלולים וקרים. הנחל מציע מסלולי הליכה מרהיבים בין עצי ערבה וצמחייה עשירה, בריכות טבעיות לשחייה, ואזורי פיקניק מוצלים. זהו מקום מושלם למשפחות המחפשות רגיעה וקרבה לטבע. הנחל מתאים גם לטיולי משפחות עם ילדים, עם שבילים נוחים ונגישים.",
    wazeQuery: "נחל%20שניר"
  },
  { 
    id: 2, 
    title: "שמורת טבע תל דן", 
    distance: "3 דק' נסיעה", 
    image: "/photos/tel_dan_nature_reserve.jpg",
    description: "אחת השמורות היפות בישראל, הנמצאת במרחק הליכה קצר מדפנה. בשמורה תמצאו את נהר הדן השוצף, \"בריכת השכשוך\" המפורסמת, ותל ארכיאולוגי מרתק. מסלול הליכה מוצל ונגיש שמתאים לכל הגילאים. גן עדן של מים זורמים ועצי ענק - מקום מושלם למשפחות, חובבי טבע וצילום.",
    wazeQuery: "שמורת%20תל%20דן"
  },
  { 
    id: 3, 
    title: "קייקי כפר בלום", 
    distance: "10 דק' נסיעה", 
    image: "/photos/kayak_kfar_blum.jpg",
    description: "האטרקציה המובילה בצפון לשייט קיאקים ורפטינג בנהר הירדן. תוכלו לבחור בין מסלול משפחתי רגוע ופסטורלי לבין מסלול אתגרי הכולל מפלים וזרימה חזקה. במקום תמצאו גם את פארק \"טופ-רופ\" הכולל חבלים, קיר טיפוס ואומגה למים. מתאים למשפחות, זוגות וקבוצות (מגובה 1 מטר במסלול הרגיל).",
    wazeQuery: "קייקי%20כפר%20בלום"
  },
  { 
    id: 4, 
    title: "מבצר נמרוד", 
    distance: "15 דק' נסיעה", 
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800",
    description: "מבצר צלבני מרשים מהמאה ה-12, השוכן על פסגת הר בגובה 800 מטר ומציע נוף פנורמי מרהיב על כל הגולן והחרמון. המבצר הוא אחד מהמבצרים השמורים ביותר בישראל ומציע טיול מרתק בין אולמות, מגדלים, ושרידים היסטוריים. הנוף מהמבצר הוא אחד מהיפים ביותר בישראל, עם תצפית על הר החרמון, הגולן, והגליל העליון.",
    wazeQuery: "מבצר%20נמרוד"
  },
  { 
    id: 5, 
    title: "אגמון החולה", 
    distance: "20 דק' נסיעה", 
    image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=800",
    description: "שמורת טבע ייחודית המהווה תחנת עצירה חשובה לעופות נודדים. האגמון מציע מסלולי הליכה וטיולי אופניים, תצפיות ציפורים, ונופים מרהיבים של מים וצמחייה. זהו מקום מושלם לחובבי טבע וצפרות, עם מגוון רחב של בעלי חיים וצמחייה ייחודית. האגמון מתאים לכל המשפחה ומציע פעילויות מגוונות לכל הגילאים.",
    wazeQuery: "אגמון%20החולה"
  },
]

const AttractionsCarousel = () => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' })
    }
  }

  const openModal = (attraction: Attraction) => {
    setSelectedAttraction(attraction)
    document.body.style.overflow = 'hidden' // מונע גלילה ברקע
  }

  const closeModal = useCallback(() => {
    setSelectedAttraction(null)
    document.body.style.overflow = 'unset'
  }, [])

  const handleWazeClick = (wazeQuery: string) => {
    const wazeUrl = `https://waze.com/ul?q=${wazeQuery}&navigate=yes`
    window.open(wazeUrl, '_blank', 'noopener,noreferrer')
  }

  // סגירה עם מקש Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedAttraction) {
        closeModal()
      }
    }

    if (selectedAttraction) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [selectedAttraction, closeModal])

  return (
    <section 
      className="section"
      style={{
        background: '#ffffff',
        padding: '60px 0',
        direction: 'rtl',
      }}
    >
      <Container>
        <div 
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '40px',
            flexWrap: 'wrap',
            gap: '20px',
          }}
        >
          <div>
            <h2 
              style={{
                fontSize: '42px',
                fontWeight: 'bold',
                color: '#0d9488',
                marginBottom: '10px',
                lineHeight: '1.2',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                fontFamily: 'Rubik, sans-serif',
              }}
            >
              אטרקציות באזור
            </h2>
            <p 
              style={{
                fontSize: '18px',
                color: '#4b5563',
                margin: 0,
                lineHeight: '1.8',
              }}
            >
              האזור שלנו מציע מגוון רחב של אטרקציות ופעילויות לכל המשפחה
            </p>
          </div>
          
          {/* כפתורי ניווט למחשב */}
          <div 
            style={{
              gap: '8px',
            }}
            className="d-none d-md-flex"
          >
            <button 
              onClick={() => scroll('left')} 
              style={{
                padding: '12px',
                borderRadius: '50%',
                border: '1px solid #e5e7eb',
                background: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f3f4f6'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white'
              }}
            >
              <Icon icon="mdi:chevron-right" style={{ fontSize: '20px', color: '#374151' }} />
            </button>
            <button 
              onClick={() => scroll('right')} 
              style={{
                padding: '12px',
                borderRadius: '50%',
                border: '1px solid #e5e7eb',
                background: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f3f4f6'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white'
              }}
            >
              <Icon icon="mdi:chevron-left" style={{ fontSize: '20px', color: '#374151' }} />
            </button>
          </div>
        </div>

        {/* הקרוסלה */}
        <div 
          ref={scrollRef}
          style={{
            display: 'flex',
            overflowX: 'auto',
            gap: '16px',
            padding: '0 16px 32px 16px',
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
          className="attractions-carousel"
        >
          {attractions.map((item) => (
            <div 
              key={item.id}
              onClick={() => openModal(item)}
              style={{
                flex: '0 0 auto',
                width: '280px',
                aspectRatio: '3/4',
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                scrollSnapAlign: 'start',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.boxShadow = '0 25px 30px -5px rgba(0, 0, 0, 0.15), 0 15px 15px -5px rgba(0, 0, 0, 0.06)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
              }}
            >
              {/* תמונה */}
              <Image 
                src={item.image} 
                alt={item.title}
                fill
                style={{
                  objectFit: 'cover',
                  transition: 'transform 0.5s ease',
                }}
                className="attraction-image"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              />
              
              {/* Overlay כהה לטקסט */}
              <div 
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.2), transparent)',
                }}
              />
              
              {/* תוכן הטקסט */}
              <div 
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '24px',
                  color: 'white',
                  textAlign: 'right',
                }}
              >
                <span 
                  style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(8px)',
                    fontSize: '12px',
                    marginBottom: '12px',
                    fontWeight: '500',
                    color: 'white',
                  }}
                >
                  {item.distance}
                </span>
                <h3 
                  style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    lineHeight: '1.2',
                    margin: 0,
                    fontFamily: 'Rubik, sans-serif',
                    color: 'white',
                  }}
                >
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </Container>

      {/* Modal */}
      {selectedAttraction && (
        <>
          {/* רקע מעומעם */}
          <div
            onClick={closeModal}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(4px)',
              zIndex: 9998,
              animation: 'fadeIn 0.3s ease-out',
            }}
          />
          
          {/* Modal */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90%',
              maxWidth: '800px',
              maxHeight: '90vh',
              background: 'white',
              borderRadius: '24px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              zIndex: 9999,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              animation: 'slideInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              direction: 'rtl',
            }}
          >
            {/* כפתור סגירה */}
            <button
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10000,
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'white'
                e.currentTarget.style.transform = 'scale(1.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)'
                e.currentTarget.style.transform = 'scale(1)'
              }}
              aria-label="סגור"
            >
              <Icon icon="mdi:close" style={{ fontSize: '24px', color: '#374151' }} />
            </button>

            {/* תמונה גדולה */}
            <div
              style={{
                width: '100%',
                height: '300px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Image
                src={selectedAttraction.image}
                alt={selectedAttraction.title}
                fill
                style={{
                  objectFit: 'cover',
                }}
              />
            </div>

            {/* תוכן */}
            <div
              style={{
                padding: '32px',
                overflowY: 'auto',
                flex: 1,
              }}
            >
              {/* כותרת */}
              <h2
                style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  marginBottom: '12px',
                  lineHeight: '1.2',
                  fontFamily: 'Rubik, sans-serif',
                }}
              >
                {selectedAttraction.title}
              </h2>

              {/* מרחק */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '24px',
                }}
              >
                <Icon icon="mdi:map-marker-distance" style={{ fontSize: '20px', color: '#0d9488' }} />
                <span
                  style={{
                    fontSize: '16px',
                    color: '#4b5563',
                    fontWeight: '500',
                  }}
                >
                  {selectedAttraction.distance} מהיחידה
                </span>
              </div>

              {/* תיאור */}
              <p
                style={{
                  fontSize: '18px',
                  color: '#4b5563',
                  lineHeight: '1.8',
                  marginBottom: '32px',
                }}
              >
                {selectedAttraction.description}
              </p>

              {/* כפתור Waze */}
              <button
                onClick={() => handleWazeClick(selectedAttraction.wazeQuery)}
                style={{
                  width: '100%',
                  padding: '16px 24px',
                  background: '#0d9488',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(13, 148, 136, 0.4)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#0b8378'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(13, 148, 136, 0.5)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#0d9488'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(13, 148, 136, 0.4)'
                }}
              >
                <Icon icon="mdi:waze" style={{ fontSize: '24px' }} />
                <span>נווט ב-Waze</span>
              </button>
            </div>
          </div>
        </>
      )}

      <style jsx global>{`
        .attractions-carousel::-webkit-scrollbar {
          display: none;
        }
        
        @media (min-width: 768px) {
          .attractions-carousel > div {
            width: 350px !important;
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translate(-50%, -45%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }

        @media (max-width: 768px) {
          .attractions-modal {
            width: 95% !important;
            max-height: 85vh !important;
          }
        }
      `}</style>
    </section>
  )
}

export default AttractionsCarousel

