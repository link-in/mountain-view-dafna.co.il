import bcrypt from 'bcryptjs'
import type { User, AuthUser } from './types'
import path from 'path'
import fs from 'fs'

const USERS_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'users.json')

/**
 * Get user by email from users.json file
 * Future: Replace with Supabase query
 */
export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    if (!fs.existsSync(USERS_FILE_PATH)) {
      console.warn('users.json not found')
      return null
    }

    const fileContent = fs.readFileSync(USERS_FILE_PATH, 'utf-8')
    const users: User[] = JSON.parse(fileContent)

    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
    return user ?? null
  } catch (error) {
    console.error('Failed to read users file:', error)
    return null
  }
}

/**
 * Verify password against hash
 */
export const verifyPassword = async (plainPassword: string, passwordHash: string): Promise<boolean> => {
  try {
    return await bcrypt.compare(plainPassword, passwordHash)
  } catch (error) {
    console.error('Failed to verify password:', error)
    return false
  }
}

/**
 * Hash password (for user creation/update)
 */
export const hashPassword = async (plainPassword: string): Promise<string> => {
  const saltRounds = 10
  return await bcrypt.hash(plainPassword, saltRounds)
}

/**
 * Convert full User to AuthUser (without password hash)
 */
export const toAuthUser = (user: User): AuthUser => {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    propertyId: user.propertyId,
    roomId: user.roomId,
    landingPageUrl: user.landingPageUrl,
  }
}
