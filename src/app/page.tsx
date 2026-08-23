import { AdSlot } from '@/components/AdSlot'
import { ToolGrid } from '@/components/ToolGrid'

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="text-center py-20 bg-white rounded-3xl shadow-sm border px-4 mt-4 bg-gradient-to-br from-blue-50 to-indigo-50 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        </div>

        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-gray-900 tracking-tight">
            เครื่องมือออนไลน์ <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">ฟรี 100%</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
            ศูนย์รวมเครื่องมือสำหรับนักพัฒนา นักออกแบบ และผู้ใช้งานทั่วไป 
            ใช้งานง่าย ปลอดภัย ไม่ต้องติดตั้งโปรแกรม
          </p>
        </div>
      </section>

      <ToolGrid />

      <AdSlot className="my-8" />
    </div>
  )
}
