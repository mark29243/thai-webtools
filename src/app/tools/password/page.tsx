'use client'

import { useState, useEffect } from 'react'
import { AdSlot } from '@/components/AdSlot'
import { Copy, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

export default function PasswordGeneratorPage() {
  const [password, setPassword] = useState('')
  const [length, setLength] = useState(16)
  const [useUppercase, setUseUppercase] = useState(true)
  const [useLowercase, setUseLowercase] = useState(true)
  const [useNumbers, setUseNumbers] = useState(true)
  const [useSymbols, setUseSymbols] = useState(true)

  const generatePassword = () => {
    let charset = ''
    if (useLowercase) charset += 'abcdefghijklmnopqrstuvwxyz'
    if (useUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    if (useNumbers) charset += '0123456789'
    if (useSymbols) charset += '!@#$%^&*()_+~`|}{[]:;?><,./-='

    if (charset === '') {
      toast.error('กรุณาเลือกอย่างน้อย 1 เงื่อนไข')
      return
    }

    let newPassword = ''
    for (let i = 0, n = charset.length; i < length; ++i) {
      newPassword += charset.charAt(Math.floor(Math.random() * n))
    }
    setPassword(newPassword)
  }

  useEffect(() => {
    generatePassword()
  }, [length, useUppercase, useLowercase, useNumbers, useSymbols])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password)
    toast.success('คัดลอกรหัสผ่านแล้ว!')
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Password Generator</h1>
        <p className="text-gray-600 dark:text-gray-400">สุ่มรหัสผ่านที่ปลอดภัย คาดเดายาก</p>
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-3xl shadow-sm border dark:border-gray-800 space-y-8">
        <div className="relative group">
          <input
            type="text"
            value={password}
            readOnly
            className="w-full text-center text-3xl font-mono tracking-wider p-6 bg-gray-50 dark:bg-gray-800 border-2 dark:border-gray-700 rounded-2xl outline-none text-gray-900 dark:text-gray-100"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
            <button 
              onClick={generatePassword}
              className="p-3 bg-white dark:bg-gray-700 shadow-md rounded-xl text-gray-500 hover:text-blue-600 transition-colors"
              title="สุ่มใหม่"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button 
              onClick={copyToClipboard}
              className="p-3 bg-blue-600 shadow-md rounded-xl text-white hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Copy className="w-5 h-5" />
              <span className="hidden sm:inline font-medium pr-1">คัดลอก</span>
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium dark:text-gray-300">ความยาวรหัสผ่าน: {length}</label>
            </div>
            <input
              type="range"
              min="8"
              max="64"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center space-x-3 p-3 border dark:border-gray-700 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <input type="checkbox" checked={useUppercase} onChange={(e) => setUseUppercase(e.target.checked)} className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
              <span className="text-gray-700 dark:text-gray-300 font-medium">A-Z</span>
            </label>
            <label className="flex items-center space-x-3 p-3 border dark:border-gray-700 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <input type="checkbox" checked={useLowercase} onChange={(e) => setUseLowercase(e.target.checked)} className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
              <span className="text-gray-700 dark:text-gray-300 font-medium">a-z</span>
            </label>
            <label className="flex items-center space-x-3 p-3 border dark:border-gray-700 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <input type="checkbox" checked={useNumbers} onChange={(e) => setUseNumbers(e.target.checked)} className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
              <span className="text-gray-700 dark:text-gray-300 font-medium">0-9</span>
            </label>
            <label className="flex items-center space-x-3 p-3 border dark:border-gray-700 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <input type="checkbox" checked={useSymbols} onChange={(e) => setUseSymbols(e.target.checked)} className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
              <span className="text-gray-700 dark:text-gray-300 font-medium">!@#$%^&*</span>
            </label>
          </div>
        </div>
      </div>

      <AdSlot />
    </div>
  )
}
