'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState } from 'react'

export default function MockCheckoutClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [processing, setProcessing] = useState(false)

  const successUrl = searchParams.get('successUrl') ?? '/'
  const cancelUrl = searchParams.get('cancelUrl') ?? '/'
  const errorUrl = searchParams.get('errorUrl') ?? '/'
  const amount = searchParams.get('amount') ?? '0'
  const uniqueId = searchParams.get('uniqueID') ?? ''

  const amountShekels = (parseInt(amount) / 100).toLocaleString('he-IL', {
    minimumFractionDigits: 0,
  })

  const handlePay = () => {
    setProcessing(true)
    setTimeout(() => {
      router.push(successUrl)
    }, 1500)
  }

  const handleCancel = () => {
    router.push(cancelUrl)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f0f2f5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: 'Arial, sans-serif',
      direction: 'rtl',
    }}>
      <div style={{ maxWidth: '420px', width: '100%' }}>

        {/* Mock badge */}
        <div style={{
          background: '#ff9800',
          color: 'white',
          textAlign: 'center',
          padding: '8px',
          borderRadius: '8px 8px 0 0',
          fontSize: '0.82rem',
          fontWeight: 700,
          letterSpacing: '0.5px',
        }}>
          🧪 סביבת בדיקות — אין חיוב אמיתי
        </div>

        {/* Main card */}
        <div style={{
          background: 'white',
          borderRadius: '0 0 16px 16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          overflow: 'hidden',
        }}>

          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
            padding: '24px',
            textAlign: 'center',
          }}>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.88rem', marginBottom: '4px' }}>
              עמוד תשלום מאובטח (סימולציה)
            </div>
            <div style={{ color: 'white', fontSize: '1.9rem', fontWeight: 700 }}>
              ₪{amountShekels}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', marginTop: '4px' }}>
              נוף הרים בדפנה
            </div>
          </div>

          <div style={{ padding: '28px 24px' }}>

            {/* Fake card fields */}
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>מספר כרטיס</label>
              <div style={fakeInputStyle}>5326 1073 0002 0772</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={labelStyle}>תוקף</label>
                <div style={fakeInputStyle}>05/31</div>
              </div>
              <div>
                <label style={labelStyle}>CVV</label>
                <div style={fakeInputStyle}>•••</div>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>תעודת זהות</label>
              <div style={fakeInputStyle}>000000000</div>
            </div>

            <div style={{
              background: '#e8f5e9',
              border: '1px solid #a5d6a7',
              borderRadius: '8px',
              padding: '10px 14px',
              fontSize: '0.82rem',
              color: '#2e7d32',
              marginBottom: '20px',
              textAlign: 'center',
            }}>
              ✅ כרטיס הבדיקה כבר מולא — לחץ "שלם" לדמות תשלום מוצלח
            </div>

            {/* Pay button */}
            <button
              onClick={handlePay}
              disabled={processing}
              style={{
                width: '100%',
                background: processing
                  ? '#ccc'
                  : 'linear-gradient(135deg, #1b5e20, #2e7d32)',
                color: 'white',
                border: 'none',
                padding: '16px',
                borderRadius: '10px',
                fontSize: '1.1rem',
                fontWeight: 700,
                cursor: processing ? 'not-allowed' : 'pointer',
                marginBottom: '12px',
                transition: 'all 0.2s',
              }}
            >
              {processing ? '⏳ מעבד...' : `💳 שלם ₪${amountShekels}`}
            </button>

            {/* Cancel */}
            <button
              onClick={handleCancel}
              disabled={processing}
              style={{
                width: '100%',
                background: 'transparent',
                color: '#999',
                border: '1px solid #ddd',
                padding: '12px',
                borderRadius: '10px',
                fontSize: '0.95rem',
                cursor: 'pointer',
              }}
            >
              ביטול
            </button>

          </div>

          {/* Footer */}
          <div style={{
            borderTop: '1px solid #f0f0f0',
            padding: '12px',
            textAlign: 'center',
            fontSize: '0.75rem',
            color: '#bbb',
          }}>
            🔒 תשלום מאובטח · Cardcom (סימולציה)
          </div>
        </div>
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.82rem',
  color: '#666',
  marginBottom: '6px',
  fontWeight: 600,
}

const fakeInputStyle: React.CSSProperties = {
  background: '#f7f7f7',
  border: '1.5px solid #e0e0e0',
  borderRadius: '8px',
  padding: '12px 14px',
  fontSize: '0.97rem',
  color: '#333',
  letterSpacing: '1px',
}
