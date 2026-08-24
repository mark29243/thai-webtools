'use client'

import { useState } from 'react'
import { AdSlot } from '@/components/AdSlot'
import * as Diff from 'diff'

export default function DiffCheckerPage() {
  const [oldText, setOldText] = useState('')
  const [newText, setNewText] = useState('')
  const [diffResult, setDiffResult] = useState<Diff.Change[] | null>(null)

  const handleCompare = () => {
    if (!oldText.trim() && !newText.trim()) return
    const diff = Diff.diffLines(oldText, newText)
    setDiffResult(diff)
  }

  const handleClear = () => {
    setOldText('')
    setNewText('')
    setDiffResult(null)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Text Diff Checker</h1>
        <p className="text-gray-600 dark:text-gray-400">เครื่องมือเปรียบเทียบข้อความหรือโค้ด หาจุดที่แตกต่าง (Text & Code Comparison)</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            ข้อความต้นฉบับ (Original Text)
          </label>
          <textarea
            className="w-full h-64 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-none whitespace-pre"
            value={oldText}
            onChange={(e) => setOldText(e.target.value)}
            placeholder="วางข้อความหรือโค้ดต้นฉบับที่นี่..."
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            ข้อความที่แก้ไข (Modified Text)
          </label>
          <textarea
            className="w-full h-64 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-none whitespace-pre"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="วางข้อความหรือโค้ดที่ถูกแก้ไขที่นี่..."
          />
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleCompare}
          disabled={!oldText && !newText}
          className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all disabled:opacity-50"
        >
          เปรียบเทียบ (Compare)
        </button>
        <button
          onClick={handleClear}
          disabled={!oldText && !newText && !diffResult}
          className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold rounded-xl transition-all disabled:opacity-50"
        >
          ล้างค่า
        </button>
      </div>

      {diffResult && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
          <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">ผลลัพธ์ (Diff Result)</h3>
            <div className="flex gap-4 text-sm font-medium">
              <span className="text-red-500 flex items-center gap-1"><div className="w-3 h-3 bg-red-500/20 border border-red-500"></div> ลบออก</span>
              <span className="text-green-500 flex items-center gap-1"><div className="w-3 h-3 bg-green-500/20 border border-green-500"></div> เพิ่มเข้ามา</span>
            </div>
          </div>
          <div className="p-4 overflow-x-auto font-mono text-sm whitespace-pre">
            {diffResult.map((part, index) => {
              const bgClass = part.added
                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                : part.removed
                ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                : 'text-gray-800 dark:text-gray-300';
              
              const sign = part.added ? '+' : part.removed ? '-' : ' ';

              return (
                <span key={index} className={`block px-2 ${bgClass}`}>
                  {part.value.split('\n').map((line, i) => {
                    // diffLines sometimes includes a trailing newline in the value
                    if (i === part.value.split('\n').length - 1 && line === '') return null;
                    return (
                      <div key={i} className="flex">
                        <span className="select-none inline-block w-4 opacity-50">{sign}</span>
                        <span>{line}</span>
                      </div>
                    )
                  })}
                </span>
              );
            })}
          </div>
        </div>
      )}

      <AdSlot />
    </div>
  )
}
