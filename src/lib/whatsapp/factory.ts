import type { WhatsAppProvider, WhatsAppProviderType } from './types'
import { WhapiProvider } from './providers/whapi'
import { MockProvider } from './providers/mock'

export function getWhatsAppProvider(): WhatsAppProvider {
  const providerType = (process.env.WHATSAPP_PROVIDER || 'auto') as WhatsAppProviderType | 'auto'

  if (providerType !== 'auto') {
    return createProvider(providerType)
  }

  if (process.env.WHAPI_TOKEN) {
    return createProvider('whapi')
  }

  console.warn('⚠️  No WhatsApp provider configured. Using mock provider.')
  return createProvider('mock')
}

function createProvider(type: WhatsAppProviderType): WhatsAppProvider {
  switch (type) {
    case 'whapi':
      return new WhapiProvider()
    case 'mock':
    default:
      return new MockProvider()
  }
}
