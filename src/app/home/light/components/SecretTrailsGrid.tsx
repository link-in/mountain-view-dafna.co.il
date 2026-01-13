'use client'

import { Icon } from '@iconify/react'
import Image from 'next/image'

interface Trail {
  id: number
  title: string
  distance: string
  description: string
  wazeQuery: string
  image: string
}

const secretTrails: Trail[] = [
  {
    id: 1,
    title: "עין ירדנון",
    distance: "10 דק' נסיעה",
    description: "בריכה נסתרת וקסומה בלב צמחייה עבותה. מקום מושלם למי שמחפש שקט מוחלט ומים קרירים וצלולים הרחק מהמסלולים המוכרים.",
    wazeQuery: "עין%20ירדנון",
    image: "/photos/yardenon_spring.jpg"
  },
  {
    id: 2,
    title: "הטנק הסורי בבניאס",
    distance: "12 דק' נסיעה",
    description: "מסלול קצר ומרתק בתוך ערוץ הנחל שמוביל לטנק סורי שהתהפך לתוך המים. שילוב של היסטוריה, ממים זורמים וטבע פראי.",
    wazeQuery: "הטנק%20הסורי%20בניאס",
    image: "/photos/syrian_tank.jpg"
  },
  {
    id: 3,
    title: "מפל פרע - הג'ונגל הנסתר",
    distance: "10 דק' נסיעה",
    image: "/photos/prat_spring.jpg",
    description: "חווית מים נדירה שנמצאת ממש ליד קיבוץ שניר. מפל פרע הוא מפל עונתי שמתעורר לחיים רק לאחר גשמים משמעותיים או שיטפונות. המסלול אליו קצר מאוד, אך הוא הופך לבוצי ומחליק במיוחד – מה שמוסיף לאווירת ההרפתקה.",     wazeQuery: "מפל%20פרע"
  },
  {
    id: 4,
    title: "תל עזזיאת - המוצב הנטוש",
    distance: "18 דק' נסיעה",
    description: "תצפית מדהימה מתל בזלת קדום על הר החרמון ועמק החולה. עקבות ישוב קדום ומוצב צבאי נטוש המספרים את סיפור המקום. מקום מושלם לשקיעה ולצילומים מיוחדים.",
    wazeQuery: "תל%20עזזיאת",
    image: "/photos/tel_azaziat.jpg"
  }
]

const SecretTrailsGrid = () => {
  return (
    <section
      style={{
        background: '#f8f9fa',
        padding: '80px 0',
        direction: 'rtl',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
        {/* Header with Icon */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
            <Icon 
              icon="mdi:compass" 
              style={{ 
                fontSize: '48px', 
                color: '#0d9488'
              }} 
            />
            <h2 
              style={{ 
                fontSize: '42px', 
                fontWeight: 'bold', 
                color: '#0d9488',
                margin: 0,
                fontFamily: 'Rubik, sans-serif',
              }}
            >
              טיולים OFF-GRID בגליל העליון
            </h2>
          </div>
          <p style={{ fontSize: '18px', color: '#666', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
            מסלולים נסתרים וייחודיים שרוב המטיילים לא מכירים. מקומות שקטים ומיוחדים במיוחד למי שמחפש את האמיתי.
          </p>
        </div>

        {/* Grid of Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
            maxWidth: '1400px',
            margin: '0 auto',
          }}
        >
          {secretTrails.map((trail) => (
            <div
              key={trail.id}
              style={{
                background: '#fff',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)'
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'
              }}
            >
              {/* Image with Badge */}
              <div style={{ position: 'relative', width: '100%', height: '220px', overflow: 'hidden' }}>
                <Image
                  src={trail.image}
                  alt={trail.title}
                  fill
                  style={{ objectFit: 'cover', transition: 'transform 0.3s ease' }}
                  unoptimized={trail.image.startsWith('http')}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)'
                  }}
                />
                {/* Badge Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'rgba(13, 148, 136, 0.95)',
                    color: '#fff',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: '600',
                    backdropFilter: 'blur(4px)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  }}
                >
                  {trail.distance}
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: '20px' }}>
                <h3
                  style={{
                    fontSize: '22px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    marginBottom: '12px',
                    fontFamily: 'Rubik, sans-serif',
                  }}
                >
                  {trail.title}
                </h3>
                <p
                  style={{
                    fontSize: '15px',
                    color: '#6b7280',
                    lineHeight: '1.6',
                    marginBottom: '20px',
                  }}
                >
                  {trail.description}
                </p>

                {/* Waze Button */}
                <a
                  href={`https://waze.com/ul?q=${trail.wazeQuery}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    padding: '12px 20px',
                    background: 'transparent',
                    color: '#0d9488',
                    border: '2px solid #0d9488',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#0d9488'
                    e.currentTarget.style.color = '#fff'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = '#0d9488'
                  }}
                >
                  <Icon icon="mdi:waze" style={{ fontSize: '20px' }} />
                  נווט עם Waze
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SecretTrailsGrid
