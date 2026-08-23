'use client'

import { useState, useRef } from 'react'
import { AdSlot } from '@/components/AdSlot'
import { FileUp, Download, RotateCw, RotateCcw, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { PDFDocument, degrees } from 'pdf-lib'

export default function PdfRotatePage() {
  const [file, setFile] = useState<File | null>(null)
  const [rotation, setRotation] = useState<number>(90)
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
    setRotation(90) // reset rotation
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const rotateLeft = () => {
    setRotation(prev => (prev - 90) % 360)
  }

  const rotateRight = () => {
    setRotation(prev => (prev + 90) % 360)
  }

  const handleApplyRotation = async () => {
    if (!file) {
      toast.error('กรุณาเลือกไฟล์')
      return
    }
    
    if (rotation === 0 || rotation % 360 === 0) {
      toast.error('คุณยังไม่ได้หมุนหน้ากระดาษ')
      return
    }

    setIsProcessing(true)
    const processToast = toast.loading('กำลังหมุนไฟล์ PDF...')

    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdfDoc = await PDFDocument.load(arrayBuffer)
      
      const pages = pdfDoc.getPages()
      pages.forEach((page) => {
        const currentRotation = page.getRotation().angle
        page.setRotation(degrees(currentRotation + rotation))
      })

      const resultPdfBytes = await pdfDoc.save()
      const blob = new Blob([resultPdfBytes as any], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      
      setResultUrl(url)
      toast.success('หมุนหน้ากระดาษสำเร็จ!', { id: processToast })
    } catch (error) {
      console.error(error)
      toast.error('เกิดข้อผิดพลาดในการหมุนไฟล์ PDF', { id: processToast })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClear = () => {
    setFile(null)
    setResultUrl(null)
    setRotation(90)
  }

  // Display angle for UX
  const displayRotation = ((rotation % 360) + 360) % 360

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Rotate PDF</h1>
        <p className="text-gray-600 dark:text-gray-400">หมุนหน้ากระดาษ PDF ทุกหน้าพร้อมกัน ทำงานบนเครื่อง 100% ปลอดภัย ไม่ต้องอัปโหลด</p>
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
              <div className="space-y-6 flex flex-col items-center">
                
                <div className="flex gap-4 items-center p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl w-full justify-center border border-gray-100 dark:border-gray-700">
                  <button onClick={rotateLeft} className="p-4 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full shadow-sm transition-colors group">
                    <RotateCcw className="w-8 h-8 text-blue-600 dark:text-blue-400 group-hover:-rotate-45 transition-transform" />
                  </button>
                  <div className="text-center w-32">
                    <div className="text-3xl font-bold text-gray-800 dark:text-white">{displayRotation}°</div>
                    <div className="text-xs text-gray-500">ทิศทางการหมุน</div>
                  </div>
                  <button onClick={rotateRight} className="p-4 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full shadow-sm transition-colors group">
                    <RotateCw className="w-8 h-8 text-blue-600 dark:text-blue-400 group-hover:rotate-45 transition-transform" />
                  </button>
                </div>

                <button 
                  onClick={handleApplyRotation}
                  disabled={isProcessing || displayRotation === 0}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
                >
                  {isProcessing ? 'กำลังหมุนไฟล์...' : <><RotateCw className="w-5 h-5" /> บันทึกการหมุน PDF</>}
                </button>
              </div>
            ) : (
              <a 
                href={resultUrl}
                download={`rotated-${file.name}`}
                className="w-full py-4 block text-center bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg transition-colors"
              >
                <Download className="w-5 h-5 inline-block mr-2" /> ดาวน์โหลดไฟล์ PDF ที่หมุนแล้ว
              </a>
            )}
          </div>
        )}
      </div>

      <AdSlot />
    </div>
  )
}
