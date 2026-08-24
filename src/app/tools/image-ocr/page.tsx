'use client'

import { useState, useRef, useEffect } from 'react'
import { AdSlot } from '@/components/AdSlot'
import { 
  FileUp, 
  Image as ImageIcon, 
  Loader2, 
  Copy, 
  Trash2, 
  Download, 
  Languages, 
  Sparkles, 
  Sliders, 
  Check, 
  FileText,
  ScanLine
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function ImageOcrPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [extractedText, setExtractedText] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [statusMessage, setStatusMessage] = useState('')
  const [language, setLanguage] = useState('tha+eng')
  const [highContrast, setHighContrast] = useState(false)
  const [copied, setCopied] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Handle file input
  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('กรุณาอัปโหลดไฟล์รูปภาพ (PNG, JPG, WEBP)')
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string)
      setExtractedText('')
      setProgress(0)
      setStatusMessage('')
    }
    reader.readAsDataURL(file)
  }

  // Handle Paste from clipboard (Ctrl+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (!items) return
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile()
          if (file) {
            handleFile(file)
            toast.success('วางรูปภาพจากคลิปบอร์ดแล้ว!')
            break
          }
        }
      }
    }

    window.addEventListener('paste', handlePaste)
    return () => window.removeEventListener('paste', handlePaste)
  }, [])

  // Process OCR
  const processImageOcr = async () => {
    if (!selectedImage) {
      toast.error('กรุณาเลือกรูปภาพก่อน')
      return
    }

    setIsProcessing(true)
    setProgress(0)
    setStatusMessage('กำลังโหลดโมเดล OCR...')
    setExtractedText('')

    try {
      let imageToProcess: string | HTMLCanvasElement = selectedImage

      // Apply High Contrast enhancement on Canvas if requested
      if (highContrast) {
        setStatusMessage('กำลังปรับภาพให้คมชัด (High Contrast)...')
        const img = new Image()
        img.src = selectedImage
        await new Promise((resolve) => { img.onload = resolve })

        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (ctx) {
          canvas.width = img.width
          canvas.height = img.height
          ctx.drawImage(img, 0, 0)
          
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const data = imgData.data
          // Grayscale + Binarization threshold
          for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114)
            const val = avg > 140 ? 255 : 0 // threshold
            data[i] = val
            data[i + 1] = val
            data[i + 2] = val
          }
          ctx.putImageData(imgData, 0, 0)
          imageToProcess = canvas
        }
      }

      setStatusMessage('กำลังวิเคราะห์และแกะตัวอักษร...')
      const Tesseract = (await import('tesseract.js')).default

      const result = await Tesseract.recognize(
        imageToProcess,
        language,
        {
          logger: m => {
            if (m.status === 'recognizing text') {
              setProgress(Math.round(m.progress * 100))
              setStatusMessage(`กำลังประมวลผล ${Math.round(m.progress * 100)}%`)
            } else {
              setStatusMessage(m.status)
            }
          }
        }
      )

      const text = result.data.text.trim()
      setExtractedText(text || 'ไม่พบข้อความในรูปภาพ')
      if (text) {
        toast.success('แกะข้อความสำเร็จ!')
      } else {
        toast('ไม่พบข้อความในภาพ ลองเปลี่ยนภาษาหรือปรับ Contrast', { icon: '🔍' })
      }
    } catch (err: any) {
      console.error(err)
      toast.error('เกิดข้อผิดพลาดในการประมวลผล OCR')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCopy = () => {
    if (!extractedText) return
    navigator.clipboard.writeText(extractedText)
    setCopied(true)
    toast.success('คัดลอกข้อความแล้ว!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadTxt = () => {
    if (!extractedText) return
    const blob = new Blob([extractedText], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `extracted-text-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('ดาวน์โหลดไฟล์ .txt แล้ว')
  }

  const handleClear = () => {
    setSelectedImage(null)
    setExtractedText('')
    setProgress(0)
    setStatusMessage('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl text-white shadow-md">
            <ScanLine className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">แกะข้อความจากรูปภาพ (Image to Text OCR)</h1>
            <p className="text-gray-600 dark:text-gray-400">
              แปลงรูปภาพ เอกสาร สลิป ป้าย หรือข้อความที่แคปหน้าจอ ให้เป็นข้อความพิมพ์ได้ (รองรับภาษาไทย อังกฤษ ญี่ปุ่น จีน) ปลอดภัย 100% ประมวลผลบนเครื่องของคุณ
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left: Upload & Image Options */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border dark:border-gray-800 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-indigo-500" /> รูปภาพต้นฉบับ
              </h2>
              {selectedImage && (
                <button
                  onClick={handleClear}
                  className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1 font-medium"
                >
                  <Trash2 className="w-3.5 h-3.5" /> ล้างรูป
                </button>
              )}
            </div>

            {/* Drop Zone */}
            {!selectedImage ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={e => {
                  e.preventDefault()
                  if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0])
                }}
                className="border-2 border-dashed border-indigo-200 dark:border-indigo-900/60 rounded-3xl p-8 sm:p-12 text-center hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors cursor-pointer bg-indigo-50/30 dark:bg-indigo-950/10 space-y-4"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
                  className="hidden"
                />
                <div className="w-16 h-16 mx-auto bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center">
                  <FileUp className="w-8 h-8" />
                </div>
                <div>
                  <p className="font-bold text-gray-800 dark:text-gray-200 text-base">
                    คลิกเพื่อเลือกรูปภาพ หรือ ลากไฟล์มาวางที่นี่
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    รองรับ PNG, JPG, JPEG, WEBP หรือกด <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-[11px]">Ctrl + V</kbd> เพื่อวางภาพที่แคป
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-950 flex items-center justify-center max-h-[350px]">
                  <img
                    src={selectedImage}
                    alt="Preview"
                    className={`max-h-[350px] w-auto object-contain transition-all ${
                      highContrast ? 'filter grayscale contrast-200' : ''
                    }`}
                  />
                  {highContrast && (
                    <div className="absolute top-2 right-2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                      High Contrast Mode
                    </div>
                  )}
                </div>

                {/* Settings */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1">
                      <Languages className="w-3.5 h-3.5 text-indigo-500" /> ภาษาในรูปภาพ
                    </label>
                    <select
                      value={language}
                      onChange={e => setLanguage(e.target.value)}
                      disabled={isProcessing}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="tha+eng">ภาษาไทย + อังกฤษ (แนะนำ)</option>
                      <option value="tha">ภาษาไทยล้วน</option>
                      <option value="eng">English Only</option>
                      <option value="jpn">日本語 (Japanese)</option>
                      <option value="chi_sim">中文 (Chinese Simplified)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1">
                      <Sliders className="w-3.5 h-3.5 text-indigo-500" /> ปรับภาพสลิป/เอกสาร
                    </label>
                    <button
                      type="button"
                      onClick={() => setHighContrast(!highContrast)}
                      className={`w-full px-3 py-2 rounded-xl text-sm font-medium border transition-colors flex items-center justify-between ${
                        highContrast
                          ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700'
                          : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <span>เพิ่มความคมชัด (High Contrast)</span>
                      <span>{highContrast ? 'เปิด' : 'ปิด'}</span>
                    </button>
                  </div>
                </div>

                <button
                  onClick={processImageOcr}
                  disabled={isProcessing}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-base"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {statusMessage || 'กำลังอ่านข้อความ...'}
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      เริ่มแกะข้อความจากรูปภาพ
                    </>
                  )}
                </button>

                {isProcessing && (
                  <div className="space-y-1.5">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full transition-all duration-300 rounded-full"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{statusMessage}</span>
                      <span>{progress}%</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Extracted Text Editor */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border dark:border-gray-800 space-y-4 flex flex-col h-full min-h-[450px]">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-500" /> ข้อความที่แกะได้ (Extracted Text)
              </h2>
              {extractedText && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'คัดลอกแล้ว' : 'คัดลอก'}
                  </button>
                  <button
                    onClick={handleDownloadTxt}
                    className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" /> บันทึก .txt
                  </button>
                </div>
              )}
            </div>

            <textarea
              value={extractedText}
              onChange={e => setExtractedText(e.target.value)}
              placeholder="ข้อความที่แกะได้จากรูปภาพจะปรากฏที่นี่ และคุณสามารถแก้ไขหรือคัดลอกได้ทันที..."
              className="flex-1 w-full min-h-[300px] p-4 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm leading-relaxed outline-none focus:ring-2 focus:ring-indigo-500 font-sans resize-none whitespace-pre-wrap"
            />

            {extractedText && (
              <div className="flex justify-between text-xs text-gray-400 pt-1">
                <span>จำนวน {extractedText.length.toLocaleString()} ตัวอักษร</span>
                <span>จำนวน {extractedText.split(/\s+/).filter(Boolean).length.toLocaleString()} คำ</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <AdSlot />
    </div>
  )
}
