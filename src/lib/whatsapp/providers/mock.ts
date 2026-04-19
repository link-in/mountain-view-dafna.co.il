import type { WhatsAppProvider, WhatsAppMessage, WhatsAppResponse } from '../types'

export class MockProvider implements WhatsAppProvider {
  name = 'Mock'

  validateConfig(): boolean {
    return true
  }

  async sendMessage(message: WhatsAppMessage): Promise<WhatsAppResponse> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    console.log('📱 [MOCK] WhatsApp Message:')
    console.log('   To:', message.to)
    console.log('   Message:', message.message)
    return { success: true, messageId: `mock_${Date.now()}`, provider: 'mock' }
  }
}
