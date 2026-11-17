'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { BoatRaceGame, DEFAULT_SETTINGS, H, W, type GameSettings, type LiveEvent, type LiveUser } from './engine'

type Source = 'server' | 'tikfinity'
type ConnState = 'idle' | 'connecting' | 'connected' | 'error'

const BOT_NAMES = ['น้องเมย์', 'พี่ต้น', 'แก้ว', 'บอยสายพาย', 'ป้าแดง', 'Mint', 'นุ่น', 'ต้าร์', 'ฝน', 'โอ๊ต', 'Ploy', 'เบียร์', 'กิ๊ฟ', 'จ๋า', 'ปาล์ม', 'แบม']
const BOT_WORDS = ['พาย', 'พาย', 'พาย', 'สู้ๆ', 'ไปเลย', 'ฟัน', 'ฟัน', 'กลอง', '555', 'พายยย']

function botUser(i: number): LiveUser {
  return { id: `bot-${i}`, name: BOT_NAMES[i % BOT_NAMES.length] + (i >= BOT_NAMES.length ? i : ''), avatar: '' }
}

// TikFinity's local WebSocket relays events in the TikTok-Live-Connector v1 shape.
function fromTikfinity(msg: { event?: string; data?: Record<string, unknown> }): LiveEvent | null {
  const d = (msg.data || {}) as Record<string, unknown>
  const user: LiveUser = {
    id: String(d.uniqueId || d.userId || 'unknown'),
    name: String(d.nickname || d.uniqueId || 'ผู้ชม'),
    avatar: String(d.profilePictureUrl || ''),
  }
  switch (msg.event) {
    case 'chat':
      return { type: 'chat', user, text: String(d.comment || '') }
    case 'like':
      return { type: 'like', user, count: Number(d.likeCount) || 1 }
    case 'gift': {
      if (Number(d.giftType) === 1 && !d.repeatEnd) return null
      return { type: 'gift', user, count: Number(d.repeatCount) || 1, diamonds: Number(d.diamondCount) || 1, giftName: String(d.giftName || 'ของขวัญ') }
    }
    case 'follow':
      return { type: 'follow', user }
    case 'share':
      return { type: 'share', user }
    case 'member':
      return { type: 'join', user }
  }
  return null
}

