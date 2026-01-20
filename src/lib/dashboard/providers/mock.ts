import type { DashboardProvider, PriceRule, Reservation, RoomPrice } from '@/lib/dashboard/types'

const reservations: Reservation[] = [
  {
    id: 'res_1001',
    guestName: 'דינה כהן',
    checkIn: '2026-02-12',
    checkOut: '2026-02-15',
    nights: 3,
    total: 2150,
    status: 'confirmed',
    source: 'Airbnb',
    unitName: 'Mountain View Dafna',
    createdAt: '2026-01-28',
  },
  {
    id: 'res_1002',
    guestName: 'טל לוי',
    checkIn: '2026-03-02',
    checkOut: '2026-03-04',
    nights: 2,
    total: 1420,
    status: 'pending',
    source: 'Booking.com',
    unitName: 'Mountain View Dafna',
    createdAt: '2026-01-29',
  },
  {
    id: 'res_1003',
    guestName: 'יואב פרץ',
    checkIn: '2026-03-10',
    checkOut: '2026-03-14',
    nights: 4,
    total: 3080,
    status: 'confirmed',
    source: 'Direct',
    unitName: 'Mountain View Dafna',
    createdAt: '2026-01-30',
  },
  {
    id: 'res_1004',
    guestName: 'מיכל אברמוביץ',
    checkIn: '2026-03-21',
    checkOut: '2026-03-23',
    nights: 2,
    total: 1500,
    status: 'cancelled',
    source: 'Booking.com',
    unitName: 'Mountain View Dafna',
    createdAt: '2026-02-01',
  },
]

const pricingRules: PriceRule[] = [
  {
    id: 'price_2001',
    title: 'סופ״ש חורף',
    startDate: '2026-01-15',
    endDate: '2026-03-01',
    minNights: 2,
    maxNights: 4,
    pricePerNight: 720,
    isActive: true,
    notes: 'כולל ארוחת בוקר קלה',
  },
  {
    id: 'price_2002',
    title: 'חופשת פסח',
    startDate: '2026-04-10',
    endDate: '2026-04-25',
    minNights: 3,
    pricePerNight: 980,
    isActive: true,
  },
  {
    id: 'price_2003',
    title: 'קיץ שקט באמצע שבוע',
    startDate: '2026-06-01',
    endDate: '2026-08-31',
    minNights: 2,
    pricePerNight: 840,
    isActive: false,
  },
]

const roomPrices: RoomPrice[] = [
  { date: '2026-02-10', price: 650, roomId: 'room_1' },
  { date: '2026-02-11', price: 650, roomId: 'room_1' },
  { date: '2026-02-12', price: 720, roomId: 'room_1' },
  { date: '2026-02-13', price: 720, roomId: 'room_1' },
  { date: '2026-02-14', price: 720, roomId: 'room_1' },
  { date: '2026-02-15', price: 650, roomId: 'room_1' },
  { date: '2026-02-16', price: 650, roomId: 'room_1' },
]

export const mockDashboardProvider: DashboardProvider = {
  getReservations: async () => reservations,
  getPricingRules: async () => pricingRules,
  getRoomPrices: async () => roomPrices,
}
