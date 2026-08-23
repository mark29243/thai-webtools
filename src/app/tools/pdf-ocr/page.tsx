'use client'

import { useState, useRef, useEffect } from 'react'
import { AdSlot } from '@/components/AdSlot'
import { FileUp, FileText, Loader2, Copy, Trash2, Languages } from 'lucide-react'
import toast from 'react-hot-toast'

export default function PdfOcrPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [extractedText, setExtractedText] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [language, setLanguage] = useState('tha+eng')
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Configure PDF.js worker dynamically to avoid SSR errors
    import('pdfjs-dist').then(pdfjsLib => {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`
    }).catch(console.error)
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return
    const file = e.target.files[0]
    
    if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
      setSelectedFile(file)
      setExtractedText('')
      setProgress(0)
    } else {
      toast.error('กรุณาอัปโหลดไฟล์ PDF หรือรูปภาพเท่านั้น')
    }
    
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const processOcr = async () => {
    if (!selectedFile) return
    
    setIsProcessing(true)
    setProgress(0)
    setExtractedText('')
    
    try {
      let imageSource: string | HTMLCanvasElement = ''

      if (selectedFile.type === 'application/pdf') {
        toast.success('กำลังอ่านไฟล์ PDF...', { duration: 2000 })
        const pdfjsLib = await import('pdfjs-dist')
        const arrayBuffer = await selectedFile.arrayBuffer()
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
        const pdf = await loadingTask.promise
        
        // For simplicity, we just OCR the first page in this tool.
        // A full pro tool might loop through all pages.
        const page = await pdf.getPage(1)
        const viewport = page.getViewport({ scale: 2.0 }) // High scale for better OCR
        
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        if (!context) throw new Error('Canvas context not available')
        
        canvas.width = viewport.width
        canvas.height = viewport.height
        
        // @ts-ignore
        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise
        
        imageSource = canvas
      } else {
        imageSource = URL.createObjectURL(selectedFile)
      }

      toast.success('กำลังสกัดข้อความ (OCR)...', { duration: 3000 })
      
      const Tesseract = (await import('tesseract.js')).default
      const result = await Tesseract.recognize(
        imageSource,
        language,
        {
          logger: m => {
            if (m.status === 'recognizing text') {
              setProgress(Math.round(m.progress * 100))
            }
          }
        }
      )

      setExtractedText(result.data.text)
      toast.success('สกัดข้อความสำเร็จ!')
      
    } catch (err) {
      console.error(err)
      toast.error('เกิดข้อผิดพลาดในการอ่านข้อความ')
    } finally {
      setIsProcessing(false)
    }
  }

  const copyToClipboard = () => {
    if (!extractedText) return
    navigator.clipboard.writeText(extractedText)
    toast.success('คัดลอกข้อความแล้ว')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">PDF to Text (OCR)</h1>
        <p className="text-gray-600 dark:text-gray-400">สกัดข้อความจากรูปภาพหรือไฟล์ PDF ที่ถูกสแกน ด้วยเทคโนโลยี AI (OCR)</p>
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-3xl shadow-sm border dark:border-gray-800 space-y-6">
        
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
          <div className="flex items-center gap-3">
            <Languages className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-gray-700 dark:text-gray-300">ภาษาของเอกสาร</span>
          </div>
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            className="p-2 border border-blue-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
          >
            <option value="tha+eng">ไทย + อังกฤษ</option>
            <option value="tha">ไทย (Thai)</option>
            <option value="eng">อังกฤษ (English)</option>
          </select>
        </div>

        {!selectedFile ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors"
          >
            <FileUp className="w-12 h-12 text-blue-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">คลิกหรือลากไฟล์ PDF / รูปภาพมาวางที่นี่</h3>
            <p className="text-sm text-gray-500 mt-2">รองรับ .pdf, .jpg, .png</p>
          </div>
        ) : (
          <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border dark:border-gray-700 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8" />
            </div>
            <p className="font-semibold text-gray-800 dark:text-gray-200 mb-1">{selectedFile.name}</p>
            <p className="text-sm text-gray-500 mb-6">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            
            <div className="flex gap-4">
              <button 
                onClick={() => setSelectedFile(null)}
                className="px-6 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                เปลี่ยนไฟล์
              </button>
              <button 
                onClick={processOcr}
                disabled={isProcessing}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center gap-2 transition-colors shadow-sm disabled:opacity-50"
              >
                {isProcessing ? <><Loader2 className="w-5 h-5 animate-spin" /> กำลังประมวลผล</> : 'เริ่มสกัดข้อความ'}
              </button>
            </div>
            
            {isProcessing && (
              <div className="w-full max-w-md mt-6">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <span>กำลังแปลงภาพเป็นข้อความ...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            )}
          </div>
        )}

        <input 
          type="file" 
          accept=".pdf,image/*" 
          className="hidden" 
          ref={fileInputRef}
          onChange={handleFileChange}
        />

        {extractedText && (
          <div className="space-y-4 pt-4 border-t dark:border-gray-800">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">ข้อความที่สกัดได้</h3>
              <div className="flex gap-2">
                <button 
                  onClick={copyToClipboard}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors"
                >
                  <Copy className="w-4 h-4" /> คัดลอก
                </button>
                <button 
                  onClick={() => setExtractedText('')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-sm font-medium transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> ล้าง
                </button>
              </div>
            </div>
            <textarea 
              className="w-full h-64 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 resize-y"
              value={extractedText}
              onChange={(e) => setExtractedText(e.target.value)}
              spellCheck="false"
            />
          </div>
        )}
      </div>

      <AdSlot />
    </div>
  )
}
