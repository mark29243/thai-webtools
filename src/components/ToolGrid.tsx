'use client'

import { useState } from 'react'
import Link from 'next/link'
import { QrCode, KeyRound, WholeWord, FileJson, Palette, Hash, Link as LinkIcon, Calculator, FileText, Fingerprint, Dices, Binary, Search, Key, Image as ImageIcon, FilePlus } from 'lucide-react'

const allCategories = [
  {
    name: 'Developer Tools',
    tools: [
      { id: 'json-formatter', name: 'JSON Formatter', desc: 'จัดรูปแบบและตรวจสอบ JSON', icon: <FileJson className="w-8 h-8 text-orange-500" />, href: '/tools/json-formatter' },
      { id: 'jwt-decoder', name: 'JWT Decoder', desc: 'ถอดรหัส JSON Web Token', icon: <Key className="w-8 h-8 text-rose-500" />, href: '/tools/jwt-decoder' },
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
      { id: 'pdf-merge', name: 'Merge PDF', desc: 'รวมไฟล์ PDF เข้าด้วยกันในเครื่อง ปลอดภัย 100%', icon: <FilePlus className="w-8 h-8 text-blue-500" />, href: '/tools/pdf-merge' },
      { id: 'qrcode', name: 'QR Code Generator', desc: 'สร้างคิวอาร์โค้ดฟรีไม่มีหมดอายุ', icon: <QrCode className="w-8 h-8 text-blue-500" />, href: '/tools/qrcode' },
      { id: 'image-compressor', name: 'Image Compressor', desc: 'ย่อขนาดรูปภาพ JPG/PNG แบบออฟไลน์', icon: <ImageIcon className="w-8 h-8 text-emerald-500" />, href: '/tools/image-compressor' },
      { id: 'password', name: 'Password Generator', desc: 'สุ่มรหัสผ่านที่ปลอดภัย', icon: <KeyRound className="w-8 h-8 text-green-500" />, href: '/tools/password' },
      { id: 'random-number', name: 'Random Number', desc: 'สุ่มตัวเลข กำหนดช่วงได้', icon: <Dices className="w-8 h-8 text-rose-500" />, href: '/tools/random-number' },
      { id: 'bmi-calculator', name: 'BMI Calculator', desc: 'คำนวณดัชนีมวลกาย', icon: <Calculator className="w-8 h-8 text-red-500" />, href: '/tools/bmi-calculator' },
      { id: 'color-converter', name: 'Color Converter', desc: 'แปลงโค้ดสี HEX, RGB, HSL', icon: <Palette className="w-8 h-8 text-pink-500" />, href: '/tools/color-converter' },
      { id: 'percentage', name: 'Percentage Calculator', desc: 'คำนวณหาค่าเปอร์เซ็นต์ ร้อยละ', icon: <Calculator className="w-8 h-8 text-amber-500" />, href: '/tools/percentage' },
    ]
  },
  {
    name: 'Unit Converters (เครื่องมือแปลงหน่วย)',
    tools: [
      { id: 'conv-length', name: 'แปลงหน่วยความยาว', desc: 'เมตร เซนติเมตร นิ้ว ฟุต', icon: <Calculator className="w-8 h-8 text-blue-500" />, href: '/converters/length' },
      { id: 'conv-weight', name: 'แปลงหน่วยน้ำหนัก', desc: 'กิโลกรัม ปอนด์ กรัม', icon: <Calculator className="w-8 h-8 text-green-500" />, href: '/converters/weight' },
      { id: 'conv-area', name: 'แปลงหน่วยพื้นที่', desc: 'ไร่ ตารางวา ตารางเมตร', icon: <Calculator className="w-8 h-8 text-yellow-500" />, href: '/converters/area' },
      { id: 'conv-data', name: 'แปลงหน่วยข้อมูล', desc: 'Byte, KB, MB, GB, TB', icon: <Calculator className="w-8 h-8 text-purple-500" />, href: '/converters/data' },
      { id: 'conv-time', name: 'แปลงหน่วยเวลา', desc: 'วินาที นาที ชั่วโมง วัน ปี', icon: <Calculator className="w-8 h-8 text-red-500" />, href: '/converters/time' },
    ]
  }
]

export function ToolGrid() {
  const [search, setSearch] = useState('')

  // Filter tools based on search query
  const filteredCategories = allCategories.map(cat => ({
    ...cat,
    tools: cat.tools.filter(tool => 
      tool.name.toLowerCase().includes(search.toLowerCase()) || 
      tool.desc.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(cat => cat.tools.length > 0)

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="relative max-w-2xl mx-auto -mt-6 mb-12 px-4 sm:px-0">
        <div className="absolute inset-y-0 left-4 sm:left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-11 pr-12 py-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full shadow-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-base sm:text-lg"
          placeholder="ค้นหาเครื่องมือที่ต้องการ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button 
            onClick={() => setSearch('')}
            className="absolute inset-y-0 right-4 sm:right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 bg-gray-100 dark:bg-gray-800 rounded-full p-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="space-y-12">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((cat, idx) => (
            <section key={idx}>
              <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 border-b dark:border-gray-800 pb-2">{cat.name}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {cat.tools.map((tool) => (
                  <Link 
                    key={tool.id} 
                    href={tool.href}
                    className="bg-white dark:bg-gray-900 p-3 sm:p-5 rounded-2xl shadow-sm border dark:border-gray-800 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all flex flex-col items-center text-center group"
                  >
                    <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-xl mb-2 sm:mb-3 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/40 transition-colors">
                      <div className="group-hover:scale-110 transition-transform [&>svg]:w-6 [&>svg]:h-6 sm:[&>svg]:w-8 sm:[&>svg]:h-8">
                        {tool.icon}
                      </div>
                    </div>
                    <div className="w-full">
                      <h3 className="font-semibold text-[13px] sm:text-base text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight line-clamp-2 px-1">{tool.name}</h3>
                      <p className="hidden sm:block text-xs text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed line-clamp-2">{tool.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))
        ) : (
          <div className="text-center py-20 text-gray-500">
            <p className="text-xl">ไม่พบเครื่องมือที่คุณค้นหา "{search}"</p>
          </div>
        )}
      </div>
    </div>
  )
}
