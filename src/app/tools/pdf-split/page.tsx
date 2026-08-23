'use client'

import { useState, useRef } from 'react'
import { AdSlot } from '@/components/AdSlot'
import { FileUp, Scissors, Download, FileText, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { PDFDocument } from 'pdf-lib'

export default function PdfSplitPage() {
  const [file, setFile] = useState<File | null>(null)
  const [pageCount, setPageCount] = useState<number>(0)
  const [startPage, setStartPage] = useState<number | ''>('')
  const [endPage, setEndPage] = useState<number | ''>('')
  const [isSplitting, setIsSplitting] = useState(false)
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
    setStartPage('')
    setEndPage('')
    
    // Read page count
    try {
      const arrayBuffer = await selected.arrayBuffer()
      const pdfDoc = await PDFDocument.load(arrayBuffer)
      setPageCount(pdfDoc.getPageCount())
    } catch (err) {
      toast.error('ไม่สามารถอ่านไฟล์ PDF ได้ ไฟล์อาจถูกเข้ารหัสไว้')
      setFile(null)
    }

    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSplit = async () => {
    if (!file || !startPage || !endPage) {
      toast.error('กรุณากรอกหน้าเริ่มต้นและหน้าสิ้นสุด')
      return
    }
    
    const start = Number(startPage)
    const end = Number(endPage)

    if (start < 1 || end > pageCount || start > end) {
      toast.error(`กรุณากรอกช่วงหน้าให้ถูกต้อง (1 ถึง ${pageCount})`)
      return
    }

    setIsSplitting(true)
    const splitToast = toast.loading('กำลังแยกไฟล์ PDF...')

    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await PDFDocument.load(arrayBuffer)
      const newPdf = await PDFDocument.create()

      // Pages are 0-indexed
      const indices = []
      for (let i = start - 1; i <= end - 1; i++) {
        indices.push(i)
      }

      const copiedPages = await newPdf.copyPages(pdf, indices)
      copiedPages.forEach((page) => newPdf.addPage(page))

      const resultPdfBytes = await newPdf.save()
      const blob = new Blob([resultPdfBytes as any], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      
      setResultUrl(url)
      toast.success(`แยกไฟล์สำเร็จ (หน้า ${start}-${end})`, { id: splitToast })
    } catch (error) {
      console.error(error)
      toast.error('เกิดข้อผิดพลาดในการแยกไฟล์ PDF', { id: splitToast })
    } finally {
      setIsSplitting(false)
    }
  }

  const handleClear = () => {
    setFile(null)
    setPageCount(0)
    setStartPage('')
    setEndPage('')
    setResultUrl(null)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Split PDF</h1>
        <p className="text-gray-600 dark:text-gray-400">แยกหน้าไฟล์ PDF โดยระบุช่วงหน้าที่ต้องการ ทำงานบนเครื่องของคุณ 100%</p>
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
                <FileText className="w-8 h-8 text-red-500" />
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-200 truncate max-w-[200px] sm:max-w-[400px]">{file.name}</p>
                  <p className="text-sm text-gray-500">จำนวนทั้งหมด {pageCount} หน้า</p>
                </div>
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
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ตั้งแต่หน้า</label>
                    <input 
                      type="number" 
                      min={1} 
                      max={pageCount}
                      value={startPage}
                      onChange={(e) => setStartPage(e.target.value ? Number(e.target.value) : '')}
                      className="w-full p-4 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                      placeholder="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ถึงหน้า</label>
                    <input 
                      type="number" 
                      min={1} 
                      max={pageCount}
                      value={endPage}
                      onChange={(e) => setEndPage(e.target.value ? Number(e.target.value) : '')}
                      className="w-full p-4 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                      placeholder={pageCount.toString()}
                    />
                  </div>
                </div>

                <button 
                  onClick={handleSplit}
                  disabled={isSplitting || !startPage || !endPage}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
                >
                  {isSplitting ? 'กำลังแยกไฟล์...' : <><Scissors className="w-5 h-5" /> แยกไฟล์ PDF ทันที</>}
                </button>
              </div>
            ) : (
              <a 
                href={resultUrl}
                download={`split-${file.name}`}
                className="w-full py-4 block text-center bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg transition-colors"
              >
                <Download className="w-5 h-5 inline-block mr-2" /> ดาวน์โหลดไฟล์ PDF ที่แยกแล้ว
              </a>
            )}
          </div>
        )}
      </div>

      <AdSlot />
    </div>
  )
}
