'use client'

import { useState } from 'react'
import Link from 'next/link'
import { QrCode, KeyRound, WholeWord, FileJson, Palette, Hash, Link as LinkIcon, Calculator, FileText, Fingerprint, Dices, Binary, Search, Key, Image as ImageIcon } from 'lucide-react'

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
      { id: 'qrcode', name: 'QR Code Generator', desc: 'สร้างคิวอาร์โค้ดฟรีไม่มีหมดอายุ', icon: <QrCode className="w-8 h-8 text-blue-500" />, href: '/tools/qrcode' },
      { id: 'image-compressor', name: 'Image Compressor', desc: 'ย่อขนาดรูปภาพ JPG/PNG แบบออฟไลน์', icon: <ImageIcon className="w-8 h-8 text-emerald-500" />, href: '/tools/image-compressor' },
      { id: 'password', name: 'Password Generator', desc: 'สุ่มรหัสผ่านที่ปลอดภัย', icon: <KeyRound className="w-8 h-8 text-green-500" />, href: '/tools/password' },
      { id: 'random-number', name: 'Random Number', desc: 'สุ่มตัวเลข กำหนดช่วงได้', icon: <Dices className="w-8 h-8 text-rose-500" />, href: '/tools/random-number' },
      { id: 'bmi-calculator', name: 'BMI Calculator', desc: 'คำนวณดัชนีมวลกาย', icon: <Calculator className="w-8 h-8 text-red-500" />, href: '/tools/bmi-calculator' },
      { id: 'color-converter', name: 'Color Converter', desc: 'แปลงโค้ดสี HEX, RGB, HSL', icon: <Palette className="w-8 h-8 text-pink-500" />, href: '/tools/color-converter' },
      { id: 'percentage', name: 'Percentage Calculator', desc: 'คำนวณหาค่าเปอร์เซ็นต์ ร้อยละ', icon: <Calculator className="w-8 h-8 text-amber-500" />, href: '/tools/percentage' },
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
      <div className="relative max-w-2xl mx-auto -mt-6 mb-12">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-11 pr-4 py-4 bg-white border border-gray-200 rounded-full shadow-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-lg"
          placeholder="ค้นหาเครื่องมือที่ต้องการ... (เช่น qr code, สุ่มรหัส)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Grid */}
      <div className="space-y-12">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((cat, idx) => (
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
