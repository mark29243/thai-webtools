// ศึกเรือยาวไลฟ์สด — game engine + canvas renderer for a TikTok LIVE
// interactive overlay. Pure TypeScript, no React; the page feeds it LiveEvents
// and calls step()/draw() every animation frame.

export type LiveUser = { id: string; name: string; avatar: string }

export type LiveEvent =
  | { type: 'chat'; user: LiveUser; text: string }
  | { type: 'like'; user: LiveUser; count: number }
  | { type: 'gift'; user: LiveUser; count: number; diamonds: number; giftName: string }
  | { type: 'follow'; user: LiveUser }
  | { type: 'share'; user: LiveUser }
  | { type: 'join'; user: LiveUser }

export type GameSettings = {
  title: string
  raceSeconds: number // rough target length of a busy race
  likeGoal: number
  giftGoal: number
  lobbySeconds: number
}

export const DEFAULT_SETTINGS: GameSettings = {
  title: 'ศึกเรือยาวไลฟ์สด',
  raceSeconds: 120,
  likeGoal: 5000,
  giftGoal: 300,
  lobbySeconds: 15,
}

export const W = 1080
export const H = 1920

type Obstacle = { kind: 'weed' | 'log'; hp: number; maxHp: number; by?: string; born: number }

type Team = {
  idx: number
  name: string
  short: string
  color: string
  dark: string
  keys: string[]
  progress: number // 0..100
  velocity: number // % per second
  turboUntil: number
  drumUntil: number
  drumCooldownUntil: number
  drumHits: Map<string, number>
  obstacle: Obstacle | null
  wins: number
  strokeAnim: number
}

type Player = LiveUser & {
  team: number
  roundScore: number
  totalScore: number
  lastPaddle: number
  lastChop: number
  lastSeen: number
}

type Popup = { x: number; y: number; text: string; color: string; born: number; size: number }
type Banner = { text: string; sub?: string; color: string; born: number; dur: number }
type FeedItem = { text: string; color: string; born: number }

const TEAM_DEFS = [
  { name: 'นาคาแดง', short: 'แดง', color: '#ff3b5c', dark: '#8a0f26', keys: ['1', 'แดง', 'red'] },
  { name: 'มังกรฟ้า', short: 'ฟ้า', color: '#2fb8ff', dark: '#0b4f7a', keys: ['2', 'ฟ้า', 'น้ำเงิน', 'blue'] },
  { name: 'หงส์เขียว', short: 'เขียว', color: '#3ddc84', dark: '#11683b', keys: ['3', 'เขียว', 'green'] },
  { name: 'ครุฑทอง', short: 'ทอง', color: '#ffc531', dark: '#7c5a00', keys: ['4', 'ทอง', 'เหลือง', 'yellow'] },
]

const PADDLE_WORDS = ['พาย', 'จ้ำ', 'สู้', 'ไป', 'paddle', 'go']
const CHOP_WORDS = ['ฟัน', 'ตัด', 'chop']
const DRUM_WORDS = ['กลอง', 'ตีกลอง', 'ตุ้ม', 'drum']

// River geometry (virtual pixels)
const RIVER_TOP = 640
const RIVER_BOTTOM = 1470
const FINISH_LINE = 690
const FINISH_Y = FINISH_LINE + 220 // boat centre when its bow tip crosses the line
const START_Y = 1290
const LANE_X0 = 70
const LANE_W = (W - LANE_X0 * 2) / 4

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, '').trim()

export class BoatRaceGame {
  settings: GameSettings
  teams: Team[]
  players = new Map<string, Player>()
  phase: 'lobby' | 'race' | 'finish' = 'lobby'
  phaseStart = 0
  now = 0
  likes = 0
  coins = 0
  winner: Team | null = null
  podium: Player[] = []
  popups: Popup[] = []
  banners: Banner[] = []
  feed: FeedItem[] = []
  nextEventAt = 0
  waterOffset = 0
  images = new Map<string, HTMLImageElement | null>()
  onSound?: (kind: 'drum' | 'gong' | 'chop' | 'turbo' | 'splash') => void

  constructor(settings: GameSettings = DEFAULT_SETTINGS) {
    this.settings = { ...settings }
    this.teams = TEAM_DEFS.map((d, idx) => ({
      idx,
      ...d,
      progress: 0,
      velocity: 0,
      turboUntil: 0,
      drumUntil: 0,
      drumCooldownUntil: 0,
      drumHits: new Map(),
      obstacle: null,
      wins: 0,
      strokeAnim: 0,
    }))
    this.toLobby(0)
  }

  configure(settings: GameSettings) {
    this.settings = { ...settings }
  }

  setSoundHandler(fn: (kind: 'drum' | 'gong' | 'chop' | 'turbo' | 'splash') => void) {
    this.onSound = fn
  }

