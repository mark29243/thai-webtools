'use client'

import { useState, useRef } from 'react'
import { AdSlot } from '@/components/AdSlot'
import { FileUp, Download, Info, Trash2, Edit3 } from 'lucide-react'
import toast from 'react-hot-toast'
import { PDFDocument } from 'pdf-lib'

export default function PdfMetadataPage() {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [subject, setSubject] = useState('')
  const [creator, setCreator] = useState('')
  
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
    
    // Attempt to read current metadata
    try {
      const arrayBuffer = await selected.arrayBuffer()
      const pdfDoc = await PDFDocument.load(arrayBuffer)
      
      setTitle(pdfDoc.getTitle() || '')
      setAuthor(pdfDoc.getAuthor() || '')
      setSubject(pdfDoc.getSubject() || '')
      setCreator(pdfDoc.getCreator() || '')
      
      toast.success('ดึงข้อมูลเดิมมาแสดงเรียบร้อย')
    } catch (err) {
      toast.error('ไม่สามารถอ่านข้อมูลเก่าได้ (อาจมีการเข้ารหัส)')
      setTitle('')
      setAuthor('')
      setSubject('')
      setCreator('')
    }

    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleUpdate = async () => {
    if (!file) {
      toast.error('กรุณาเลือกไฟล์')
      return
    }

    setIsProcessing(true)
    const processToast = toast.loading('กำลังอัปเดตข้อมูล PDF...')

    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdfDoc = await PDFDocument.load(arrayBuffer)
      
      if (title) pdfDoc.setTitle(title)
      if (author) pdfDoc.setAuthor(author)
      if (subject) pdfDoc.setSubject(subject)
      if (creator) pdfDoc.setCreator(creator)
      
      const resultPdfBytes = await pdfDoc.save()
      const blob = new Blob([resultPdfBytes as any], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      
      setResultUrl(url)
      toast.success('อัปเดตข้อมูลสำเร็จ!', { id: processToast })
    } catch (error) {
      console.error(error)
      toast.error('เกิดข้อผิดพลาดในการอัปเดตข้อมูล', { id: processToast })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClear = () => {
    setFile(null)
    setResultUrl(null)
    setTitle('')
    setAuthor('')
    setSubject('')
    setCreator('')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Edit PDF Metadata</h1>
        <p className="text-gray-600 dark:text-gray-400">ดูและแก้ไขข้อมูล Metadata (ชื่อเรื่อง ผู้เขียน) ที่ฝังอยู่ในไฟล์ PDF</p>
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
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title (ชื่อเอกสาร)</label>
                    <input 
                      type="text" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full p-4 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Author (ชื่อผู้สร้าง/องค์กร)</label>
                    <input 
                      type="text" 
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="w-full p-4 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject (หัวข้อ)</label>
                    <input 
                      type="text" 
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full p-4 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Creator (โปรแกรมที่สร้าง)</label>
                    <input 
                      type="text" 
                      value={creator}
                      onChange={(e) => setCreator(e.target.value)}
                      className="w-full p-4 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>

                <button 
                  onClick={handleUpdate}
                  disabled={isProcessing}
                  className="w-full py-4 mt-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
                >
                  {isProcessing ? 'กำลังบันทึก...' : <><Edit3 className="w-5 h-5" /> บันทึกข้อมูล Metadata</>}
                </button>
              </div>
            ) : (
              <a 
                href={resultUrl}
                download={`meta-${file.name}`}
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
