'use client'

import { useState, useRef } from 'react'
import { AdSlot } from '@/components/AdSlot'
import { FileUp, Trash2, Merge, Download, MoveUp, MoveDown } from 'lucide-react'
import toast from 'react-hot-toast'
import { PDFDocument } from 'pdf-lib'

interface PdfFile {
  id: string
  file: File
  name: string
  size: string
}

export default function PdfMergePage() {
  const [files, setFiles] = useState<PdfFile[]>([])
  const [isMerging, setIsMerging] = useState(false)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return
    
    const newFiles = Array.from(e.target.files).filter(f => f.type === 'application/pdf').map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      name: file.name,
      size: formatSize(file.size)
    }))

    if (newFiles.length !== e.target.files.length) {
      toast.error('กรุณาเลือกเฉพาะไฟล์ PDF เท่านั้น')
    }

    setFiles(prev => [...prev, ...newFiles])
    setResultUrl(null)
    
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeFile = (id: string) => {
    setFiles(files.filter(f => f.id !== id))
    setResultUrl(null)
  }

  const moveUp = (index: number) => {
    if (index === 0) return
    const newFiles = [...files]
    const temp = newFiles[index - 1]
    newFiles[index - 1] = newFiles[index]
    newFiles[index] = temp
    setFiles(newFiles)
  }

  const moveDown = (index: number) => {
    if (index === files.length - 1) return
    const newFiles = [...files]
    const temp = newFiles[index + 1]
    newFiles[index + 1] = newFiles[index]
    newFiles[index] = temp
    setFiles(newFiles)
  }

  const handleMerge = async () => {
    if (files.length < 2) {
      toast.error('กรุณาเลือกไฟล์ PDF อย่างน้อย 2 ไฟล์ขึ้นไป')
      return
    }

    setIsMerging(true)
    const mergeToast = toast.loading('กำลังรวมไฟล์ PDF...')

    try {
      const mergedPdf = await PDFDocument.create()

      for (const pdfFile of files) {
        const arrayBuffer = await pdfFile.file.arrayBuffer()
        const pdf = await PDFDocument.load(arrayBuffer)
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
        copiedPages.forEach((page) => mergedPdf.addPage(page))
      }

      const mergedPdfFile = await mergedPdf.save()
      const blob = new Blob([mergedPdfFile as any], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      
      setResultUrl(url)
      toast.success('รวมไฟล์ PDF สำเร็จ!', { id: mergeToast })
    } catch (error) {
      console.error(error)
      toast.error('เกิดข้อผิดพลาดในการรวมไฟล์ PDF', { id: mergeToast })
    } finally {
      setIsMerging(false)
    }
  }

  const handleClear = () => {
    setFiles([])
    setResultUrl(null)
    toast.success('ล้างข้อมูลเรียบร้อย')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Merge PDF</h1>
        <p className="text-gray-600 dark:text-gray-400">รวมไฟล์ PDF หลายๆ ไฟล์ให้เป็นไฟล์เดียว ทำงานบนเครื่องของคุณ 100% ปลอดภัย ไม่มีการอัปโหลดไฟล์</p>
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-3xl shadow-sm border dark:border-gray-800 space-y-6">
        
        {/* Dropzone */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors"
        >
          <FileUp className="w-12 h-12 text-blue-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">คลิกหรือลากไฟล์ PDF มาวางที่นี่</h3>
          <p className="text-sm text-gray-500 mt-2">เลือกได้หลายไฟล์พร้อมกัน</p>
          <input 
            type="file" 
            multiple 
            accept=".pdf,application/pdf" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 flex justify-between items-center">
              ไฟล์ที่เลือก ({files.length})
              <button onClick={handleClear} className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1">
                <Trash2 className="w-4 h-4" /> ล้างทั้งหมด
              </button>
            </h4>
            
            <div className="space-y-2">
              {files.map((file, index) => (
                <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="flex flex-col gap-1">
                      <button onClick={() => moveUp(index)} disabled={index === 0} className="p-1 text-gray-400 hover:text-blue-500 disabled:opacity-30 disabled:hover:text-gray-400"><MoveUp className="w-3 h-3" /></button>
                      <button onClick={() => moveDown(index)} disabled={index === files.length - 1} className="p-1 text-gray-400 hover:text-blue-500 disabled:opacity-30 disabled:hover:text-gray-400"><MoveDown className="w-3 h-3" /></button>
                    </div>
                    <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg flex items-center justify-center font-bold text-xs shrink-0">
                      PDF
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">{file.size}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeFile(file.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {!resultUrl ? (
              <button 
                onClick={handleMerge}
                disabled={files.length < 2 || isMerging}
                className="w-full py-4 mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
              >
                {isMerging ? 'กำลังรวมไฟล์...' : <><Merge className="w-5 h-5" /> รวมไฟล์ PDF ทันที</>}
              </button>
            ) : (
              <a 
                href={resultUrl}
                download="merged-thai-webtools.pdf"
                className="w-full py-4 mt-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" /> ดาวน์โหลดไฟล์ PDF ที่รวมแล้ว
              </a>
            )}
          </div>
        )}
      </div>

      <AdSlot />
    </div>
  )
}