  // A busy room averages a few paddles per second per team; scale impulses so
  // a race lasts roughly settings.raceSeconds.
  private get k() {
    return 120 / Math.max(30, this.settings.raceSeconds)
  }

  private toLobby(t: number) {
    this.phase = 'lobby'
    this.phaseStart = t
    this.winner = null
    for (const tm of this.teams) {
      tm.progress = 0
      tm.velocity = 0
      tm.obstacle = null
      tm.turboUntil = 0
      tm.drumUntil = 0
      tm.drumHits.clear()
    }
    for (const p of this.players.values()) p.roundScore = 0
  }

  private startRace(t: number) {
    this.phase = 'race'
    this.phaseStart = t
    this.nextEventAt = t + 18 + Math.random() * 10
    this.banner('ปล่อยเรือ!!', 'คอมเมนต์ "พาย" รัวๆ', '#ffffff', 2.2)
    this.onSound?.('gong')
  }

  // ---------- input ----------

  handle(ev: LiveEvent) {
    const t = this.now
    const p = this.player(ev.user)
    p.lastSeen = t
    switch (ev.type) {
      case 'chat': {
        const text = norm(ev.text)
        const pick = this.teams.find((tm) => tm.keys.some((k) => text === k || text === 'ทีม' + k))
        if (pick && pick.idx !== p.team) {
          p.team = pick.idx
          this.log(`${p.name} ลงเรือ ${pick.name}`, pick.color)
          this.popupAtBoat(pick, `+${short(p.name)}`, pick.color)
          return
        }
        const team = this.teams[p.team]
        if (DRUM_WORDS.some((w) => text.includes(w))) return this.drum(team, p)
        if (CHOP_WORDS.some((w) => text.includes(w)) && team.obstacle) return this.chop(team, p)
        // Any other comment counts as a stroke; the paddle words count double.
        const strong = PADDLE_WORDS.some((w) => text.includes(w))
        this.paddle(team, p, strong ? 1 : 0.6)
        return
      }
      case 'like': {
        this.likes += ev.count
        const team = this.teams[p.team]
        if (this.phase === 'race' && !team.obstacle) team.velocity += 0.035 * this.k * Math.min(ev.count, 15)
        p.roundScore += ev.count * 0.2
        p.totalScore += ev.count * 0.2
        const goal = this.settings.likeGoal
        if (goal > 0 && Math.floor((this.likes - ev.count) / goal) < Math.floor(this.likes / goal)) {
          this.banner('ถึงเป้าหัวใจแล้ว!', 'ลมส่งทุกลำ 5 วินาที 💨', '#ff7eb3', 2.5)
          for (const tm of this.teams) tm.turboUntil = Math.max(tm.turboUntil, t + 5)
        }
        return
      }
      case 'gift': {
        const value = ev.diamonds * ev.count
        this.coins += value
        const team = this.teams[p.team]
        p.roundScore += value * 5
        p.totalScore += value * 5
        const secs = Math.min(25, 2.5 + value * 0.8)
        team.turboUntil = Math.max(team.turboUntil, t) + secs
        if (team.obstacle && value >= 5) {
          team.obstacle = null
          this.log(`${p.name} ใช้ ${ev.giftName} ระเบิดสิ่งกีดขวาง!`, team.color)
        }
        this.banner(`${short(p.name, 14)} ส่ง ${ev.giftName} x${ev.count}`, `${team.name} เทอร์โบ ${Math.round(secs)} วิ 🚀`, team.color, 2.4)
        this.onSound?.('turbo')
        // Bigger gifts also throw ผักตบชวา into the leading rival's lane.
        if (value >= 5 && this.phase === 'race') {
          const rival = this.teams
            .filter((tm) => tm.idx !== team.idx && !tm.obstacle)
            .sort((a, b) => b.progress - a.progress)[0]
          if (rival) {
            const hp = Math.min(60, 8 + Math.round(value / 2))
            rival.obstacle = { kind: 'weed', hp, maxHp: hp, by: p.name, born: t }
            this.log(`${p.name} โยนผักตบใส่ ${rival.name}! พิมพ์ "ฟัน" ${hp} ครั้ง`, rival.color)
            this.onSound?.('splash')
          }
        }
        return
      }
      case 'follow': {
        const team = this.teams[p.team]
        if (this.phase === 'race') team.velocity += 1.2 * this.k
        this.log(`${p.name} กดติดตาม! ${team.name} พุ่ง`, team.color)
        this.popupAtBoat(team, 'ติดตาม +พลัง', '#ffffff')
        return
      }
      case 'share': {
        const team = this.teams[p.team]
        if (this.phase === 'race') team.velocity += 0.9 * this.k
        this.log(`${p.name} แชร์ไลฟ์ ขอบคุณจ้า`, team.color)
        return
      }
      case 'join':
        return
    }
  }

