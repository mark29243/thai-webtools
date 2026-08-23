'use client'

import { useState, useEffect, useRef } from 'react'
import { AdSlot } from '@/components/AdSlot'
import { Search, Trophy, Calendar, Loader2, AlertCircle, Coins, PartyPopper, Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface Prize {
  id: string
  name: string
  reward: string
  amount: number
  number: string[]
}

interface LotteryData {
  response: {
    date: string
    endpoint: string
    prizes: Prize[]
  }
}

interface WinResult {
  ticket: string
  name: string
  reward: string
  matchedNumber: string
}

function TicketBlock({ value, onChange, onEnter }: { value: string, onChange: (v: string) => void, onEnter?: () => void }) {
  const inputs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (i: number, val: string) => {
    const digits = val.replace(/\D/g, '')
    if (digits.length > 1) {
      onChange(digits.slice(0, 6))
      inputs.current[Math.min(digits.length, 5)]?.focus()
      return
    }

    const newArr = (value || '').split('')
    newArr[i] = digits.slice(-1)
    while(newArr.length < 6) newArr.push('')
    const newVal = newArr.join('').slice(0, 6)
    onChange(newVal)

    if (digits && i < 5) {
      inputs.current[i + 1]?.focus()
    }
  }

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !value[i] && i > 0) {
      inputs.current[i - 1]?.focus()
    } else if (e.key === 'Enter') {
      onEnter?.()
    } else if (e.key === 'ArrowLeft' && i > 0) {
      inputs.current[i - 1]?.focus()
    } else if (e.key === 'ArrowRight' && i < 5) {
      inputs.current[i + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text')
    const digits = pasted.replace(/\D/g, '')
    if (digits.length > 0) {
      e.preventDefault()
      onChange(digits.slice(0, 6))
      inputs.current[Math.min(digits.length, 5)]?.focus()
    }
  }

  return (
    <div className="flex justify-center gap-1 sm:gap-3 w-full">
      {[0, 1, 2, 3, 4, 5].map(i => (
        <input
          key={i}
          ref={el => { inputs.current[i] = el }}
          type="text"
          inputMode="numeric"
          value={value[i] || ''}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className="w-10 h-14 sm:w-14 sm:h-16 text-center text-2xl sm:text-3xl font-bold rounded-xl border-2 border-blue-200 dark:border-blue-900/50 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 transition-all outline-none shadow-sm"
          placeholder="-"
        />
      ))}
    </div>
  )
}

export default function LotteryPage() {
  const [data, setData] = useState<LotteryData | null>(null)
  const [loading, setLoading] = useState(true)
  const [tickets, setTickets] = useState<string[]>([''])
  const [results, setResults] = useState<WinResult[] | null>(null)
  const [checkedTickets, setCheckedTickets] = useState<string[]>([])

  useEffect(() => {
    fetch('/api/lottery')
      .then(res => res.json())
      .then(data => {
        setData(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        toast.error('ไม่สามารถดึงข้อมูลสลากกินแบ่งรัฐบาลได้')
        setLoading(false)
      })
  }, [])

  const handleCheck = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    
    const validTickets = Array.from(new Set(tickets.filter(t => /^\d{6}$/.test(t))))
    
    if (validTickets.length === 0) {
      toast.error('กรุณากรอกตัวเลข 6 หลักให้ถูกต้องอย่างน้อย 1 ใบ')
      return
    }

    if (!data) return

    const won: WinResult[] = []

    validTickets.forEach(ticket => {
      data.response.prizes.forEach(prize => {
        if (prize.id === 'runningNumberFrontThree') {
          const front3 = ticket.substring(0, 3)
          if (prize.number.includes(front3)) won.push({ ticket, name: prize.name, reward: prize.reward, matchedNumber: front3 })
        } else if (prize.id === 'runningNumberBackThree') {
          const back3 = ticket.substring(3, 6)
          if (prize.number.includes(back3)) won.push({ ticket, name: prize.name, reward: prize.reward, matchedNumber: back3 })
        } else if (prize.id === 'runningNumberBackTwo') {
          const back2 = ticket.substring(4, 6)
          if (prize.number.includes(back2)) won.push({ ticket, name: prize.name, reward: prize.reward, matchedNumber: back2 })
        } else {
          if (prize.number.includes(ticket)) won.push({ ticket, name: prize.name, reward: prize.reward, matchedNumber: ticket })
        }
      })
    })

    setCheckedTickets(validTickets)
    setResults(won)
    
    if (won.length > 0) {
      toast.success(`ยินดีด้วย! คุณถูกรางวัล ${won.length} รายการ`)
    } else {
      toast('เสียใจด้วย ไว้ลุ้นใหม่นะ', { icon: '😢' })
    }
  }

  const handlePasteGlobal = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text')
    const matches = pasted.match(/\b\d{6}\b/g)
    if (matches && matches.length > 0) {
      e.preventDefault()
      setTickets(matches)
      toast.success(`วางเลขสลากทั้งหมด ${matches.length} ใบเรียบร้อย`)
    }
  }

  const getPrizeByPrefix = (prefix: string) => {
    return data?.response.prizes.find(p => p.id === prefix)?.number || []
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">ตรวจสลากกินแบ่งรัฐบาล (Lottery)</h1>
        <p className="text-gray-600 dark:text-gray-400">ตรวจหวยรวดเร็ว อัปเดตล่าสุดตรงจากกองสลากฯ เช็กง่ายได้เงินจริง</p>
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 md:p-10 rounded-3xl shadow-sm border dark:border-gray-800 space-y-8">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-600" />
            <p>กำลังโหลดข้อมูลรางวัลงวดล่าสุด...</p>
          </div>
        ) : !data ? (
          <div className="flex flex-col items-center justify-center py-20 text-red-500">
            <AlertCircle className="w-10 h-10 mb-4" />
            <p>ไม่สามารถโหลดข้อมูลได้ในขณะนี้ กรุณาลองใหม่ภายหลัง</p>
          </div>
        ) : (
          <>
            <div className="text-center space-y-2">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200 flex items-center justify-center gap-2">
                <Calendar className="w-6 h-6 text-blue-600" />
                ผลงวดประจำวันที่ {data.response.date}
              </h2>
            </div>

            {/* Check Form */}
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleCheck} className="space-y-6" onPaste={handlePasteGlobal}>
                <div className="text-center text-sm text-gray-500 mb-2">
                  (สามารถก๊อปปี้ตัวเลขสลากหลายใบมาวางได้เลย ระบบจะแยกให้ตามช่องอัตโนมัติ)
                </div>
                
                <div className="space-y-4">
                  {tickets.map((t, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row items-center justify-center gap-4 relative animate-in fade-in duration-200">
                      <div className="absolute -left-4 md:-left-12 text-gray-400 font-medium text-sm hidden sm:block whitespace-nowrap">
                        ใบที่ {idx + 1}
                      </div>
                      <TicketBlock 
                        value={t} 
                        onChange={(v) => {
                          const nt = [...tickets]
                          nt[idx] = v
                          setTickets(nt)
                        }}
                        onEnter={handleCheck}
                      />
                      {tickets.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => setTickets(tickets.filter((_, i) => i !== idx))} 
                          className="absolute -right-2 sm:-right-10 text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition-colors"
                          title="ลบสลากใบนี้"
                        >
                          <Trash2 className="w-5 h-5"/>
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-center pt-2">
                  <button 
                    type="button" 
                    onClick={() => setTickets([...tickets, ''])} 
                    className="text-blue-600 font-bold flex items-center gap-1 hover:bg-blue-50 px-5 py-2.5 rounded-xl transition-colors border-2 border-transparent hover:border-blue-100"
                  >
                    <Plus className="w-5 h-5"/> เพิ่มสลาก
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t dark:border-gray-800">
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    จำนวนที่พร้อมตรวจ: <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">{tickets.filter(t => /^\d{6}$/.test(t)).length}</span> ใบ
                  </div>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center transition-colors shadow-sm gap-2 text-lg"
                  >
                    <Search className="w-6 h-6" /> ตรวจรางวัล
                  </button>
                </div>
              </form>
            </div>

            {/* Result Display */}
            {results !== null && (
              <div className="max-w-xl mx-auto mt-6 animate-in slide-in-from-bottom-4 fade-in duration-300">
                {results.length > 0 ? (
                  <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 text-green-700 dark:text-green-400 p-6 rounded-2xl space-y-4 shadow-sm">
                    <div className="text-center">
                      <PartyPopper className="w-12 h-12 mx-auto animate-bounce text-green-500 mb-2" />
                      <h3 className="text-2xl font-black text-green-600 dark:text-green-400">ยินดีด้วย! คุณถูกรางวัล</h3>
                      <p className="text-green-700/80 dark:text-green-400/80 font-medium mt-1">
                        ตรวจทั้งหมด {checkedTickets.length} ใบ ถูกรางวัล {results.length} รายการ
                      </p>
                    </div>
                    
                    <div className="space-y-3 mt-4">
                      {results.map((r, idx) => (
                        <div key={idx} className="bg-white dark:bg-green-900/40 p-4 rounded-xl border border-green-200 dark:border-green-800 flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-sm gap-2">
                          <div>
                            <div className="text-sm font-medium text-green-600/80 dark:text-green-400/80 mb-1">เลขสลาก: <span className="font-bold text-lg text-green-700 dark:text-green-300">{r.ticket}</span></div>
                            <div className="font-bold text-lg">{r.name} <span className="text-sm font-normal text-green-600/70">(เลขที่ออก {r.matchedNumber})</span></div>
                          </div>
                          <div className="font-black text-xl text-green-600 dark:text-green-400 flex items-center gap-1">
                            {Number(r.reward).toLocaleString()} <Coins className="w-5 h-5"/>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="pt-4 text-xl font-black border-t border-green-200 dark:border-green-800 flex justify-between items-center mt-4">
                      <span>รวมเงินรางวัล:</span>
                      <span>
                        {results.reduce((acc, curr) => acc + Number(curr.reward), 0).toLocaleString()} บาท
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 p-8 rounded-2xl text-center space-y-2">
                    <div className="text-4xl mb-4">😢</div>
                    <h3 className="text-xl font-bold">เสียใจด้วย คุณไม่ถูกรางวัล</h3>
                    <p>ตรวจแล้วทั้งหมด {checkedTickets.length} ใบ งวดหน้าลองใหม่นะ ขอให้โชคดี!</p>
                  </div>
                )}
              </div>
            )}

            {/* Major Prizes Board */}
            <div className="pt-8 mt-8 border-t dark:border-gray-800">
              <h3 className="text-xl font-bold text-center mb-6 text-gray-800 dark:text-gray-200 flex items-center justify-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" /> สรุปผลรางวัล
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* 1st Prize */}
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 p-6 rounded-2xl border border-yellow-200 dark:border-yellow-900/30 text-center">
                  <p className="font-semibold text-yellow-700 dark:text-yellow-500 mb-2">รางวัลที่ 1 (6,000,000 บาท)</p>
                  <p className="text-4xl font-black text-yellow-600 dark:text-yellow-400 tracking-[0.2em]">
                    {getPrizeByPrefix('prizeFirst')[0] || '------'}
                  </p>
                </div>
                
                {/* 2 Digits */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 p-6 rounded-2xl border border-blue-200 dark:border-blue-900/30 text-center">
                  <p className="font-semibold text-blue-700 dark:text-blue-400 mb-2">เลขท้าย 2 ตัว (2,000 บาท)</p>
                  <p className="text-4xl font-black text-blue-600 dark:text-blue-400 tracking-[0.2em]">
                    {getPrizeByPrefix('runningNumberBackTwo')[0] || '--'}
                  </p>
                </div>
              </div>

              {/* 3 Digits */}
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 text-center">
                  <p className="font-semibold text-gray-600 dark:text-gray-400 mb-3">เลขหน้า 3 ตัว (4,000 บาท)</p>
                  <div className="flex justify-center gap-6">
                    {getPrizeByPrefix('runningNumberFrontThree').map((num, i) => (
                      <p key={i} className="text-2xl font-bold text-gray-800 dark:text-gray-200 tracking-[0.15em]">{num}</p>
                    ))}
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 text-center">
                  <p className="font-semibold text-gray-600 dark:text-gray-400 mb-3">เลขท้าย 3 ตัว (4,000 บาท)</p>
                  <div className="flex justify-center gap-6">
                    {getPrizeByPrefix('runningNumberBackThree').map((num, i) => (
                      <p key={i} className="text-2xl font-bold text-gray-800 dark:text-gray-200 tracking-[0.15em]">{num}</p>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-gray-600 dark:text-gray-400 mb-4">รางวัลข้างเคียงรางวัลที่ 1 (100,000 บาท)</h4>
                <div className="flex flex-wrap gap-4">
                  {getPrizeByPrefix('prizeFirstNear').map((num, i) => (
                    <span key={i} className="text-lg font-bold text-gray-800 dark:text-gray-200 tracking-wider bg-white dark:bg-gray-900 px-4 py-2 rounded-lg border dark:border-gray-700 shadow-sm">{num}</span>
                  ))}
                </div>
              </div>

              <div className="mt-6 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-gray-600 dark:text-gray-400 mb-4">รางวัลที่ 2 (200,000 บาท)</h4>
                <div className="flex flex-wrap gap-4">
                  {getPrizeByPrefix('prizeSecond').map((num, i) => (
                    <span key={i} className="text-lg font-bold text-gray-800 dark:text-gray-200 tracking-wider bg-white dark:bg-gray-900 px-4 py-2 rounded-lg border dark:border-gray-700 shadow-sm">{num}</span>
                  ))}
                </div>
              </div>

              <div className="mt-6 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-gray-600 dark:text-gray-400 mb-4">รางวัลที่ 3 (80,000 บาท)</h4>
                <div className="flex flex-wrap gap-4">
                  {getPrizeByPrefix('prizeThird').map((num, i) => (
                    <span key={i} className="text-lg font-bold text-gray-800 dark:text-gray-200 tracking-wider bg-white dark:bg-gray-900 px-4 py-2 rounded-lg border dark:border-gray-700 shadow-sm">{num}</span>
                  ))}
                </div>
              </div>

              <div className="mt-6 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-gray-600 dark:text-gray-400 mb-4">รางวัลที่ 4 (40,000 บาท)</h4>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {getPrizeByPrefix('prizeFourth').map((num, i) => (
                    <span key={i} className="text-center font-bold text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900 px-2 py-2 rounded-lg border dark:border-gray-700 shadow-sm">{num}</span>
                  ))}
                </div>
              </div>

              <div className="mt-6 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-gray-600 dark:text-gray-400 mb-4">รางวัลที่ 5 (20,000 บาท)</h4>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                  {getPrizeByPrefix('prizeFifth').map((num, i) => (
                    <span key={i} className="text-center font-bold text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900 px-2 py-2 rounded-lg border dark:border-gray-700 shadow-sm">{num}</span>
                  ))}
                </div>
              </div>
              
            </div>
          </>
        )}
      </div>

      <AdSlot />
    </div>
  )
}
