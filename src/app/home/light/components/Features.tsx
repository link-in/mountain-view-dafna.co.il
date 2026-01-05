'use client'

import { Icon } from '@iconify/react'
import { Col, Container, Row } from 'react-bootstrap'

interface Feature {
  icon: string
  title: string
}

const features: Feature[] = [
  {
    icon: 'mdi:wifi',
    title: 'WiFi חינם במהירות גבוהה',
  },
  {
    icon: 'mdi:bag-checked',
    title: 'אחסון חינם למזוודות מכל גודל',
  },
  {
    icon: 'mdi:map-marker',
    title: 'מיקום נוח במרכז',
  },
  {
    icon: 'mdi:car',
    title: 'מקום חניה מוקצה',
  },
  {
    icon: 'mdi:air-conditioner',
    title: 'מיזוג אוויר',
  },
  {
    icon: 'mdi:image-filter-hdr',
    title: 'מרפסת נוף ענקית',
  },
  {
    icon: 'mdi:kitchen',
    title: 'מטבח מאובזר',
  },
  {
    icon: 'mdi:sofa',
    title: 'חלל משותף נוח',
  },
]

const Features = () => {

  const handleBookNow = () => {
    // גלילה לכפתור ההזמנות או פתיחת חלון ההזמנות
    const floatingButton = document.querySelector('.floating-availability-button') as HTMLElement
    if (floatingButton) {
      floatingButton.click()
    }
  }

  return (
    <section
      style={{
        background: '#ffffff',
        padding: '40px 0',
        position: 'relative',
        direction: 'rtl',
      }}
    >
      <Container>
        <Row className="justify-content-center">
          {/* טקסט ותיאור */}
          <Col lg={10} xl={8}>
            <h2
              style={{
                fontSize: '42px',
                fontWeight: 'bold',
                color: '#1a365d',
                marginBottom: '25px',
                lineHeight: '1.2',
                textAlign: 'center',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
              }}
            >
             בין פלגי הדן אל מול נופי חרמון היחידה שלנו מציעה לכם חוויה מושלמת
            </h2>
            <p
              style={{
                fontSize: '18px',
                color: '#666',
                lineHeight: '1.8',
                marginBottom: '40px',
              }}
            >
              יחידת האירוח שלנו בדפנה מציעה לכם חוויה מושלמת בין פלגי הדן אל מול נופי חרמון. 
              היחידה מאובזרת בכל מה שצריך לנוחות מקסימלית - מטבח מלא, חלל משותף מרווח, 
              חדרי שינה נוחים ומרפסת עם נוף מרהיב. המיקום הנוח מאפשר גישה קלה לכל האטרקציות 
              באזור, והשירותים שלנו מבטיחים שהייה נעימה ובלתי נשכחת.
            </p>

            {/* רשימת שירותים */}
            <Row className="g-4 features-icons-list">
              {features.map((feature, index) => (
                <Col key={index} xs={6} sm={6} md={6}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '15px',
                      padding: '5px 15px',
                      borderRadius: '8px',
                      transition: 'all 0.3s ease',
                      cursor: 'default',
                      flexDirection: 'row-reverse', // איקון מימין לטקסט
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f8f9fa'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    <div
                      style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.1)'
                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.4)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)'
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)'
                      }}
                    >
                      <Icon
                        icon={feature.icon}
                        style={{
                          fontSize: '28px',
                          color: '#ffffff',
                        }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: '0.8em',
                          fontWeight: '600',
                          color: '#2e2e2e',
                          lineHeight: '1.4',
                        }}
                      >
                        {feature.title}
                      </p>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>

            {/* כפתורים */}
            {/* <div
              style={{
                display: 'flex',
                gap: '20px',
                marginTop: '40px',
                flexWrap: 'wrap',
                flexDirection: 'row-reverse', // כפתורים מימין לשמאל
              }}
            >
              <button
                onClick={handleBookNow}
                style={{
                  background: '#2e2e2e',
                  color: 'white',
                  border: 'none',
                  padding: '16px 40px',
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
                הזמן עכשיו
              </button>
              <a
                href="#portfolio-gallery"
                style={{
                  color: '#2e2e2e',
                  fontSize: '18px',
                  fontWeight: '600',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '16px 0',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#1a1a1a'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#2e2e2e'
                }}
              >
                עוד פרטים
                <Icon icon="mdi:arrow-right" style={{ fontSize: '20px' }} />
              </a>
            </div> */}
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default Features

