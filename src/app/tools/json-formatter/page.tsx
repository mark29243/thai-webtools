'use client'

import { useState } from 'react'
import { AdSlot } from '@/components/AdSlot'

export default function JsonFormatterPage() {
  const [input, setInput] = useState('')
  const [error, setError] = useState<string | null>(null)

  const formatJson = () => {
    try {
      if (!input.trim()) return
      const parsed = JSON.parse(input)
      const formatted = JSON.stringify(parsed, null, 2)
      setInput(formatted)
      setError(null)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Invalid JSON')
      }
    }
  }

  const minifyJson = () => {
    try {
      if (!input.trim()) return
      const parsed = JSON.parse(input)
      const minified = JSON.stringify(parsed)
      setInput(minified)
      setError(null)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Invalid JSON')
      }
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">JSON Formatter & Validator</h1>
        <p className="text-gray-600">จัดรูปแบบ JSON ให้สวยงามอ่านง่าย หรือย่อขนาดไฟล์ (Minify)</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
        <div className="flex gap-2">
          <button
            onClick={formatJson}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
          >
            Format / Beautify
          </button>
          <button
            onClick={minifyJson}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm font-medium"
          >
            Minify
          </button>
          <button
            onClick={() => setInput('')}
            className="px-4 py-2 text-red-500 hover:bg-red-50 rounded text-sm font-medium ml-auto"
          >
            Clear
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200 text-sm font-mono">
            Error: {error}
          </div>
        )}

        <textarea
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            setError(null)
          }}
          placeholder="วาง JSON ของคุณที่นี่..."
          className="w-full min-h-[400px] border rounded-lg p-4 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-y bg-gray-50"
          spellCheck="false"
        />
      </div>

      <AdSlot />
    </div>
  )
}
