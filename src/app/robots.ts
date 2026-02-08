import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/api/dashboard/', '/admin/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/dashboard/', '/api/dashboard/', '/admin/'],
      },
    ],
    sitemap: 'https://mountain-view-dafna.co.il/sitemap.xml',
    host: 'https://mountain-view-dafna.co.il',
  }
}
