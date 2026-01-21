export interface User {
  id: string
  email: string
  passwordHash: string
  displayName: string
  propertyId: string
  roomId: string
  landingPageUrl?: string
}

export interface AuthUser {
  id: string
  email: string
  displayName: string
  propertyId: string
  roomId: string
  landingPageUrl?: string
}

export interface UserCredentials {
  email: string
  password: string
}
