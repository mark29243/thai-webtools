'use client'
import { useState, useEffect } from 'react'
import { AdSlot } from '@/components/AdSlot'
import figlet from 'figlet'
import standard from 'figlet/importable-fonts/Standard'

figlet.parseFont('Standard', standard)

export default function AsciiArtPage() {
  const [text, setText] = useState('HELLO')
  const [output, setOutput] = useState('')

  useEffect(() => {
    try {
      if (!text.trim()) {
        setOutput('')
        return
      }
      figlet.text(text, { font: 'Standard' }, (err, data) => {
        if (!err && data) setOutput(data)
      })
    } catch(e) {}
  }, [text])

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">ASCII Art Generator</h1>
        <p className="text-gray-600 dark:text-gray-400">แปลงข้อความภาษาอังกฤษเป็นอาร์ตตัวอักษรใหญ่ๆ</p>
      </div>
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border dark:border-gray-800 space-y-6">
        <input 
          type="text" 
          className="w-full p-4 border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-purple-500" 
          value={text} 
          onChange={e=>setText(e.target.value)} 
          placeholder="พิมพ์ข้อความ (แนะนำภาษาอังกฤษ)..." 
        />
        <textarea 
          className="w-full h-[400px] p-4 bg-gray-900 text-green-400 font-mono text-xs sm:text-sm rounded-xl resize-none outline-none whitespace-pre overflow-auto" 
          readOnly 
          value={output} 
          spellCheck="false"
        />
      </div>
      <AdSlot />
    </div>
  )
}
