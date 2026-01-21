import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/authOptions'
import { getUserByEmail, verifyPassword, hashPassword } from '@/lib/auth/getUsersDb'
import type { User } from '@/lib/auth/types'
import fs from 'fs'
import path from 'path'

const USERS_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'users.json')

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let payload: {
    displayName?: string
    email?: string
    landingPageUrl?: string
    currentPassword?: string
    newPassword?: string
  }

  try {
    payload = await request.json()
  } catch (error) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  try {
    // Read users file
    if (!fs.existsSync(USERS_FILE_PATH)) {
      return NextResponse.json({ error: 'Users file not found' }, { status: 500 })
    }

    const fileContent = fs.readFileSync(USERS_FILE_PATH, 'utf-8')
    const users: User[] = JSON.parse(fileContent)

    const userIndex = users.findIndex((u) => u.id === session.user.id)
    if (userIndex === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const currentUser = users[userIndex]

    // If changing password, verify current password
    if (payload.newPassword) {
      if (!payload.currentPassword) {
        return NextResponse.json({ error: 'יש להזין סיסמה נוכחית' }, { status: 400 })
      }

      const isValid = await verifyPassword(payload.currentPassword, currentUser.passwordHash)
      if (!isValid) {
        return NextResponse.json({ error: 'סיסמה נוכחית שגויה' }, { status: 403 })
      }

      currentUser.passwordHash = await hashPassword(payload.newPassword)
    }

    // Update editable fields
    if (payload.displayName) {
      currentUser.displayName = payload.displayName
    }

    if (payload.email) {
      // Check if email is already used by another user
      const emailExists = users.some((u) => u.id !== session.user.id && u.email.toLowerCase() === payload.email!.toLowerCase())
      if (emailExists) {
        return NextResponse.json({ error: 'אימייל כבר בשימוש' }, { status: 400 })
      }
      currentUser.email = payload.email
    }

    if (payload.landingPageUrl !== undefined) {
      currentUser.landingPageUrl = payload.landingPageUrl
    }

    // Save back to file
    users[userIndex] = currentUser
    fs.writeFileSync(USERS_FILE_PATH, JSON.stringify(users, null, 2), 'utf-8')

    return NextResponse.json({
      success: true,
      user: {
        id: currentUser.id,
        email: currentUser.email,
        displayName: currentUser.displayName,
        propertyId: currentUser.propertyId,
        roomId: currentUser.roomId,
        landingPageUrl: currentUser.landingPageUrl,
      },
    })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'עדכון נכשל', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
