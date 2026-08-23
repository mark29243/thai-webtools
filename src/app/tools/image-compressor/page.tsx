'use client'

import { useState, useRef } from 'react'
import { AdSlot } from '@/components/AdSlot'
import { Upload, Download, Image as ImageIcon } from 'lucide-react'

export default function ImageCompressorPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [compressedImage, setCompressedImage] = useState<string | null>(null)
  const [quality, setQuality] = useState(0.7)
  const [originalSize, setOriginalSize] = useState<number>(0)
  const [compressedSize, setCompressedSize] = useState<number>(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setOriginalSize(file.size)
    const reader = new FileReader()
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string)
      compressImage(event.target?.result as string, quality)
    }
    reader.readAsDataURL(file)
  }

  const compressImage = (dataUrl: string, compressQuality: number) => {
    const img = new window.Image()
    img.src = dataUrl
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      canvas.width = img.width
      canvas.height = img.height
      
      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        const compressedDataUrl = canvas.toDataURL('image/jpeg', compressQuality)
        setCompressedImage(compressedDataUrl)
        
        // Calculate approx size of base64
        const base64Length = compressedDataUrl.length - (compressedDataUrl.indexOf(',') + 1)
        const padding = (compressedDataUrl.charAt(compressedDataUrl.length - 2) === '=') ? 2 : ((compressedDataUrl.charAt(compressedDataUrl.length - 1) === '=') ? 1 : 0)
        setCompressedSize(base64Length * 0.75 - padding)
      }
    }
  }

  const handleQualityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuality = parseFloat(e.target.value)
    setQuality(newQuality)
    if (selectedImage) {
      compressImage(selectedImage, newQuality)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Image Compressor</h1>
        <p className="text-gray-600">ย่อขนาดรูปภาพ (JPG/PNG) ให้เล็กลง โดยยังคงความคมชัด ประมวลผลบนเครื่องของคุณ 100% ปลอดภัย</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-6">
        {/* Upload Area */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-blue-300 rounded-xl p-12 text-center cursor-pointer hover:bg-blue-50 transition-colors flex flex-col items-center justify-center gap-4"
        >
          <Upload className="w-12 h-12 text-blue-500" />
          <div>
            <p className="font-semibold text-lg">คลิกเพื่ออัปโหลดรูปภาพ</p>
            <p className="text-sm text-gray-500 mt-1">รองรับไฟล์ JPG, PNG</p>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            accept="image/*" 
            className="hidden" 
          />
        </div>

        {selectedImage && (
          <div className="space-y-6 pt-6 border-t">
            {/* Controls */}
            <div className="bg-gray-50 p-4 rounded-lg border">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ปรับคุณภาพความคมชัด (Quality): {Math.round(quality * 100)}%
              </label>
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

            {/* Comparison */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Original */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-gray-700 flex items-center gap-2"><ImageIcon className="w-4 h-4"/> ภาพต้นฉบับ</span>
                  <span className="bg-gray-200 px-2 py-1 rounded text-gray-700 font-medium">{formatSize(originalSize)}</span>
                </div>
                <div className="border rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center h-64">
                  <img src={selectedImage} alt="Original" className="max-w-full max-h-full object-contain" />
                </div>
              </div>

              {/* Compressed */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-green-600 flex items-center gap-2"><ImageIcon className="w-4 h-4"/> ภาพที่บีบอัดแล้ว</span>
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded font-medium">{formatSize(compressedSize)}</span>
                </div>
                <div className="border border-green-200 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center h-64 relative">
                  {compressedImage && (
                    <img src={compressedImage} alt="Compressed" className="max-w-full max-h-full object-contain" />
                  )}
                  {originalSize > 0 && compressedSize > 0 && (
                    <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                      ลดขนาดลง {Math.round(((originalSize - compressedSize) / originalSize) * 100)}%
                    </div>
                  )}
                </div>
                {compressedImage && (
                  <a 
                    href={compressedImage} 
                    download="compressed-image.jpg"
                    className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    ดาวน์โหลดภาพที่บีบอัด
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <AdSlot />
    </div>
  )
}
