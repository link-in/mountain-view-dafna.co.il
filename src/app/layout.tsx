import logo from '@/assets/images/favicon.ico'
import type { Metadata } from 'next'
import { Open_Sans, Poppins, Rubik } from 'next/font/google'

import 'bootstrap/dist/css/bootstrap.min.css'

import '@/assets/scss/style.scss'
import GoogleTagManager from './components/GoogleTagManager'
import GoogleAnalytics from './components/GoogleAnalytics'

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
  icons: {
    icon: logo.src,
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
      <body className={`${openSans.className} ${poppins.variable} ${rubik.variable}`}>
        <GoogleTagManager gtmId={gtmId} />
        <GoogleAnalytics measurementId={gaId} />
        {children}
      </body>
    </html>
  )
}
