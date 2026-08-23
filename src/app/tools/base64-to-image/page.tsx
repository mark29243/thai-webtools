'use client'

import { useState } from 'react'
import { AdSlot } from '@/components/AdSlot'
import { Image as ImageIcon, Copy, Download, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Base64ToImagePage() {
  const [base64, setBase64] = useState('')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleConvert = () => {
    if (!base64.trim()) {
      toast.error('กรุณาวางโค้ด Base64')
      return
    }

    try {
      // Basic validation
      let validBase64 = base64.trim()
      
      // Auto-prefix if missing data URI scheme but looks like valid base64 image
      if (!validBase64.startsWith('data:image')) {
        // Just assume PNG if no header provided
        validBase64 = `data:image/png;base64,${validBase64}`
      }

      // Test if valid by creating an image object
      const img = new Image()
      img.onload = () => {
        setImageUrl(validBase64)
        setError(null)
        toast.success('แปลงโค้ดเป็นรูปภาพสำเร็จ!')
      }
      img.onerror = () => {
        setImageUrl(null)
        setError('โค้ด Base64 ไม่ถูกต้องหรือไม่ใช่รูปภาพ')
        toast.error('โค้ด Base64 ไม่ถูกต้อง')
      }
      img.src = validBase64

    } catch (e) {
      setImageUrl(null)
      setError('เกิดข้อผิดพลาดในการแปลง')
    }
  }

  const handleClear = () => {
    setBase64('')
    setImageUrl(null)
    setError(null)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Base64 to Image</h1>
        <p className="text-gray-600 dark:text-gray-400">แปลงโค้ดข้อความ Base64 String กลับมาเป็นไฟล์รูปภาพ (Preview & Download)</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-3xl shadow-sm border dark:border-gray-800 space-y-4">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              วางโค้ด Base64 ที่นี่
            </label>
            <button 
              onClick={handleClear}
              className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-4 h-4" /> ล้าง
            </button>
          </div>
          <textarea 
            value={base64}
            onChange={(e) => {
              setBase64(e.target.value)
              setError(null)
            }}
            className="w-full h-64 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
            placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
          />
          <button 
            onClick={handleConvert}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
          >
            <ImageIcon className="w-5 h-5" /> แปลงเป็นรูปภาพ
          </button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-6 md:p-8 rounded-3xl border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center min-h-[300px]">
          {imageUrl ? (
            <div className="space-y-6 w-full flex flex-col items-center">
              <div className="relative group rounded-xl overflow-hidden shadow-md max-w-full bg-white flex items-center justify-center p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt="Base64 Preview" className="max-h-64 object-contain" />
              </div>
              <a 
                href={imageUrl}
                download="base64-image.png"
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" /> ดาวน์โหลดรูปภาพ
              </a>
            </div>
          ) : (
            <div className="text-gray-400 flex flex-col items-center gap-2">
              <ImageIcon className="w-12 h-12 opacity-50" />
              <p>รูปภาพจะแสดงที่นี่</p>
            </div>
          )}
        </div>
      </div>

      <AdSlot />
    </div>
  )
}
