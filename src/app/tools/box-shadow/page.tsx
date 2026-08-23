'use client'

import { useState } from 'react'
import { AdSlot } from '@/components/AdSlot'
import { Copy } from 'lucide-react'
import toast from 'react-hot-toast'

export default function BoxShadowPage() {
  const [hOffset, setHOffset] = useState(10)
  const [vOffset, setVOffset] = useState(10)
  const [blur, setBlur] = useState(15)
  const [spread, setSpread] = useState(0)
  const [color, setColor] = useState('#000000')
  const [opacity, setOpacity] = useState(20)
  const [inset, setInset] = useState(false)
  const [boxColor, setBoxColor] = useState('#ffffff')
  const [bgColor, setBgColor] = useState('#f3f4f6')

  // Convert hex + opacity to rgba
  const hexToRgba = (hex: string, op: number) => {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16)
      g = parseInt(hex[2] + hex[2], 16)
      b = parseInt(hex[3] + hex[3], 16)
    } else if (hex.length === 7) {
      r = parseInt(hex.substring(1, 3), 16)
      g = parseInt(hex.substring(3, 5), 16)
      b = parseInt(hex.substring(5, 7), 16)
    }
    return `rgba(${r}, ${g}, ${b}, ${op / 100})`
  }

  const shadowValue = `${inset ? 'inset ' : ''}${hOffset}px ${vOffset}px ${blur}px ${spread}px ${hexToRgba(color, opacity)}`
  const cssCode = `box-shadow: ${shadowValue};\n-webkit-box-shadow: ${shadowValue};\n-moz-box-shadow: ${shadowValue};`

  const handleCopy = () => {
    navigator.clipboard.writeText(cssCode)
    toast.success('คัดลอกโค้ด CSS แล้ว')
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">CSS Box Shadow Generator</h1>
        <p className="text-gray-600 dark:text-gray-400">สร้างเงาให้กล่องข้อความ (Box Shadow) และคัดลอกโค้ด CSS ไปใช้ได้ทันที</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* Controls Panel */}
        <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-3xl shadow-sm border dark:border-gray-800 space-y-6">
          
          {/* Sliders */}
          <div className="space-y-5">
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Shift Right (แกน X): {hOffset}px</label>
              </div>
              <input type="range" min="-50" max="50" value={hOffset} onChange={(e) => setHOffset(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Shift Down (แกน Y): {vOffset}px</label>
              </div>
              <input type="range" min="-50" max="50" value={vOffset} onChange={(e) => setVOffset(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Spread (การกระจาย): {spread}px</label>
              </div>
              <input type="range" min="-50" max="50" value={spread} onChange={(e) => setSpread(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Blur (ความเบลอ): {blur}px</label>
              </div>
              <input type="range" min="0" max="100" value={blur} onChange={(e) => setBlur(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Opacity (ความโปร่งใสเงา): {opacity}%</label>
              </div>
              <input type="range" min="0" max="100" value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input 
              type="checkbox" 
              id="inset" 
              checked={inset} 
              onChange={(e) => setInset(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor="inset" className="font-medium text-gray-700 dark:text-gray-300 cursor-pointer">เงาด้านในกล่อง (Inset)</label>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">สีเงา</label>
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-10 rounded cursor-pointer border-0 p-0" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">สีกล่อง</label>
              <input type="color" value={boxColor} onChange={(e) => setBoxColor(e.target.value)} className="w-full h-10 rounded cursor-pointer border-0 p-0" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">สีพื้นหลัง</label>
              <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full h-10 rounded cursor-pointer border-0 p-0" />
            </div>
          </div>

        </div>

        {/* Preview Panel */}
        <div className="space-y-6 flex flex-col">
          <div 
            className="flex-1 rounded-3xl border border-gray-200 dark:border-gray-700 flex items-center justify-center min-h-[300px] transition-colors"
            style={{ backgroundColor: bgColor }}
          >
            <div 
              className="w-48 h-48 sm:w-64 sm:h-64 rounded-2xl transition-all duration-200"
              style={{ backgroundColor: boxColor, boxShadow: shadowValue }}
            ></div>
          </div>

          <div className="relative group">
            <pre className="p-4 bg-gray-900 text-green-400 rounded-xl overflow-x-auto text-sm font-mono whitespace-pre-wrap">
              {cssCode}
            </pre>
            <button 
              onClick={handleCopy}
              className="absolute top-3 right-3 p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
              title="คัดลอกโค้ด"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <AdSlot />
    </div>
  )
}
