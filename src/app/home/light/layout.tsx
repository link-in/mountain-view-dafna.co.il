import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'נוף הרים בדפנה - צימר מפנק עם ג\'קוזי ספא ונוף להרים',
  description: 'צימר יוקרתי בדפנה בין פלגי הדן אל מול נופי חרמון. ג\'קוזי ספא, נוף פנורמי להרים, מטבח מאובזר. המקום המושלם לחופשה רומנטית בצפון.',
  keywords: ['צימר בדפנה', 'צימר עם ג\'קוזי', 'צימר רומנטי', 'נוף הרים בדפנה', 'צימר בצפון', 'צימר עם נוף'],
  openGraph: {
    title: 'נוף הרים בדפנה',
    description: 'צימר יוקרתי בדפנה בין פלגי הדן אל מול נופי חרמון',
    url: 'https://mountain-view-dafna.co.il',
    siteName: 'נוף הרים בדפנה',
    locale: 'he_IL',
    type: 'website',
    images: [
      {
        url: 'https://mountain-view-dafna.co.il/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'נוף הרים בדפנה - צימר מפנק',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'נוף הרים בדפנה',
    description: 'צימר יוקרתי בדפנה עם ג\'קוזי ספא ונוף להרים',
    images: ['https://mountain-view-dafna.co.il/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://mountain-view-dafna.co.il',
  },
}

export default function LightLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
