'use client'

import { useState } from 'react'
import { AdSlot } from '@/components/AdSlot'
import { Trash2, Copy } from 'lucide-react'
import toast from 'react-hot-toast'

export default function WordCounterPage() {
  const [text, setText] = useState('')

  const stats = {
    words: text.trim().split(/\s+/).filter(w => w.length > 0).length,
    characters: text.length,
    charactersNoSpaces: text.replace(/\s/g, '').length,
    paragraphs: text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length,
  }

  const handleCopy = () => {
    if (!text) return
    navigator.clipboard.writeText(text)
    toast.success('คัดลอกข้อความแล้ว!')
  }

  const handleClear = () => {
    setText('')
    toast.success('ล้างข้อมูลเรียบร้อย')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Word Counter</h1>
        <p className="text-gray-600 dark:text-gray-400">เครื่องมือนับจำนวนคำ ตัวอักษร และย่อหน้า</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border dark:border-gray-800 text-center">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.words}</div>
          <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-1">คำ (Words)</div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border dark:border-gray-800 text-center">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.characters}</div>
          <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-1">ตัวอักษร</div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border dark:border-gray-800 text-center">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.charactersNoSpaces}</div>
          <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-1">ไม่รวมช่องว่าง</div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border dark:border-gray-800 text-center">
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{stats.paragraphs}</div>
          <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-1">ย่อหน้า</div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border dark:border-gray-800">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="พิมพ์หรือวางข้อความที่นี่..."
          className="w-full min-h-[300px] border-none focus:ring-0 resize-y outline-none bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 break-words"
        />
        <div className="flex justify-between items-center pt-4 border-t dark:border-gray-800 mt-4">
          <button
            onClick={handleClear}
            className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors font-medium text-sm p-2"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">ล้างข้อความ</span>
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors font-medium text-sm px-4 py-2 rounded-xl"
          >
            <Copy className="w-4 h-4" />
            คัดลอกข้อความ
          </button>
        </div>
      </div>

      <AdSlot />
    </div>
  )
}
