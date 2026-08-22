import Link from 'next/link'
import { QrCode, KeyRound, WholeWord, FileJson, Palette } from 'lucide-react'
import { AdSlot } from '@/components/AdSlot'

const tools = [
  {
    id: 'qrcode',
    name: 'QR Code Generator',
    description: 'สร้างคิวอาร์โค้ดจากข้อความหรือ URL ได้อย่างรวดเร็ว',
    icon: <QrCode className="w-8 h-8 text-blue-500" />,
    href: '/tools/qrcode',
  },
  {
    id: 'password',
    name: 'Password Generator',
    description: 'สุ่มรหัสผ่านที่ปลอดภัย พร้อมกำหนดความยาวและรูปแบบได้',
    icon: <KeyRound className="w-8 h-8 text-green-500" />,
    href: '/tools/password',
  },
  {
    id: 'word-counter',
    name: 'Word Counter',
    description: 'นับจำนวนคำ ตัวอักษร และประโยคในข้อความ',
    icon: <WholeWord className="w-8 h-8 text-purple-500" />,
    href: '/tools/word-counter',
  },
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    description: 'จัดรูปแบบและตรวจสอบความถูกต้องของ JSON data',
    icon: <FileJson className="w-8 h-8 text-orange-500" />,
    href: '/tools/json-formatter',
  },
  {
    id: 'color-converter',
    name: 'Color Converter',
    description: 'แปลงโค้ดสี HEX, RGB, HSL สลับไปมา',
    icon: <Palette className="w-8 h-8 text-pink-500" />,
    href: '/tools/color-converter',
  },
]

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="text-center py-12 bg-white rounded-xl shadow-sm border">
        <h1 className="text-4xl font-bold mb-4">เครื่องมือออนไลน์ฟรี</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          รวมเครื่องมือที่มีประโยชน์สำหรับนักพัฒนาและผู้ใช้งานทั่วไป ใช้งานง่าย ไม่ต้องติดตั้งโปรแกรม
        </p>
      </section>

      <AdSlot className="my-8" />

      <section>
        <h2 className="text-2xl font-semibold mb-6">เครื่องมือทั้งหมด</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Link 
              key={tool.id} 
              href={tool.href}
              className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow flex flex-col gap-4 group"
            >
              <div className="p-3 bg-gray-50 rounded-lg w-fit group-hover:scale-110 transition-transform">
                {tool.icon}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{tool.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{tool.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
