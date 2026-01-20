import type { DashboardProvider, PriceRule, Reservation, RoomPrice } from '@/lib/dashboard/types'

type Beds24ProviderConfig = {
  baseUrl?: string
  apiKey?: string
}

const DEFAULT_BASE_URL = '/api/dashboard'

const buildHeaders = (apiKey?: string): Record<string, string> => {
  if (!apiKey) {
    return {}
  }

  return {
    Authorization: `Bearer ${apiKey}`,
  }
}

const fetchJson = async <T>(url: string, apiKey?: string): Promise<T> => {
  const response = await fetch(url, {
    headers: buildHeaders(apiKey),
  })

  if (!response.ok) {
    throw new Error(`Beds24 request failed: ${response.status} ${response.statusText}`)
  }

  return response.json() as Promise<T>
}

export const createBeds24Provider = (config: Beds24ProviderConfig = {}): DashboardProvider => {
  const baseUrl = config.baseUrl ?? DEFAULT_BASE_URL
  const apiKey = config.apiKey

  return {
    getReservations: async () => {
      const payload = await fetchJson<unknown>(`${baseUrl}/bookings?arrivalFrom=2024-01-01&includeInvoice=true`, apiKey)
      const bookings = extractBookings(payload)
      return bookings.map(mapBookingToReservation)
    },
    getPricingRules: async () => {
      // Beds24 API does not expose a pricing rules endpoint in this flow.
      // Use the inventory calendar prices instead.
      return []
    },
    getRoomPrices: async () => {
      const payload = await fetchJson<unknown>(`${baseUrl}/rooms`, apiKey)
      const prices = extractRoomPrices(payload)
      return prices
    },
  }
}

const extractBookings = (payload: unknown): Record<string, unknown>[] => {
  if (!payload) {
    return []
  }

  if (Array.isArray(payload)) {
    return payload as Record<string, unknown>[]
  }

  if (typeof payload === 'object') {
    const data = (payload as { data?: unknown }).data
    if (Array.isArray(data)) {
      return data as Record<string, unknown>[]
    }

    const bookings = (payload as { bookings?: unknown }).bookings
    if (Array.isArray(bookings)) {
      return bookings as Record<string, unknown>[]
    }
  }

  return []
}

const extractRoomPrices = (payload: unknown): RoomPrice[] => {
  if (!payload) {
    return []
  }

  if (typeof payload === 'object') {
    const prices = (payload as { prices?: unknown }).prices
    if (Array.isArray(prices)) {
      return prices as RoomPrice[]
    }
  }

  return []
}

const mapBookingToReservation = (booking: Record<string, unknown>, index: number): Reservation => {
  const firstName =
    (typeof booking.firstName === 'string' && booking.firstName) ||
    (typeof booking.guestFirstName === 'string' && booking.guestFirstName) ||
    ''
  const lastName =
    (typeof booking.lastName === 'string' && booking.lastName) ||
    (typeof booking.guestLastName === 'string' && booking.guestLastName) ||
    ''
  const guestName =
    `${firstName} ${lastName}`.trim() ||
    (typeof booking.guestName === 'string' && booking.guestName) ||
    (typeof booking.name === 'string' && booking.name) ||
    'אורח'

  const checkIn =
    (typeof booking.arrival === 'string' && booking.arrival) ||
    (typeof booking.checkIn === 'string' && booking.checkIn) ||
    (typeof booking.startDate === 'string' && booking.startDate) ||
    ''

  const checkOut =
    (typeof booking.departure === 'string' && booking.departure) ||
    (typeof booking.checkOut === 'string' && booking.checkOut) ||
    (typeof booking.endDate === 'string' && booking.endDate) ||
    ''

  const nights =
    Number(booking.numNights ?? booking.nights ?? booking.nightCount ?? 0) ||
    calculateNights(checkIn, checkOut)

  const total =
    Number(booking.price ?? booking.totalPrice ?? booking.total ?? booking.grandTotal ?? booking.invoiceTotal ?? 0) || 0

  const rawStatus =
    (typeof booking.status === 'string' && booking.status) ||
    (typeof booking.bookingStatus === 'string' && booking.bookingStatus) ||
    ''

  const status = normalizeStatus(rawStatus)

  return {
    id: String(booking.id ?? booking.bookingId ?? booking.reservationId ?? `booking_${index}`),
    guestName,
    checkIn,
    checkOut,
    nights,
    total,
    status,
    source:
      (typeof booking.channel === 'string' && booking.channel) ||
      (typeof booking.apiSource === 'string' && booking.apiSource) ||
      (typeof booking.referer === 'string' && booking.referer) ||
      undefined,
    unitName:
      (typeof booking.roomName === 'string' && booking.roomName) ||
      (typeof booking.unitName === 'string' && booking.unitName) ||
      (typeof booking.propertyName === 'string' && booking.propertyName) ||
      undefined,
    createdAt: typeof booking.bookingTime === 'string' ? booking.bookingTime : undefined,
  }
}

const normalizeStatus = (value: string): Reservation['status'] => {
  const normalized = value.toLowerCase()
  if (normalized.includes('new')) {
    return 'pending'
  }
  if (normalized.includes('cancel')) {
    return 'cancelled'
  }
  if (normalized.includes('confirm') || normalized.includes('booked')) {
    return 'confirmed'
  }
  return 'pending'
}

const calculateNights = (checkIn: string, checkOut: string) => {
  const start = new Date(checkIn)
  const end = new Date(checkOut)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 0
  }
  const diffMs = end.getTime() - start.getTime()
  return diffMs > 0 ? Math.ceil(diffMs / (1000 * 60 * 60 * 24)) : 0
}
