'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function PaymentErrorContent() {
  const searchParams = useSearchParams()
  const errorCode = searchParams.get('errorCode') ?? ''

  useEffect(() => {
    if (window.self !== window.top) {
      window.parent.postMessage({
        type: 'payment-error',
        error: errorCode ? `התשלום נכשל (קוד: ${errorCode})` : 'התשלום נכשל',
      }, '*')
    }
  }, [errorCode])

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
          background: 'linear-gradient(135deg, #ef5350, #c62828)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          fontSize: '2.5rem',
          boxShadow: '0 8px 24px rgba(239,83,80,0.3)',
          color: 'white',
        }}>
          ✗
        </div>

        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#c62828', marginBottom: '12px' }}>
          התשלום נכשל
        </h1>

        <p style={{ color: '#666', fontSize: '1.05rem', marginBottom: '16px', lineHeight: 1.6 }}>
          לא הצלחנו לעבד את התשלום שלך.
          <br />
          לא בוצע חיוב בכרטיס האשראי שלך.
        </p>

        {errorCode && errorCode !== '000' && (
          <p style={{
            background: '#ffebee',
            border: '1px solid #ef9a9a',
            borderRadius: '8px',
            padding: '10px',
            fontSize: '0.88rem',
            color: '#b71c1c',
            marginBottom: '24px',
          }}>
            קוד שגיאה: {errorCode}
          </p>
        )}

        <p style={{ color: '#888', fontSize: '0.9rem' }}>
          ניתן לסגור חלון זה ולנסות שוב.
        </p>
      </div>
    </div>
  )
}

export default function PaymentErrorPage() {
  return (
    <Suspense fallback={null}>
      <PaymentErrorContent />
    </Suspense>
  )
}
