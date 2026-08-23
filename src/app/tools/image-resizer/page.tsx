'use client'

import { useState, useRef } from 'react'
import { AdSlot } from '@/components/AdSlot'
import { Image as ImageIcon, Download, Trash2, Lock, Unlock, UploadCloud } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ImageResizerPage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [fileName, setFileName] = useState('')
  const [fileType, setFileType] = useState('image/jpeg')
  
  const [originalWidth, setOriginalWidth] = useState(0)
  const [originalHeight, setOriginalHeight] = useState(0)
  
  const [width, setWidth] = useState<number | ''>('')
  const [height, setHeight] = useState<number | ''>('')
  const [maintainRatio, setMaintainRatio] = useState(true)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    if (!file.type.startsWith('image/')) {
      toast.error('กรุณาเลือกไฟล์รูปภาพเท่านั้น')
      return
    }

    setFileName(file.name)
    setFileType(file.type)

    const reader = new FileReader()
    reader.onload = (event) => {
      const src = event.target?.result as string
      setImageSrc(src)
      
      const img = new Image()
      img.onload = () => {
        setOriginalWidth(img.width)
        setOriginalHeight(img.height)
        setWidth(img.width)
        setHeight(img.height)
      }
      img.src = src
    }
    reader.readAsDataURL(file)
    
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleWidthChange = (val: string) => {
    const newWidth = parseInt(val)
    setWidth(isNaN(newWidth) ? '' : newWidth)
    
    if (maintainRatio && !isNaN(newWidth) && originalWidth > 0) {
      const ratio = originalHeight / originalWidth
      setHeight(Math.round(newWidth * ratio))
    }
  }

  const handleHeightChange = (val: string) => {
    const newHeight = parseInt(val)
    setHeight(isNaN(newHeight) ? '' : newHeight)
    
    if (maintainRatio && !isNaN(newHeight) && originalHeight > 0) {
      const ratio = originalWidth / originalHeight
      setWidth(Math.round(newHeight * ratio))
    }
  }

  const handleDownload = () => {
    if (!imageSrc || !width || !height) {
      toast.error('กรุณากำหนดขนาดให้ครบถ้วน')
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.onload = () => {
      canvas.width = width as number
      canvas.height = height as number
      ctx.drawImage(img, 0, 0, width as number, height as number)
      
      const dataUrl = canvas.toDataURL(fileType)
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = `resized-${fileName}`
      a.click()
      
      toast.success('ดาวน์โหลดรูปภาพสำเร็จ!')
    }
    img.src = imageSrc
  }

  const handleClear = () => {
    setImageSrc(null)
    setWidth('')
    setHeight('')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Image Resizer</h1>
        <p className="text-gray-600 dark:text-gray-400">ปรับขนาดรูปภาพ (กว้าง x ยาว) ได้อย่างรวดเร็ว ทำงานบนเครื่องของคุณ 100% ปลอดภัย</p>
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-3xl shadow-sm border dark:border-gray-800 space-y-6">
        
        {!imageSrc ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors"
          >
            <UploadCloud className="w-16 h-16 text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">คลิกเพื่ออัปโหลดรูปภาพ</h3>
            <p className="text-gray-500 mt-2">รองรับไฟล์ JPG, PNG, WebP</p>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center font-bold text-xs shrink-0">
                  IMG
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-200 truncate max-w-[200px] sm:max-w-[400px]">{fileName}</p>
                  <p className="text-xs text-gray-500">ต้นฉบับ: {originalWidth} x {originalHeight} px</p>
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

            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ความกว้าง (Width)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={width}
                      onChange={(e) => handleWidthChange(e.target.value)}
                      className="w-full p-4 pr-12 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">px</span>
                  </div>
                </div>
                
                <div className="flex justify-center -my-2 relative z-10">
                  <button 
                    onClick={() => setMaintainRatio(!maintainRatio)}
                    className={`p-2 rounded-full border-2 bg-white dark:bg-gray-900 transition-colors ${maintainRatio ? 'border-blue-500 text-blue-500' : 'border-gray-300 dark:border-gray-700 text-gray-400'}`}
                    title={maintainRatio ? 'ปลดล็อคอัตราส่วน' : 'ล็อคอัตราส่วน'}
                  >
                    {maintainRatio ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ความสูง (Height)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={height}
                      onChange={(e) => handleHeightChange(e.target.value)}
                      className="w-full p-4 pr-12 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">px</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    onClick={handleDownload}
                    disabled={!width || !height}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" /> ดาวน์โหลดรูปภาพ
                  </button>
                </div>
              </div>

              <div className="flex justify-center items-center bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 min-h-[300px] border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={imageSrc} 
                  alt="Preview" 
                  className="max-w-full max-h-[400px] object-contain opacity-80"
                  style={{ 
                    aspectRatio: width && height ? `${width}/${height}` : 'auto'
                  }} 
                />
              </div>
            </div>
            
            {/* Hidden canvas for processing */}
            <canvas ref={canvasRef} className="hidden"></canvas>
          </div>
        )}
      </div>

      <AdSlot />
    </div>
  )
}
