import Link from 'next/link'
import { QrCode, KeyRound, WholeWord, FileJson, Palette, Hash, Link as LinkIcon, Calculator, FileText, Fingerprint, Dices, Binary } from 'lucide-react'
import { AdSlot } from '@/components/AdSlot'

const categories = [
  {
    name: 'Developer Tools',
    tools: [
      { id: 'json-formatter', name: 'JSON Formatter', desc: 'จัดรูปแบบและตรวจสอบ JSON', icon: <FileJson className="w-8 h-8 text-orange-500" />, href: '/tools/json-formatter' },
      { id: 'base64', name: 'Base64 Encoder', desc: 'เข้ารหัสและถอดรหัส Base64', icon: <Hash className="w-8 h-8 text-indigo-500" />, href: '/tools/base64' },
      { id: 'url-encoder', name: 'URL Encoder', desc: 'เข้ารหัส URL (Percent-encoding)', icon: <LinkIcon className="w-8 h-8 text-teal-500" />, href: '/tools/url-encoder' },
      { id: 'uuid', name: 'UUID Generator', desc: 'สร้างรหัส GUID / UUID v4', icon: <Fingerprint className="w-8 h-8 text-slate-500" />, href: '/tools/uuid' },
      { id: 'text-to-binary', name: 'Text to Binary', desc: 'แปลงข้อความเป็นรหัสฐานสอง', icon: <Binary className="w-8 h-8 text-cyan-500" />, href: '/tools/text-to-binary' },
    ]
  },
  {
    name: 'Text & Content',
    tools: [
      { id: 'word-counter', name: 'Word Counter', desc: 'นับจำนวนคำและตัวอักษร', icon: <WholeWord className="w-8 h-8 text-purple-500" />, href: '/tools/word-counter' },
      { id: 'lorem-ipsum', name: 'Lorem Ipsum Gen.', desc: 'สร้างข้อความจำลอง (Dummy Text)', icon: <FileText className="w-8 h-8 text-gray-500" />, href: '/tools/lorem-ipsum' },
    ]
  },
  {
    name: 'Utilities & Everyday',
    tools: [
      { id: 'qrcode', name: 'QR Code Generator', desc: 'สร้างคิวอาร์โค้ดฟรีไม่มีหมดอายุ', icon: <QrCode className="w-8 h-8 text-blue-500" />, href: '/tools/qrcode' },
      { id: 'password', name: 'Password Generator', desc: 'สุ่มรหัสผ่านที่ปลอดภัย', icon: <KeyRound className="w-8 h-8 text-green-500" />, href: '/tools/password' },
      { id: 'random-number', name: 'Random Number', desc: 'สุ่มตัวเลข กำหนดช่วงได้', icon: <Dices className="w-8 h-8 text-rose-500" />, href: '/tools/random-number' },
      { id: 'bmi-calculator', name: 'BMI Calculator', desc: 'คำนวณดัชนีมวลกาย', icon: <Calculator className="w-8 h-8 text-red-500" />, href: '/tools/bmi-calculator' },
      { id: 'color-converter', name: 'Color Converter', desc: 'แปลงโค้ดสี HEX, RGB, HSL', icon: <Palette className="w-8 h-8 text-pink-500" />, href: '/tools/color-converter' },
      { id: 'percentage', name: 'Percentage Calculator', desc: 'คำนวณหาค่าเปอร์เซ็นต์ ร้อยละ', icon: <Calculator className="w-8 h-8 text-amber-500" />, href: '/tools/percentage' },
    ]
  }
]

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="text-center py-16 bg-white rounded-2xl shadow-sm border px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Thai WebTools
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          ศูนย์รวมเครื่องมือออนไลน์ฟรี สำหรับนักพัฒนา นักออกแบบ และผู้ใช้งานทั่วไป 
          ทำงานจบบนเบราว์เซอร์ ปลอดภัย ไม่ต้องติดตั้งโปรแกรม
        </p>
      </section>

      <AdSlot className="my-8" />

      <div className="space-y-12">
        {categories.map((cat, idx) => (
          <section key={idx}>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">{cat.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {cat.tools.map((tool) => (
                <Link 
                  key={tool.id} 
                  href={tool.href}
                  className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md hover:border-blue-200 transition-all flex flex-col gap-4 group"
                >
                  <div className="p-3 bg-gray-50 rounded-lg w-fit group-hover:bg-blue-50 transition-colors">
                    <div className="group-hover:scale-110 transition-transform">
                      {tool.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">{tool.name}</h3>
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">{tool.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
