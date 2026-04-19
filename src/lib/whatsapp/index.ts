import { getWhatsAppProvider } from './factory'
import type { WhatsAppMessage, WhatsAppResponse } from './types'

export async function sendWhatsAppMessage(message: WhatsAppMessage): Promise<WhatsAppResponse> {
  const provider = getWhatsAppProvider()
  console.log(`📱 Sending WhatsApp via ${provider.name}...`)
  const result = await provider.sendMessage(message)
  if (result.success) {
    console.log(`✅ WhatsApp sent successfully (${result.provider})`)
  } else {
    console.error(`❌ WhatsApp failed (${result.provider}):`, result.error)
  }
  return result
}

export type { WhatsAppMessage, WhatsAppResponse, WhatsAppProvider } from './types'
