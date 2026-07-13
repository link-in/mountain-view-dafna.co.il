import { MetadataRoute } from 'next'

const TEMPLATE_DISALLOWS = [
  '/dashboard/',
  '/api/dashboard/',
  '/admin/',
  '/contact',
  '/about',
  '/service',
  '/shop/',
  '/blog/',
  '/portfolio/',
  '/home/',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: TEMPLATE_DISALLOWS,
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: TEMPLATE_DISALLOWS,
      },
    ],
    sitemap: 'https://mountain-view-dafna.co.il/sitemap.xml',
    host: 'https://mountain-view-dafna.co.il',
  }
}
