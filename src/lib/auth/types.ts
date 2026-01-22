export type UserRole = 'admin' | 'owner'

export interface User {
  id: string
  email: string
  passwordHash: string
  displayName: string
  propertyId: string
  roomId: string
  landingPageUrl?: string
  phoneNumber?: string
  role: UserRole
}

export interface AuthUser {
  id: string
  email: string
  displayName: string
  propertyId: string
  roomId: string
  landingPageUrl?: string
  phoneNumber?: string
  role: UserRole
}

export interface UserCredentials {
  email: string
  password: string
}
