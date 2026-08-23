'use client'

import { useState, useRef } from 'react'
import { AdSlot } from '@/components/AdSlot'
import { FileUp, Download, Droplet, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { PDFDocument, rgb, degrees } from 'pdf-lib'

export default function PdfWatermarkPage() {
  const [file, setFile] = useState<File | null>(null)
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL')
  const [opacity, setOpacity] = useState(50)
  const [fontSize, setFontSize] = useState(60)
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return

    if (selected.type !== 'application/pdf') {
      toast.error('กรุณาเลือกไฟล์ PDF เท่านั้น')
      return
    }

    setFile(selected)
    setResultUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleAddWatermark = async () => {
    if (!file || !watermarkText) {
      toast.error('กรุณาเลือกไฟล์และพิมพ์ข้อความลายน้ำ')
      return
    }

    setIsProcessing(true)
    const processToast = toast.loading('กำลังใส่ลายน้ำ...')

    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdfDoc = await PDFDocument.load(arrayBuffer)
      
      const pages = pdfDoc.getPages()
      
      // Calculate opacity (0 to 1)
      const alpha = opacity / 100

      pages.forEach((page) => {
        const { width, height } = page.getSize()
        
        // Simple positioning: Center of the page, rotated 45 degrees
        page.drawText(watermarkText, {
          x: width / 2 - (watermarkText.length * fontSize) / 4,
          y: height / 2 - fontSize / 2,
          size: fontSize,
          color: rgb(0.5, 0.5, 0.5), // Gray
          opacity: alpha,
          rotate: degrees(45),
        })
      })

      const resultPdfBytes = await pdfDoc.save()
      const blob = new Blob([resultPdfBytes as any], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      
      setResultUrl(url)
      toast.success('ใส่ลายน้ำสำเร็จ!', { id: processToast })
    } catch (error) {
      console.error(error)
      toast.error('เกิดข้อผิดพลาดในการใส่ลายน้ำ', { id: processToast })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClear = () => {
    setFile(null)
    setResultUrl(null)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Add Watermark</h1>
        <p className="text-gray-600 dark:text-gray-400">ใส่ข้อความลายน้ำ (Watermark) ลงในไฟล์ PDF ทุกหน้า ปลอดภัย ไม่มีการอัปโหลดไฟล์</p>
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-3xl shadow-sm border dark:border-gray-800 space-y-6">
        
        {!file ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors"
          >
            <FileUp className="w-12 h-12 text-blue-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">คลิกหรือลากไฟล์ PDF มาวางที่นี่</h3>
            <input 
              type="file" 
              accept=".pdf,application/pdf" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg flex items-center justify-center font-bold text-xs shrink-0">
                  PDF
                </div>
                <p className="font-medium text-gray-700 dark:text-gray-200 truncate max-w-[200px] sm:max-w-[400px]">{file.name}</p>
              </div>
              <button 
                onClick={handleClear}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="ลบไฟล์"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            {!resultUrl ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ข้อความลายน้ำ</label>
                  <input 
                    type="text" 
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                    className="w-full p-4 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                    placeholder="เช่น CONFIDENTIAL, สำเนาถูกต้อง"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium dark:text-gray-300">ความโปร่งใส (Opacity): {opacity}%</label>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={opacity}
                      onChange={(e) => setOpacity(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium dark:text-gray-300">ขนาดตัวอักษร: {fontSize}px</label>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="120"
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    />
                  </div>
                </div>

                <button 
                  onClick={handleAddWatermark}
                  disabled={isProcessing || !watermarkText}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
                >
                  {isProcessing ? 'กำลังใส่ลายน้ำ...' : <><Droplet className="w-5 h-5" /> ใส่ลายน้ำทันที</>}
                </button>
              </div>
            ) : (
              <a 
                href={resultUrl}
                download={`watermarked-${file.name}`}
                className="w-full py-4 block text-center bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg transition-colors"
              >
                <Download className="w-5 h-5 inline-block mr-2" /> ดาวน์โหลดไฟล์ PDF
              </a>
            )}
          </div>
        )}
      </div>

      <AdSlot />
    </div>
  )
}
