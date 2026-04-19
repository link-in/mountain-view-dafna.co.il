'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface BookingResult {
  bookingId: string
  guestName: string
  checkIn: string
  checkOut: string
  amountPaid: number
  message: string
}

type VerifyStatus = 'loading' | 'success' | 'error'

export default function PaymentSuccessClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<VerifyStatus>('loading')
  const [result, setResult] = useState<BookingResult | null>(null)
  const [errorMessage, setErrorMessage] = useState('')

  const isInIframe = typeof window !== 'undefined' && window.self !== window.top

  useEffect(() => {
    const lowProfileId = searchParams.get('LowProfileId')

    if (!lowProfileId) {
      setStatus('error')
      setErrorMessage('פרמטרי תשלום חסרים. אנא צור קשר עם התמיכה.')
      if (isInIframe) window.parent.postMessage({ type: 'payment-error', error: 'פרמטרי תשלום חסרים' }, '*')
      return
    }

    let attempts = 0
    const maxAttempts = 8

    const verifyPayment = async (): Promise<void> => {
      attempts += 1
      try {
        const params = new URLSearchParams(searchParams.toString())
        const response = await fetch(`/api/public/payment/verify?${params.toString()}`)
        const data = await response.json()

        if (response.status === 202 && attempts < maxAttempts) {
          setTimeout(() => void verifyPayment(), 1500)
          return
        }

        if (!response.ok || !data.success) {
          setStatus('error')
          setErrorMessage(data.error ?? 'אימות התשלום נכשל. אנא צור קשר עם התמיכה.')
          if (isInIframe) window.parent.postMessage({ type: 'payment-error', error: data.error ?? 'אימות התשלום נכשל' }, '*')
          return
        }

        setResult(data as BookingResult)
        setStatus('success')
        if (isInIframe) window.parent.postMessage({ type: 'payment-success', result: data }, '*')
      } catch {
        if (attempts < maxAttempts) {
          setTimeout(() => void verifyPayment(), 1500)
          return
        }
        setStatus('error')
        setErrorMessage('שגיאת תקשורת. אנא צור קשר עם התמיכה.')
        if (isInIframe) window.parent.postMessage({ type: 'payment-error', error: 'שגיאת תקשורת' }, '*')
      }
    }

    void verifyPayment()
  }, [searchParams, isInIframe])

  if (status === 'loading') {
    return <LoadingView />
  }

  if (status === 'error') {
    return <ErrorView message={errorMessage} />
  }

  return <SuccessView result={result!} />
}

function LoadingView() {
  return (
    <PageWrapper>
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
    </PageWrapper>
  )
}

function SuccessView({ result }: { result: BookingResult }) {
  return (
    <PageWrapper>
      <div style={{
        width: '80px',
        height: '80px',
        background: 'linear-gradient(135deg, #4caf50, #45a049)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 24px',
        fontSize: '2.5rem',
        boxShadow: '0 8px 24px rgba(76,175,80,0.3)',
      }}>
        ✓
      </div>

      <h1 style={{
        fontSize: '1.8rem',
        fontWeight: 700,
        color: '#2e7d32',
        marginBottom: '8px',
      }}>
        ההזמנה אושרה!
      </h1>

      <p style={{ color: '#666', fontSize: '1.05rem', marginBottom: '28px' }}>
        תודה {result.guestName}! קיבלנו את תשלומך בהצלחה.
      </p>

      <div style={{
        background: 'linear-gradient(135deg, #f1f8e9, #e8f5e9)',
        border: '2px solid #a5d6a7',
        borderRadius: '14px',
        padding: '24px',
        marginBottom: '28px',
        textAlign: 'right',
        direction: 'rtl',
      }}>
        <DetailRow label="מספר הזמנה" value={result.bookingId} highlight />
        <DetailRow label="תאריך כניסה" value={formatDate(result.checkIn)} />
        <DetailRow label="תאריך יציאה" value={formatDate(result.checkOut)} />
        <DetailRow label="סכום ששולם" value={`₪${Number(result.amountPaid).toLocaleString()}`} highlight />
      </div>

      <p style={{
        background: '#fff8e1',
        border: '1px solid #ffe082',
        borderRadius: '10px',
        padding: '14px',
        fontSize: '0.92rem',
        color: '#6d4c00',
        marginBottom: '28px',
      }}>
        📱 הודעת WhatsApp עם פרטי ההזמנה נשלחה לטלפון שלך.
      </p>

      <Link
        href="/"
        style={{
          display: 'inline-block',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '14px 36px',
          borderRadius: '30px',
          textDecoration: 'none',
          fontWeight: 600,
          fontSize: '1rem',
          boxShadow: '0 8px 20px rgba(102,126,234,0.3)',
          transition: 'transform 0.2s',
        }}
      >
        חזרה לאתר
      </Link>
    </PageWrapper>
  )
}

function ErrorView({ message }: { message: string }) {
  return (
    <PageWrapper>
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
      }}>
        ✗
      </div>

      <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#c62828', marginBottom: '8px' }}>
        שגיאה בתשלום
      </h1>

      <p style={{ color: '#666', marginBottom: '24px', lineHeight: 1.6 }}>{message}</p>

      <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '28px' }}>
        לא בוצע חיוב בכרטיס האשראי שלך. ניתן לנסות שוב.
      </p>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link
          href="/"
          style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '14px 28px',
            borderRadius: '30px',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          חזרה לאתר
        </Link>
        <a
          href={`tel:${process.env.NEXT_PUBLIC_OWNER_PHONE ?? ''}`}
          style={{
            display: 'inline-block',
            border: '2px solid #667eea',
            color: '#667eea',
            padding: '14px 28px',
            borderRadius: '30px',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          צור קשר
        </a>
      </div>
    </PageWrapper>
  )
}

function DetailRow({
  label,
  value,
  highlight = false,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      padding: '10px 0',
      borderBottom: '1px solid rgba(0,0,0,0.07)',
      fontSize: highlight ? '1.05rem' : '0.97rem',
      fontWeight: highlight ? 700 : 400,
    }}>
      <span style={{ color: '#555' }}>{label}</span>
      <span style={{ color: highlight ? '#2e7d32' : '#222' }}>{value}</span>
    </div>
  )
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('he-IL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

function PageWrapper({ children }: { children: React.ReactNode }) {
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
        maxWidth: '520px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
      }}>
        {children}
      </div>
    </div>
  )
}
