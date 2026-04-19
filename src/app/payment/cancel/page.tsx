'use client'

import { useEffect, Suspense } from 'react'

function PaymentCancelContent() {
  useEffect(() => {
    if (window.self !== window.top) {
      window.parent.postMessage({ type: 'payment-cancelled' }, '*')
    }
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      direction: 'rtl',
      padding: '24px',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '48px 36px',
        textAlign: 'center',
        maxWidth: '480px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, #ff9800, #f57c00)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          fontSize: '2.5rem',
          boxShadow: '0 8px 24px rgba(255,152,0,0.3)',
          color: 'white',
        }}>
          ↩
        </div>

        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#e65100', marginBottom: '12px' }}>
          ביטלת את התשלום
        </h1>

        <p style={{ color: '#666', fontSize: '1.05rem', marginBottom: '28px', lineHeight: 1.6 }}>
          התשלום בוטל ולא בוצע חיוב.
          <br />
          התאריכים שבחרת עדיין פנויים — ניתן לחזור ולהשלים את ההזמנה.
        </p>
      </div>
    </div>
  )
}

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={null}>
      <PaymentCancelContent />
    </Suspense>
  )
}
