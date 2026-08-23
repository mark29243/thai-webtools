'use client'

import { use, useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import { devTools } from '@/data/dev-tools'
import { AdSlot } from '@/components/AdSlot'
import { Copy, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import * as LucideIcons from 'lucide-react'

export default function DevToolPage({ params }: { params: Promise<{ action: string }> }) {
  const resolvedParams = use(params)
  const tool = devTools.find(t => t.id === resolvedParams.action)
  
  if (!tool) {
    notFound()
  }

  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string | null>(null)

  // Dynamically render icon
  const IconComponent = (LucideIcons as any)[tool.icon] || LucideIcons.Code2

  useEffect(() => {
    if (!input) {
      setOutput('')
      setError(null)
      return
    }

    try {
      setOutput(tool.action(input))
      setError(null)
    } catch (e: any) {
      setError(e.message || 'เกิดข้อผิดพลาดในการประมวลผล')
      setOutput('')
    }
  }, [input, tool])

  const handleCopy = () => {
    if (!output) return
    navigator.clipboard.writeText(output)
    toast.success('คัดลอกโค้ดลงคลิปบอร์ดแล้ว')
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
    setError(null)
    toast.success('ล้างข้อมูลเรียบร้อย')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <IconComponent className="w-8 h-8 text-orange-600 dark:text-orange-400" />
          <h1 className="text-3xl font-bold">{tool.name}</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">{tool.desc}</p>
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-3xl shadow-sm border dark:border-gray-800 space-y-6">
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              โค้ดต้นฉบับ (Input)
            </label>
            <button 
              onClick={handleClear}
              className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-4 h-4" /> ล้างข้อความ
            </button>
          </div>
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-48 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 resize-none font-mono text-sm break-all"
            placeholder={tool.placeholder}
            spellCheck="false"
          />
        </div>

        <div className="space-y-4 w-full">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              ผลลัพธ์ (Output)
            </label>
            <button 
              onClick={handleCopy}
              disabled={!output}
              className="text-sm text-orange-600 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-300 flex items-center gap-1 transition-colors disabled:opacity-50"
            >
              <Copy className="w-4 h-4" /> คัดลอก
            </button>
          </div>
          
          {error ? (
            <div className="w-full p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-2xl text-red-600 dark:text-red-400 break-words">
              {error}
            </div>
          ) : (
            <textarea 
              value={output}
              readOnly
              className="w-full h-48 p-4 bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 rounded-2xl outline-none text-gray-800 dark:text-gray-200 resize-none font-mono text-sm break-all"
              placeholder="ผลลัพธ์จะแสดงที่นี่แบบเรียลไทม์..."
              spellCheck="false"
            />
          )}
        </div>

      </div>

      <AdSlot />
    </div>
  )
}
