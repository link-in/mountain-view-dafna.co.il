import type { WhatsAppProvider, WhatsAppMessage, WhatsAppResponse } from '../types'

export class WhapiProvider implements WhatsAppProvider {
  name = 'Whapi'
  private token: string
  private baseUrl: string

  constructor() {
    this.token = process.env.WHAPI_TOKEN || ''
    this.baseUrl = process.env.WHAPI_BASE_URL || 'https://gate.whapi.cloud'
  }

  validateConfig(): boolean {
    return !!this.token
  }

  async sendMessage(message: WhatsAppMessage): Promise<WhatsAppResponse> {
    if (!this.validateConfig()) {
      return { success: false, error: 'Whapi configuration missing (WHAPI_TOKEN)', provider: 'whapi' }
    }

    try {
      const phoneNumber = message.to.replace(/^\+/, '')

      if (message.image) {
        const response = await fetch(`${this.baseUrl}/messages/image`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${this.token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ typing_time: 0, to: phoneNumber, media: message.image, caption: message.caption || message.message }),
        })
        const data = await response.json()
        if (!response.ok) return { success: false, error: data.message || `HTTP ${response.status}`, provider: 'whapi' }
        return { success: true, messageId: data.message_id || data.id, provider: 'whapi' }
      }

      if (message.document) {
        const response = await fetch(`${this.baseUrl}/messages/document`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${this.token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ typing_time: 0, to: phoneNumber, media: message.document, caption: message.caption }),
        })
        const data = await response.json()
        if (!response.ok) return { success: false, error: data.message || `HTTP ${response.status}`, provider: 'whapi' }
        return { success: true, messageId: data.message_id || data.id, provider: 'whapi' }
      }

      const response = await fetch(`${this.baseUrl}/messages/text`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${this.token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ typing_time: 0, to: phoneNumber, body: message.message }),
      })
      const data = await response.json()
      if (!response.ok) return { success: false, error: data.message || `HTTP ${response.status}`, provider: 'whapi' }
      return { success: true, messageId: data.message_id || data.id, provider: 'whapi' }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : String(error), provider: 'whapi' }
    }
  }
}
