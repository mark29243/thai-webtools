'use client'

import { useState } from 'react'
import { AdSlot } from '@/components/AdSlot'
import confetti from 'canvas-confetti'

export default function RandomPickerPage() {
  const [names, setNames] = useState('สมชาย\nสมศรี\nสมศักดิ์\nสมหมาย\nมานี\nปิติ\nชูใจ')
  const [winner, setWinner] = useState<string | null>(null)
  const [isSpinning, setIsSpinning] = useState(false)

  const handlePick = () => {
    const list = names.split('\n').map(n => n.trim()).filter(n => n.length > 0)
    if (list.length === 0) return

    setIsSpinning(true)
    setWinner(null)

    let counter = 0
    const maxSpins = 20
    const interval = setInterval(() => {
      setWinner(list[Math.floor(Math.random() * list.length)])
      counter++
      if (counter >= maxSpins) {
        clearInterval(interval)
        const finalWinner = list[Math.floor(Math.random() * list.length)]
        setWinner(finalWinner)
        setIsSpinning(false)
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#2563eb', '#3b82f6', '#60a5fa']
        })
      }
    }, 100)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Random Name Picker</h1>
        <p className="text-gray-600 dark:text-gray-400">สุ่มรายชื่อ ผู้โชคดี ผู้ชนะ หรือสุ่มจับฉลาก</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border dark:border-gray-800 space-y-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            รายชื่อ (บรรทัดละ 1 ชื่อ)
          </label>
          <textarea
            className="w-full h-64 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 resize-none break-words"
            value={names}
            onChange={(e) => setNames(e.target.value)}
            placeholder="พิมพ์รายชื่อที่นี่..."
          />
          <button
            onClick={handlePick}
            disabled={isSpinning || !names.trim()}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all disabled:opacity-50 text-lg"
          >
            {isSpinning ? 'กำลังสุ่ม...' : '🎉 สุ่มเลย!'}
          </button>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/30 flex flex-col items-center justify-center min-h-[300px]">
          <h2 className="text-sm font-semibold text-blue-800 dark:text-blue-300 uppercase tracking-wider mb-6">ผู้ที่ถูกเลือก</h2>
          
          {winner ? (
            <div className={`text-center transition-all ${isSpinning ? 'scale-90 opacity-70' : 'scale-110'}`}>
              <div className="text-4xl sm:text-5xl font-extrabold text-blue-600 dark:text-blue-400 break-words max-w-full px-4 text-center">
                {winner}
              </div>
            </div>
          ) : (
            <div className="text-gray-400 dark:text-gray-500 text-lg">
              รอการสุ่ม...
            </div>
          )}
        </div>
      </div>

      <AdSlot />
    </div>
  )
}
