export type UserRole = 'admin' | 'owner'

export interface User {
  id: string
  email: string
  passwordHash: string
  displayName: string
  firstName?: string
  lastName?: string
  propertyId: string
  roomId: string
  landingPageUrl?: string
  phoneNumber?: string
  role: UserRole
  isDemo?: boolean
}

export interface AuthUser {
  id: string
  email: string
  displayName: string
  firstName?: string
  lastName?: string
  propertyId: string
  roomId: string
  landingPageUrl?: string
  phoneNumber?: string
  role: UserRole
  isDemo?: boolean
}

export interface UserCredentials {
  email: string
  password: string
}
