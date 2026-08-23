'use client'

import { useState } from 'react'
import { AdSlot } from '@/components/AdSlot'
import { Copy, RefreshCw } from 'lucide-react'

export default function UuidGeneratorPage() {
  const [uuids, setUuids] = useState<string[]>([])
  const [count, setCount] = useState(5)

  const generateUUID = () => {
    // Basic UUID v4 implementation for browser
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }

  const handleGenerate = () => {
    const newUuids = Array.from({ length: count }, () => generateUUID())
    setUuids(newUuids)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const copyAll = () => {
    navigator.clipboard.writeText(uuids.join('\n'))
    alert('คัดลอกทั้งหมดเรียบร้อยแล้ว')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">UUID / GUID Generator</h1>
        <p className="text-gray-600">สร้างรหัสประจำตัวไม่ซ้ำกัน (Universally Unique Identifier) เวอร์ชัน 4</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border space-y-6">
        <div className="flex items-end gap-4">
          <div className="w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">จำนวนที่ต้องการสร้าง</label>
            <input
              type="number"
              min="1"
              max="100"
              className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
            />
          </div>
          <button
            onClick={handleGenerate}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            สร้าง UUID
          </button>
        </div>

        {uuids.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-700">ผลลัพธ์:</h3>
              <button onClick={copyAll} className="text-sm text-blue-600 hover:underline">
                คัดลอกทั้งหมด
              </button>
            </div>
            <div className="space-y-2 max-h-[400px] overflow-y-auto p-4 bg-gray-50 border rounded-lg">
              {uuids.map((uuid, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-white border rounded hover:border-blue-300 transition-colors">
                  <code className="text-sm font-mono text-gray-800">{uuid}</code>
                  <button
                    onClick={() => copyToClipboard(uuid)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="คัดลอก"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <AdSlot />
    </div>
  )
}
