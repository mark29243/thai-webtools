'use client'

import { use, useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import { textTools } from '@/data/text-tools'
import { AdSlot } from '@/components/AdSlot'
import { Copy, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import * as LucideIcons from 'lucide-react'

export default function TextToolPage({ params }: { params: Promise<{ action: string }> }) {
  const resolvedParams = use(params)
  const tool = textTools.find(t => t.id === resolvedParams.action)
  
  if (!tool) {
    notFound()
  }

  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')

  // Dynamically render icon
  const IconComponent = (LucideIcons as any)[tool.icon] || LucideIcons.Type

  useEffect(() => {
    try {
      setOutput(tool.action(input))
    } catch (e) {
      setOutput('เกิดข้อผิดพลาดในการแปลงข้อความ')
    }
  }, [input, tool])

  const handleCopy = () => {
    if (!output) return
    navigator.clipboard.writeText(output)
    toast.success('คัดลอกลงคลิปบอร์ดแล้ว')
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
    toast.success('ล้างข้อมูลเรียบร้อย')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <IconComponent className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-3xl font-bold">{tool.name}</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">{tool.desc}</p>
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-3xl shadow-sm border dark:border-gray-800 space-y-6">
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              ข้อความต้นฉบับ (Input)
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
            className="w-full h-48 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder={tool.placeholder}
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              ผลลัพธ์ (Output)
            </label>
            <button 
              onClick={handleCopy}
              disabled={!output}
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 transition-colors disabled:opacity-50"
            >
              <Copy className="w-4 h-4" /> คัดลอก
            </button>
          </div>
          <textarea 
            value={output}
            readOnly
            className="w-full h-48 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl outline-none text-gray-800 dark:text-gray-200 resize-none font-medium"
            placeholder="ผลลัพธ์จะแสดงที่นี่แบบเรียลไทม์..."
          />
        </div>

      </div>

      <AdSlot />
    </div>
  )
}
