'use client'

import React, { useRef, useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Container } from 'react-bootstrap'
import { Icon } from '@iconify/react'

interface Restaurant {
  id: number
  title: string
  distance: string
  image: string
  description: string
  wazeQuery: string
}

// רשימת מסעדות עם תיאורים ארוכים יותר
const restaurants: Restaurant[] = [
  { 
    id: 1, 
    title: "מסעדת דן", 
    distance: "5 דק' נסיעה", 
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800",
    description: "מסעדה כשרה המציעה מטבח איטלקי ואירופאי משובח. המסעדה מתמחה במנות בשריות איכותיות, פסטות טריות, ופיצות אפויות בתנור עץ. האווירה חמה ומזמינה, עם שירות מקצועי וארוחות מושלמות לכל המשפחה. המסעדה מתאימה גם לאירועים פרטיים וקבוצות גדולות.",
    wazeQuery: "מסעדת%20דן"
  },
  { 
    id: 2, 
    title: "בית קפה דפנה", 
    distance: "במרחק הליכה", 
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800",
    description: "בית קפה כפרי ונעים המציע ארוחות בוקר עשירות, כריכים טריים, וקינוחים ביתיים. המקום מתאים לארוחת בוקר מאוחרת, צהריים קלילים, או קפה ועוגה בשעות אחר הצהריים. האווירה שלווה ונינוחה, עם נוף לטבע המקיף את הקיבוץ.",
    wazeQuery: "בית%20קפה%20דפנה"
  },
  { 
    id: 3, 
    title: "מסעדת החרמון", 
    distance: "10 דק' נסיעה", 
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800",
    description: "מסעדה יוקרתית עם נוף מרהיב להר החרמון. המסעדה מציעה מטבח ישראלי מודרני עם דגש על חומרי גלם טריים ואיכותיים מהאזור. התפריט כולל מנות דגים, בשרים, וסלטים טריים. המקום מושלם לארוחת ערב רומנטית או חגיגה מיוחדת.",
    wazeQuery: "מסעדת%20החרמון"
  },
  { 
    id: 4, 
    title: "פיצריית הגולן", 
    distance: "12 דק' נסיעה", 
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800",
    description: "פיצרייה איטלקית אותנטית עם פיצות אפויות בתנור אבן. התפריט כולל מגוון רחב של פיצות, פסטות, וסלטים טריים. המקום מתאים למשפחות עם ילדים ולחבר'ה שמחפשים אוכל מהיר וטעים. יש אפשרות להזמנות טייק-אאווי.",
    wazeQuery: "פיצריית%20הגולן"
  },
  { 
    id: 5, 
    title: "מסעדת הנחלים", 
    distance: "8 דק' נסיעה", 
    image: "https://images.unsplash.com/photo-1555396273-367ea86eb684?q=80&w=800",
    description: "מסעדה כשרה המתמחה במטבח ישראלי מסורתי עם טוויסט מודרני. התפריט כולל מנות בשריות, דגים טריים, ומגוון סלטים ומתאבנים. המסעדה ידועה באווירה המשפחתית החמה ובשירות המסור. מתאימה לארוחות משפחתיות ואירועים.",
    wazeQuery: "מסעדת%20הנחלים"
  },
]

const RestaurantsCarousel = () => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' })
    }
  }

  const openModal = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant)
    document.body.style.overflow = 'hidden' // מונע גלילה ברקע
  }

  const closeModal = useCallback(() => {
    setSelectedRestaurant(null)
    document.body.style.overflow = 'unset'
  }, [])

  const handleWazeClick = (wazeQuery: string) => {
    const wazeUrl = `https://waze.com/ul?q=${wazeQuery}&navigate=yes`
    window.open(wazeUrl, '_blank', 'noopener,noreferrer')
  }

  // סגירה עם מקש Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedRestaurant) {
        closeModal()
      }
    }

    if (selectedRestaurant) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [selectedRestaurant, closeModal])

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
                color: '#1a365d',
                marginBottom: '10px',
                lineHeight: '1.2',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
              }}
            >
              מסעדות באזור
            </h2>
            <p 
              style={{
                fontSize: '18px',
                color: '#666',
                margin: 0,
                lineHeight: '1.8',
              }}
            >
              מגוון רחב של מסעדות ובתי קפה בקרבת היחידה
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
          className="restaurants-carousel"
        >
          {restaurants.map((item) => (
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
                className="restaurant-image"
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
      {selectedRestaurant && (
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
                src={selectedRestaurant.image}
                alt={selectedRestaurant.title}
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
                  color: '#1a365d',
                  marginBottom: '12px',
                  lineHeight: '1.2',
                }}
              >
                {selectedRestaurant.title}
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
                <Icon icon="mdi:map-marker-distance" style={{ fontSize: '20px', color: '#667eea' }} />
                <span
                  style={{
                    fontSize: '16px',
                    color: '#666',
                    fontWeight: '500',
                  }}
                >
                  {selectedRestaurant.distance} מהיחידה
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
                {selectedRestaurant.description}
              </p>

              {/* כפתור Waze */}
              <button
                onClick={() => handleWazeClick(selectedRestaurant.wazeQuery)}
                style={{
                  width: '100%',
                  padding: '16px 24px',
                  background: '#33CCFF',
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
                  boxShadow: '0 4px 12px rgba(51, 204, 255, 0.4)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#29b8e6'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(51, 204, 255, 0.5)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#33CCFF'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(51, 204, 255, 0.4)'
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
        .restaurants-carousel::-webkit-scrollbar {
          display: none;
        }
        
        @media (min-width: 768px) {
          .restaurants-carousel > div {
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
          .restaurants-modal {
            width: 95% !important;
            max-height: 85vh !important;
          }
        }
      `}</style>
    </section>
  )
}

export default RestaurantsCarousel

