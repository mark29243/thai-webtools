'use client'

import { useState } from 'react'
import { AdSlot } from '@/components/AdSlot'

export default function TextToBinaryPage() {
  const [text, setText] = useState('')
  const [binary, setBinary] = useState('')
  const [mode, setMode] = useState<'text2bin' | 'bin2text'>('text2bin')

  const convert = () => {
    try {
      if (mode === 'text2bin') {
        const result = Array.from(text)
          .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
          .join(' ')
        setBinary(result)
      } else {
        const result = text.split(' ')
          .map(bin => String.fromCharCode(parseInt(bin, 2)))
          .join('')
        setBinary(result)
      }
    } catch (e) {
      setBinary('เกิดข้อผิดพลาด: รูปแบบไม่ถูกต้อง')
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Text / Binary Converter</h1>
        <p className="text-gray-600">แปลงข้อความเป็นรหัสฐานสอง (Binary) หรือแปลงกลับ</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border space-y-6">
        <div className="flex gap-4 border-b pb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" checked={mode === 'text2bin'} onChange={() => {setMode('text2bin'); setText(''); setBinary('');}} className="text-blue-600" />
            <span className="font-medium">Text to Binary</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" checked={mode === 'bin2text'} onChange={() => {setMode('bin2text'); setText(''); setBinary('');}} className="text-blue-600" />
            <span className="font-medium">Binary to Text</span>
          </label>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block font-medium text-sm text-gray-700">
              {mode === 'text2bin' ? 'ข้อความ (Text)' : 'รหัสฐานสอง (Binary)'}
            </label>
            <textarea
              className="w-full h-48 border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 font-mono break-all resize-none"
              placeholder={mode === 'text2bin' ? 'พิมพ์ข้อความ...' : '01101000 01100101 01101100 01101100 01101111'}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="block font-medium text-sm text-gray-700">ผลลัพธ์ (Result)</label>
            <textarea
              className="w-full h-48 bg-gray-50 border rounded-lg p-3 outline-none font-mono break-all resize-none"
              readOnly
              value={binary}
            />
          </div>
        </div>

        <button onClick={convert} className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
          แปลงข้อมูล (Convert)
        </button>
      </div>
      <AdSlot />
    </div>
  )
}
