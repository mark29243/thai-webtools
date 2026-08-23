'use client'

import { useState, useRef, useEffect } from 'react'
import { AdSlot } from '@/components/AdSlot'
import { Download, Trash2, UploadCloud, FileArchive, Settings2, ImageIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

interface ResizedImage {
  id: string
  file: File
  originalUrl: string
  originalWidth: number
  originalHeight: number
  targetWidth: number
  targetHeight: number
  dataUrl: string | null
}

export default function ImageResizerPage() {
  const [images, setImages] = useState<ResizedImage[]>([])
  
  // Settings applied to ALL images
  const [targetWidth, setTargetWidth] = useState<number | ''>('')
  const [targetHeight, setTargetHeight] = useState<number | ''>('')
  const [maintainRatio, setMaintainRatio] = useState(true)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    const newFiles = Array.from(files).filter(f => f.type.startsWith('image/'))
    if (newFiles.length === 0) {
      toast.error('กรุณาเลือกไฟล์รูปภาพเท่านั้น')
      return
    }

    const loadedImages: ResizedImage[] = []
    
    for (const file of newFiles) {
      const url = URL.createObjectURL(file)
      const dims = await new Promise<{w: number, h: number}>((resolve) => {
        const img = new Image()
        img.onload = () => resolve({ w: img.width, h: img.height })
        img.src = url
      })
      
      loadedImages.push({
        id: Math.random().toString(36).substring(7),
        file,
        originalUrl: url,
        originalWidth: dims.w,
        originalHeight: dims.h,
        targetWidth: dims.w,
        targetHeight: dims.h,
        dataUrl: null
      })
    }

    setImages(prev => [...prev, ...loadedImages])
    
    // Auto-set targetWidth if it's the first image
    if (images.length === 0 && loadedImages.length > 0 && targetWidth === '') {
      setTargetWidth(loadedImages[0].originalWidth)
      setTargetHeight(loadedImages[0].originalHeight)
    }

    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // Recalculate dimensions for all images when global settings change
  useEffect(() => {
    if (images.length === 0) return
    
    setImages(prev => prev.map(img => {
      let newW = img.originalWidth
      let newH = img.originalHeight
      
      if (typeof targetWidth === 'number' && targetWidth > 0) {
        newW = targetWidth
        if (maintainRatio) {
          newH = Math.round(targetWidth * (img.originalHeight / img.originalWidth))
        } else if (typeof targetHeight === 'number' && targetHeight > 0) {
          newH = targetHeight
        }
      } else if (typeof targetHeight === 'number' && targetHeight > 0) {
        newH = targetHeight
        if (maintainRatio) {
          newW = Math.round(targetHeight * (img.originalWidth / img.originalHeight))
        }
      }
      
      return { ...img, targetWidth: newW, targetHeight: newH }
    }))
  }, [targetWidth, targetHeight, maintainRatio])

  const handleWidthChange = (val: string) => {
    const w = parseInt(val)
    setTargetWidth(isNaN(w) ? '' : w)
    
    // If maintain ratio is checked and there's a primary ratio (from the first image)
    if (maintainRatio && !isNaN(w) && images.length > 0) {
      const ratio = images[0].originalHeight / images[0].originalWidth
      setTargetHeight(Math.round(w * ratio))
    }
  }

  const handleHeightChange = (val: string) => {
    const h = parseInt(val)
    setTargetHeight(isNaN(h) ? '' : h)
    
    if (maintainRatio && !isNaN(h) && images.length > 0) {
      const ratio = images[0].originalWidth / images[0].originalHeight
      setTargetWidth(Math.round(h * ratio))
    }
  }

  const processImage = (img: ResizedImage): Promise<string> => {
    return new Promise((resolve, reject) => {
      const image = new Image()
      image.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.targetWidth
        canvas.height = img.targetHeight
        const ctx = canvas.getContext('2d')
        if (!ctx) return reject('No ctx')
        ctx.drawImage(image, 0, 0, img.targetWidth, img.targetHeight)
        resolve(canvas.toDataURL(img.file.type))
      }
      image.onerror = reject
      image.src = img.originalUrl
    })
  }

  const downloadSingle = async (img: ResizedImage) => {
    const dataUrl = await processImage(img)
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = `resized-${img.file.name}`
    a.click()
  }

  const downloadAllAsZip = async () => {
    if (images.length === 0) return
    
    const zipToast = toast.loading('กำลังสร้างไฟล์ ZIP...')
    try {
      const zip = new JSZip()
      const folder = zip.folder("resized_images")
      
      for (const img of images) {
        const dataUrl = await processImage(img)
        const base64Data = dataUrl.split(',')[1]
        const extension = img.file.name.split('.').pop() || 'jpg'
        const originalName = img.file.name.substring(0, img.file.name.lastIndexOf('.')) || img.file.name
        folder?.file(`${originalName}_${img.targetWidth}x${img.targetHeight}.${extension}`, base64Data, { base64: true })
      }
      
      const content = await zip.generateAsync({ type: 'blob' })
      saveAs(content, 'thai-webtools-resized.zip')
      toast.success('ดาวน์โหลดไฟล์ ZIP สำเร็จ!', { id: zipToast })
    } catch (err) {
      console.error(err)
      toast.error('เกิดข้อผิดพลาด', { id: zipToast })
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Batch Image Resizer</h1>
        <p className="text-gray-600 dark:text-gray-400">ปรับขนาดรูปรวดเดียวหลายๆ ไฟล์ (กว้าง x ยาว) ปลอดภัย 100% ไม่มีการอัปโหลดขึ้นเซิร์ฟเวอร์</p>
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-3xl shadow-sm border dark:border-gray-800 space-y-8">
        
        {/* Upload Area */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors"
        >
          <UploadCloud className="w-12 h-12 text-blue-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">คลิกหรือลากรูปภาพมาวางที่นี่</h3>
          <p className="text-sm text-gray-500 mt-2">อัปโหลดทีละหลายๆ ไฟล์ได้ (Multiple Files)</p>
          <input 
            type="file" 
            multiple
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </div>

        {images.length > 0 && (
          <div className="space-y-6">
            
            {/* Global Settings */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl border dark:border-gray-700 grid md:grid-cols-2 gap-6 items-center">
              <div>
                <h4 className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-300 mb-4">
                  <Settings2 className="w-5 h-5 text-blue-500"/> กำหนดขนาดเป้าหมาย
                </h4>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500 mb-1">กว้าง (Width)</label>
                    <input 
                      type="number" 
                      value={targetWidth}
                      onChange={(e) => handleWidthChange(e.target.value)}
                      className="w-full p-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex flex-col items-center pt-5">
                    <label className="flex items-center gap-1 cursor-pointer text-xs font-medium text-gray-500">
                      <input 
                        type="checkbox" 
                        checked={maintainRatio} 
                        onChange={(e) => setMaintainRatio(e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      ล็อคอัตราส่วน
                    </label>
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500 mb-1">สูง (Height)</label>
                    <input 
                      type="number" 
                      value={targetHeight}
                      onChange={(e) => handleHeightChange(e.target.value)}
                      className="w-full p-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={maintainRatio}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col justify-end items-end gap-3 md:border-l md:dark:border-gray-700 md:pl-6">
                <button 
                  onClick={downloadAllAsZip}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <FileArchive className="w-5 h-5" /> ดาวน์โหลดทั้งหมด (ZIP)
                </button>
                <button 
                  onClick={() => setImages([])}
                  className="text-sm text-red-500 hover:text-red-700 font-medium"
                >
                  ล้างไฟล์ทั้งหมด
                </button>
              </div>
            </div>

            {/* Image List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {images.map(img => (
                <div key={img.id} className="relative group bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                  <div className="h-40 bg-gray-100 dark:bg-gray-900 flex items-center justify-center relative p-2">
                    <img src={img.originalUrl} alt={img.file.name} className="max-h-full max-w-full object-contain" />
                    
                    <button 
                      onClick={() => setImages(images.filter(i => i.id !== img.id))}
                      className="absolute top-2 right-2 bg-red-500/90 text-white p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="p-3 text-sm space-y-1">
                    <p className="truncate font-semibold text-gray-800 dark:text-gray-200" title={img.file.name}>{img.file.name}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>เดิม:</span>
                      <span>{img.originalWidth} x {img.originalHeight}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                      <span>ใหม่:</span>
                      <span>{img.targetWidth} x {img.targetHeight}</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => downloadSingle(img)}
                    className="w-full flex items-center justify-center gap-1.5 bg-gray-50 dark:bg-gray-700/50 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium py-2 text-xs border-t dark:border-gray-700 transition-colors"
                  >
                    <Download className="w-3 h-3" /> ดาวน์โหลด
                  </button>
                </div>
              ))}
            </div>

          </div>
        )}
      </div>

      <AdSlot />
    </div>
  )
}
