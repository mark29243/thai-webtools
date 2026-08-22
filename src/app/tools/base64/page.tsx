'use client'

import { useState } from 'react'
import { AdSlot } from '@/components/AdSlot'

export default function Base64Page() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [error, setError] = useState('')

  const handleProcess = () => {
    setError('')
    try {
      if (mode === 'encode') {
        // Encode text to Base64
        // use encodeURIComponent to handle unicode characters properly
        const encoded = btoa(unescape(encodeURIComponent(input)))
        setOutput(encoded)
      } else {
        // Decode Base64 to text
        const decoded = decodeURIComponent(escape(atob(input)))
        setOutput(decoded)
      }
    } catch (err) {
      setError('ข้อความไม่ถูกต้อง หรือไม่ใช่รูปแบบ Base64 ที่สามารถถอดรหัสได้')
      setOutput('')
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Base64 Encoder / Decoder</h1>
        <p className="text-gray-600">เครื่องมือแปลงข้อความเป็น Base64 หรือถอดรหัส Base64 กลับเป็นข้อความ</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border space-y-6">
        <div className="flex gap-4 border-b pb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              name="mode" 
              checked={mode === 'encode'} 
              onChange={() => { setMode('encode'); setOutput(''); setError(''); }}
              className="text-blue-600 focus:ring-blue-500"
            />
            <span className="font-medium">Encode (เข้ารหัส)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              name="mode" 
              checked={mode === 'decode'} 
              onChange={() => { setMode('decode'); setOutput(''); setError(''); }}
              className="text-blue-600 focus:ring-blue-500"
            />
            <span className="font-medium">Decode (ถอดรหัส)</span>
          </label>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block font-medium text-sm text-gray-700">
              {mode === 'encode' ? 'ข้อความต้นฉบับ (Text)' : 'ข้อความ Base64'}
            </label>
            <textarea
              className="w-full h-48 border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={mode === 'encode' ? 'พิมพ์ข้อความที่ต้องการเข้ารหัส...' : 'วางโค้ด Base64 ที่นี่...'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="block font-medium text-sm text-gray-700">ผลลัพธ์ (Result)</label>
            <textarea
              className="w-full h-48 bg-gray-50 border rounded-lg p-3 outline-none"
              readOnly
              placeholder="ผลลัพธ์จะแสดงที่นี่..."
              value={output}
            />
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-sm font-medium">{error}</div>
        )}

        <div className="flex justify-between items-center pt-4 border-t">
          <button
            onClick={() => { setInput(''); setOutput(''); setError(''); }}
            className="text-gray-500 hover:text-red-500 text-sm font-medium"
          >
            ล้างข้อมูล
          </button>
          <button
            onClick={handleProcess}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm transition-colors"
          >
            {mode === 'encode' ? 'เข้ารหัส Base64' : 'ถอดรหัส Base64'}
          </button>
        </div>
      </div>

      <AdSlot />
    </div>
  )
}
