'use client'

import { useState, useRef } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { AdSlot } from '@/components/AdSlot'
import { Download } from 'lucide-react'

export default function QrCodePage() {
  const [text, setText] = useState('')
  const qrRef = useRef<HTMLDivElement>(null)

  const handleDownload = () => {
    const canvas = qrRef.current?.querySelector('canvas')
    if (canvas) {
      const pngUrl = canvas
        .toDataURL('image/png')
        .replace('image/png', 'image/octet-stream')
      let downloadLink = document.createElement('a')
      downloadLink.href = pngUrl
      downloadLink.download = 'qrcode.png'
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">QR Code Generator</h1>
        <p className="text-gray-600 dark:text-gray-400">สร้างคิวอาร์โค้ดจากข้อความ ลิงก์ หรือเบอร์โทรศัพท์ พร้อมดาวน์โหลดเป็นรูปภาพ</p>
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border dark:border-gray-800 grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ข้อความหรือ URL</label>
            <textarea
              className="w-full border dark:border-gray-700 rounded-xl p-4 min-h-[200px] bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
              placeholder="พิมพ์ข้อความ ลิงก์เว็บไซต์ หรือเบอร์โทรศัพท์ที่นี่..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800/50 rounded-xl p-8 border-2 border-dashed dark:border-gray-700">
          {text ? (
            <div className="flex flex-col items-center gap-6">
              <div ref={qrRef} className="bg-white p-4 rounded-xl shadow-sm">
                <QRCodeCanvas value={text} size={220} level="H" includeMargin={true} />
              </div>
              <button 
                onClick={handleDownload}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-sm"
              >
                <Download className="w-5 h-5" />
                ดาวน์โหลด QR Code
              </button>
            </div>
          ) : (
            <div className="text-gray-400 dark:text-gray-500 text-center">
              <p>QR Code จะแสดงที่นี่</p>
              <p className="text-sm mt-2">พิมพ์ข้อความด้านซ้ายเพื่อเริ่มต้น</p>
            </div>
          )}
        </div>
      </div>

      <AdSlot />
    </div>
  )
}
