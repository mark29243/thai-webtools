'use client'

import { useState } from 'react'
import { AdSlot } from '@/components/AdSlot'
import { Copy, Trash2, Code } from 'lucide-react'
import toast from 'react-hot-toast'

export default function JsonFormatterPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const formatJson = () => {
    try {
      if (!input.trim()) {
        setOutput('')
        setError('')
        return
      }
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed, null, 2))
      setError('')
      toast.success('จัดรูปแบบสำเร็จ!')
    } catch (err: any) {
      setError(err.message || 'รูปแบบ JSON ไม่ถูกต้อง')
      toast.error('JSON ไม่ถูกต้อง')
    }
  }

  const handleCopy = () => {
    if (!output) return
    navigator.clipboard.writeText(output)
    toast.success('คัดลอกลงคลิปบอร์ดแล้ว!')
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
    setError('')
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">JSON Formatter</h1>
        <p className="text-gray-600 dark:text-gray-400">จัดรูปแบบและตรวจสอบ JSON ให้สวยงามและอ่านง่าย (Validate & Format)</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 h-[600px]">
        {/* Input */}
        <div className="flex flex-col bg-white dark:bg-gray-900 rounded-2xl shadow-sm border dark:border-gray-800 overflow-hidden">
          <div className="flex justify-between items-center px-4 py-3 border-b dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
            <span className="font-semibold text-gray-700 dark:text-gray-300">Input JSON</span>
            <button 
              onClick={handleClear}
              className="text-gray-400 hover:text-red-500 transition-colors p-1"
              title="ล้างข้อมูล"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <textarea
            className="flex-1 w-full p-4 focus:outline-none resize-none font-mono text-sm bg-transparent"
            placeholder='{"name": "Thai WebTools", "awesome": true}'
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        {/* Output */}
        <div className="flex flex-col bg-white dark:bg-gray-900 rounded-2xl shadow-sm border dark:border-gray-800 overflow-hidden relative">
          <div className="flex justify-between items-center px-4 py-3 border-b dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
            <span className="font-semibold text-gray-700 dark:text-gray-300">Formatted Output</span>
            <button 
              onClick={handleCopy}
              className="text-blue-500 hover:text-blue-600 transition-colors flex items-center gap-1 text-sm font-medium"
            >
              <Copy className="w-4 h-4" /> คัดลอก
            </button>
          </div>
          <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900/50 p-4 relative">
            {error ? (
              <div className="text-red-500 font-mono text-sm p-4 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-900/30">
                ⚠️ {error}
              </div>
            ) : output ? (
              <pre className="font-mono text-sm text-green-700 dark:text-green-400">{output}</pre>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-50">
                <Code className="w-16 h-16 mb-4" />
                <p>ผลลัพธ์จะแสดงที่นี่</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={formatJson}
          className="px-12 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-colors transform hover:-translate-y-1 active:translate-y-0"
        >
          จัดรูปแบบ JSON
        </button>
      </div>

      <AdSlot />
    </div>
  )
}
