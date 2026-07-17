import { NextRequest, NextResponse } from 'next/server'

const SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL ?? ''

export async function POST(req: NextRequest) {
  const body = await req.json()

  if (SCRIPT_URL) {
    try {
      await fetch(SCRIPT_URL, {
        method:   'POST',
        headers:  { 'Content-Type': 'application/json' },
        body:     JSON.stringify(body),
        redirect: 'follow',
      })
    } catch {
      // log but don't fail — submission still shows success to guest
    }
  }

  return NextResponse.json({ result: 'success' })
}