  private player(u: LiveUser): Player {
    let p = this.players.get(u.id)
    if (!p) {
      // Auto-balance newcomers into the smallest crew.
      const counts = [0, 0, 0, 0]
      for (const q of this.players.values()) if (this.now - q.lastSeen < 300) counts[q.team]++
      const team = counts.indexOf(Math.min(...counts))
      p = { ...u, team, roundScore: 0, totalScore: 0, lastPaddle: -1, lastChop: -1, lastSeen: this.now }
      this.players.set(u.id, p)
      if (this.players.size > 3000) this.prunePlayers()
    } else {
      if (u.avatar) p.avatar = u.avatar
      if (u.name) p.name = u.name
    }
    return p
  }

  private prunePlayers() {
    const sorted = [...this.players.values()].sort((a, b) => a.lastSeen - b.lastSeen)
    for (const p of sorted.slice(0, 1000)) this.players.delete(p.id)
  }

  private paddle(team: Team, p: Player, power: number) {
    const t = this.now
    if (this.phase !== 'race') return
    if (t - p.lastPaddle < 0.35) return
    p.lastPaddle = t
    if (team.obstacle) {
      this.popupAtBoat(team, 'ติดผักตบ! พิมพ์ "ฟัน"', '#b6ff8a', 30)
      return
    }
    const drum = t < team.drumUntil ? 2 : 1
    team.velocity += 0.42 * power * drum * this.k
    team.strokeAnim = 1
    p.roundScore += power * drum
    p.totalScore += power * drum
  }

  private chop(team: Team, p: Player) {
    const t = this.now
    const ob = team.obstacle
    if (!ob || t - p.lastChop < 0.25) return
    p.lastChop = t
    ob.hp -= 1
    p.roundScore += 1.5
    p.totalScore += 1.5
    this.popupAtBoat(team, 'ฉับ!', '#ffffff', 34)
    this.onSound?.('chop')
    if (ob.hp <= 0) {
      team.obstacle = null
      team.velocity += 2 * this.k
      this.log(`${team.name} ฟันผ่านแล้ว! ฮีโร่: ${p.name}`, team.color)
    }
  }

  private drum(team: Team, p: Player) {
    const t = this.now
    if (this.phase !== 'race') return
    team.drumHits.set(p.id, t)
    for (const [id, at] of team.drumHits) if (t - at > 6) team.drumHits.delete(id)
    const need = this.drumNeed(team)
    if (team.drumHits.size >= need && t > team.drumCooldownUntil && t > team.drumUntil) {
      team.drumUntil = t + 8
      team.drumCooldownUntil = t + 20
      team.drumHits.clear()
      this.banner(`${team.name} ตีกลองพร้อมกัน!`, 'แรงพาย x2 นาน 8 วินาที 🥁', team.color, 2.2)
      this.onSound?.('drum')
    } else {
      this.popupAtBoat(team, `🥁 ${team.drumHits.size}/${need}`, team.color, 30)
    }
  }

  drumNeed(team: Team) {
    let crew = 0
    for (const q of this.players.values()) if (q.team === team.idx && this.now - q.lastSeen < 60) crew++
    return Math.max(2, Math.min(6, Math.ceil(crew * 0.3)))
  }

  // ---------- simulation ----------

  step(dt: number) {
    dt = Math.min(dt, 0.1)
    this.now += dt
    const t = this.now
    this.waterOffset = (this.waterOffset + dt * 60) % 80

    if (this.phase === 'lobby') {
      if (t - this.phaseStart >= this.settings.lobbySeconds) this.startRace(t)
    } else if (this.phase === 'race') {
      for (const tm of this.teams) {
        if (tm.obstacle) {
          tm.velocity *= Math.pow(0.02, dt)
        } else {
          if (t < tm.turboUntil) tm.velocity += 1.6 * this.k * dt
          tm.velocity *= Math.pow(0.45, dt) // water drag
          tm.velocity = Math.min(tm.velocity, 9 * this.k)
          tm.progress += tm.velocity * dt
        }
        tm.strokeAnim = Math.max(0, tm.strokeAnim - dt * 2.5)
      }
      const done = this.teams.filter((tm) => tm.progress >= 100).sort((a, b) => b.progress - a.progress)[0]
      if (done) this.finish(done)
      else if (t >= this.nextEventAt) this.randomEvent()
    } else if (this.phase === 'finish') {
      if (t - this.phaseStart >= 10) this.toLobby(t)
    }

    this.popups = this.popups.filter((p) => t - p.born < 1.4)
    this.banners = this.banners.filter((b) => t - b.born < b.dur)
    this.feed = this.feed.filter((f) => t - f.born < 12).slice(-5)
  }

