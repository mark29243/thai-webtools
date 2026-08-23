'use client'

import { useState } from 'react'
import { AdSlot } from '@/components/AdSlot'

export default function UrlEncoderPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')

  const handleProcess = () => {
    try {
      if (mode === 'encode') {
        setOutput(encodeURIComponent(input))
      } else {
        setOutput(decodeURIComponent(input))
      }
    } catch (err) {
      setOutput('เกิดข้อผิดพลาด: รูปแบบ URL ไม่ถูกต้อง')
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">URL Encoder / Decoder</h1>
        <p className="text-gray-600">เข้ารหัสและถอดรหัส URL (เปอร์เซ็นต์เอ็นโค้ดดิ้ง) อย่างปลอดภัย</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border space-y-6">
        <div className="flex gap-4 border-b pb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" checked={mode === 'encode'} onChange={() => {setMode('encode'); setOutput('');}} className="text-blue-600 focus:ring-blue-500" />
            <span className="font-medium">Encode URL</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" checked={mode === 'decode'} onChange={() => {setMode('decode'); setOutput('');}} className="text-blue-600 focus:ring-blue-500" />
            <span className="font-medium">Decode URL</span>
          </label>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block font-medium text-sm text-gray-700">ข้อความต้นฉบับ</label>
            <textarea
              className="w-full h-48 border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 break-all resize-none"
              placeholder={mode === 'encode' ? 'https://example.com/?q=ภาษาไทย' : 'https%3A%2F%2Fexample.com%2F%3Fq%3D%E0%B8%A0%E0%B8%B2%E0%B8%A9%E0%B8%B2%E0%B9%84%E0%B8%97%E0%B8%A2'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="block font-medium text-sm text-gray-700">ผลลัพธ์</label>
            <textarea
              className="w-full h-48 bg-gray-50 border rounded-lg p-3 outline-none break-all resize-none"
              readOnly
              value={output}
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <button onClick={handleProcess} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            {mode === 'encode' ? 'Encode URL' : 'Decode URL'}
          </button>
        </div>
      </div>
      <AdSlot />
    </div>
  )
}
