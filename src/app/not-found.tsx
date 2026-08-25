import Link from 'next/link'
import { FileSearch, Home } from 'lucide-react'

export const metadata = {
  title: '404 - ไม่พบหน้าที่ต้องการ | Thai WebTools',
}

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 space-y-6 animate-in fade-in duration-300">
      <div className="p-5 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-3xl shadow-sm border border-blue-100 dark:border-blue-900/50">
        <FileSearch className="w-14 h-14" />
      </div>
      
      <div className="space-y-2 max-w-md">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
          404 - ไม่พบหน้าที่ต้องการ
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
          ขออภัยครับ เราไม่พบหน้าเว็บไซต์ที่คุณกำลังค้นหา อาจจะถูกย้าย ถูกลบ หรือคุณอาจจะพิมพ์ URL ผิด
        </p>
      </div>

      <Link 
        href="/"
        className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/25 text-sm"
      >
        <Home className="w-4 h-4" /> กลับสู่หน้าแรก
      </Link>
    </div>
  )
}
