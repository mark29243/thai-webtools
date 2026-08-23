'use client'
import { useState } from 'react'
import { AdSlot } from '@/components/AdSlot'
import { Activity, Gauge, Play, ArrowDown, ArrowUp } from 'lucide-react'

export default function SpeedTestPage() {
  const [phase, setPhase] = useState<'idle' | 'download' | 'upload' | 'done'>('idle')
  const [dlSpeed, setDlSpeed] = useState<number | null>(null)
  const [ulSpeed, setUlSpeed] = useState<number | null>(null)
  const [progress, setProgress] = useState(0)

  const testSpeed = async () => {
    setDlSpeed(0)
    setUlSpeed(0)
    setProgress(0)
    
    // --- Phase 1: Download ---
    setPhase('download')
    const dlImageUrl = 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Pleiades_large.jpg'
    const dlFileBits = 1.25 * 1024 * 1024 * 8 // ~10 Megabits
    const dlIterations = 3
    
    let totalDlBits = 0
    let totalDlTimeMs = 0

    for (let i = 1; i <= dlIterations; i++) {
      await new Promise<void>((resolve, reject) => {
        const start = performance.now()
        const img = new Image()
        img.onload = () => {
          const duration = performance.now() - start
          totalDlBits += dlFileBits
          totalDlTimeMs += duration
          setProgress(Math.round((i / dlIterations) * 50)) // 0 to 50%
          setDlSpeed((totalDlBits / (totalDlTimeMs / 1000)) / 1000000)
          resolve()
        }
        img.onerror = reject
        img.src = `${dlImageUrl}?cache=${Math.random()}`
      })
    }

    // --- Phase 2: Upload ---
    setPhase('upload')
    
    // Generate 2MB pseudo-random payload to avoid compression
    const ulFileSize = 2 * 1024 * 1024 // 2MB
    const buffer = new Uint8Array(ulFileSize)
    for (let i = 0; i < buffer.length; i++) {
      buffer[i] = (i * 167 + 13) % 256
    }
    const ulBlob = new Blob([buffer])
    const ulFileBits = ulFileSize * 8 // 16 Megabits
    const ulIterations = 2
    
    let totalUlBits = 0
    let totalUlTimeMs = 0

    for (let i = 1; i <= ulIterations; i++) {
      try {
        const start = performance.now()
        const res = await fetch('/api/speedtest-upload', {
          method: 'POST',
          body: ulBlob
        })
        if (!res.ok) throw new Error('Upload failed')
        
        const duration = performance.now() - start
        totalUlBits += ulFileBits
        totalUlTimeMs += duration
        setProgress(50 + Math.round((i / ulIterations) * 50)) // 50 to 100%
        setUlSpeed((totalUlBits / (totalUlTimeMs / 1000)) / 1000000)
      } catch (err) {
        console.error(err)
        alert('เกิดข้อผิดพลาดในการทดสอบอัปโหลด')
        setPhase('idle')
        return
      }
    }

    setPhase('done')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Internet Speed Test</h1>
        <p className="text-gray-600 dark:text-gray-400">เช็กความเร็วเน็ตของคุณ (Download & Upload) อย่างแม่นยำ</p>
      </div>

      <div className="bg-white dark:bg-gray-900 p-8 sm:p-12 rounded-3xl shadow-sm border dark:border-gray-800 text-center flex flex-col items-center">
        
        {/* Main Dial */}
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
              className={`${phase === 'download' ? 'text-blue-500' : phase === 'upload' ? 'text-purple-500' : 'text-green-500'} transition-all duration-300 ease-out`}
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * progress) / 100}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {phase !== 'idle' ? (
              <>
                <span className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-gray-100">
                  {phase === 'download' ? dlSpeed?.toFixed(1) : ulSpeed?.toFixed(1) || dlSpeed?.toFixed(1)}
                </span>
                <span className="text-gray-500 font-medium">Mbps</span>
              </>
            ) : (
              <Gauge className="w-16 h-16 text-gray-300 dark:text-gray-700" />
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-8 w-full max-w-md mb-8">
          <div className={`flex flex-col items-center p-4 rounded-2xl ${phase === 'download' ? 'bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500' : 'bg-gray-50 dark:bg-gray-800'} transition-all`}>
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-2">
              <ArrowDown className="w-5 h-5 text-blue-500" /> Download
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {dlSpeed !== null ? dlSpeed.toFixed(1) : '--'} <span className="text-sm font-normal text-gray-500">Mbps</span>
            </div>
          </div>
          
          <div className={`flex flex-col items-center p-4 rounded-2xl ${phase === 'upload' ? 'bg-purple-50 dark:bg-purple-900/20 ring-2 ring-purple-500' : 'bg-gray-50 dark:bg-gray-800'} transition-all`}>
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-2">
              <ArrowUp className="w-5 h-5 text-purple-500" /> Upload
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {ulSpeed !== null && ulSpeed > 0 ? ulSpeed.toFixed(1) : '--'} <span className="text-sm font-normal text-gray-500">Mbps</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {phase === 'idle' && (
          <button 
            onClick={testSpeed}
            className="flex items-center gap-2 px-10 py-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <Play className="w-6 h-6 fill-current" /> เริ่มทดสอบ (GO)
          </button>
        )}

        {(phase === 'download' || phase === 'upload') && (
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium animate-pulse">
            <Activity className="w-5 h-5" /> {phase === 'download' ? 'กำลังทดสอบดาวน์โหลด...' : 'กำลังทดสอบอัปโหลด...'}
          </div>
        )}

        {phase === 'done' && (
          <div className="space-y-4 w-full">
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
