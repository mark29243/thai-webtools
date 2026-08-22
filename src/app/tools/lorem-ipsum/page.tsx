'use client'

import { useState } from 'react'
import { AdSlot } from '@/components/AdSlot'

export default function LoremIpsumPage() {
  const [paragraphs, setParagraphs] = useState(3)
  const [output, setOutput] = useState('')

  const generateLorem = () => {
    const loremText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    
    let result = []
    for (let i = 0; i < paragraphs; i++) {
      result.push(loremText)
    }
    setOutput(result.join('\n\n'))
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output)
    alert('คัดลอกข้อความแล้ว!')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Lorem Ipsum Generator</h1>
        <p className="text-gray-600">สร้างข้อความจำลอง (Dummy Text) สำหรับงานออกแบบและพัฒนาเว็บไซต์</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border space-y-6">
        <div className="flex items-end gap-4">
          <div className="flex-1 max-w-xs">
            <label className="block text-sm font-medium text-gray-700 mb-1">จำนวนย่อหน้า (Paragraphs)</label>
            <input
              type="number"
              min="1"
              max="50"
              className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
              value={paragraphs}
              onChange={(e) => setParagraphs(Number(e.target.value))}
            />
          </div>
          <button
            onClick={generateLorem}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            สร้างข้อความ
          </button>
        </div>

        {output && (
          <div className="relative">
            <textarea
              className="w-full h-64 bg-gray-50 border rounded-lg p-4 outline-none resize-y"
              readOnly
              value={output}
            />
            <button
              onClick={copyToClipboard}
              className="absolute top-4 right-4 px-3 py-1 bg-white border shadow-sm rounded text-sm text-gray-600 hover:text-blue-600"
            >
              คัดลอก
            </button>
          </div>
        )}
      </div>

      <AdSlot />
    </div>
  )
}
