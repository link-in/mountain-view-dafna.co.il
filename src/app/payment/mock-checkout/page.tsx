'use client'

import { Suspense } from 'react'
import MockCheckoutClient from './MockCheckoutClient'

export default function MockCheckoutPage() {
  return (
    <Suspense fallback={null}>
      <MockCheckoutClient />
    </Suspense>
  )
}
