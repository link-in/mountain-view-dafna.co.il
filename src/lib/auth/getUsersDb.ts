import bcrypt from 'bcryptjs'
import type { User, AuthUser } from './types'
import { createServerClient } from '@/lib/supabase/server'

/**
 * Get user by email from Supabase
 */
export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const supabase = createServerClient()
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .ilike('email', email)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null
      }
      console.error('Failed to fetch user from Supabase:', error)
      return null
    }

    if (!data) {
      return null
    }

    // Map database columns to User interface
    return {
      id: data.id,
      email: data.email,
      passwordHash: data.password_hash,
      displayName: data.display_name,
      propertyId: data.property_id,
      roomId: data.room_id,
      landingPageUrl: data.landing_page_url || undefined,
      phoneNumber: data.phone_number || undefined,
      role: data.role || 'owner',
    }
  } catch (error) {
    console.error('Failed to fetch user:', error)
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
 * Update user in Supabase
 */
export const updateUser = async (userId: string, updates: Partial<User>): Promise<User | null> => {
  try {
    const supabase = createServerClient()
    
    // Map User interface to database columns
    const dbUpdates: Record<string, any> = {}
    
    if (updates.email !== undefined) dbUpdates.email = updates.email
    if (updates.displayName !== undefined) dbUpdates.display_name = updates.displayName
    if (updates.passwordHash !== undefined) dbUpdates.password_hash = updates.passwordHash
    if (updates.propertyId !== undefined) dbUpdates.property_id = updates.propertyId
    if (updates.roomId !== undefined) dbUpdates.room_id = updates.roomId
    if (updates.landingPageUrl !== undefined) dbUpdates.landing_page_url = updates.landingPageUrl
    if (updates.phoneNumber !== undefined) dbUpdates.phone_number = updates.phoneNumber
    if (updates.role !== undefined) dbUpdates.role = updates.role

    const { data, error } = await supabase
      .from('users')
      .update(dbUpdates)
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('Failed to update user in Supabase:', error)
      return null
    }

    if (!data) {
      return null
    }

    // Map database columns back to User interface
    return {
      id: data.id,
      email: data.email,
      passwordHash: data.password_hash,
      displayName: data.display_name,
      propertyId: data.property_id,
      roomId: data.room_id,
      landingPageUrl: data.landing_page_url || undefined,
      phoneNumber: data.phone_number || undefined,
      role: data.role || 'owner',
    }
  } catch (error) {
    console.error('Failed to update user:', error)
    return null
  }
}

/**
 * Check if email exists (for another user)
 */
export const emailExists = async (email: string, excludeUserId?: string): Promise<boolean> => {
  try {
    const supabase = createServerClient()
    
    let query = supabase
      .from('users')
      .select('id')
      .ilike('email', email)

    if (excludeUserId) {
      query = query.neq('id', excludeUserId)
    }

    const { data, error } = await query.single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - email doesn't exist
        return false
      }
      console.error('Failed to check email existence:', error)
      return false
    }

    return data !== null
  } catch (error) {
    console.error('Failed to check email:', error)
    return false
  }
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
    phoneNumber: user.phoneNumber,
    role: user.role,
  }
}