  private randomEvent() {
    const t = this.now
    this.nextEventAt = t + 20 + Math.random() * 15
    const roll = Math.random()
    if (roll < 0.55) {
      // Logs and weeds tend to drift into whoever is ahead.
      const free = this.teams.filter((tm) => !tm.obstacle)
      if (!free.length) return
      const sorted = free.sort((a, b) => b.progress - a.progress)
      const target = Math.random() < 0.6 ? sorted[0] : sorted[Math.floor(Math.random() * sorted.length)]
      const hp = 10 + Math.floor(Math.random() * 8)
      target.obstacle = { kind: Math.random() < 0.5 ? 'log' : 'weed', hp, maxHp: hp, born: t }
      this.banner(`${target.name} ชนขอนไม้!`, `ลูกเรือพิมพ์ "ฟัน" ${hp} ครั้งเพื่อไปต่อ`, target.color, 2.6)
      this.onSound?.('splash')
    } else if (roll < 0.8) {
      const last = [...this.teams].sort((a, b) => a.progress - b.progress)[0]
      last.turboUntil = Math.max(last.turboUntil, t) + 6
      this.banner('กระแสน้ำช่วยคนรั้งท้าย!', `${last.name} ได้ลมส่ง 6 วินาที`, last.color, 2.4)
    } else {
      this.banner('ช่วงตีกลอง!', 'พิมพ์ "กลอง" พร้อมกันเพื่อพายแรง x2', '#ffe08a', 2.6)
    }
  }

  private finish(team: Team) {
    this.phase = 'finish'
    this.phaseStart = this.now
    this.winner = team
    team.wins++
    this.podium = [...this.players.values()]
      .filter((p) => p.team === team.idx && p.roundScore > 0)
      .sort((a, b) => b.roundScore - a.roundScore)
      .slice(0, 3)
    this.log(`${team.name} คว้าชัย! 🏆`, team.color)
    this.onSound?.('gong')
  }

  private banner(text: string, sub: string | undefined, color: string, dur: number) {
    this.banners.push({ text, sub, color, born: this.now, dur })
    if (this.banners.length > 2) this.banners.shift()
  }

  private log(text: string, color: string) {
    this.feed.push({ text, color, born: this.now })
  }

  private popupAtBoat(team: Team, text: string, color: string, size = 30) {
    const x = LANE_X0 + LANE_W * team.idx + LANE_W / 2 + (Math.random() - 0.5) * 80
    const y = this.boatY(team) - 60 + (Math.random() - 0.5) * 40
    this.popups.push({ x, y, text, color, born: this.now, size })
    if (this.popups.length > 40) this.popups.shift()
  }

  boatY(team: Team) {
    return START_Y - (Math.min(team.progress, 100) / 100) * (START_Y - FINISH_Y)
  }

  crew(team: Team, n: number) {
    return [...this.players.values()]
      .filter((p) => p.team === team.idx && this.now - p.lastSeen < 120)
      .sort((a, b) => b.roundScore - a.roundScore || b.lastSeen - a.lastSeen)
      .slice(0, n)
  }

  topAllTime(n: number) {
    return [...this.players.values()].filter((p) => p.totalScore > 0).sort((a, b) => b.totalScore - a.totalScore).slice(0, n)
  }

  // ---------- rendering ----------

  private img(url: string) {
    if (!url) return null
    if (this.images.has(url)) return this.images.get(url) || null
    this.images.set(url, null)
    const im = new Image()
    im.referrerPolicy = 'no-referrer'
    im.onload = () => this.images.set(url, im)
    im.src = url
    if (this.images.size > 600) {
      const first = this.images.keys().next().value
      if (first) this.images.delete(first)
    }
    return null
  }

  draw(ctx: CanvasRenderingContext2D) {
    const t = this.now
    ctx.save()
    ctx.textBaseline = 'middle'
    this.drawBackground(ctx, t)
    this.drawRiver(ctx, t)
    for (const tm of this.teams) this.drawBoat(ctx, tm, t)
    this.drawHud(ctx, t)
    this.drawBottom(ctx)
    for (const p of this.popups) {
      const a = 1 - (t - p.born) / 1.4
      ctx.globalAlpha = Math.max(0, a)
      text(ctx, p.text, p.x, p.y - (t - p.born) * 60, p.size, p.color, 'center', 900, true)
    }
    ctx.globalAlpha = 1
    this.drawBanners(ctx, t)
    if (this.phase === 'finish') this.drawWinner(ctx, t)
    ctx.restore()
  }

