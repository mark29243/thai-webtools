'use client'

import { useState } from 'react'
import { AdSlot } from '@/components/AdSlot'
import { Copy } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ColorConverterPage() {
  const [hex, setHex] = useState('#2563eb')
  const [rgb, setRgb] = useState('rgb(37, 99, 235)')
  const [hsl, setHsl] = useState('hsl(221, 83%, 53%)')

  const hexToRgb = (hexColor: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor)
    if (!result) return null
    return {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    }
  }

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255
    g /= 255
    b /= 255
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0, s = 0, l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break
        case g: h = (b - r) / d + 2; break
        case b: h = (r - g) / d + 4; break
      }
      h /= 6
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
  }

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHex = e.target.value
    setHex(newHex)
    const rgbVal = hexToRgb(newHex)
    if (rgbVal) {
      setRgb(`rgb(${rgbVal.r}, ${rgbVal.g}, ${rgbVal.b})`)
      const hslVal = rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b)
      setHsl(`hsl(${hslVal.h}, ${hslVal.s}%, ${hslVal.l}%)`)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`คัดลอก ${text} แล้ว!`)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Color Converter</h1>
        <p className="text-gray-600 dark:text-gray-400">แปลงโค้ดสีและเลือกสีที่ต้องการ (HEX, RGB, HSL)</p>
      </div>

      <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border dark:border-gray-800 grid md:grid-cols-2 gap-12">
        <div className="space-y-6 flex flex-col items-center justify-center">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">คลิกเพื่อเลือกสี</label>
          <div 
            className="w-48 h-48 rounded-full shadow-inner border-4 border-gray-100 dark:border-gray-800 relative overflow-hidden"
            style={{ backgroundColor: hex }}
          >
            <input 
              type="color" 
              value={hex}
              onChange={handleHexChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>

        <div className="space-y-6 flex flex-col justify-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">HEX</label>
            <div className="flex gap-2">
              <input type="text" value={hex.toUpperCase()} readOnly className="flex-1 p-4 border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-xl outline-none font-mono text-lg" />
              <button onClick={() => copyToClipboard(hex.toUpperCase())} className="p-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl transition-colors shrink-0">
                <Copy className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">RGB</label>
            <div className="flex gap-2">
              <input type="text" value={rgb} readOnly className="flex-1 p-4 border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-xl outline-none font-mono text-lg" />
              <button onClick={() => copyToClipboard(rgb)} className="p-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl transition-colors shrink-0">
                <Copy className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">HSL</label>
            <div className="flex gap-2">
              <input type="text" value={hsl} readOnly className="flex-1 p-4 border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-xl outline-none font-mono text-lg" />
              <button onClick={() => copyToClipboard(hsl)} className="p-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl transition-colors shrink-0">
                <Copy className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <AdSlot />
    </div>
  )
}
