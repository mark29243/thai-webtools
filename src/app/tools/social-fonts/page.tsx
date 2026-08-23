'use client'
import { useState } from 'react'
import { AdSlot } from '@/components/AdSlot'
import { Copy } from 'lucide-react'
import toast from 'react-hot-toast'

const fontMaps = [
  { name: 'Math Bold', map: (c: string) => c.replace(/[a-zA-Z]/g, m => String.fromCodePoint(m.charCodeAt(0) + (m.toLowerCase()===m ? 119789 : 119795))) },
  { name: 'Math Italic', map: (c: string) => c.replace(/[a-zA-Z]/g, m => m==='h'?'ℎ':String.fromCodePoint(m.charCodeAt(0) + (m.toLowerCase()===m ? 119815 : 119821))) },
  { name: 'Script', map: (c: string) => c.replace(/[a-zA-Z]/g, m => String.fromCodePoint(m.charCodeAt(0) + (m.toLowerCase()===m ? 119945 : 119951))) },
  { name: 'Fraktur', map: (c: string) => c.replace(/[a-zA-Z]/g, m => String.fromCodePoint(m.charCodeAt(0) + (m.toLowerCase()===m ? 120049 : 120055))) },
  { name: 'Double Struck', map: (c: string) => c.replace(/[a-zA-Z]/g, m => String.fromCodePoint(m.charCodeAt(0) + (m.toLowerCase()===m ? 120101 : 120107))) },
  { name: 'Circled', map: (c: string) => c.replace(/[a-zA-Z]/g, m => String.fromCodePoint(m.charCodeAt(0) + (m.toLowerCase()===m ? 9327 : 9333))) },
  { name: 'Squared', map: (c: string) => c.replace(/[a-zA-Z]/g, m => String.fromCodePoint(m.charCodeAt(0) + (m.toLowerCase()===m ? 127265 : 127215))) },
  { name: 'Fullwidth', map: (c: string) => c.replace(/[a-zA-Z]/g, m => String.fromCodePoint(m.charCodeAt(0) + 65248)) }
]

export default function SocialFontsPage() {
  const [text, setText] = useState('Hello World')
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Social Media Fonts</h1>
        <p className="text-gray-600 dark:text-gray-400">แปลงข้อความภาษาอังกฤษเป็นฟอนต์แปลกๆ สำหรับ IG, Twitter, Facebook</p>
      </div>
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border dark:border-gray-800">
        <input 
          type="text" 
          className="w-full p-4 text-xl border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-pink-500 mb-6" 
          value={text} 
          onChange={(e)=>setText(e.target.value)} 
          placeholder="พิมพ์ภาษาอังกฤษที่นี่..." 
        />
        <div className="space-y-4">
          {fontMaps.map((f, i) => {
            const mapped = f.map(text)
            return (
              <div key={i} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl overflow-hidden">
                <div className="min-w-0 flex-1 pr-4">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{f.name}</div>
                  <div className="text-lg text-gray-900 dark:text-gray-100 break-words">{mapped || '...'}</div>
                </div>
                <button 
                  onClick={() => {navigator.clipboard.writeText(mapped);toast.success('คัดลอกแล้ว')}} 
                  className="p-3 text-pink-600 dark:text-pink-400 hover:bg-pink-100 dark:hover:bg-pink-900/30 rounded-lg flex-shrink-0 transition-colors"
                >
                  <Copy className="w-5 h-5"/>
                </button>
              </div>
            )
          })}
        </div>
      </div>
      <AdSlot />
    </div>
  )
}
