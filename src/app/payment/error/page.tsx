import Link from 'next/link'

export const metadata = {
  title: 'שגיאה בתשלום | נוף הרים בדפנה',
  robots: { index: false },
}

export default function PaymentErrorPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>
}) {
  const errorCode = String(searchParams?.errorCode ?? '')
  const uniqueID = String(searchParams?.uniqueID ?? '')

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

        <h1 style={{
          fontSize: '1.8rem',
          fontWeight: 700,
          color: '#c62828',
          marginBottom: '12px',
        }}>
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

        <p style={{
          background: '#fff8e1',
          border: '1px solid #ffe082',
          borderRadius: '10px',
          padding: '14px',
          fontSize: '0.92rem',
          color: '#6d4c00',
          marginBottom: '28px',
        }}>
          ניתן לנסות שוב או לפנות אלינו ישירות לקביעת הזמנה.
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
              fontSize: '0.97rem',
              boxShadow: '0 6px 16px rgba(102,126,234,0.3)',
            }}
          >
            חזרה ונסה שוב
          </Link>
        </div>
      </div>
    </div>
  )
}
