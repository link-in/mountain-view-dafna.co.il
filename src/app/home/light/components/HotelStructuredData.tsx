'use client'

import { useEffect, useState } from 'react'

interface AvailabilityData {
  date: string
  price: number
  available: boolean
}

export default function HotelStructuredData() {
  const [availability, setAvailability] = useState<AvailabilityData[]>([])
  const [reviewStats, setReviewStats] = useState<{
    averageRating: number
    reviewCount: number
  }>({
    averageRating: 5.0,
    reviewCount: 48, // Default fallback values
  })

  useEffect(() => {
    // Fetch availability data for structured data
    const fetchAvailability = async () => {
      try {
        const today = new Date()
        const threeMonthsLater = new Date(today)
        threeMonthsLater.setMonth(today.getMonth() + 3)

        const from = today.toISOString().split('T')[0]
        const to = threeMonthsLater.toISOString().split('T')[0]

        const response = await fetch(`/api/public/availability?from=${from}&to=${to}`)
        const data = await response.json()
        
        if (data.success) {
          setAvailability(data.dates)
        }
      } catch (error) {
        console.error('Failed to fetch availability for structured data:', error)
      }
    }

    // Fetch review statistics for structured data
    const fetchReviewStats = async () => {
      try {
        const response = await fetch('/api/reviews')
        const reviews = await response.json()
        
        if (reviews && Array.isArray(reviews) && reviews.length > 0) {
          const totalRating = reviews.reduce((sum: number, review: any) => sum + review.rating, 0)
          const averageRating = totalRating / reviews.length
          
          setReviewStats({
            averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
            reviewCount: reviews.length,
          })
        }
      } catch (error) {
        console.error('Failed to fetch review stats for structured data:', error)
        // Keep default values if fetch fails
      }
    }

    fetchAvailability()
    fetchReviewStats()
  }, [])

  // Calculate price range from availability data
  const availableDates = availability.filter(d => d.available && d.price > 0)
  const prices = availableDates.map(d => d.price)
  const minPrice = prices.length > 0 ? Math.min(...prices) : 400
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 700

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "@id": "https://mountain-view-dafna.co.il",
    "name": "נוף הרים בדפנה",
    "alternateName": "Mountain View Dafna",
    "description": "צימר מפנק בדפנה בין פלגי הדן אל מול נופי חרמון. חדר שינה יוקרתי, ג'קוזי ספא, נוף פנורמי להרים, מטבח מאובזר ופינת ישיבה נעימה. המקום המושלם לחופשה רומנטית בצפון.",
    "url": "https://mountain-view-dafna.co.il",
    "telephone": "+972-52-383-0063",
    "email": "mountain.view.dafna@gmail.com",
    "image": [
      "https://mountain-view-dafna.co.il/images/hero-1.jpg",
      "https://mountain-view-dafna.co.il/images/hero-2.jpg",
      "https://mountain-view-dafna.co.il/images/hero-3.jpg"
    ],
    "priceRange": `₪${minPrice}-₪${maxPrice}`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "דפנה",
      "addressLocality": "דפנה",
      "addressRegion": "צפון",
      "postalCode": "12245",
      "addressCountry": "IL"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 33.2363,
      "longitude": 35.6528
    },
    "starRating": {
      "@type": "Rating",
      "ratingValue": "5",
      "bestRating": "5"
    },
    "checkinTime": "15:00",
    "checkoutTime": "11:00",
    "numberOfRooms": "1",
    "petsAllowed": false,
    "amenityFeature": [
      {
        "@type": "LocationFeatureSpecification",
        "name": "ג'קוזי ספא",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "נוף להרים",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "מטבח מאובזר",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "WiFi חינם",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "חניה חינם",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "מיזוג אוויר",
        "value": true
      }
    ],
    "makesOffer": {
      "@type": "Offer",
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": minPrice,
        "priceCurrency": "ILS",
        "unitCode": "DAY"
      },
      "availability": "https://schema.org/InStock",
      "url": "https://mountain-view-dafna.co.il",
      "validFrom": new Date().toISOString().split('T')[0]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": reviewStats.averageRating.toFixed(1),
      "reviewCount": reviewStats.reviewCount.toString(),
      "bestRating": "5",
      "worstRating": "1"
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
