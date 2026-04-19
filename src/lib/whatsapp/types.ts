export interface WhatsAppMessage {
  to: string
  message: string
  image?: string
  document?: string
  caption?: string
}

export interface WhatsAppResponse {
  success: boolean
  messageId?: string
  error?: string
  provider: string
}

export interface WhatsAppProvider {
  name: string
  sendMessage(message: WhatsAppMessage): Promise<WhatsAppResponse>
  validateConfig(): boolean
}

export type WhatsAppProviderType = 'whapi' | 'mock'
