import Link from 'next/link'
import { FileSearch } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div className="p-6 bg-blue-50 text-blue-600 rounded-full">
        <FileSearch className="w-16 h-16" />
      </div>
      <h1 className="text-4xl font-bold text-gray-900">404 - ไม่พบหน้าที่ต้องการ</h1>
      <p className="text-gray-600 max-w-md mx-auto text-lg">
        ขออภัยครับ เราไม่พบหน้าเว็บไซต์ที่คุณกำลังค้นหา อาจจะถูกลบไปแล้ว หรือคุณพิมพ์ URL ผิด
      </p>
      <Link 
        href="/"
        className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm"
      >
        กลับสู่หน้าแรก
      </Link>
    </div>
  )
}
