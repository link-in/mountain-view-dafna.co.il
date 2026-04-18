import { Suspense } from 'react'
import PaymentSuccessClient from './PaymentSuccessClient'

export const metadata = {
  title: 'תשלום הושלם | נוף הרים בדפנה',
  robots: { index: false },
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<PaymentLoadingScreen />}>
      <PaymentSuccessClient />
    </Suspense>
  )
}

function PaymentLoadingScreen() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      direction: 'rtl',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '60px 40px',
        textAlign: 'center',
        maxWidth: '480px',
        width: '90%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
      }}>
        <div style={{
          width: '70px',
          height: '70px',
          border: '5px solid #e0e0e0',
          borderTop: '5px solid #667eea',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 24px',
        }} />
        <h2 style={{ color: '#333', marginBottom: '8px' }}>מאמת תשלום...</h2>
        <p style={{ color: '#666' }}>אנא המתן, מעבד את ההזמנה שלך</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  )
}
