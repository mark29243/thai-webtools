'use client'

import { useState, useRef } from 'react'
import { AdSlot } from '@/components/AdSlot'
import { FileUp, Download, Hash, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { PDFDocument, rgb } from 'pdf-lib'

export default function PdfPageNumbersPage() {
  const [file, setFile] = useState<File | null>(null)
  const [position, setPosition] = useState<'bottom-right' | 'bottom-center' | 'top-right' | 'top-center'>('bottom-right')
  const [startNumber, setStartNumber] = useState(1)
  
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

  const handleAddPageNumbers = async () => {
    if (!file) {
      toast.error('กรุณาเลือกไฟล์ PDF')
      return
    }

    setIsProcessing(true)
    const processToast = toast.loading('กำลังรันหมายเลขหน้า...')

    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdfDoc = await PDFDocument.load(arrayBuffer)
      
      const pages = pdfDoc.getPages()
      
      pages.forEach((page, index) => {
        const { width, height } = page.getSize()
        const text = String(startNumber + index)
        const fontSize = 12
        const margin = 30
        
        // Calculate X and Y based on position
        let x = 0
        let y = 0

        // Approximate text width (naive calculation for standard fonts)
        const textWidth = text.length * (fontSize * 0.5)

        switch (position) {
          case 'bottom-right':
            x = width - margin - textWidth
            y = margin
            break
          case 'bottom-center':
            x = width / 2 - textWidth / 2
            y = margin
            break
          case 'top-right':
            x = width - margin - textWidth
            y = height - margin - fontSize
            break
          case 'top-center':
            x = width / 2 - textWidth / 2
            y = height - margin - fontSize
            break
        }
        
        page.drawText(text, {
          x,
          y,
          size: fontSize,
          color: rgb(0, 0, 0), // Black
        })
      })

      const resultPdfBytes = await pdfDoc.save()
      const blob = new Blob([resultPdfBytes as any], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      
      setResultUrl(url)
      toast.success('ใส่หมายเลขหน้าสำเร็จ!', { id: processToast })
    } catch (error) {
      console.error(error)
      toast.error('เกิดข้อผิดพลาดในการใส่หมายเลขหน้า', { id: processToast })
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
        <h1 className="text-3xl font-bold mb-2">Add Page Numbers</h1>
        <p className="text-gray-600 dark:text-gray-400">รันหมายเลขหน้าให้กับไฟล์ PDF อย่างรวดเร็ว ปลอดภัย ประมวลผลบนเครื่อง 100%</p>
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
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ตำแหน่งการวางเลขหน้า</label>
                    <select
                      value={position}
                      onChange={(e) => setPosition(e.target.value as any)}
                      className="w-full p-4 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none cursor-pointer"
                    >
                      <option value="bottom-right">ล่างขวา (Bottom Right)</option>
                      <option value="bottom-center">ตรงกลางด้านล่าง (Bottom Center)</option>
                      <option value="top-right">บนขวา (Top Right)</option>
                      <option value="top-center">ตรงกลางด้านบน (Top Center)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">เริ่มนับจากเลข</label>
                    <input 
                      type="number"
                      min={1}
                      value={startNumber}
                      onChange={(e) => setStartNumber(Number(e.target.value) || 1)}
                      className="w-full p-4 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>

                <button 
                  onClick={handleAddPageNumbers}
                  disabled={isProcessing}
                  className="w-full py-4 mt-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
                >
                  {isProcessing ? 'กำลังประมวลผล...' : <><Hash className="w-5 h-5" /> รันหมายเลขหน้า</>}
                </button>
              </div>
            ) : (
              <a 
                href={resultUrl}
                download={`numbered-${file.name}`}
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
