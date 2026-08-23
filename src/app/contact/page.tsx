import { Metadata } from 'next'
import { Mail, MapPin } from 'lucide-react'

export const metadata: Metadata = {
  title: 'ติดต่อเรา - Thai WebTools',
  description: 'ติดต่อทีมงาน Thai WebTools สำหรับข้อเสนอแนะหรือแจ้งปัญหา',
}

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">ติดต่อเรา (Contact Us)</h1>
        <p className="text-gray-600">หากคุณมีข้อเสนอแนะ แจ้งปัญหาการใช้งาน หรือต้องการสนับสนุนโปรเจกต์ สามารถติดต่อเราได้ที่นี่</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl">
            <Mail className="w-10 h-10 text-blue-600 mb-4" />
            <h3 className="font-semibold text-lg mb-2">อีเมลติดต่อ</h3>
            <p className="text-gray-600">support@thaiwebtools.com</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl">
            <MapPin className="w-10 h-10 text-blue-600 mb-4" />
            <h3 className="font-semibold text-lg mb-2">ที่อยู่</h3>
            <p className="text-gray-600">กรุงเทพมหานคร, ประเทศไทย</p>
          </div>
        </div>

        <div className="border-t pt-8">
          <h3 className="font-semibold text-xl mb-4">ฟอร์มติดต่อ (เร็วๆ นี้)</h3>
          <p className="text-gray-500 text-sm">
            ระบบฟอร์มติดต่ออยู่ระหว่างการพัฒนา หากต้องการติดต่อเร่งด่วนกรุณาส่งอีเมลโดยตรง
          </p>
        </div>
      </div>
    </div>
  )
}
