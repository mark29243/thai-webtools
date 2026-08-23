'use client'

import { useState, useRef } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { AdSlot } from '@/components/AdSlot'
import { Download, Upload, Trash2, Settings2, Image as ImageIcon } from 'lucide-react'

export default function QrCodePage() {
  const [text, setText] = useState('https://thaiweb.tools')
  const [fgColor, setFgColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [logoSize, setLogoSize] = useState(24) // percentage
  
  const qrRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDownload = () => {
    const canvas = qrRef.current?.querySelector('canvas')
    if (canvas) {
      const pngUrl = canvas
        .toDataURL('image/png')
        .replace('image/png', 'image/octet-stream')
      let downloadLink = document.createElement('a')
      downloadLink.href = pngUrl
      downloadLink.download = 'custom-qrcode.png'
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
    }
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setLogoUrl(url)
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeLogo = () => {
    setLogoUrl(null)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Advanced QR Code Generator</h1>
        <p className="text-gray-600 dark:text-gray-400">สร้างคิวอาร์โค้ดแบบ Custom ปรับสี และใส่โลโก้ตรงกลางได้ฟรี ไม่มีหมดอายุ</p>
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-3xl shadow-sm border dark:border-gray-800 grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Settings Area */}
        <div className="space-y-6">
          
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">ข้อความหรือ URL (ปลายทาง)</label>
            <textarea
              className="w-full border dark:border-gray-700 rounded-xl p-4 h-32 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow break-all resize-none text-gray-800 dark:text-gray-200"
              placeholder="พิมพ์ข้อความ ลิงก์เว็บไซต์ หรือเบอร์โทรศัพท์ที่นี่..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <div className="p-5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border dark:border-gray-700 space-y-5">
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-semibold border-b dark:border-gray-700 pb-3">
              <Settings2 className="w-5 h-5" /> ตกแต่ง QR Code
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">สี QR Code (Foreground)</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="color" 
                    value={fgColor} 
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0 outline-none"
                  />
                  <span className="text-sm uppercase text-gray-500">{fgColor}</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">สีพื้นหลัง (Background)</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="color" 
                    value={bgColor} 
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0 outline-none"
                  />
                  <span className="text-sm uppercase text-gray-500">{bgColor}</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">โลโก้ตรงกลาง (Logo)</label>
              {!logoUrl ? (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                >
                  <Upload className="w-4 h-4" /> อัปโหลดรูปโลโก้
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 flex items-center justify-center bg-white">
                        <img src={logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
                      </div>
                      <span className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-1"><ImageIcon className="w-4 h-4" /> ใส่โลโก้แล้ว</span>
                    </div>
                    <button 
                      onClick={removeLogo}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="flex justify-between text-xs font-medium text-gray-500">
                      <span>ขนาดโลโก้</span>
                      <span>{logoSize}%</span>
                    </label>
                    <input 
                      type="range" 
                      min="10" 
                      max="40" 
                      value={logoSize} 
                      onChange={(e) => setLogoSize(Number(e.target.value))}
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleLogoUpload} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
          </div>
        </div>

        {/* Preview Area */}
        <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800/30 rounded-2xl p-8 border-2 border-dashed dark:border-gray-700 min-h-[400px]">
          {text ? (
            <div className="flex flex-col items-center gap-8 w-full max-w-sm">
              <div 
                ref={qrRef} 
                className="p-6 rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-105"
                style={{ backgroundColor: bgColor }}
              >
                <QRCodeCanvas 
                  value={text} 
                  size={250} 
                  level="H" 
                  includeMargin={false} 
                  fgColor={fgColor}
                  bgColor={bgColor}
                  imageSettings={logoUrl ? {
                    src: logoUrl,
                    height: (250 * logoSize) / 100,
                    width: (250 * logoSize) / 100,
                    excavate: true, // ขุดพื้นหลังให้โลโก้เด่น
                  } : undefined}
                />
              </div>
              <button 
                onClick={handleDownload}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-xl transition-colors shadow-lg hover:shadow-xl"
              >
                <Download className="w-6 h-6" />
                ดาวน์โหลด QR Code
              </button>
            </div>
          ) : (
            <div className="text-gray-400 dark:text-gray-500 text-center flex flex-col items-center gap-3">
              <div className="w-24 h-24 border-4 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex items-center justify-center opacity-50">
                <Settings2 className="w-8 h-8" />
              </div>
              <p className="font-medium text-lg mt-4">QR Code จะแสดงที่นี่</p>
              <p className="text-sm">พิมพ์ข้อความเพื่อสร้างคิวอาร์โค้ด</p>
            </div>
          )}
        </div>
      </div>

      <AdSlot />
    </div>
  )
}
