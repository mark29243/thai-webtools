'use client'

import { useState, useRef, useEffect } from 'react'
import { AdSlot } from '@/components/AdSlot'
import { Upload, Download, Image as ImageIcon, Trash2, FileArchive, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

interface ImageFile {
  id: string
  file: File
  originalUrl: string
  compressedUrl: string | null
  originalSize: number
  compressedSize: number
}

export default function ImageCompressorPage() {
  const [images, setImages] = useState<ImageFile[]>([])
  const [quality, setQuality] = useState(0.7)
  const [isCompressing, setIsCompressing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const compressSingleImage = (file: File, compressQuality: number): Promise<{ url: string, size: number }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        const img = new window.Image()
        img.src = event.target?.result as string
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          canvas.width = img.width
          canvas.height = img.height
          
          if (ctx) {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
            // Use image/jpeg for compression since png doesn't support quality parameter
            const compressedDataUrl = canvas.toDataURL('image/jpeg', compressQuality)
            
            // Calculate approx size of base64
            const base64Length = compressedDataUrl.length - (compressedDataUrl.indexOf(',') + 1)
            const padding = (compressedDataUrl.charAt(compressedDataUrl.length - 2) === '=') ? 2 : ((compressedDataUrl.charAt(compressedDataUrl.length - 1) === '=') ? 1 : 0)
            const size = base64Length * 0.75 - padding
            
            resolve({ url: compressedDataUrl, size })
          } else {
            reject('Canvas context not available')
          }
        }
        img.onerror = reject
      }
      reader.onerror = reject
    })
  }

  const processImages = async (filesToProcess: ImageFile[], q: number) => {
    setIsCompressing(true)
    const newImages = [...filesToProcess]
    
    for (let i = 0; i < newImages.length; i++) {
      try {
        const result = await compressSingleImage(newImages[i].file, q)
        newImages[i].compressedUrl = result.url
        newImages[i].compressedSize = result.size
      } catch (err) {
        console.error(err)
      }
    }
    
    setImages(newImages)
    setIsCompressing(false)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newFiles: ImageFile[] = Array.from(files).filter(f => f.type.startsWith('image/')).map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      originalUrl: URL.createObjectURL(file),
      compressedUrl: null,
      originalSize: file.size,
      compressedSize: 0
    }))

    if (newFiles.length === 0) {
      toast.error('กรุณาเลือกไฟล์รูปภาพเท่านั้น')
      return
    }

    const updatedImages = [...images, ...newFiles]
    setImages(updatedImages)
    
    if (fileInputRef.current) fileInputRef.current.value = ''
    
    // Auto compress new images
    await processImages(updatedImages, quality)
  }

  const handleQualityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuality = parseFloat(e.target.value)
    setQuality(newQuality)
  }

  // Re-compress when quality changes
  useEffect(() => {
    if (images.length > 0) {
      const timer = setTimeout(() => {
        processImages(images, quality)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [quality])

  const removeImage = (id: string) => {
    setImages(images.filter(img => img.id !== id))
  }

  const downloadAllAsZip = async () => {
    if (images.length === 0) return
    
    const zip = new JSZip()
    const folder = zip.folder("compressed_images")
    
    images.forEach((img, idx) => {
      if (img.compressedUrl) {
        const base64Data = img.compressedUrl.split(',')[1]
        const extension = 'jpg'
        const originalName = img.file.name.substring(0, img.file.name.lastIndexOf('.')) || img.file.name
        folder?.file(`${originalName}_compressed.${extension}`, base64Data, { base64: true })
      }
    })
    
    const zipToast = toast.loading('กำลังสร้างไฟล์ ZIP...')
    try {
      const content = await zip.generateAsync({ type: 'blob' })
      saveAs(content, 'thai-webtools-compressed-images.zip')
      toast.success('ดาวน์โหลดไฟล์ ZIP สำเร็จ!', { id: zipToast })
    } catch (err) {
      console.error(err)
      toast.error('เกิดข้อผิดพลาดในการสร้างไฟล์ ZIP', { id: zipToast })
    }
  }

  const downloadAllImages = async () => {
    if (images.length === 0) return
    
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    if (isMobile && images.length > 3) {
      toast('เบราว์เซอร์อาจถามการอนุญาตให้ดาวน์โหลดหลายไฟล์', { icon: 'ℹ️' })
    }
    
    let downloadedCount = 0
    for (let i = 0; i < images.length; i++) {
      const img = images[i]
      if (img.compressedUrl) {
        const link = document.createElement('a')
        link.href = img.compressedUrl
        link.download = `compressed_${img.file.name.replace(/\.[^/.]+$/, "")}.jpg`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        downloadedCount++
        
        // Delay to prevent browser blocking multiple downloads
        await new Promise(resolve => setTimeout(resolve, 400))
      }
    }
    toast.success(`ดาวน์โหลดเสร็จสิ้น ${downloadedCount} รูป! (เช็กในแกลเลอรี่/โฟลเดอร์ดาวน์โหลด)`)
  }

  const totalOriginalSize = images.reduce((acc, curr) => acc + curr.originalSize, 0)
  const totalCompressedSize = images.reduce((acc, curr) => acc + curr.compressedSize, 0)

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Batch Image Compressor</h1>
        <p className="text-gray-600 dark:text-gray-400">ย่อขนาดรูปรวดเดียวหลายๆ ไฟล์ (JPG/PNG) โดยคงความคมชัด ประมวลผลบนเครื่อง ปลอดภัย 100%</p>
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-3xl shadow-sm border dark:border-gray-800 space-y-6">
        
        {/* Upload Area */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors"
        >
          <Upload className="w-12 h-12 text-blue-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">คลิกหรือลากรูปภาพมาวางที่นี่</h3>
          <p className="text-sm text-gray-500 mt-2">อัปโหลดได้หลายไฟล์พร้อมกัน (Multiple Files)</p>
          <input 
            type="file" 
            multiple
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            accept="image/*" 
            className="hidden" 
          />
        </div>

        {images.length > 0 && (
          <div className="space-y-6 pt-6 border-t dark:border-gray-800">
            {/* Controls */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl border dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <label className="font-semibold text-gray-700 dark:text-gray-200">
                  ปรับคุณภาพความคมชัด (Quality): {Math.round(quality * 100)}%
                </label>
                {isCompressing && <span className="flex items-center gap-2 text-blue-500 text-sm font-medium"><Loader2 className="w-4 h-4 animate-spin"/> กำลังบีบอัด...</span>}
              </div>
              <input 
                type="range" 
                min="0.1" 
                max="1" 
                step="0.05" 
                value={quality} 
                onChange={handleQualityChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Summary */}
            <div className="flex flex-col md:flex-row md:items-center justify-between bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30 gap-4">
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                <span>ไฟล์ทั้งหมด: {images.length} รูป</span>
                <span>รวมก่อนบีบ: {formatSize(totalOriginalSize)}</span>
                <span className="text-green-600 dark:text-green-400">รวมหลังบีบ: {formatSize(totalCompressedSize)}</span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <button 
                  onClick={downloadAllImages}
                  disabled={isCompressing || images.length === 0}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <ImageIcon className="w-5 h-5" /> โหลดรูปลงเครื่องทีละภาพ
                </button>
                <button 
                  onClick={downloadAllAsZip}
                  disabled={isCompressing || images.length === 0}
                  className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:opacity-50 text-gray-800 dark:text-gray-200 font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <FileArchive className="w-4 h-4" /> แบบ ZIP
                </button>
              </div>
            </div>

            {/* Grid List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {images.map(img => (
                <div key={img.id} className="relative group bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                  <div className="h-40 bg-gray-100 dark:bg-gray-900 flex items-center justify-center relative">
                    <img src={img.compressedUrl || img.originalUrl} alt={img.file.name} className="max-h-full max-w-full object-contain" />
                    
                    {img.compressedSize > 0 && (
                      <div className="absolute top-2 left-2 bg-green-500/90 text-white text-xs font-bold px-2 py-1 rounded-md backdrop-blur-sm shadow-sm">
                        -{Math.round(((img.originalSize - img.compressedSize) / img.originalSize) * 100)}%
                      </div>
                    )}
                    
                    <button 
                      onClick={() => removeImage(img.id)}
                      className="absolute top-2 right-2 bg-red-500/90 text-white p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="p-3 text-sm">
                    <p className="truncate font-medium text-gray-700 dark:text-gray-200 mb-1" title={img.file.name}>{img.file.name}</p>
                    <div className="flex justify-between items-center text-xs">
                      <span className="line-through text-gray-400">{formatSize(img.originalSize)}</span>
                      <span className="font-bold text-green-600 dark:text-green-400">{formatSize(img.compressedSize)}</span>
                    </div>
                  </div>
                  
                  {img.compressedUrl && (
                    <a 
                      href={img.compressedUrl}
                      download={`compressed_${img.file.name.replace(/\.[^/.]+$/, "")}.jpg`}
                      className="block text-center w-full bg-gray-50 dark:bg-gray-700/50 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium py-2 text-xs border-t dark:border-gray-700 transition-colors"
                    >
                      ดาวน์โหลด
                    </a>
                  )}
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
