import { NextResponse } from 'next/server'
import { sendWhatsAppMessage } from '@/lib/whatsapp'

export const dynamic = 'force-dynamic'

/**
 * GET /api/test/whatsapp?to=972528676516
 * endpoint לבדיקת שליחת WhatsApp בלבד — מחק לפני פרודקשן סופי
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const to = searchParams.get('to') ?? process.env.OWNER_WHATSAPP_NUMBER ?? ''

  if (!to) {
    return NextResponse.json({ error: 'Missing ?to= parameter' }, { status: 400 })
  }

  console.log(`🧪 [Test] Sending WhatsApp to: ${to}`)

  const result = await sendWhatsAppMessage({
    to,
    message: `🧪 הודעת בדיקה מהאתר\n\nאם קיבלת הודעה זו — WhatsApp עובד בהצלחה! ✅\n\nזמן: ${new Date().toLocaleString('he-IL')}`,
  })

  console.log('🧪 [Test] WhatsApp result:', result)

  return NextResponse.json({
    success: result.success,
    provider: result.provider,
    messageId: result.messageId,
    error: result.error,
    to,
  })
}
