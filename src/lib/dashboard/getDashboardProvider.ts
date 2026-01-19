import type { DashboardProvider } from '@/lib/dashboard/types'
import { createBeds24Provider } from '@/lib/dashboard/providers/beds24'
import { mockDashboardProvider } from '@/lib/dashboard/providers/mock'

type ProviderMeta = {
  name: 'mock' | 'beds24'
  label: string
  isMock: boolean
}

export const getDashboardProvider = (): { provider: DashboardProvider; meta: ProviderMeta } => {
  const providerName = (process.env.NEXT_PUBLIC_DASHBOARD_PROVIDER ?? 'mock').toLowerCase()

  if (providerName === 'beds24') {
    return {
      provider: createBeds24Provider({
        baseUrl: process.env.NEXT_PUBLIC_BEDS24_BASE_URL,
      }),
      meta: {
        name: 'beds24',
        label: 'Beds24',
        isMock: false,
      },
    }
  }

  return {
    provider: mockDashboardProvider,
    meta: {
      name: 'mock',
      label: 'Mock data',
      isMock: true,
    },
  }
}
