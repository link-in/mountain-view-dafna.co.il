'use client'

import React, { useRef, useState, useEffect } from 'react'
import { Container } from 'react-bootstrap'
import { Icon } from '@iconify/react'
import { reviews as staticReviews, Review } from '@/data/reviews'

const AirbnbLogo = () => (
  <img
    src="/logos/airbnb.png"
    alt="Airbnb"
    style={{ display: 'block', height: '16px', width: 'auto' }}
    loading="lazy"
  />
)

const BookingLogo = () => (
  <img
    src="/logos/booking.svg"
    alt="Booking.com"
    style={{ display: 'block', height: '16px', width: 'auto' }}
    loading="lazy"
  />
)

const GoogleLogo = () => (
  <span
    style={{
      fontSize: '14px',
      fontWeight: '600',
      color: '#4285F4',
    }}
  >
    Google
  </span>
)

const SourceLogo = ({ source }: { source: string }) => {
  const normalizedSource = source.toLowerCase()

  if (normalizedSource === 'booking') {
    return <BookingLogo />
  }

  if (normalizedSource === 'airbnb') {
    return <AirbnbLogo />
  }

  if (normalizedSource === 'google') {
    return <GoogleLogo />
  }

  return null
}

const ReviewAvatar = ({ name, image }: { name: string; image: string }) => {
  const [hasError, setHasError] = useState(false)

  if (hasError || !image) {
    return <>{name.charAt(0)}</>
  }

  return (
    <img
      src={image}
      alt={name}
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
    />
  )
}

const ReviewsCarousel = () => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [reviews, setReviews] = useState<Review[]>(staticReviews)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  // Fetch reviews from API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('/api/reviews')
        
        if (!response.ok) {
          throw new Error('Failed to fetch reviews')
        }

        const data = await response.json()
        
        if (data && Array.isArray(data) && data.length > 0) {
          setReviews(data)
          setError(false)
        } else {
          // If no reviews in DB, keep static reviews
          console.log('No reviews in database, using static reviews')
        }
      } catch (err) {
        console.error('Error loading reviews:', err)
        setError(true)
        // Keep static reviews as fallback
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 1.2 : scrollLeft + clientWidth / 1.2
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' })
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        icon={index < rating ? 'mdi:star' : 'mdi:star-outline'}
        style={{ fontSize: '18px', color: '#f59e0b' }}
      />
    ))
  }

  // Show loading skeleton or static reviews while loading
  if (loading) {
    // Show static reviews immediately for better UX
    // The component will update when API data loads
  }

  return (
    <section
      className="section"
      style={{
        background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
        padding: '70px 0',
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
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '12px',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: 'rgba(13, 148, 136, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon icon="mdi:comment-quote" style={{ fontSize: '26px', color: '#0d9488' }} />
              </div>
              <h2
                style={{
                  fontSize: '42px',
                  fontWeight: 'bold',
                  color: '#0d9488',
                  margin: 0,
                  lineHeight: '1.2',
                  fontFamily: 'Rubik, sans-serif',
                }}
              >
                ביקורות אורחים
              </h2>
            </div>
            <p
              style={{
                fontSize: '18px',
                color: '#4b5563',
                margin: 0,
                lineHeight: '1.8',
                maxWidth: '640px',
              }}
            >
              מילים אמיתיות מאנשים שהתארחו אצלנו וחזרו הביתה עם חיוך.
            </p>
          </div>

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
                boxShadow: '0 6px 14px rgba(15, 23, 42, 0.08)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f8fafc'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white'
              }}
              aria-label="גלול ימינה"
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
                boxShadow: '0 6px 14px rgba(15, 23, 42, 0.08)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f8fafc'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white'
              }}
              aria-label="גלול שמאלה"
            >
              <Icon icon="mdi:chevron-left" style={{ fontSize: '20px', color: '#374151' }} />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          style={{
            display: 'flex',
            overflowX: 'auto',
            gap: '18px',
            padding: '0 16px 24px 16px',
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
          className="reviews-carousel"
        >
          {reviews.map((review) => (
            <div
              key={review.id}
              style={{
                flex: '0 0 auto',
                width: '300px',
                borderRadius: '20px',
                background: '#ffffff',
                padding: '24px',
                boxShadow: '0 18px 40px rgba(15, 23, 42, 0.08)',
                scrollSnapAlign: 'start',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                border: '1px solid rgba(148, 163, 184, 0.2)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)'
                e.currentTarget.style.boxShadow = '0 22px 45px rgba(15, 23, 42, 0.14)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 18px 40px rgba(15, 23, 42, 0.08)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: '#0d9488',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    fontWeight: '700',
                    fontFamily: 'Rubik, sans-serif',
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}
                >
                  <ReviewAvatar name={review.userName} image={review.userImage} />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#111827',
                      fontFamily: 'Rubik, sans-serif',
                    }}
                  >
                    {review.userName}
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>{review.location}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>{renderStars(review.rating)}</div>

              <p
                style={{
                  fontSize: '15px',
                  color: '#4b5563',
                  lineHeight: '1.7',
                  marginBottom: '20px',
                }}
              >
                {review.comment}
              </p>

              {review.hostResponse && (
                <div
                  style={{
                    background: 'rgba(13, 148, 136, 0.08)',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    marginBottom: '18px',
                    fontSize: '14px',
                    color: '#0f766e',
                    lineHeight: '1.6',
                  }}
                >
                  תגובת המארחים: {review.hostResponse}
                </div>
              )}

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '13px',
                  color: '#94a3b8',
                  borderTop: '1px dashed rgba(148, 163, 184, 0.4)',
                  paddingTop: '12px',
                }}
              >
                <span>{review.date}</span>
                <span
                  style={{
                    background: 'rgba(13, 148, 136, 0.12)',
                    color: '#0d9488',
                    padding: '4px 10px',
                    borderRadius: '999px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <SourceLogo source={review.source} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </Container>

      <style jsx global>{`
        .reviews-carousel::-webkit-scrollbar {
          display: none;
        }

        @media (min-width: 768px) {
          .reviews-carousel > div {
            width: 360px !important;
          }
        }
      `}</style>
    </section>
  )
}

export default ReviewsCarousel
