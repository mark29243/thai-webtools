'use client'

import { useState } from 'react'
import { AdSlot } from '@/components/AdSlot'

export default function WordCounterPage() {
  const [text, setText] = useState('')

  const stats = {
    words: text.trim().split(/\s+/).filter(w => w.length > 0).length,
    characters: text.length,
    charactersNoSpaces: text.replace(/\s/g, '').length,
    paragraphs: text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length,
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Word Counter</h1>
        <p className="text-gray-600">เครื่องมือนับจำนวนคำ ตัวอักษร และย่อหน้า</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
          <div className="text-3xl font-bold text-blue-600">{stats.words}</div>
          <div className="text-sm text-gray-500 uppercase tracking-wide mt-1">คำ (Words)</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
          <div className="text-3xl font-bold text-green-600">{stats.characters}</div>
          <div className="text-sm text-gray-500 uppercase tracking-wide mt-1">ตัวอักษร</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
          <div className="text-3xl font-bold text-purple-600">{stats.charactersNoSpaces}</div>
          <div className="text-sm text-gray-500 uppercase tracking-wide mt-1">ไม่รวมช่องว่าง</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
          <div className="text-3xl font-bold text-orange-600">{stats.paragraphs}</div>
          <div className="text-sm text-gray-500 uppercase tracking-wide mt-1">ย่อหน้า</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="พิมพ์หรือวางข้อความที่นี่..."
          className="w-full min-h-[300px] border-none focus:ring-0 resize-y outline-none"
        />
        <div className="flex justify-between items-center pt-4 border-t mt-4 text-sm text-gray-500">
          <button
            onClick={() => setText('')}
            className="text-red-500 hover:text-red-700"
          >
            ล้างข้อความ
          </button>
        </div>
      </div>

      <AdSlot />
    </div>
  )
}
