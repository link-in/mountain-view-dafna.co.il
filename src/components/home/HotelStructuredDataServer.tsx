// Server Component - renders structured data in initial HTML for Google
export default function HotelStructuredDataServer() {
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
      "https://mountain-view-dafna.co.il/photos/IMG_2253.JPG",
      "https://mountain-view-dafna.co.il/photos/IMG_2254.JPG",
      "https://mountain-view-dafna.co.il/photos/IMG_2269.JPG"
    ],
    "priceRange": "₪580-₪928",
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
      "latitude": "33.2363",
      "longitude": "35.6528"
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
        "price": "580",
        "priceCurrency": "ILS",
        "unitCode": "DAY"
      },
      "availability": "https://schema.org/InStock",
      "url": "https://mountain-view-dafna.co.il",
      "validFrom": new Date().toISOString().split('T')[0]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "48",
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
