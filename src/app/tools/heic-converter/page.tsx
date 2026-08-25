'use client'

import { useState, useRef } from 'react'
import { AdSlot } from '@/components/AdSlot'
import { 
  FileImage, 
  Upload, 
  Download, 
  Trash2, 
  Sparkles, 
  CheckCircle2, 
  Loader2, 
  AlertCircle,
  Sliders,
  Archive,
  RefreshCw
} from 'lucide-react'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import toast from 'react-hot-toast'

interface ConvertedFile {
  id: string
  originalName: string
  originalSize: number
  convertedBlob: Blob | null
  convertedUrl: string | null
  convertedSize: number
  status: 'pending' | 'converting' | 'completed' | 'error'
  errorMessage?: string
}

export default function HeicConverterPage() {
  const [files, setFiles] = useState<ConvertedFile[]>([])
  const [outputFormat, setOutputFormat] = useState<'image/jpeg' | 'image/png'>('image/jpeg')
  const [quality, setQuality] = useState<number>(0.9)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (newFiles: FileList | null) => {
    if (!newFiles || newFiles.length === 0) return

    const added: ConvertedFile[] = Array.from(newFiles).map(file => ({
      id: Math.random().toString(36).substring(2, 9),
      originalName: file.name,
      originalSize: file.size,
      convertedBlob: null,
      convertedUrl: null,
      convertedSize: 0,
      status: 'pending'
    }))

    setFiles(prev => [...prev, ...added])

    // Trigger conversion
    convertFiles(Array.from(newFiles), added)
  }

  const convertFiles = async (fileList: File[], queueItems: ConvertedFile[]) => {
    setIsProcessing(true)
    let heic2any: any

    try {
      // Dynamic import to avoid SSR issues
      const mod = await import('heic2any')
      heic2any = mod.default || mod
    } catch (err) {
      console.error('Failed to load heic2any', err)
      toast.error('ไม่สามารถโหลดโมดูลแปลงไฟล์ได้ กรุณาลองใหม่')
      setIsProcessing(false)
      return
    }

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i]
      const queueItem = queueItems[i]

      setFiles(prev => prev.map(f => f.id === queueItem.id ? { ...f, status: 'converting' } : f))

      try {
        const resultBlobOrBlobs = await heic2any({
          blob: file,
          toType: outputFormat,
          quality: quality
        })

        const resultBlob = Array.isArray(resultBlobOrBlobs) ? resultBlobOrBlobs[0] : resultBlobOrBlobs
        const url = URL.createObjectURL(resultBlob)

        setFiles(prev => prev.map(f => {
          if (f.id === queueItem.id) {
            return {
              ...f,
              convertedBlob: resultBlob,
              convertedUrl: url,
              convertedSize: resultBlob.size,
              status: 'completed'
            }
          }
          return f
        }))
      } catch (err: any) {
        console.error('Conversion error:', err)
        setFiles(prev => prev.map(f => {
          if (f.id === queueItem.id) {
            return {
              ...f,
              status: 'error',
              errorMessage: err.message || 'ไฟล์เสียหายหรือไม่รองรับ'
            }
          }
          return f
        }))
      }
    }

    setIsProcessing(false)
    toast.success('แปลงไฟล์เสร็จสมบูรณ์!')
  }

  const handleDownloadAll = async () => {
    const completed = files.filter(f => f.status === 'completed' && f.convertedBlob)
    if (completed.length === 0) return

    if (completed.length === 1) {
      const ext = outputFormat === 'image/jpeg' ? '.jpg' : '.png'
      const name = completed[0].originalName.replace(/\.[^/.]+$/, '') + ext
      saveAs(completed[0].convertedBlob!, name)
      return
    }

    const zip = new JSZip()
    completed.forEach(file => {
      const ext = outputFormat === 'image/jpeg' ? '.jpg' : '.png'
      const name = file.originalName.replace(/\.[^/.]+$/, '') + ext
      zip.file(name, file.convertedBlob!)
    })

    const zipBlob = await zip.generateAsync({ type: 'blob' })
    saveAs(zipBlob, 'converted_heic_images.zip')
  }

  const handleDownloadSingle = (file: ConvertedFile) => {
    if (!file.convertedBlob) return
    const ext = outputFormat === 'image/jpeg' ? '.jpg' : '.png'
    const name = file.originalName.replace(/\.[^/.]+$/, '') + ext
    saveAs(file.convertedBlob, name)
  }

  const removeFile = (id: string) => {
    setFiles(prev => {
      const found = prev.find(f => f.id === id)
      if (found?.convertedUrl) {
        URL.revokeObjectURL(found.convertedUrl)
      }
      return prev.filter(f => f.id !== id)
    })
  }

  const clearAll = () => {
    files.forEach(f => {
      if (f.convertedUrl) URL.revokeObjectURL(f.convertedUrl)
    })
    setFiles([])
  }

  const completedCount = files.filter(f => f.status === 'completed').length

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl text-white shadow-lg shadow-emerald-500/20">
            <FileImage className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">แปลงไฟล์รูปภาพ HEIC เป็น JPG / PNG</h1>
            <p className="text-gray-600 dark:text-gray-400">
              แปลงรูปถ่ายจาก iPhone (.HEIC / .HEIF) เป็น JPG หรือ PNG ความละเอียดสูง รวดเร็ว ปลอดภัย 100% ในเครื่องคุณ
            </p>
          </div>
        </div>
      </div>

      {/* Control & Settings Bar */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border dark:border-gray-800 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-600" />
            <h2 className="font-bold text-sm text-gray-900 dark:text-white">ตั้งค่าการแปลงไฟล์</h2>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            {/* Format */}
            <div className="flex items-center gap-2">
              <span className="text-gray-500">แปลงเป็น:</span>
              <div className="flex rounded-xl bg-gray-100 dark:bg-gray-800 p-1 border dark:border-gray-700">
                <button
                  onClick={() => setOutputFormat('image/jpeg')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    outputFormat === 'image/jpeg'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  JPG
                </button>
                <button
                  onClick={() => setOutputFormat('image/png')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    outputFormat === 'image/png'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  PNG
                </button>
              </div>
            </div>

            {/* Quality (JPG only) */}
            {outputFormat === 'image/jpeg' && (
              <div className="flex items-center gap-2">
                <span className="text-gray-500">คุณภาพ:</span>
                <input
                  type="range"
                  min="0.5"
                  max="1.0"
                  step="0.05"
                  value={quality}
                  onChange={e => setQuality(parseFloat(e.target.value))}
                  className="w-24 accent-emerald-600 cursor-pointer"
                />
                <span className="font-bold text-emerald-600">{(quality * 100).toFixed(0)}%</span>
              </div>
            )}
          </div>
        </div>

        {/* Upload Zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => {
            e.preventDefault()
            handleFileSelect(e.dataTransfer.files)
          }}
          className="border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all bg-gray-50/50 dark:bg-gray-800/40 group"
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".heic,.heif,.HEIC,.HEIF"
            onChange={e => handleFileSelect(e.target.files)}
            className="hidden"
          />
          <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
            คลิกเพื่อเลือกไฟล์ หรือลากไฟล์ HEIC / HEIF มาวางที่นี่
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            รองรับการแปลงรูปภาพหลายไฟล์พร้อมกันแบบกลุ่ม (Batch Processing)
          </p>
        </div>
      </div>

      {/* Files List */}
      {files.length > 0 && (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border dark:border-gray-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm">
              <span>รายการรูปภาพ ({files.length})</span>
              {completedCount > 0 && (
                <span className="text-xs bg-emerald-100 dark:bg-emerald-950 text-emerald-600 px-2 py-0.5 rounded-full font-bold">
                  แปลงเสร็จแล้ว {completedCount}/{files.length}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {completedCount > 1 && (
                <button
                  onClick={handleDownloadAll}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  <Archive className="w-3.5 h-3.5" /> ดาวน์โหลดทั้งหมด (ZIP)
                </button>
              )}
              <button
                onClick={clearAll}
                className="text-xs text-gray-500 hover:text-red-600 p-2 rounded-lg transition-colors"
                title="ล้างทั้งหมด"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {files.map(file => (
              <div
                key={file.id}
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/80 rounded-2xl border dark:border-gray-700/80"
              >
                {/* Thumbnail Preview */}
                <div className="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {file.convertedUrl ? (
                    <img src={file.convertedUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : file.status === 'converting' ? (
                    <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
                  ) : (
                    <FileImage className="w-6 h-6 text-gray-400" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-grow min-w-0">
                  <p className="text-xs font-semibold truncate text-gray-900 dark:text-white">
                    {file.originalName}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5">
                    <span>{(file.originalSize / 1024 / 1024).toFixed(2)} MB</span>
                    {file.convertedSize > 0 && (
                      <>
                        <span>→</span>
                        <span className="font-bold text-emerald-600">
                          {(file.convertedSize / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </>
                    )}
                  </div>
                  {file.status === 'error' && (
                    <p className="text-[10px] text-red-500">{file.errorMessage}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  {file.status === 'completed' && (
                    <button
                      onClick={() => handleDownloadSingle(file)}
                      className="p-2 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 hover:bg-emerald-200 dark:hover:bg-emerald-900 rounded-xl transition-colors"
                      title="ดาวน์โหลดรูปนี้"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-2 text-gray-400 hover:text-red-500 rounded-xl transition-colors"
                    title="ลบ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <AdSlot />
    </div>
  )
}
