import logo from '@/assets/images/favicon.ico'
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
  manifest: '/manifest.json',
  icons: {
    icon: logo.src,
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Hostly',
  },
  themeColor: '#667eea',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
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
        <meta name="apple-mobile-web-app-title" content="Hostly" />
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
