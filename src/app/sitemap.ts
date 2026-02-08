import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://mountain-view-dafna.co.il',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://mountain-view-dafna.co.il/api/hotel-feed',
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
  ]
}
