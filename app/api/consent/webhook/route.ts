import { NextRequest, NextResponse } from 'next/server'

const DA_BASE       = process.env.DIGITAL_ANUMATI_BASE_URL ?? process.env.DA_BASE_URL ?? 'http://localhost:5001'
const DA_SECRET_KEY = process.env.DIGITAL_ANUMATI_API_KEY  ?? process.env.DA_SECRET_KEY ?? ''
const DB_TIMEOUT_MS = 30_000

export async function POST(req: NextRequest) {
  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  // Backend sends event type in header AND in body.type
  const eventType  = req.headers.get('x-webhook-event') ?? body.type ?? ''
  const dispatchId = req.headers.get('x-da-dispatch-id')
    ?? req.headers.get('x-da-dispatch')
    ?? body.id
    ?? ''

  // referenceId lives inside body.data
  const referenceId = body.data?.referenceId
    ?? body.data?.reference_id
    ?? body.referenceId
    ?? ''

  console.log(
    '[DA Webhook] Received:', eventType,
    '| ref:', referenceId,
    '| dispatch:', dispatchId,
    '| at:', new Date().toISOString(),
  )

  // Return 200 immediately — DA needs response within 10 seconds
  processEvent({ eventType, dispatchId, referenceId, body })
    .catch(console.error)

  return NextResponse.json({ received: true })
}

async function processEvent(ctx: {
  eventType:   string
  dispatchId:  string
  referenceId: string
  body:        any
}) {
  const { eventType, dispatchId, referenceId, body } = ctx
  const consentId = body.data?.consentId || body.consentId || ""
  const purposeId = body.data?.purpose?.id || body.purposeId || ""

  switch (eventType) {

    case 'consent.withdrawn':
      await handleWithdrawn(dispatchId, referenceId, consentId || purposeId)
      break

    case 'data.deleted':
      await handleDeleted(dispatchId, referenceId, consentId || purposeId)
      break

    case 'consent.created':
    case 'consent.captured':
      console.log('[DA] Consent created | ref:', referenceId)
      break

    case 'consent.granted':
      console.log('[DA] Consent granted | ref:', referenceId)
      break

    case 'consent.expired':
      console.log('[DA] Consent expired | ref:', referenceId)
      break

    case 'consent.expiry.reminder':
      console.log('[DA] Expiring soon | ref:', referenceId)
      break

    default:
      console.log('[DA] Unhandled event:', eventType)
  }
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
  )
  return Promise.race([promise, timeout])
}

async function sendPostback(endpoint: string, payload: object, dispatchId: string) {
  const start = Date.now()

  const res = await fetch(`${DA_BASE}${endpoint}`, {
    method:  'POST',
    headers: {
      'x-secret-key':  DA_SECRET_KEY,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify(payload),
  })

  const result = await res.json().catch(() => ({}))
  const ms     = Date.now() - start

  if (res.status === 409) {
    console.log('[DA] Already confirmed | dispatch:', dispatchId, `(${ms}ms)`)
    return
  }

  if (!res.ok) {
    console.error(
      '[DA] Postback failed | dispatch:', dispatchId,
      '| status:', res.status,
      '| took:', ms + 'ms',
      '| body:', result,
    )
    return
  }

  console.log(
    '[DA] Postback confirmed | dispatch:', dispatchId,
    '| took:', ms + 'ms',
  )
}

async function handleWithdrawn(dispatchId: string, referenceId: string, targetId: string) {
  const start = Date.now()
  console.log('[DA] Processing withdrawal | ref:', referenceId)

  try {
    await withTimeout(doWithdrawalWork(referenceId), DB_TIMEOUT_MS, 'withdrawal DB work')

    const ms = Date.now() - start
    console.log('[DA] Withdrawal work done | ref:', referenceId, `| took: ${ms}ms`)

    await sendPostback(
      '/api/v1/server/consent/action',
      {
        dispatchId,
        referenceId,
        action: 'withdraw',
        purposeIds: targetId ? [targetId] : [],
        reason: `Completed in ${ms}ms`,
        performedBy: 'demo_web_app',
      },
      dispatchId,
    )

  } catch (error) {
    const ms        = Date.now() - start
    const isTimeout = error instanceof Error && error.message.includes('timed out')
    console.error('[DA] Withdrawal error | ref:', referenceId, `| ${ms}ms |`, error)

    await sendPostback(
      '/api/v1/server/consent/action',
      {
        dispatchId,
        referenceId,
        action: 'withdraw',
        purposeIds: targetId ? [targetId] : [],
        reason: isTimeout
          ? `Timed out after ${DB_TIMEOUT_MS}ms`
          : `Error: ${error instanceof Error ? error.message : 'Unknown'}`,
        performedBy: 'demo_web_app',
      },
      dispatchId,
    ).catch(console.error)
  }
}

async function handleDeleted(dispatchId: string, referenceId: string, targetId: string) {
  const start = Date.now()
  console.log('[DA] Processing deletion | ref:', referenceId)

  try {
    const { deletedTypes } = await withTimeout(
      doDeletionWork(referenceId),
      DB_TIMEOUT_MS,
      'deletion DB work',
    )

    const ms = Date.now() - start
    console.log('[DA] Deletion work done | ref:', referenceId, `| took: ${ms}ms | types:`, deletedTypes)

    await sendPostback(
      '/api/v1/server/consent/action',
      {
        dispatchId,
        referenceId,
        action: 'erase',
        purposeIds: targetId ? [targetId] : [],
        reason: `Completed in ${ms}ms`,
        performedBy: 'demo_web_app',
      },
      dispatchId,
    )

  } catch (error) {
    const ms        = Date.now() - start
    const isTimeout = error instanceof Error && error.message.includes('timed out')
    console.error('[DA] Deletion error | ref:', referenceId, `| ${ms}ms |`, error)

    await sendPostback(
      '/api/v1/server/consent/action',
      {
        dispatchId,
        referenceId,
        action: 'erase',
        purposeIds: targetId ? [targetId] : [],
        reason: isTimeout
          ? `Timed out after ${DB_TIMEOUT_MS}ms`
          : `Error: ${error instanceof Error ? error.message : 'Unknown'}`,
        performedBy: 'demo_web_app',
      },
      dispatchId,
    ).catch(console.error)
  }
}

// Replace with real MongoDB / DB calls for your business logic
async function doWithdrawalWork(referenceId: string): Promise<void> {
  console.log('[DA] doWithdrawalWork | ref:', referenceId)
  // const db = await getDatabase()
  // await db.collection('appointments').updateMany(
  //   { da_reference_id: referenceId },
  //   { $set: { consent_status: 'withdrawn', updated_at: new Date() } }
  // )
}

async function doDeletionWork(referenceId: string): Promise<{ deletedTypes: string[] }> {
  console.log('[DA] doDeletionWork | ref:', referenceId)
  // const db = await getDatabase()
  // await db.collection('appointments').deleteMany({ da_reference_id: referenceId })
  // await db.collection('health_records').deleteMany({ da_reference_id: referenceId })
  return { deletedTypes: ['booking_records', 'contact_info'] }
}
