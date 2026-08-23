'use client'
import { useState, useRef } from 'react'
import { AdSlot } from '@/components/AdSlot'
import { Activity, Gauge, Play } from 'lucide-react'

export default function SpeedTestPage() {
  const [status, setStatus] = useState<'idle' | 'testing' | 'done'>('idle')
  const [speedMbps, setSpeedMbps] = useState<number | null>(null)
  const [progress, setProgress] = useState(0)

  const testSpeed = () => {
    setStatus('testing')
    setSpeedMbps(0)
    setProgress(0)
    
    // We will download a large image 3 times to average
    // Using a known Wikimedia image (approx 1.25 MB)
    // 1.25 MB = 10 Megabits
    const imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Pleiades_large.jpg'
    const fileSizeBits = 1.25 * 1024 * 1024 * 8 
    const maxIterations = 3
    let currentIteration = 0
    let totalBits = 0
    let totalTimeMs = 0

    const loadNext = () => {
      const startTime = performance.now()
      const img = new Image()
      img.onload = () => {
        const endTime = performance.now()
        const duration = endTime - startTime
        
        totalBits += fileSizeBits
        totalTimeMs += duration
        currentIteration++
        
        setProgress(Math.round((currentIteration / maxIterations) * 100))
        
        // Calculate current avg speed in Mbps
        const currentSpeed = (totalBits / (totalTimeMs / 1000)) / 1000000
        setSpeedMbps(currentSpeed)

        if (currentIteration < maxIterations) {
          loadNext()
        } else {
          setStatus('done')
        }
      }
      img.onerror = () => {
        // Fallback if failed
        setStatus('idle')
        alert('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์ทดสอบ')
      }
      // Add cache buster
      img.src = `${imageUrl}?cache=${Math.random()}`
    }

    loadNext()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Internet Speed Test</h1>
        <p className="text-gray-600 dark:text-gray-400">เช็กความเร็วเน็ตของคุณ (Download Speed) อย่างง่ายบนเบราว์เซอร์</p>
      </div>

      <div className="bg-white dark:bg-gray-900 p-8 sm:p-12 rounded-3xl shadow-sm border dark:border-gray-800 text-center flex flex-col items-center">
        
        <div className="relative w-48 h-48 sm:w-64 sm:h-64 mb-8 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50" cy="50" r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              className="text-gray-100 dark:text-gray-800"
            />
            <circle
              cx="50" cy="50" r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              className="text-blue-500 transition-all duration-300 ease-out"
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * progress) / 100}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {speedMbps !== null ? (
              <>
                <span className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-gray-100">
                  {speedMbps.toFixed(1)}
                </span>
                <span className="text-gray-500 font-medium">Mbps</span>
              </>
            ) : (
              <Gauge className="w-16 h-16 text-gray-300 dark:text-gray-700" />
            )}
          </div>
        </div>

        {status === 'idle' && (
          <button 
            onClick={testSpeed}
            className="flex items-center gap-2 px-10 py-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <Play className="w-6 h-6 fill-current" /> เริ่มทดสอบ (GO)
          </button>
        )}

        {status === 'testing' && (
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium animate-pulse">
            <Activity className="w-5 h-5" /> กำลังทดสอบความเร็ว...
          </div>
        )}

        {status === 'done' && (
          <div className="space-y-4">
            <div className="text-green-600 dark:text-green-400 font-bold text-xl flex items-center gap-2 justify-center">
              <Activity className="w-6 h-6" /> ทดสอบเสร็จสิ้น
            </div>
            <button 
              onClick={testSpeed}
              className="text-gray-500 hover:text-blue-600 font-medium underline underline-offset-4"
            >
              ทดสอบอีกครั้ง
            </button>
          </div>
        )}

      </div>
      <AdSlot />
    </div>
  )
}
