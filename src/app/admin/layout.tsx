'use client'

import { SessionProvider } from 'next-auth/react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <div className="min-vh-100 bg-light">
        {children}
      </div>
    </SessionProvider>
  )
}
