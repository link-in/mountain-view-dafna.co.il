'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function PWAInstallPrompt() {
  const pathname = usePathname()
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallButton, setShowInstallButton] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  // Show ONLY in dashboard area
  const isInDashboard = pathname?.startsWith('/dashboard')

  useEffect(() => {
    // Register Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('✅ PWA: Service Worker registered:', registration)
        })
        .catch((error) => {
          console.log('❌ PWA: Service Worker registration failed:', error)
        })
    }

    // Check if already installed (standalone mode)
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true

    setIsStandalone(isInStandaloneMode)
    console.log('📱 PWA: Standalone mode:', isInStandaloneMode)
    console.log('📍 PWA: Current path:', pathname)

    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    setIsIOS(iOS)
    console.log('🍎 PWA: Is iOS:', iOS)
    console.log('🎯 PWA: In dashboard:', pathname?.startsWith('/dashboard'))

    // Listen for beforeinstallprompt event (Android/Chrome)
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallButton(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [pathname])

  const handleInstallClick = async () => {
    console.log('🔘 PWA: Install button clicked!', { deferredPrompt, isIOS })
    
    if (deferredPrompt) {
      // Android/Chrome
      console.log('📱 PWA: Showing Android install prompt')
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      console.log(`User response: ${outcome}`)
      setDeferredPrompt(null)
      setShowInstallButton(false)
    } else {
      // iOS or no prompt available - show instructions
      console.log('🍎 PWA: Showing iOS instructions modal')
      setShowInstructions(true)
    }
  }

  // Don't show anything if already installed or not in dashboard
  if (isStandalone || !isInDashboard) {
    console.log('🚫 PWA: Not showing button - isStandalone:', isStandalone, 'isInDashboard:', isInDashboard)
    return null
  }

  // Debug: Show button state
  const shouldShowButton = showInstallButton || (isIOS && !isStandalone)
  console.log('🔘 PWA: Button render check:', {
    showInstallButton,
    isIOS,
    isStandalone,
    isInDashboard,
    shouldShowButton
  })

  return (
    <>
      {/* Install Button - show for iOS always (unless standalone), or when Android prompt is ready */}
      {(showInstallButton || (isIOS && !isStandalone)) && (
        <button
          onClick={handleInstallClick}
          className="btn btn-sm d-flex align-items-center gap-2"
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '30px',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
            fontSize: '14px',
            fontWeight: '600',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)'
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.6)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          התקן אפליקציה
        </button>
      )}

      {/* Instructions Modal for iOS */}
      {showInstructions && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            animation: 'fadeIn 0.2s ease-in',
          }}
          onClick={() => {
            console.log('🚫 PWA: Closing instructions modal')
            setShowInstructions(false)
          }}
        >
          <div
            className="bg-white p-4 rounded-3"
            style={{ 
              maxWidth: '400px', 
              width: '100%',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
              animation: 'slideUp 0.3s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5
                className="mb-0"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontWeight: 'bold',
                }}
              >
                הוסף למסך הבית
              </h5>
              <button
                onClick={() => setShowInstructions(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#999',
                }}
              >
                ×
              </button>
            </div>

            <div className="text-end" dir="rtl">
              <div className="mb-4 p-3 rounded" style={{ backgroundColor: '#f8f9fa', border: '2px solid #667eea' }}>
                <div className="d-flex align-items-center justify-content-center mb-2">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#667eea"
                    strokeWidth="2"
                  >
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                    <polyline points="16 6 12 2 8 6" />
                    <line x1="12" y1="2" x2="12" y2="15" />
                  </svg>
                </div>
                <p className="mb-0 text-center fw-bold" style={{ color: '#667eea' }}>
                  לחץ על כפתור השיתוף
                </p>
              </div>

              <div className="mb-3">
                <p className="mb-2 fw-bold">📱 כדי להוסיף למסך הבית:</p>
                <ol className="text-end pe-3" style={{ fontSize: '15px', lineHeight: '1.8' }}>
                  <li className="mb-2">
                    לחץ על כפתור <strong style={{ color: '#667eea' }}>השיתוף ↑</strong> בתחתית המסך
                  </li>
                  <li className="mb-2">
                    גלול למטה ובחר <strong style={{ color: '#667eea' }}>"הוסף למסך הבית"</strong>
                  </li>
                  <li className="mb-2">
                    לחץ על <strong style={{ color: '#667eea' }}>"הוסף"</strong>
                  </li>
                </ol>
              </div>

              <div className="alert alert-success mb-0" style={{ fontSize: '14px' }}>
                ✅ האפליקציה עם לוגו HOSTLY תופיע במסך הבית!
              </div>
            </div>

            <button
              onClick={() => {
                console.log('✅ PWA: User closed instructions')
                setShowInstructions(false)
              }}
              className="btn w-100 mt-3"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                color: 'white',
                padding: '12px',
                fontSize: '16px',
                fontWeight: '600',
              }}
            >
              הבנתי 👍
            </button>
          </div>
        </div>
      )}
    </>
  )
}