export default function TikTokLiveGamePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [game] = useState(() => new BoatRaceGame(DEFAULT_SETTINGS))
  const audioRef = useRef<AudioContext | null>(null)
  const mutedRef = useRef(false)
  const [stage, setStage] = useState(false)
  const [username, setUsername] = useState('')
  const [source, setSource] = useState<Source>('server')
  const [conn, setConn] = useState<ConnState>('idle')
  const [connMsg, setConnMsg] = useState('')
  const [demo, setDemo] = useState(true)
  const [muted, setMuted] = useState(false)
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS)
  const [testName, setTestName] = useState('ทดสอบ')
  const [testText, setTestText] = useState('พาย')
  const [copied, setCopied] = useState(false)
  const autoConnect = useRef(false)

  // Read options from the URL so an OBS browser source can be configured by link.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    /* eslint-disable react-hooks/set-state-in-effect -- one-time hydration from URL */
    if (q.get('stage') === '1') setStage(true)
    if (q.get('u')) setUsername(q.get('u') || '')
    if (q.get('src') === 'tikfinity') setSource('tikfinity')
    if (q.get('demo') === '0') setDemo(false)
    if (q.get('mute') === '1') setMuted(true)
    const s: Partial<GameSettings> = {}
    if (q.get('title')) s.title = q.get('title') || DEFAULT_SETTINGS.title
    if (q.get('race')) s.raceSeconds = Number(q.get('race')) || DEFAULT_SETTINGS.raceSeconds
    if (q.get('likes')) s.likeGoal = Number(q.get('likes')) || DEFAULT_SETTINGS.likeGoal
    if (q.get('coins')) s.giftGoal = Number(q.get('coins')) || DEFAULT_SETTINGS.giftGoal
    if (Object.keys(s).length) setSettings((prev) => ({ ...prev, ...s }))
    autoConnect.current = !!q.get('u') || q.get('src') === 'tikfinity'
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [])

  useEffect(() => {
    game.configure(settings)
  }, [game, settings])

  useEffect(() => {
    mutedRef.current = muted
  }, [muted])

  // Simple synthesized sound effects (no audio files needed).
  useEffect(() => {
    game.setSoundHandler((kind) => {
      if (mutedRef.current) return
      try {
        const ac = (audioRef.current ||= new AudioContext())
        if (ac.state === 'suspended') ac.resume()
        const o = ac.createOscillator()
        const g = ac.createGain()
        const now = ac.currentTime
        const spec = {
          drum: [90, 'sine', 0.35],
          gong: [180, 'triangle', 1.6],
          chop: [600, 'square', 0.06],
          turbo: [440, 'sawtooth', 0.4],
          splash: [140, 'sawtooth', 0.3],
        } as const
        const [f, type, dur] = spec[kind]
        o.type = type
        o.frequency.setValueAtTime(f, now)
        if (kind === 'turbo') o.frequency.exponentialRampToValueAtTime(f * 2.5, now + dur)
        if (kind === 'drum') o.frequency.exponentialRampToValueAtTime(45, now + dur)
        g.gain.setValueAtTime(kind === 'chop' ? 0.05 : 0.18, now)
        g.gain.exponentialRampToValueAtTime(0.0001, now + dur)
        o.connect(g).connect(ac.destination)
        o.start(now)
        o.stop(now + dur)
      } catch {}
    })
  }, [game])

  // Render loop.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let raf = 0
    let last = performance.now()
    const loop = (now: number) => {
      game.step((now - last) / 1000)
      last = now
      game.draw(ctx)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [game, stage])

  // Demo crowd so the stage looks alive before real viewers arrive.
  useEffect(() => {
    if (!demo) return
    const id = setInterval(() => {
      const n = 16
      for (let k = 0; k < 3; k++) {
        const i = Math.floor(Math.random() * n)
        const user = botUser(i)
        const r = Math.random()
        if (r < 0.75) game.handle({ type: 'chat', user, text: BOT_WORDS[Math.floor(Math.random() * BOT_WORDS.length)] })
        else if (r < 0.97) game.handle({ type: 'like', user, count: 1 + Math.floor(Math.random() * 10) })
        else if (r < 0.99) game.handle({ type: 'gift', user, count: 1, diamonds: 1, giftName: 'กุหลาบ' })
        else game.handle({ type: 'gift', user, count: 1, diamonds: 30, giftName: 'โดนัท' })
      }
    }, 400)
    return () => clearInterval(id)
  }, [demo, game])

  // Live connection.
  const [connectKey, setConnectKey] = useState(0)
  const connect = useCallback(() => setConnectKey((k) => k + 1), [])
  const disconnect = useCallback(() => {
    setConnectKey(0)
    setConn('idle')
    setConnMsg('')
  }, [])

  useEffect(() => {
    if (autoConnect.current && connectKey === 0) {
      autoConnect.current = false
      setConnectKey(1)
    }
  }, [username, source, connectKey])

  useEffect(() => {
    if (!connectKey) return
    /* eslint-disable react-hooks/set-state-in-effect -- reflect connection lifecycle */
    setConn('connecting')
    setConnMsg('')
    /* eslint-enable react-hooks/set-state-in-effect */
    if (source === 'server') {
      const u = username.replace(/^@/, '').trim()
      if (!u) {
        setConn('error')
        setConnMsg('ใส่ชื่อผู้ใช้ TikTok ก่อน')
        return
      }
      const es = new EventSource(`/api/tiktok-live?u=${encodeURIComponent(u)}`)
      es.onmessage = (e) => {
        const msg = JSON.parse(e.data)
        if (msg.type === 'status') {
          if (msg.status === 'connected') {
            setConn('connected')
            setConnMsg(`เชื่อมต่อ @${msg.username} แล้ว`)
          } else if (msg.status === 'error') {
            setConn('error')
            setConnMsg(msg.message || 'เชื่อมต่อไม่สำเร็จ (ไลฟ์อยู่หรือยัง?)')
            es.close()
          } else {
            setConn('error')
            setConnMsg(msg.status === 'ended' ? 'ไลฟ์จบแล้ว' : 'หลุดการเชื่อมต่อ')
          }
        } else if (msg.type !== 'ping') {
          game.handle(msg as LiveEvent)
        }
      }
      es.onerror = () => {
        setConn('error')
        setConnMsg('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ — ต้องรันเว็บนี้บนเครื่องตัวเอง (npm run dev)')
        es.close()
      }
      return () => es.close()
    }
    let ws: WebSocket | null = null
    try {
      ws = new WebSocket('ws://localhost:21213/')
    } catch {
      setConn('error')
      setConnMsg('เปิด WebSocket ไม่ได้')
      return
    }
    ws.onopen = () => {
      setConn('connected')
      setConnMsg('เชื่อม TikFinity แล้ว')
    }
    ws.onmessage = (e) => {
      try {
        const ev = fromTikfinity(JSON.parse(String(e.data)))
        if (ev) game.handle(ev)
      } catch {}
    }
    ws.onerror = () => {
      setConn('error')
      setConnMsg('ไม่พบ TikFinity ที่ localhost:21213 — เปิดแอป TikFinity และเชื่อมไลฟ์ก่อน')
    }
    return () => ws?.close()
  }, [connectKey, game, source, username])

  const sendTest = (ev: LiveEvent) => game.handle(ev)
  const testUser: LiveUser = { id: 'test-' + testName, name: testName || 'ทดสอบ', avatar: '' }

  const stageUrl = () => {
    const q = new URLSearchParams({ stage: '1' })
    if (source === 'server' && username) q.set('u', username.replace(/^@/, ''))
    if (source === 'tikfinity') q.set('src', 'tikfinity')
    if (!demo) q.set('demo', '0')
    if (muted) q.set('mute', '1')
    if (settings.title !== DEFAULT_SETTINGS.title) q.set('title', settings.title)
    q.set('race', String(settings.raceSeconds))
    q.set('likes', String(settings.likeGoal))
    q.set('coins', String(settings.giftGoal))
    return `${window.location.origin}${window.location.pathname}?${q}`
  }

  const canvas = (
    <canvas
      ref={canvasRef}
      width={W}
      height={H}
      className={stage ? 'h-full max-h-screen w-auto max-w-full' : 'w-full h-auto rounded-2xl shadow-lg'}
      style={{ aspectRatio: `${W}/${H}` }}
    />
  )

  if (stage) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center" onDoubleClick={() => setStage(false)}>
        {canvas}
      </div>
    )
  }

  const inputCls = 'w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-pink-500'
  const btn = 'px-3 py-2 rounded-xl font-semibold text-sm transition-colors'

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">เกมไลฟ์ TikTok: ศึกเรือยาว 🚣</h1>
        <p className="text-gray-600 dark:text-gray-400">
          เกมอินเทอร์แอคทีฟสำหรับไลฟ์สด คนดูเลือกทีมด้วยคอมเมนต์ 1-4 พิมพ์ &quot;พาย&quot; ให้เรือพุ่ง ส่งของขวัญเพื่อเทอร์โบหรือโยนผักตบใส่ทีมที่นำ
          แล้วทีมนั้นต้องช่วยกันพิมพ์ &quot;ฟัน&quot; ให้ผ่าน
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4">
          <section className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm border dark:border-gray-800 space-y-3">
            <h2 className="font-bold text-lg">1. เชื่อมต่อไลฟ์</h2>
            <div className="flex gap-2">
              {(['server', 'tikfinity'] as Source[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setSource(s)}
                  className={`${btn} flex-1 ${source === s ? 'bg-pink-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
                >
                  {s === 'server' ? 'ชื่อผู้ใช้ TikTok' : 'ผ่าน TikFinity'}
                </button>
              ))}
            </div>
            {source === 'server' ? (
              <input className={inputCls} placeholder="@username ของคุณ" value={username} onChange={(e) => setUsername(e.target.value)} />
            ) : (
              <p className="text-sm text-gray-500">เปิดแอป TikFinity บนคอมฯ เชื่อมไลฟ์ไว้ แล้วกดเชื่อมต่อ (ใช้ WebSocket localhost:21213)</p>
            )}
            <div className="flex gap-2">
              <button onClick={connect} className={`${btn} flex-1 bg-pink-600 hover:bg-pink-700 text-white`}>
                {conn === 'connecting' ? 'กำลังเชื่อม...' : 'เชื่อมต่อ'}
              </button>
              {conn !== 'idle' && (
                <button onClick={disconnect} className={`${btn} bg-gray-100 dark:bg-gray-800`}>
                  ตัดการเชื่อม
                </button>
              )}
            </div>
            {connMsg && <p className={`text-sm ${conn === 'error' ? 'text-red-500' : 'text-green-600'}`}>{connMsg}</p>}
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={demo} onChange={(e) => setDemo(e.target.checked)} /> โหมดเดโม (บอทจำลองคนดู)
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={!muted} onChange={(e) => setMuted(!e.target.checked)} /> เปิดเสียงเอฟเฟกต์
            </label>
          </section>

          <section className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm border dark:border-gray-800 space-y-3">
            <h2 className="font-bold text-lg">2. ตั้งค่าเกม</h2>
            <label className="block text-sm">
              ชื่อบนจอ
              <input className={inputCls} value={settings.title} onChange={(e) => setSettings({ ...settings, title: e.target.value })} />
            </label>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <label>
                ความยาวแข่ง (วิ)
                <input type="number" className={inputCls} value={settings.raceSeconds} onChange={(e) => setSettings({ ...settings, raceSeconds: Number(e.target.value) || 120 })} />
              </label>
              <label>
                เป้าหัวใจ
                <input type="number" className={inputCls} value={settings.likeGoal} onChange={(e) => setSettings({ ...settings, likeGoal: Number(e.target.value) || 0 })} />
              </label>
              <label>
                เป้าเหรียญ
                <input type="number" className={inputCls} value={settings.giftGoal} onChange={(e) => setSettings({ ...settings, giftGoal: Number(e.target.value) || 0 })} />
              </label>
            </div>
          </section>

          <section className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm border dark:border-gray-800 space-y-3">
            <h2 className="font-bold text-lg">3. ทดสอบเอง</h2>
            <div className="grid grid-cols-2 gap-2">
              <input className={inputCls} value={testName} onChange={(e) => setTestName(e.target.value)} placeholder="ชื่อคนดู" />
              <input
                className={inputCls}
                value={testText}
                onChange={(e) => setTestText(e.target.value)}
                placeholder="คอมเมนต์"
                onKeyDown={(e) => e.key === 'Enter' && sendTest({ type: 'chat', user: testUser, text: testText })}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button className={`${btn} bg-blue-600 text-white`} onClick={() => sendTest({ type: 'chat', user: testUser, text: testText })}>
                💬 ส่งคอมเมนต์
              </button>
              <button className={`${btn} bg-rose-500 text-white`} onClick={() => sendTest({ type: 'like', user: testUser, count: 15 })}>
                ❤️ หัวใจ x15
              </button>
              <button className={`${btn} bg-amber-500 text-white`} onClick={() => sendTest({ type: 'gift', user: testUser, count: 1, diamonds: 1, giftName: 'กุหลาบ' })}>
                🌹 กุหลาบ
              </button>
              <button className={`${btn} bg-purple-600 text-white`} onClick={() => sendTest({ type: 'gift', user: testUser, count: 1, diamonds: 30, giftName: 'โดนัท' })}>
                🍩 โดนัท (โยนผักตบ)
              </button>
              <button className={`${btn} bg-gray-700 text-white`} onClick={() => sendTest({ type: 'follow', user: testUser })}>
                ➕ ติดตาม
              </button>
            </div>
          </section>

          <section className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm border dark:border-gray-800 space-y-3">
            <h2 className="font-bold text-lg">4. ขึ้นไลฟ์</h2>
            <div className="flex flex-wrap gap-2">
              <button className={`${btn} bg-green-600 text-white`} onClick={() => setStage(true)}>
                🖥️ เต็มจอ (ดับเบิลคลิกเพื่อออก)
              </button>
              <button
                className={`${btn} bg-gray-100 dark:bg-gray-800`}
                onClick={() => {
                  navigator.clipboard.writeText(stageUrl()).then(() => {
                    setCopied(true)
                    setTimeout(() => setCopied(false), 1500)
                  })
                }}
              >
                {copied ? 'คัดลอกแล้ว ✓' : '🔗 คัดลอกลิงก์ OBS / Live Studio'}
              </button>
            </div>
            <ol className="text-sm text-gray-600 dark:text-gray-400 list-decimal pl-5 space-y-1">
              <li>รันเว็บนี้บนคอมฯ ตัวเอง (<code>npm run dev</code>) เพื่อใช้การเชื่อมด้วยชื่อผู้ใช้ หรือใช้ TikFinity</li>
              <li>ใน TikTok LIVE Studio / OBS เพิ่ม Browser Source ขนาด 1080×1920 แล้ววางลิงก์ที่คัดลอก</li>
              <li>ปิดโหมดเดโมก่อนไลฟ์จริง เพื่อให้มีแต่คนดูจริงบนเรือ</li>
            </ol>
          </section>
        </div>

        <div className="lg:col-span-7">
          <div className="max-w-[460px] mx-auto">{canvas}</div>
        </div>
      </div>
    </div>
  )
}
