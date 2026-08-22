'use client'

import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { AdSlot } from '@/components/AdSlot'

export default function QrCodePage() {
  const [text, setText] = useState('')

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">QR Code Generator</h1>
        <p className="text-gray-600">สร้างคิวอาร์โค้ดจากข้อความ ลิงก์ หรือเบอร์โทรศัพท์</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">ข้อความหรือ URL</label>
            <textarea
              className="w-full border rounded-lg p-3 min-h-[150px] focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="พิมพ์ข้อความที่นี่..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-8 border border-dashed">
          {text ? (
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <QRCodeSVG value={text} size={200} level="H" />
            </div>
          ) : (
            <div className="text-gray-400 text-center">
              <p>QR Code จะแสดงที่นี่</p>
            </div>
          )}
        </div>
      </div>

      <AdSlot />
    </div>
  )
}
