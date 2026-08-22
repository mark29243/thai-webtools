'use client'

import { useState } from 'react'
import { AdSlot } from '@/components/AdSlot'

export default function ColorConverterPage() {
  const [hex, setHex] = useState('#3B82F6')

  // Helper to safely parse HEX to RGB
  const hexToRgb = (h: string) => {
    let r = 0, g = 0, b = 0
    if (h.length === 4) {
      r = parseInt(h[1] + h[1], 16)
      g = parseInt(h[2] + h[2], 16)
      b = parseInt(h[3] + h[3], 16)
    } else if (h.length === 7) {
      r = parseInt(h.substring(1, 3), 16)
      g = parseInt(h.substring(3, 5), 16)
      b = parseInt(h.substring(5, 7), 16)
    }
    return isNaN(r) ? null : { r, g, b }
  }

  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1).toUpperCase()
  }

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setHex(val)
  }

  const rgb = hexToRgb(hex)
  const rgbString = rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : 'Invalid Color'

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Color Picker & Converter</h1>
        <p className="text-gray-600">เครื่องมือเลือกสีและแปลงรหัสสี HEX, RGB</p>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border grid md:grid-cols-2 gap-8 items-center">
        <div className="flex flex-col items-center gap-6">
          <div 
            className="w-48 h-48 rounded-2xl shadow-inner border-4 border-gray-100"
            style={{ backgroundColor: rgb ? hex : '#ccc' }}
          />
          <input
            type="color"
            value={rgb ? hex : '#cccccc'}
            onChange={handleHexChange}
            className="w-24 h-12 rounded cursor-pointer"
          />
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">HEX Code</label>
            <input
              type="text"
              value={hex}
              onChange={handleHexChange}
              className="w-full border rounded-lg p-3 font-mono focus:ring-2 focus:ring-blue-500 outline-none uppercase"
              placeholder="#000000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">RGB</label>
            <input
              type="text"
              readOnly
              value={rgbString}
              className="w-full bg-gray-50 border rounded-lg p-3 font-mono outline-none text-gray-600"
            />
          </div>
        </div>
      </div>

      <AdSlot />
    </div>
  )
}
