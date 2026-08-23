'use client'

import { useState, useEffect } from 'react'
import { AdSlot } from '@/components/AdSlot'
import { Search, Trophy, Calendar, Loader2, AlertCircle, Coins, PartyPopper } from 'lucide-react'
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
  name: string
  reward: string
  matchedNumber: string
}

export default function LotteryPage() {
  const [data, setData] = useState<LotteryData | null>(null)
  const [loading, setLoading] = useState(true)
  const [inputNumber, setInputNumber] = useState('')
  const [results, setResults] = useState<WinResult[] | null>(null)

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
    
    if (!inputNumber || inputNumber.length !== 6 || !/^\d+$/.test(inputNumber)) {
      toast.error('กรุณากรอกตัวเลขให้ครบ 6 หลัก')
      return
    }

    if (!data) return

    const won: WinResult[] = []

    data.response.prizes.forEach(prize => {
      if (prize.id === 'runningNumberFrontThree') {
        const front3 = inputNumber.substring(0, 3)
        if (prize.number.includes(front3)) {
          won.push({ name: prize.name, reward: prize.reward, matchedNumber: front3 })
        }
      } else if (prize.id === 'runningNumberBackThree') {
        const back3 = inputNumber.substring(3, 6)
        if (prize.number.includes(back3)) {
          won.push({ name: prize.name, reward: prize.reward, matchedNumber: back3 })
        }
      } else if (prize.id === 'runningNumberBackTwo') {
        const back2 = inputNumber.substring(4, 6)
        if (prize.number.includes(back2)) {
          won.push({ name: prize.name, reward: prize.reward, matchedNumber: back2 })
        }
      } else {
        if (prize.number.includes(inputNumber)) {
          won.push({ name: prize.name, reward: prize.reward, matchedNumber: inputNumber })
        }
      }
    })

    setResults(won)
    
    if (won.length > 0) {
      toast.success('ยินดีด้วย! คุณถูกรางวัล')
    } else {
      toast('เสียใจด้วย ไว้ลุ้นใหม่นะ', { icon: '😢' })
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
            <div className="max-w-xl mx-auto">
              <form onSubmit={handleCheck} className="relative">
                <input
                  type="text"
                  maxLength={6}
                  value={inputNumber}
                  onChange={(e) => setInputNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="กรอกเลขสลาก 6 หลัก"
                  className="w-full text-center text-3xl tracking-[0.5em] font-bold p-6 pr-32 bg-gray-50 dark:bg-gray-800 border-2 border-blue-200 dark:border-blue-900/50 focus:border-blue-500 rounded-2xl outline-none transition-colors text-gray-800 dark:text-gray-100 placeholder:text-gray-300 dark:placeholder:text-gray-600"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-3 bottom-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center transition-colors shadow-sm"
                >
                  <Search className="w-6 h-6" />
                </button>
              </form>
            </div>

            {/* Result Display */}
            {results !== null && (
              <div className="max-w-xl mx-auto mt-6 animate-in slide-in-from-bottom-4 fade-in duration-300">
                {results.length > 0 ? (
                  <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 text-green-700 dark:text-green-400 p-6 rounded-2xl text-center space-y-4 shadow-sm">
                    <PartyPopper className="w-12 h-12 mx-auto animate-bounce text-green-500" />
                    <h3 className="text-2xl font-black text-green-600 dark:text-green-400">ยินดีด้วย! คุณถูกรางวัล</h3>
                    <div className="space-y-2">
                      {results.map((r, idx) => (
                        <div key={idx} className="bg-white dark:bg-green-900/40 p-3 rounded-xl border border-green-200 dark:border-green-800 flex justify-between items-center shadow-sm">
                          <span className="font-bold text-lg">{r.name}</span>
                          <span className="font-black text-xl text-green-600 dark:text-green-400 flex items-center gap-1">
                            {Number(r.reward).toLocaleString()} <Coins className="w-4 h-4"/>
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-2 text-xl font-black border-t border-green-200 dark:border-green-800 mt-4 flex justify-between items-center">
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
                    <p>งวดหน้าลองใหม่นะ ขอให้โชคดี!</p>
                  </div>
                )}
              </div>
            )}

            {/* Major Prizes Board */}
            <div className="pt-8 mt-8 border-t dark:border-gray-800">
              <h3 className="text-xl font-bold text-center mb-6 text-gray-800 dark:text-gray-200 flex items-center justify-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" /> สรุปผลรางวัลใหญ่
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
              
            </div>
          </>
        )}
      </div>

      <AdSlot />
    </div>
  )
}
