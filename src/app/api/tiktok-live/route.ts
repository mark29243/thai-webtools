// Streams a TikTok LIVE room's comments, likes, gifts, follows and shares to
// the browser as Server-Sent Events, normalised into the small LiveEvent shape
// the live-game page understands. Uses the unofficial tiktok-live-connector,
// so it needs a long-running Node server (e.g. `npm run dev` / `npm start`
// on the streamer's own PC) rather than a short-lived serverless function.
import { TikTokLiveConnection, WebcastEvent, ControlEvent } from 'tiktok-live-connector'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type ProtoUser = {
  id?: string
  displayId?: string
  nickname?: string
  avatarThumb?: { urlList?: string[] }
}

function toUser(u: ProtoUser | undefined) {
  return {
    id: u?.displayId || u?.id || 'unknown',
    name: u?.nickname || u?.displayId || 'ผู้ชม',
    avatar: u?.avatarThumb?.urlList?.[0] || '',
  }
}

export async function GET(request: Request) {
  const username = (new URL(request.url).searchParams.get('u') || '').replace(/^@/, '').trim()
  if (!/^[\w.]{2,30}$/.test(username)) {
    return Response.json({ error: 'ชื่อผู้ใช้ TikTok ไม่ถูกต้อง' }, { status: 400 })
  }

  const encoder = new TextEncoder()
  const connection = new TikTokLiveConnection(username, {
    // Skip the replay of old chat so a fresh race isn't flooded on connect.
    processInitialData: false,
    // Optional Euler Stream sign key for higher rate limits (set in .env.local).
    signApiKey: process.env.EULER_API_KEY || undefined,
  })
  const comboSeen = new Map<string, number>()
  let closed = false

  const stream = new ReadableStream({
    start(controller) {
      const send = (payload: unknown) => {
        if (closed) return
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`))
        } catch {
          closed = true
        }
      }

      connection.on(WebcastEvent.CHAT, (m) => {
        send({ type: 'chat', user: toUser(m.user), text: m.content })
      })
      connection.on(WebcastEvent.LIKE, (m) => {
        send({ type: 'like', user: toUser(m.user), count: m.count || 1 })
      })
      connection.on(WebcastEvent.FOLLOW, (m) => {
        send({ type: 'follow', user: toUser(m.user) })
      })
      connection.on(WebcastEvent.SHARE, (m) => {
        send({ type: 'share', user: toUser(m.user) })
      })
      connection.on(WebcastEvent.MEMBER, (m) => {
        send({ type: 'join', user: toUser(m.user) })
      })
      connection.on(WebcastEvent.GIFT, (m) => {
        const user = toUser(m.user)
        const diamonds = m.gift?.diamondCount || 1
        const name = m.gift?.name || 'ของขวัญ'
        // Streakable gifts arrive repeatedly with a growing repeatCount;
        // forward only the newly added amount each time.
        let count = m.repeatCount || 1
        if (m.gift?.type === 1) {
          const key = `${user.id}:${m.groupId}:${m.giftId}`
          const prev = comboSeen.get(key) || 0
          count = Math.max(0, count - prev)
          if (m.repeatEnd) comboSeen.delete(key)
          else comboSeen.set(key, m.repeatCount)
        }
        if (count > 0) send({ type: 'gift', user, count, diamonds, giftName: name })
      })
      connection.on(WebcastEvent.STREAM_END, () => {
        send({ type: 'status', status: 'ended' })
      })
      connection.on(ControlEvent.DISCONNECTED, () => {
        send({ type: 'status', status: 'disconnected' })
      })

      connection
        .connect()
        .then(() => send({ type: 'status', status: 'connected', username }))
        .catch((err: unknown) => {
          send({ type: 'status', status: 'error', message: err instanceof Error ? err.message : String(err) })
        })

      // Keep proxies from closing an idle stream.
      const ping = setInterval(() => send({ type: 'ping' }), 15000)
      request.signal.addEventListener('abort', () => {
        closed = true
        clearInterval(ping)
        connection.disconnect().catch(() => {})
        try {
          controller.close()
        } catch {}
      })
    },
    cancel() {
      closed = true
      connection.disconnect().catch(() => {})
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  })
}
