'use client'
import { useState } from 'react'
import { AdSlot } from '@/components/AdSlot'
import { Download, Image as ImageIcon } from 'lucide-react'

export default function YoutubeThumbnailPage() {
  const [url, setUrl] = useState('')
  
  const extractVideoId = (url: string) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : false;
  }

  const videoId = extractVideoId(url)
  const maxRes = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : ''
  const hqRes = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : ''
  const mqRes = videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : ''

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">YouTube Thumbnail Downloader</h1>
        <p className="text-gray-600 dark:text-gray-400">ดึงรูปหน้าปกคลิป YouTube แบบความละเอียดสูง HD นำไปใช้งานได้ทันที</p>
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border dark:border-gray-800">
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          วางลิงก์ YouTube ที่นี่
        </label>
        <input 
          type="text"
          className="w-full p-4 text-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-red-500 transition-shadow"
          placeholder="เช่น https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>

      {videoId ? (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border dark:border-gray-800 overflow-hidden">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <ImageIcon className="text-red-500" />
              ความละเอียดสูงสุด (Max Resolution)
            </h2>
            <img src={maxRes} alt="Thumbnail HD" className="w-full rounded-xl border dark:border-gray-800 shadow-sm" />
            <div className="mt-4 flex justify-end">
              <a href={maxRes} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                <Download className="w-4 h-4" /> ดูรูปภาพขนาดเต็ม
              </a>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border dark:border-gray-800">
              <h2 className="text-lg font-bold mb-4">คุณภาพสูง (HQ)</h2>
              <img src={hqRes} alt="Thumbnail HQ" className="w-full rounded-xl border dark:border-gray-800 shadow-sm" />
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border dark:border-gray-800">
              <h2 className="text-lg font-bold mb-4">คุณภาพปานกลาง (MQ)</h2>
              <img src={mqRes} alt="Thumbnail MQ" className="w-full rounded-xl border dark:border-gray-800 shadow-sm" />
            </div>
          </div>
        </div>
      ) : (
        url.length > 5 && (
          <div className="bg-red-50 text-red-500 p-4 rounded-xl border border-red-100 dark:bg-red-900/10 dark:border-red-900/30">
            ไม่พบ Video ID กรุณาตรวจสอบลิงก์ YouTube อีกครั้ง
          </div>
        )
      )}

      <AdSlot />
    </div>
  )
}
