import type { SupabaseClient } from '@supabase/supabase-js'
import { createAdminClient } from '@/lib/supabase/server'

type PaymentAuditStatus = 'info' | 'success' | 'error' | 'warning'

type JsonPrimitive = string | number | boolean | null
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue }

interface LogPaymentEventParams {
  uniquePaymentId?: string | null
  lowProfileId?: string | null
  stage: string
  status: PaymentAuditStatus
  message?: string
  data?: JsonValue
  supabase?: SupabaseClient
}

function normalizeOptionalText(value?: string | number | null): string | null {
  if (value === undefined || value === null || value === '') {
    return null
  }

  return String(value)
}

export async function logPaymentEvent({
  uniquePaymentId,
  lowProfileId,
  stage,
  status,
  message,
  data,
  supabase,
}: LogPaymentEventParams): Promise<void> {
  try {
    const client = supabase ?? createAdminClient()
    const { error } = await client.from('payment_audit_logs').insert({
      unique_payment_id: normalizeOptionalText(uniquePaymentId),
      low_profile_id: normalizeOptionalText(lowProfileId),
      stage,
      status,
      message: message ?? null,
      data: data ?? {},
    })

    if (error) {
      console.error('❌ [Payment Audit] Failed to write audit log:', {
        stage,
        message: error.message,
      })
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err)
    console.error('❌ [Payment Audit] Unexpected audit log error:', {
      stage,
      message: errorMessage,
    })
  }
}
