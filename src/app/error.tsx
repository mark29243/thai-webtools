'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Unhandled application error:', error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 space-y-6 animate-in fade-in duration-300">
      <div className="p-5 bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 rounded-3xl shadow-sm">
        <AlertTriangle className="w-14 h-14" />
      </div>

      <div className="space-y-2 max-w-md">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
          เกิดข้อผิดพลาดในการประมวลผล
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          ขออภัยในความไม่สะดวก ระบบพบปัญหาชั่วคราวในการแสดงผลหน้านี้ ท่านสามารถลองกดโหลดใหม่ หรือกลับไปยังหน้าแรกได้ครับ
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          onClick={() => reset()}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm transition-all shadow-sm"
        >
          <RefreshCw className="w-4 h-4" /> ลองใหม่อีกครั้ง
        </button>
        <Link
          href="/"
          className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-2xl font-semibold text-sm transition-all"
        >
          <Home className="w-4 h-4" /> กลับสู่หน้าแรก
        </Link>
      </div>
    </div>
  )
}
