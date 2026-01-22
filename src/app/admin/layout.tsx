import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'HOSTLY Admin',
  description: 'Admin panel for HOSTLY platform',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-vh-100 bg-light">
      {children}
    </div>
  )
}
