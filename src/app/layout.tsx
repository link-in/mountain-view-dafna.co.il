import type { Metadata } from 'next'
import { Open_Sans, Poppins, Rubik } from 'next/font/google'

import 'bootstrap/dist/css/bootstrap.min.css'

import '@/assets/scss/style.scss'
import GoogleTagManager from './components/GoogleTagManager'
import GoogleAnalytics from './components/GoogleAnalytics'
import PWAInstallPrompt from './components/PWAInstallPrompt'

const openSans = Open_Sans({
  display: 'swap',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-open-sans',
})

const poppins = Poppins({
  display: 'swap',
  style: ['normal'],
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
})

const rubik = Rubik({
  display: 'swap',
  style: ['normal'],
  subsets: ['latin', 'hebrew'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-rubik',
})

export const metadata: Metadata = {
  title: 'נוף הרים בדפנה',
  description: 'מערכת ניהול אירוח - נוף הרים בדפנה',
  manifest: '/manifest.json?v=2',
  icons: {
    icon: '/photos/logo.png',
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'נוף הרים בדפנה',
  },
  themeColor: '#667eea',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  openGraph: {
    type: 'website',
    locale: 'he_IL',
    url: 'https://mountain-view-dafna.co.il',
    siteName: 'נוף הרים בדפנה',
    title: 'נוף הרים בדפנה',
    description: 'מערכת ניהול אירוח - נוף הרים בדפנה',
    images: [
      {
        url: 'https://mountain-view-dafna.co.il/photos/logo.png',
        width: 1200,
        height: 630,
        alt: 'נוף הרים בדפנה',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'נוף הרים בדפנה',
    description: 'מערכת ניהול אירוח - נוף הרים בדפנה',
    images: ['https://mountain-view-dafna.co.il/photos/logo.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Google Tag Manager ID
  const gtmId = 'GTM-WZJ2QGJ6'
  // Google Analytics 4 Measurement ID
  const gaId = 'G-WTREN42PHT'
  
  return (
    <html lang="he">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="נוף הרים בדפנה" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      </head>
      <body className={`${openSans.className} ${poppins.variable} ${rubik.variable}`}>
        <GoogleTagManager gtmId={gtmId} />
        <GoogleAnalytics measurementId={gaId} />
        <PWAInstallPrompt />
        {children}
      </body>
    </html>
  )
}
