'use client'
import { useState, useEffect, useRef } from 'react'
import { AdSlot } from '@/components/AdSlot'
import JsBarcode from 'jsbarcode'
import { Download } from 'lucide-react'

export default function BarcodePage() {
  const [text, setText] = useState('123456789012')
  const [format, setFormat] = useState('CODE128')
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (svgRef.current && text) {
      try {
        JsBarcode(svgRef.current, text, {
          format,
          displayValue: true,
          width: 2,
          height: 100,
          margin: 10
        })
      } catch (e) {
        // invalid format for the barcode
      }
    }
  }, [text, format])

  const download = () => {
    const svg = svgRef.current
    if (!svg) return
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      if (ctx) ctx.drawImage(img, 0, 0)
      const a = document.createElement('a')
      a.download = 'barcode.png'
      a.href = canvas.toDataURL('image/png')
      a.click()
    }
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Barcode Generator</h1>
        <p className="text-gray-600 dark:text-gray-400">สร้างบาร์โค้ดสินค้า (CODE128, EAN, UPC, etc.)</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border dark:border-gray-800">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">ข้อมูลบาร์โค้ด</label>
            <input type="text" className="w-full p-3 border dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500" value={text} onChange={(e) => setText(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">รูปแบบ (Format)</label>
            <select className="w-full p-3 border dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500" value={format} onChange={(e) => setFormat(e.target.value)}>
              <option value="CODE128">CODE128 (รองรับอักษร/ตัวเลข)</option>
              <option value="EAN13">EAN-13 (สินค้าสากล 13 หลัก)</option>
              <option value="UPC">UPC (สินค้าอเมริกา 12 หลัก)</option>
              <option value="CODE39">CODE39</option>
              <option value="ITF14">ITF-14</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
          <div className="bg-white p-4 rounded-xl shadow-sm overflow-x-auto max-w-full">
            <svg ref={svgRef}></svg>
          </div>
          <button onClick={download} className="mt-6 flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="w-5 h-5" /> ดาวน์โหลดภาพ
          </button>
        </div>
      </div>
      <AdSlot />
    </div>
  )
}
