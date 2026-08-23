'use client'

import { useState, useRef } from 'react'
import { AdSlot } from '@/components/AdSlot'
import { FileUp, Trash2, Merge, Download, GripVertical, FileText } from 'lucide-react'
import toast from 'react-hot-toast'
import { PDFDocument } from 'pdf-lib'

// dnd-kit imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface PdfFile {
  id: string
  file: File
  name: string
  size: string
}

// Sortable Item Component
function SortableFileItem({ 
  file, 
  onRemove 
}: { 
  file: PdfFile; 
  onRemove: (id: string) => void 
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: file.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  }

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border ${isDragging ? 'border-blue-500 shadow-lg' : 'border-gray-200 dark:border-gray-700'} shadow-sm group transition-colors`}
    >
      <div className="flex items-center gap-3 overflow-hidden flex-1">
        <div 
          {...attributes} 
          {...listeners} 
          className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-blue-500 transition-colors"
        >
          <GripVertical className="w-5 h-5" />
        </div>
        <div className="w-10 h-10 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-lg flex items-center justify-center shrink-0">
          <FileText className="w-5 h-5" />
        </div>
        <div className="truncate pr-4">
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{file.name}</p>
          <p className="text-xs text-gray-500">{file.size}</p>
        </div>
      </div>
      <button 
        onClick={() => onRemove(file.id)}
        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors shrink-0"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  )
}

export default function PdfMergePage() {
  const [files, setFiles] = useState<PdfFile[]>([])
  const [isMerging, setIsMerging] = useState(false)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

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
    
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeFile = (id: string) => {
    setFiles(files.filter(f => f.id !== id))
    setResultUrl(null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    if (over && active.id !== over.id) {
      setFiles((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id)
        const newIndex = items.findIndex((i) => i.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
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

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Merge PDF (Advanced)</h1>
        <p className="text-gray-600 dark:text-gray-400">รวมไฟล์ PDF และลากสลับตำแหน่ง (Drag & Drop) ได้อย่างอิสระ ปลอดภัย 100%</p>
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

        {/* File List with Drag and Drop */}
        {files.length > 0 && (
          <div className="space-y-4 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border dark:border-gray-800">
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 flex justify-between items-center mb-4">
              <span>จัดเรียงไฟล์ ({files.length})</span>
              <button onClick={() => { setFiles([]); setResultUrl(null) }} className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-lg transition-colors">
                <Trash2 className="w-4 h-4" /> ล้างทั้งหมด
              </button>
            </h4>
            
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={files.map(f => f.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {files.map((file) => (
                    <SortableFileItem 
                      key={file.id} 
                      file={file} 
                      onRemove={removeFile} 
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {!resultUrl ? (
              <button 
                onClick={handleMerge}
                disabled={files.length < 2 || isMerging}
                className="w-full py-4 mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2 text-lg"
              >
                {isMerging ? 'กำลังรวมไฟล์...' : <><Merge className="w-6 h-6" /> รวมไฟล์ PDF ทันที</>}
              </button>
            ) : (
              <a 
                href={resultUrl}
                download="merged-thai-webtools.pdf"
                className="w-full py-4 mt-6 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2 text-lg"
              >
                <Download className="w-6 h-6" /> ดาวน์โหลดไฟล์ PDF ที่รวมแล้ว
              </a>
            )}
          </div>
        )}
      </div>

      <AdSlot />
    </div>
  )
}
