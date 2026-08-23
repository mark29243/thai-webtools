'use client'

import { useState } from 'react'
import { AdSlot } from '@/components/AdSlot'
import { Copy, RefreshCw, Palette } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CssGradientPage() {
  const [color1, setColor1] = useState('#4facfe')
  const [color2, setColor2] = useState('#00f2fe')
  const [angle, setAngle] = useState(90)
  const [type, setType] = useState<'linear' | 'radial'>('linear')

  const generateGradient = () => {
    if (type === 'linear') {
      return `linear-gradient(${angle}deg, ${color1}, ${color2})`
    }
    return `radial-gradient(circle, ${color1}, ${color2})`
  }

  const cssCode = `background: ${color1}; /* fallback for old browsers */\nbackground: -webkit-${generateGradient()};\nbackground: ${generateGradient()};`

  const handleCopy = () => {
    navigator.clipboard.writeText(cssCode)
    toast.success('คัดลอกโค้ด CSS แล้ว')
  }

  const handleRandom = () => {
    const randomColor = () => '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')
    setColor1(randomColor())
    setColor2(randomColor())
    setAngle(Math.floor(Math.random() * 360))
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">CSS Gradient Generator</h1>
        <p className="text-gray-600 dark:text-gray-400">เครื่องมือสร้างโค้ดไล่สีพื้นหลัง (Gradient Background) สำหรับนำไปใช้ในเว็บไซต์</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* Preview Panel */}
        <div 
          className="rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 h-[300px] lg:h-auto min-h-[400px] transition-all duration-300"
          style={{ background: generateGradient() }}
        ></div>

        {/* Controls Panel */}
        <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-3xl shadow-sm border dark:border-gray-800 space-y-8">
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">สีที่ 1</label>
              <div className="flex gap-2 items-center">
                <input 
                  type="color" 
                  value={color1}
                  onChange={(e) => setColor1(e.target.value)}
                  className="w-12 h-12 rounded cursor-pointer border-0 p-0"
                />
                <input 
                  type="text"
                  value={color1}
                  onChange={(e) => setColor1(e.target.value)}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 uppercase text-sm font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">สีที่ 2</label>
              <div className="flex gap-2 items-center">
                <input 
                  type="color" 
                  value={color2}
                  onChange={(e) => setColor2(e.target.value)}
                  className="w-12 h-12 rounded cursor-pointer border-0 p-0"
                />
                <input 
                  type="text"
                  value={color2}
                  onChange={(e) => setColor2(e.target.value)}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 uppercase text-sm font-mono"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-4">
              <button 
                onClick={() => setType('linear')}
                className={`flex-1 py-3 rounded-xl font-medium transition-colors ${type === 'linear' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' : 'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                Linear (เส้นตรง)
              </button>
              <button 
                onClick={() => setType('radial')}
                className={`flex-1 py-3 rounded-xl font-medium transition-colors ${type === 'radial' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' : 'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                Radial (วงกลม)
              </button>
            </div>

            {type === 'linear' && (
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">องศา (Angle): {angle}°</label>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={angle}
                  onChange={(e) => setAngle(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
              </div>
            )}
          </div>

          <div className="pt-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">CSS Code</h3>
              <div className="flex gap-2">
                <button 
                  onClick={handleRandom}
                  className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" /> สุ่มสีใหม่
                </button>
              </div>
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
      </div>

      <AdSlot />
    </div>
  )
}
