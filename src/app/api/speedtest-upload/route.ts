import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    // Read the stream to consume it
    const data = await req.arrayBuffer()
    return NextResponse.json({ ok: true, bytesReceived: data.byteLength })
  } catch (e) {
    return NextResponse.json({ error: true }, { status: 400 })
  }
}