  private drawBackground(ctx: CanvasRenderingContext2D, t: number) {
    const g = ctx.createLinearGradient(0, 0, 0, H)
    g.addColorStop(0, '#0b0630')
    g.addColorStop(0.35, '#2a0b4d')
    g.addColorStop(1, '#06121f')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W, H)
    // stars
    for (let i = 0; i < 60; i++) {
      const x = (i * 197) % W
      const y = (i * 131) % 600
      ctx.globalAlpha = 0.3 + 0.3 * Math.sin(t * 2 + i)
      ctx.fillStyle = '#fff'
      ctx.fillRect(x, y, 3, 3)
    }
    ctx.globalAlpha = 1
    // temple silhouettes on the far bank
    ctx.fillStyle = '#12082a'
    const base = RIVER_TOP - 10
    for (const [cx, s] of [[150, 1], [540, 1.5], [930, 1.1]] as const) {
      ctx.beginPath()
      ctx.moveTo(cx - 110 * s, base)
      ctx.lineTo(cx - 70 * s, base - 70 * s)
      ctx.lineTo(cx - 30 * s, base - 80 * s)
      ctx.lineTo(cx, base - 200 * s)
      ctx.lineTo(cx + 30 * s, base - 80 * s)
      ctx.lineTo(cx + 70 * s, base - 70 * s)
      ctx.lineTo(cx + 110 * s, base)
      ctx.fill()
    }
    // festival lantern string
    for (let row = 0; row < 2; row++) {
      const y0 = 560 + row * 30
      ctx.strokeStyle = 'rgba(255,220,150,.35)'
      ctx.lineWidth = 2
      ctx.beginPath()
      for (let x = 0; x <= W; x += 20) ctx.lineTo(x, y0 + Math.sin(x / 140 + row) * 18)
      ctx.stroke()
      for (let x = 30 + row * 45; x < W; x += 90) {
        const y = y0 + Math.sin(x / 140 + row) * 18 + 14
        const c = ['#ff4d6d', '#ffd166', '#06d6a0', '#4cc9f0'][(x / 90 + row) % 4 | 0]
        ctx.fillStyle = c
        ctx.shadowColor = c
        ctx.shadowBlur = 18 + 8 * Math.sin(t * 3 + x)
        roundRect(ctx, x - 10, y - 12, 20, 26, 8)
        ctx.fill()
      }
      ctx.shadowBlur = 0
    }
  }

  private drawRiver(ctx: CanvasRenderingContext2D, t: number) {
    const rg = ctx.createLinearGradient(0, RIVER_TOP, 0, RIVER_BOTTOM)
    rg.addColorStop(0, '#0d3b66')
    rg.addColorStop(1, '#0a2540')
    ctx.fillStyle = rg
    ctx.fillRect(0, RIVER_TOP, W, RIVER_BOTTOM - RIVER_TOP)
    // banks
    ctx.fillStyle = '#1f5130'
    ctx.fillRect(0, RIVER_TOP - 14, W, 16)
    ctx.fillRect(0, RIVER_BOTTOM - 2, W, 16)
    // flowing ripples
    ctx.strokeStyle = 'rgba(255,255,255,.08)'
    ctx.lineWidth = 3
    for (let y = RIVER_TOP + (this.phase === 'race' ? this.waterOffset : 0); y < RIVER_BOTTOM; y += 80) {
      for (let x = 20; x < W; x += 140) {
        ctx.beginPath()
        const ox = ((y / 80) % 2) * 70
        ctx.arc(x + ox, y, 26, Math.PI * 1.15, Math.PI * 1.85)
        ctx.stroke()
      }
    }
    // lane ropes with buoys
    for (let i = 1; i < 4; i++) {
      const x = LANE_X0 + LANE_W * i
      for (let y = RIVER_TOP + 10; y < RIVER_BOTTOM; y += 34) {
        ctx.fillStyle = (y / 34) % 2 < 1 ? '#ffffff' : '#ff5a5f'
        ctx.globalAlpha = 0.55
        ctx.beginPath()
        ctx.arc(x, y, 5, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    ctx.globalAlpha = 1
    // finish line
    for (let x = LANE_X0; x < W - LANE_X0; x += 24) {
      ctx.fillStyle = ((x - LANE_X0) / 24) % 2 < 1 ? '#fff' : '#111'
      ctx.fillRect(x, FINISH_LINE - 12, 24, 12)
      ctx.fillStyle = ((x - LANE_X0) / 24) % 2 < 1 ? '#111' : '#fff'
      ctx.fillRect(x, FINISH_LINE, 24, 12)
    }
    text(ctx, 'เส้นชัย', W / 2, FINISH_LINE - 32, 26, '#ffe08a', 'center', 900, true)
    void t
  }

  private drawBoat(ctx: CanvasRenderingContext2D, tm: Team, t: number) {
    const cx = LANE_X0 + LANE_W * tm.idx + LANE_W / 2
    const y = this.boatY(tm)
    const bob = Math.sin(t * 3 + tm.idx) * 4
    const len = 300
    const bw = 64
    const top = y - len / 2 + bob
    ctx.save()

    // wake
    if (this.phase === 'race' && tm.velocity > 0.3 && !tm.obstacle) {
      ctx.fillStyle = 'rgba(255,255,255,.18)'
      ctx.beginPath()
      ctx.moveTo(cx - bw / 2, top + len - 20)
      ctx.lineTo(cx - bw - 20, top + len + 70 + tm.velocity * 6)
      ctx.lineTo(cx + bw + 20, top + len + 70 + tm.velocity * 6)
      ctx.lineTo(cx + bw / 2, top + len - 20)
      ctx.fill()
    }
    const turbo = t < tm.turboUntil
    const drum = t < tm.drumUntil
    if (turbo || drum) {
      ctx.shadowColor = turbo ? '#ffffff' : tm.color
      ctx.shadowBlur = 40
    }
    // hull (long boat, bow pointing up)
    ctx.fillStyle = tm.dark
    ctx.strokeStyle = tm.color
    ctx.lineWidth = 6
    ctx.beginPath()
    ctx.moveTo(cx, top - 30)
    ctx.quadraticCurveTo(cx + bw / 2 + 6, top + 40, cx + bw / 2, top + len - 30)
    ctx.quadraticCurveTo(cx, top + len + 14, cx - bw / 2, top + len - 30)
    ctx.quadraticCurveTo(cx - bw / 2 - 6, top + 40, cx, top - 30)
    ctx.fill()
    ctx.stroke()
    ctx.shadowBlur = 0
    // carved bow head
    ctx.fillStyle = tm.color
    ctx.beginPath()
    ctx.moveTo(cx, top - 70)
    ctx.quadraticCurveTo(cx + 26, top - 50, cx + 10, top - 20)
    ctx.lineTo(cx - 10, top - 20)
    ctx.quadraticCurveTo(cx - 26, top - 50, cx, top - 70)
    ctx.fill()
    ctx.fillStyle = '#fff'
    ctx.beginPath()
    ctx.arc(cx + 6, top - 50, 4, 0, Math.PI * 2)
    ctx.fill()

    // rowers
    const crew = this.crew(tm, 8)
    const stroke = this.phase === 'race' ? Math.sin(t * (drum ? 14 : 8) + tm.idx) : 0
    for (let i = 0; i < 8; i++) {
      const ry = top + 30 + i * 32
      const side = i % 2 === 0 ? -1 : 1
      // paddle
      ctx.strokeStyle = '#d9b26f'
      ctx.lineWidth = 5
      ctx.beginPath()
      ctx.moveTo(cx + side * 10, ry)
      const px = cx + side * (bw / 2 + 34)
      const py = ry + stroke * 16 * side
      ctx.lineTo(px, py)
      ctx.stroke()
      ctx.fillStyle = '#d9b26f'
      ctx.beginPath()
      ctx.ellipse(px, py, 7, 14, 0, 0, Math.PI * 2)
      ctx.fill()
      const p = crew[i]
      this.avatar(ctx, p, cx + side * 8, ry, 19, tm.color)
    }
    // name tag of top paddler
    if (crew[0]) text(ctx, short(crew[0].name, 10), cx, top + len + 30, 22, '#ffffff', 'center', 700, true)

    // obstacle
    const ob = tm.obstacle
    if (ob) {
      const oy = top - 110
      if (ob.kind === 'log') {
        ctx.fillStyle = '#7a4a24'
        roundRect(ctx, cx - 95, oy - 20, 190, 40, 20)
        ctx.fill()
        ctx.fillStyle = '#a8703c'
        ctx.beginPath()
        ctx.ellipse(cx + 85, oy, 12, 20, 0, 0, Math.PI * 2)
        ctx.fill()
      } else {
        for (let i = 0; i < 9; i++) {
          const a = (i / 9) * Math.PI * 2
          ctx.fillStyle = i % 2 ? '#2e8b3e' : '#3fb950'
          ctx.beginPath()
          ctx.ellipse(cx + Math.cos(a) * 60, oy + Math.sin(a) * 22, 28, 16, a, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.fillStyle = '#c99cff'
        ctx.beginPath()
        ctx.arc(cx, oy - 6, 12, 0, Math.PI * 2)
        ctx.fill()
      }
      const w = 170
      ctx.fillStyle = 'rgba(0,0,0,.6)'
      roundRect(ctx, cx - w / 2, oy + 30, w, 18, 9)
      ctx.fill()
      ctx.fillStyle = '#b6ff8a'
      roundRect(ctx, cx - w / 2, oy + 30, (w * ob.hp) / ob.maxHp, 18, 9)
      ctx.fill()
      text(ctx, `ฟัน ${ob.hp}`, cx, oy + 66, 26, '#b6ff8a', 'center', 900, true)
    }
    if (drum) text(ctx, '🥁 x2', cx, top + len / 2, 34, '#fff', 'center', 900, true)
    ctx.restore()
  }

  private avatar(ctx: CanvasRenderingContext2D, p: Player | undefined, x: number, y: number, r: number, ring: string) {
    ctx.save()
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fillStyle = p ? '#2b2b3a' : 'rgba(255,255,255,.12)'
    ctx.fill()
    const im = p ? this.img(p.avatar) : null
    if (im) {
      ctx.clip()
      ctx.drawImage(im, x - r, y - r, r * 2, r * 2)
    } else if (p) {
      text(ctx, [...p.name][0] || '?', x, y + 1, r, '#fff', 'center', 800)
    }
    ctx.restore()
    ctx.strokeStyle = ring
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.stroke()
  }

  private drawHud(ctx: CanvasRenderingContext2D, t: number) {
    // Panel sits below TikTok's own top bar (~230px).
    const x = 60
    const y = 240
    const w = W - 120
    const h = 300
    const g = ctx.createLinearGradient(0, y, 0, y + h)
    g.addColorStop(0, 'rgba(26,8,60,.92)')
    g.addColorStop(1, 'rgba(10,30,60,.92)')
    ctx.fillStyle = g
    ctx.strokeStyle = '#ffd166'
    ctx.lineWidth = 4
    roundRect(ctx, x, y, w, h, 28)
    ctx.fill()
    ctx.stroke()

    text(ctx, this.settings.title, W / 2, y + 44, 54, '#ffd166', 'center', 900, true)
    let status = ''
    if (this.phase === 'lobby') status = `เลือกทีมก่อนปล่อยเรือ ${Math.ceil(this.settings.lobbySeconds - (t - this.phaseStart))} วิ`
    else if (this.phase === 'race') status = `กำลังแข่ง • ${fmtTime(t - this.phaseStart)}`
    else status = 'จบรอบ!'
    text(ctx, status, W / 2, y + 92, 28, '#ffffff', 'center', 700)

    // goal bars
    this.goalBar(ctx, x + 24, y + 62, 200, '❤️ หัวใจ', this.likes % Math.max(1, this.settings.likeGoal), this.settings.likeGoal, '#ff5c8a')
    this.goalBar(ctx, x + w - 224, y + 62, 200, '🎁 เหรียญ', this.coins, this.settings.giftGoal, '#ffd166')

    // command cards
    const cmds: [string, string][] = [
      ['1-4', 'เลือกเรือ'],
      ['พาย', 'จ้ำพาย'],
      ['ฟัน', 'ฟันสิ่งกีดขวาง'],
      ['กลอง', 'ตีพร้อมกัน x2'],
      ['❤️', 'กดหัวใจ = แรงพาย'],
      ['🎁', 'เทอร์โบ/โยนผักตบ'],
    ]
    const cw = (w - 48 - 20) / 3
    cmds.forEach(([k, d], i) => {
      const cx = x + 24 + (i % 3) * (cw + 10)
      const cy = y + 128 + Math.floor(i / 3) * 76
      ctx.fillStyle = 'rgba(255,255,255,.08)'
      roundRect(ctx, cx, cy, cw, 64, 16)
      ctx.fill()
      ctx.fillStyle = '#ffd166'
      roundRect(ctx, cx + 8, cy + 10, 82, 44, 12)
      ctx.fill()
      text(ctx, k, cx + 49, cy + 33, 28, '#2a0b4d', 'center', 900)
      text(ctx, d, cx + 100, cy + 33, 25, '#ffffff', 'left', 700)
    })

    // team scoreboard strip
    const sy = y + h + 14
    const sw = (w - 30) / 4
    this.teams.forEach((tm, i) => {
      const sx = x + i * (sw + 10)
      ctx.fillStyle = tm.dark
      ctx.strokeStyle = tm.color
      ctx.lineWidth = 3
      roundRect(ctx, sx, sy, sw, 70, 16)
      ctx.fill()
      ctx.stroke()
      text(ctx, `${tm.keys[0]} ${tm.name}`, sx + sw / 2, sy + 22, 24, '#fff', 'center', 900)
      const crewN = [...this.players.values()].filter((p) => p.team === tm.idx && t - p.lastSeen < 120).length
      text(ctx, `🏆${tm.wins}  👥${crewN}  ${Math.floor(Math.min(100, tm.progress))}%`, sx + sw / 2, sy + 50, 21, tm.color, 'center', 800)
    })
  }

  private goalBar(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, label: string, v: number, max: number, color: string) {
    text(ctx, label, x, y - 2, 20, '#fff', 'left', 700)
    ctx.fillStyle = 'rgba(255,255,255,.15)'
    roundRect(ctx, x, y + 14, w, 14, 7)
    ctx.fill()
    ctx.fillStyle = color
    roundRect(ctx, x, y + 14, Math.max(14, (w * Math.min(v, max)) / Math.max(1, max)), 14, 7)
    ctx.fill()
    text(ctx, `${Math.floor(v)}/${max}`, x + w, y - 2, 18, '#ddd', 'right', 600)
  }

  private drawBottom(ctx: CanvasRenderingContext2D) {
    // Event feed + all-time top paddlers, kept above TikTok's bottom UI.
    const y = RIVER_BOTTOM + 30
    ctx.fillStyle = 'rgba(0,0,0,.45)'
    roundRect(ctx, 60, y, W - 120, 300, 24)
    ctx.fill()
    text(ctx, 'ฝีพายเทพประจำไลฟ์', 90, y + 32, 26, '#ffd166', 'left', 900)
    this.topAllTime(5).forEach((p, i) => {
      const yy = y + 76 + i * 46
      this.avatar(ctx, p, 110, yy, 18, this.teams[p.team].color)
      text(ctx, `${i + 1}. ${short(p.name, 12)}`, 140, yy, 24, '#fff', 'left', 700)
      text(ctx, `${Math.floor(p.totalScore)}`, 500, yy, 24, this.teams[p.team].color, 'right', 900)
    })
    text(ctx, 'เหตุการณ์ล่าสุด', 560, y + 32, 26, '#ffd166', 'left', 900)
    this.feed.slice(-5).forEach((f, i) => {
      text(ctx, short(f.text, 26), 560, y + 76 + i * 46, 22, f.color, 'left', 700)
    })
  }

  private drawBanners(ctx: CanvasRenderingContext2D, t: number) {
    this.banners.forEach((b, i) => {
      const age = t - b.born
      const a = Math.min(1, age * 5, (b.dur - age) * 4)
      const scale = 0.85 + 0.15 * Math.min(1, age * 6)
      const y = 1000 + i * 150
      ctx.save()
      ctx.globalAlpha = Math.max(0, a)
      ctx.translate(W / 2, y)
      ctx.scale(scale, scale)
      ctx.fillStyle = 'rgba(10,5,30,.85)'
      ctx.strokeStyle = b.color
      ctx.lineWidth = 5
      roundRect(ctx, -460, -62, 920, b.sub ? 128 : 90, 30)
      ctx.fill()
      ctx.stroke()
      text(ctx, b.text, 0, -18, 46, b.color, 'center', 900, true)
      if (b.sub) text(ctx, b.sub, 0, 34, 30, '#fff', 'center', 700)
      ctx.restore()
    })
  }

  private drawWinner(ctx: CanvasRenderingContext2D, t: number) {
    const tm = this.winner
    if (!tm) return
    const age = t - this.phaseStart
    ctx.save()
    ctx.globalAlpha = Math.min(1, age * 3)
    ctx.fillStyle = 'rgba(0,0,0,.6)'
    ctx.fillRect(0, RIVER_TOP, W, RIVER_BOTTOM - RIVER_TOP)
    // confetti
    for (let i = 0; i < 80; i++) {
      const x = (i * 137 + age * 40 * ((i % 3) + 1)) % W
      const y = RIVER_TOP + ((i * 89 + age * 260) % (RIVER_BOTTOM - RIVER_TOP))
      ctx.fillStyle = ['#ff3b5c', '#2fb8ff', '#3ddc84', '#ffc531', '#fff'][i % 5]
      ctx.fillRect(x, y, 10, 16)
    }
    text(ctx, '🏆 ผู้ชนะรอบนี้ 🏆', W / 2, 780, 46, '#fff', 'center', 900, true)
    text(ctx, tm.name, W / 2, 870, 96, tm.color, 'center', 900, true)
    text(ctx, 'ฝีพายยอดเยี่ยม', W / 2, 980, 34, '#ffd166', 'center', 800, true)
    const medals = ['🥇', '🥈', '🥉']
    this.podium.forEach((p, i) => {
      const yy = 1060 + i * 100
      this.avatar(ctx, p, W / 2 - 220, yy, 38, tm.color)
      text(ctx, `${medals[i]} ${short(p.name, 14)}`, W / 2 - 160, yy, 40, '#fff', 'left', 800, true)
    })
    text(ctx, `รอบใหม่ใน ${Math.max(0, Math.ceil(10 - age))} วิ`, W / 2, 1400, 30, '#ddd', 'center', 700)
    ctx.restore()
  }
}

// ---------- helpers ----------

function short(s: string, n = 8) {
  const chars = [...s]
  return chars.length > n ? chars.slice(0, n).join('') + '…' : s
}

function fmtTime(s: number) {
  const m = Math.floor(s / 60)
  const r = Math.floor(s % 60)
  return `${m}:${r.toString().padStart(2, '0')}`
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, Math.min(r, h / 2, w / 2))
}

function text(
  ctx: CanvasRenderingContext2D,
  s: string,
  x: number,
  y: number,
  size: number,
  color: string,
  align: CanvasTextAlign = 'left',
  weight = 700,
  outline = false,
) {
  ctx.font = `${weight} ${size}px "Noto Sans Thai", "Sarabun", "Leelawadee UI", Tahoma, sans-serif`
  ctx.textAlign = align
  if (outline) {
    ctx.lineJoin = 'round'
    ctx.lineWidth = Math.max(4, size / 7)
    ctx.strokeStyle = 'rgba(0,0,0,.85)'
    ctx.strokeText(s, x, y)
  }
  ctx.fillStyle = color
  ctx.fillText(s, x, y)
}
