'use client'

import { useState, useRef } from 'react'
import { AdSlot } from '@/components/AdSlot'
import { FileUp, Trash2, Download, Image as ImageIcon, MoveUp, MoveDown, FilePlus } from 'lucide-react'
import toast from 'react-hot-toast'
import { PDFDocument } from 'pdf-lib'

interface ImageFile {
  id: string
  file: File
  name: string
  preview: string
}

export default function ImageToPdfPage() {
  const [images, setImages] = useState<ImageFile[]>([])
  const [isConverting, setIsConverting] = useState(false)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return
    
    const newFiles = Array.from(e.target.files)
      .filter(f => f.type.startsWith('image/'))
      .map(file => ({
        id: Math.random().toString(36).substring(7),
        file,
        name: file.name,
        preview: URL.createObjectURL(file)
      }))

    if (newFiles.length !== e.target.files.length) {
      toast.error('กรุณาเลือกเฉพาะไฟล์รูปภาพ (JPG, PNG) เท่านั้น')
    }

    setImages(prev => [...prev, ...newFiles])
    setResultUrl(null)
    
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeImage = (id: string) => {
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== id)
      const removed = prev.find(img => img.id === id)
      if (removed) URL.revokeObjectURL(removed.preview)
      return filtered
    })
    setResultUrl(null)
  }

  const moveUp = (index: number) => {
    if (index === 0) return
    const newImages = [...images]
    const temp = newImages[index - 1]
    newImages[index - 1] = newImages[index]
    newImages[index] = temp
    setImages(newImages)
  }

  const moveDown = (index: number) => {
    if (index === images.length - 1) return
    const newImages = [...images]
    const temp = newImages[index + 1]
    newImages[index + 1] = newImages[index]
    newImages[index] = temp
    setImages(newImages)
  }

  const handleConvert = async () => {
    if (images.length === 0) {
      toast.error('กรุณาเลือกรูปภาพอย่างน้อย 1 รูป')
      return
    }

    setIsConverting(true)
    const convertToast = toast.loading('กำลังแปลงรูปภาพเป็น PDF...')

    try {
      const pdfDoc = await PDFDocument.create()

      for (const img of images) {
        const imageBytes = await img.file.arrayBuffer()
        let pdfImage

        if (img.file.type === 'image/jpeg' || img.file.type === 'image/jpg') {
          pdfImage = await pdfDoc.embedJpg(imageBytes)
        } else if (img.file.type === 'image/png') {
          pdfImage = await pdfDoc.embedPng(imageBytes)
        } else {
          toast.error(`ไม่รองรับรูปภาพชนิด ${img.file.type}`, { id: convertToast })
          setIsConverting(false)
          return
        }

        const page = pdfDoc.addPage([pdfImage.width, pdfImage.height])
        page.drawImage(pdfImage, {
          x: 0,
          y: 0,
          width: pdfImage.width,
          height: pdfImage.height,
        })
      }

      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      
      setResultUrl(url)
      toast.success('แปลงเป็น PDF สำเร็จ!', { id: convertToast })
    } catch (error) {
      console.error(error)
      toast.error('เกิดข้อผิดพลาดในการแปลงไฟล์', { id: convertToast })
    } finally {
      setIsConverting(false)
    }
  }

  const handleClear = () => {
    images.forEach(img => URL.revokeObjectURL(img.preview))
    setImages([])
    setResultUrl(null)
    toast.success('ล้างข้อมูลเรียบร้อย')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Image to PDF</h1>
        <p className="text-gray-600 dark:text-gray-400">แปลงรูปภาพ JPG, PNG เป็นไฟล์ PDF ทำงานบนเครื่องของคุณ 100% ปลอดภัย</p>
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-3xl shadow-sm border dark:border-gray-800 space-y-6">
        
        {/* Dropzone */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors"
        >
          <ImageIcon className="w-12 h-12 text-blue-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">คลิกหรือลากรูปภาพมาวางที่นี่</h3>
          <p className="text-sm text-gray-500 mt-2">รองรับไฟล์ JPG, PNG (เลือกได้หลายไฟล์)</p>
          <input 
            type="file" 
            multiple 
            accept="image/jpeg,image/png,image/jpg" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </div>

        {/* Image List */}
        {images.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 flex justify-between items-center">
              รูปภาพที่เลือก ({images.length})
              <button onClick={handleClear} className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1">
                <Trash2 className="w-4 h-4" /> ล้างทั้งหมด
              </button>
            </h4>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((img, index) => (
                <div key={img.id} className="relative group bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden aspect-square">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.preview} alt={img.name} className="w-full h-full object-cover" />
                  
                  {/* Actions overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    <div className="flex gap-2">
                      <button onClick={() => moveUp(index)} disabled={index === 0} className="p-2 bg-white/20 hover:bg-white/40 rounded-full text-white disabled:opacity-30"><MoveUp className="w-4 h-4" /></button>
                      <button onClick={() => moveDown(index)} disabled={index === images.length - 1} className="p-2 bg-white/20 hover:bg-white/40 rounded-full text-white disabled:opacity-30"><MoveDown className="w-4 h-4" /></button>
                    </div>
                    <button onClick={() => removeImage(img.id)} className="p-2 bg-red-500 hover:bg-red-600 rounded-full text-white">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {!resultUrl ? (
              <button 
                onClick={handleConvert}
                disabled={isConverting}
                className="w-full py-4 mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
              >
                {isConverting ? 'กำลังแปลงไฟล์...' : <><FilePlus className="w-5 h-5" /> สร้างไฟล์ PDF</>}
              </button>
            ) : (
              <a 
                href={resultUrl}
                download="images-thai-webtools.pdf"
                className="w-full py-4 block text-center mt-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg transition-colors"
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
