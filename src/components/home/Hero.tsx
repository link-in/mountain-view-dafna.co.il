'use client'

import { Col, Container, Row } from 'react-bootstrap'
import { ReactTyped } from 'react-typed'
import { useState, useEffect } from 'react'

// רשימת תמונות הרקע לסליידר
// משתמשים בנתיבים יחסיים מהתיקייה public
// הערה: יש להעתיק את התמונות לתיקייה public/photos
const backgroundImages = [
  '/photos/IMG_2254.JPG',
  '/photos/IMG_2277.JPG',
  '/photos/IMG_2269.JPG',
  '/photos/IMG_2287.JPG',
]

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  // החלפה אוטומטית כל 5 שניות
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgroundImages.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + backgroundImages.length) % backgroundImages.length)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % backgroundImages.length)
  }

  return (
    <>
      <section className="bg-image-slider bg-light" id="home" style={{ position: 'relative', borderBottom: '10px solid #2e2e2e', paddingTop: '80px' }}>
        {/* תמונות רקע */}
        <div className="slider-backgrounds">
          {backgroundImages.map((image, index) => (
            <div
              key={index}
              className={`slider-background ${index === currentSlide ? 'active' : ''}`}
              style={{
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: index === currentSlide ? 1 : 0,
                transition: 'opacity 1s ease-in-out',
                zIndex: 1,
              }}
            />
          ))}
        </div>
        
        <div className="" style={{ zIndex: 2 }} />
        
        {/* כפתורי ניווט */}
        <button
          className="slider-nav-btn slider-nav-prev"
          onClick={goToPrevious}
          style={{
            position: 'absolute',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 3,
            background: 'transparent',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            cursor: 'pointer',
            fontSize: '24px',
            color: 'black',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'transparent'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
          }}
        >
          ‹
        </button>
        
        <button
          className="slider-nav-btn slider-nav-next"
          onClick={goToNext}
          style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 3,
            background: 'transparent',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            cursor: 'pointer',
            fontSize: '24px',
            color: 'black',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'transparent'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
          }}
        >
          ›
        </button>

        {/* נקודות ניווט */}
        <div
          className="slider-dots"
          style={{
            position: 'absolute',
            bottom: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 3,
            display: 'flex',
            gap: '10px',
          }}
        >
          {backgroundImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                border: 'none',
                background: index === currentSlide ? 'white' : 'rgba(255, 255, 255, 0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>

        <Container style={{ position: 'relative', zIndex: 2 }}>
          {/* <Row className="justify-content-center">
            <Col lg={8}>
              <div className="text-center">
                <h1 style={{ fontSize: '90px' , fontWeight: 'bold', textShadow: '5px 4px 8px #000', color: '#0aa4f1' }}> 
                  <span className="font-weight-300">נוף הרים</span> בדפנה
                </h1>
                <h4 className="font-weight-300 mt-4 line-height_1_4">
                  בין פלגי הדן אל מול נוף חרמון שוכנת יחידת האירוח שלנו ... ואתם מוזמנים
                </h4>
              </div>
            </Col>
          </Row> */}
        </Container>
      </section>
    </>
  )
}

export default Hero
