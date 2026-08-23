'use client'

import { useState, useEffect } from 'react'
import { AdSlot } from '@/components/AdSlot'
import confetti from 'canvas-confetti'

interface Horse {
  id: number
  name: string
  progress: number
}

export default function RandomPickerPage() {
  const [names, setNames] = useState('สมชาย\nสมศรี\nสมศักดิ์\nสมหมาย\nมานี\nปิติ\nชูใจ')
  const [winner, setWinner] = useState<string | null>(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [horses, setHorses] = useState<Horse[]>([])
  const [hasRaced, setHasRaced] = useState(false)

  // Initialize horses when names change or on mount
  useEffect(() => {
    if (!isSpinning && !hasRaced) {
      const list = names.split('\n').map(n => n.trim()).filter(n => n.length > 0)
      setHorses(list.map((name, i) => ({ id: i, name, progress: 0 })))
    }
  }, [names, isSpinning, hasRaced])

  const handlePick = () => {
    const list = names.split('\n').map(n => n.trim()).filter(n => n.length > 0)
    if (list.length === 0) return

    setHorses(list.map((name, i) => ({ id: i, name, progress: 0 })))
    setIsSpinning(true)
    setWinner(null)
    setHasRaced(true)
  }

  useEffect(() => {
    if (!isSpinning) return
    const interval = setInterval(() => {
      setHorses(prev => {
        let hasWinner = false
        let winnerName = ''
        const next = prev.map(h => {
          if (hasWinner) return h
          const step = Math.random() * 1.5 + 0.2 // ~4-6 seconds race
          const newProgress = Math.min(100, h.progress + step)
          if (newProgress >= 100 && !hasWinner) {
            hasWinner = true
            winnerName = h.name
          }
          return { ...h, progress: newProgress }
        })

        if (hasWinner) {
          clearInterval(interval)
          setTimeout(() => {
            setIsSpinning(false)
            setWinner(winnerName)
            confetti({
              particleCount: 200,
              spread: 100,
              origin: { y: 0.5 },
              colors: ['#16a34a', '#22c55e', '#4ade80']
            })
          }, 600)
        }
        return next
      })
    }, 50)
    return () => clearInterval(interval)
  }, [isSpinning])

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Random Name Picker</h1>
        <p className="text-gray-600 dark:text-gray-400">สุ่มรายชื่อ แข่งม้าหาสุดยอดผู้โชคดี! 🐎</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border dark:border-gray-800 space-y-4 flex flex-col min-h-[400px]">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            รายชื่อ (บรรทัดละ 1 ชื่อ)
          </label>
          <textarea
            className="w-full flex-1 min-h-[250px] p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500 resize-none break-words"
            value={names}
            onChange={(e) => {
              setNames(e.target.value)
              setHasRaced(false)
            }}
            placeholder="พิมพ์รายชื่อที่นี่..."
          />
          <button
            onClick={handlePick}
            disabled={isSpinning || !names.trim()}
            className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-md transition-all disabled:opacity-50 text-lg flex items-center justify-center gap-2"
          >
            {isSpinning ? 'กำลังแข่ง...' : '🏁 ปล่อยม้า!'}
          </button>
        </div>

        <div className="lg:col-span-8 bg-green-50 dark:bg-green-900/10 p-2 sm:p-6 rounded-2xl border border-green-200 dark:border-green-900/30 min-h-[500px] flex flex-col relative overflow-hidden shadow-inner">
          {winner && !isSpinning ? (
            <div className="flex-1 flex flex-col items-center justify-center animate-in zoom-in duration-300 bg-white/90 dark:bg-gray-900/90 rounded-2xl p-8 z-20 backdrop-blur-sm shadow-2xl border border-green-200 dark:border-green-800 m-4">
              <h2 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-6 flex items-center gap-2">
                <span className="text-4xl">🏆</span> ผู้ชนะการแข่งขัน <span className="text-4xl">🏆</span>
              </h2>
              <div className="text-5xl sm:text-7xl font-black text-green-600 dark:text-green-400 text-center break-words max-w-full drop-shadow-sm">
                {winner}
              </div>
              <button 
                onClick={() => setWinner(null)} 
                className="mt-10 px-6 py-3 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-xl text-gray-800 dark:text-gray-200 font-bold transition-colors"
              >
                ดูสนามแข่งอีกครั้ง
              </button>
            </div>
          ) : (
            <div className="flex-1 w-full overflow-y-auto overflow-x-hidden relative pr-2 sm:pr-4 rounded-xl">
              {/* Finish Line */}
              <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-12 border-r-8 border-dashed border-red-500 z-0 opacity-80 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.5)_10px,rgba(255,255,255,0.5)_20px)] dark:bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,0,0,0.5)_10px,rgba(0,0,0,0.5)_20px)]"></div>
              <div className="absolute right-0 top-0 bottom-0 w-2 bg-red-600 z-0"></div>
              
              <div className="space-y-1 sm:space-y-2 py-4">
                {horses.map((h, i) => (
                  <div key={i} className="relative h-14 sm:h-16 flex items-center w-full z-10 border-b-2 border-green-200/50 dark:border-green-800/50 bg-green-100/40 dark:bg-green-800/20 rounded-l-full">
                    {/* Lane Number */}
                    <div className="w-8 sm:w-10 flex-shrink-0 text-center font-black text-green-700/40 dark:text-green-300/40 text-sm sm:text-base">{i + 1}</div>
                    
                    {/* Track */}
                    <div className="flex-1 relative h-full">
                      <div 
                        className="absolute top-1/2 flex flex-col items-center"
                        style={{ 
                          left: `${h.progress}%`,
                          transform: `translate(-${h.progress}%, -50%)`,
                          transition: isSpinning ? 'left 50ms linear, transform 50ms linear' : 'none',
                          width: 'max-content'
                        }}
                      >
                        <span className="text-4xl sm:text-5xl filter drop-shadow-md" style={{ transform: 'scaleX(-1)' }}>🐎</span>
                        <span className="text-[10px] sm:text-xs font-bold bg-white/95 dark:bg-gray-800/95 px-2 py-0.5 rounded-md shadow text-gray-800 dark:text-gray-100 -mt-2 max-w-[80px] sm:max-w-[120px] truncate border border-gray-200 dark:border-gray-700">
                          {h.name}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {horses.length === 0 && (
                  <div className="flex h-full items-center justify-center text-green-600/50 dark:text-green-400/50 font-medium py-20">
                    พิมพ์รายชื่อเพื่อพาม้าเข้าช่องสตาร์ท
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <AdSlot />
    </div>
  )
}
