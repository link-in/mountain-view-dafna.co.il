'use client'

import { useEffect, useState } from 'react'

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallButton, setShowInstallButton] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Register Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration)
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error)
        })
    }

    // Check if already installed (standalone mode)
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true

    setIsStandalone(isInStandaloneMode)

    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    setIsIOS(iOS)

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
  }, [])

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Android/Chrome
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      console.log(`User response: ${outcome}`)
      setDeferredPrompt(null)
      setShowInstallButton(false)
    } else if (isIOS) {
      // iOS - show instructions
      setShowInstructions(true)
    }
  }

  // Don't show anything if already installed
  if (isStandalone) {
    return null
  }

  return (
    <>
      {/* Install Button */}
      {(showInstallButton || isIOS) && (
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
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setShowInstructions(false)}
        >
          <div
            className="bg-white p-4 rounded-3"
            style={{ maxWidth: '400px', width: '100%' }}
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
              {isIOS ? (
                <>
                  <p className="mb-3">כדי להוסיף את האתר למסך הבית ב-iPhone:</p>
                  <ol className="text-end pe-3">
                    <li className="mb-2">
                      לחץ על כפתור <strong>השיתוף</strong> 
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        style={{ display: 'inline', marginRight: '5px' }}
                      >
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                        <polyline points="16 6 12 2 8 6" />
                        <line x1="12" y1="2" x2="12" y2="15" />
                      </svg>
                    </li>
                    <li className="mb-2">גלול למטה ובחר <strong>"הוסף למסך הבית"</strong></li>
                    <li className="mb-2">לחץ על <strong>"הוסף"</strong></li>
                  </ol>
                  <p className="text-muted small mt-3">
                    האפליקציה תופיע במסך הבית שלך!
                  </p>
                </>
              ) : (
                <>
                  <p className="mb-3">כדי להוסיף את האתר למסך הבית באנדרואיד:</p>
                  <ol className="text-end pe-3">
                    <li className="mb-2">לחץ על <strong>תפריט</strong> (3 נקודות)</li>
                    <li className="mb-2">בחר <strong>"התקן אפליקציה"</strong> או <strong>"הוסף למסך הבית"</strong></li>
                    <li className="mb-2">לחץ על <strong>"התקן"</strong></li>
                  </ol>
                  <p className="text-muted small mt-3">
                    האפליקציה תופיע במסך הבית שלך!
                  </p>
                </>
              )}
            </div>

            <button
              onClick={() => setShowInstructions(false)}
              className="btn w-100 mt-3"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                color: 'white',
              }}
            >
              הבנתי
            </button>
          </div>
        </div>
      )}
    </>
  )
}
