'use client'

import { useState, useEffect } from 'react'
import { Copy, RefreshCw } from 'lucide-react'
import { AdSlot } from '@/components/AdSlot'

export default function PasswordGeneratorPage() {
  const [password, setPassword] = useState('')
  const [length, setLength] = useState(16)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)

  const generatePassword = () => {
    let charset = ''
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz'
    if (includeNumbers) charset += '0123456789'
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?'

    if (charset === '') {
      setPassword('กรุณาเลือกอย่างน้อย 1 รูปแบบ')
      return
    }

    let newPassword = ''
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length)
      newPassword += charset[randomIndex]
    }
    setPassword(newPassword)
  }

  useEffect(() => {
    generatePassword()
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password)
    alert('คัดลอกรหัสผ่านแล้ว')
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Password Generator</h1>
        <p className="text-gray-600">เครื่องมือสุ่มรหัสผ่านที่ปลอดภัย</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border space-y-6">
        <div className="relative">
          <input
            type="text"
            readOnly
            value={password}
            className="w-full text-2xl font-mono bg-gray-50 border rounded-lg p-4 pr-24 text-center tracking-wider"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
            <button
              onClick={generatePassword}
              className="p-2 text-gray-500 hover:text-blue-600 bg-white rounded-md border shadow-sm"
              title="สุ่มใหม่"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={copyToClipboard}
              className="p-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm"
              title="คัดลอก"
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <div>
            <label className="flex justify-between text-sm font-medium mb-2">
              <span>ความยาวรหัสผ่าน</span>
              <span className="text-blue-600">{length}</span>
            </label>
            <input
              type="range"
              min="8"
              max="64"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeUppercase}
                onChange={(e) => setIncludeUppercase(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span>ตัวพิมพ์ใหญ่ (A-Z)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeLowercase}
                onChange={(e) => setIncludeLowercase(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span>ตัวพิมพ์เล็ก (a-z)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span>ตัวเลข (0-9)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={(e) => setIncludeSymbols(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span>อักขระพิเศษ (!@#$)</span>
            </label>
          </div>
        </div>
      </div>

      <AdSlot />
    </div>
  )
}
