'use client'

import { useState, useMemo, useRef } from 'react'
import { AdSlot } from '@/components/AdSlot'
import { 
  FileText, 
  Printer, 
  Plus, 
  Trash2, 
  Download, 
  Sparkles, 
  Building2, 
  User, 
  Calendar, 
  QrCode, 
  Percent, 
  DollarSign, 
  Upload, 
  Image as ImageIcon,
  CheckCircle2
} from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

// Convert Number to Thai Text (e.g. 1,520.50 -> หนึ่งพันห้าร้อยยี่สิบบาทห้าสิบสตางค์)
function arabicToThaiBaht(num: number): string {
  if (isNaN(num) || num === 0) return 'ศูนย์บาทถ้วน'
  
  const thaiNums = ['', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า']
  const thaiUnits = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน']

  function convertSection(s: string): string {
    let result = ''
    const len = s.length
    for (let i = 0; i < len; i++) {
      const digit = parseInt(s[i])
      const unit = len - i - 1
      if (digit !== 0) {
        if (unit === 0 && digit === 1 && len > 1 && s[len - 2] !== '0') {
          result += 'เอ็ด'
        } else if (unit === 1 && digit === 2) {
          result += 'ยี่สิบ'
        } else if (unit === 1 && digit === 1) {
          result += 'สิบ'
        } else {
          result += thaiNums[digit] + thaiUnits[unit]
        }
      }
    }
    return result
  }

  const parts = num.toFixed(2).split('.')
  const integerPart = parts[0]
  const decimalPart = parts[1]

  let text = ''
  if (integerPart.length > 6) {
    const millionPart = integerPart.substring(0, integerPart.length - 6)
    const lowerPart = integerPart.substring(integerPart.length - 6)
    text = convertSection(millionPart) + 'ล้าน' + convertSection(lowerPart) + 'บาท'
  } else {
    text = convertSection(integerPart) + 'บาท'
  }

  if (decimalPart === '00') {
    text += 'ถ้วน'
  } else {
    text += convertSection(decimalPart) + 'สตางค์'
  }

  return text
}

interface InvoiceItem {
  id: string
  name: string
  quantity: number
  price: number
}

export default function InvoiceGeneratorPage() {
  // Document Type
  const [docType, setDocType] = useState<string>('ใบเสนอราคา (Quotation)')
  const [docNumber, setDocNumber] = useState<string>('QT-' + new Date().toISOString().slice(0,10).replace(/-/g,'') + '-01')
  const [docDate, setDocDate] = useState<string>(new Date().toISOString().slice(0,10))
  const [dueDate, setDueDate] = useState<string>(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0,10)
  )

  // Seller Info
  const [sellerName, setSellerName] = useState<string>('บริษัท ตัวอย่าง จำกัด')
  const [sellerTaxId, setSellerTaxId] = useState<string>('0105550000000')
  const [sellerAddress, setSellerAddress] = useState<string>('99/9 อาคารเอ็กเซล ซอยสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110')
  const [sellerPhone, setSellerPhone] = useState<string>('02-123-4567')
  const [sellerPromptPay, setSellerPromptPay] = useState<string>('0812345678')
  const [logoUrl, setLogoUrl] = useState<string>('')

  // Buyer Info
  const [buyerName, setBuyerName] = useState<string>('บริษัท ลูกค้าใจดี จำกัด (สำนักงานใหญ่)')
  const [buyerTaxId, setBuyerTaxId] = useState<string>('0105560000000')
  const [buyerAddress, setBuyerAddress] = useState<string>('123 ถนนพหลโยธิน แขวงพญาไท เขตพญาไท กรุงเทพฯ 10400')
  const [buyerPhone, setBuyerPhone] = useState<string>('089-999-9999')

  // Items
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', name: 'บริการออกแบบเว็บไซต์และพัฒนา Web Application', quantity: 1, price: 25000 },
    { id: '2', name: 'บริการจดโดเมนเนมและเช่า Cloud Hosting รายปี', quantity: 1, price: 3500 },
  ])

  // Tax & Discount
  const [discountAmount, setDiscountAmount] = useState<number>(0)
  const [vatType, setVatType] = useState<'exclusive' | 'inclusive' | 'none'>('exclusive') // 7%
  const [withholdingTaxRate, setWithholdingTaxRate] = useState<number>(3) // 3%
  const [notes, setNotes] = useState<string>('1. กรุณาโอนเงินเข้าบัญชีตามที่ระบุไว้ข้างต้น\n2. กำหนดยืนราคาภายใน 30 วันนับจากวันที่ออกเอกสาร')

  // Calculations
  const calc = useMemo(() => {
    const rawSubtotal = items.reduce((acc, item) => acc + (item.quantity * item.price), 0)
    const afterDiscount = Math.max(0, rawSubtotal - discountAmount)

    let vat = 0
    let grandTotal = 0

    if (vatType === 'exclusive') {
      vat = afterDiscount * 0.07
      grandTotal = afterDiscount + vat
    } else if (vatType === 'inclusive') {
      vat = afterDiscount - (afterDiscount / 1.07)
      grandTotal = afterDiscount
    } else {
      vat = 0
      grandTotal = afterDiscount
    }

    const withholdingTax = (afterDiscount * withholdingTaxRate) / 100
    const netPayable = Math.max(0, grandTotal - withholdingTax)

    return {
      rawSubtotal,
      afterDiscount,
      vat,
      grandTotal,
      withholdingTax,
      netPayable,
      thaiBahtText: arabicToThaiBaht(netPayable)
    }
  }, [items, discountAmount, vatType, withholdingTaxRate])

  // Item Management
  const addItem = () => {
    setItems(prev => [
      ...prev,
      { id: Date.now().toString(), name: '', quantity: 1, price: 0 }
    ])
  }

  const updateItem = (id: string, field: keyof InvoiceItem, val: any) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, [field]: val }
      }
      return item
    }))
  }

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(prev => prev.filter(item => item.id !== id))
    }
  }

  // Handle Logo Upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setLogoUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header (Hidden on Print) */}
      <div className="print:hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-500/20">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">ระบบสร้างใบเสนอราคา & ใบเสร็จรับเงิน (Easy Invoice)</h1>
              <p className="text-gray-600 dark:text-gray-400">
                ออกใบเสนอราคา ใบแจ้งหนี้ ใบเสร็จรับเงิน คำนวณ VAT และหัก ณ ที่จ่าย พร้อมพิมพ์/บันทึก PDF ทันที
              </p>
            </div>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 transition-all text-sm"
          >
            <Printer className="w-4 h-4" /> พิมพ์ / บันทึกเป็น PDF
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs Control Panel (Hidden on Print) (5 cols) */}
        <div className="lg:col-span-5 space-y-6 print:hidden">
          {/* Doc Type Selector */}
          <div className="bg-white dark:bg-gray-900 p-5 rounded-3xl border dark:border-gray-800 space-y-3">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">ประเภทเอกสาร</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                'ใบเสนอราคา (Quotation)',
                'ใบแจ้งหนี้ (Invoice)',
                'ใบเสร็จรับเงิน (Receipt)',
                'ใบวางบิล (Billing Note)'
              ].map(type => (
                <button
                  key={type}
                  onClick={() => setDocType(type)}
                  className={`p-2.5 text-xs font-semibold rounded-xl border transition-all text-left truncate ${
                    docType === type
                      ? 'bg-blue-50 dark:bg-blue-950 border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Seller & Logo */}
          <div className="bg-white dark:bg-gray-900 p-5 rounded-3xl border dark:border-gray-800 space-y-4">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-500" /> ข้อมูลผู้ออกเอกสาร (ผู้ขาย / ร้านค้า)
            </h3>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-500 mb-1">ชื่อร้านค้า / บริษัท / ฟรีแลนซ์</label>
                <input
                  type="text"
                  value={sellerName}
                  onChange={e => setSellerName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-500 mb-1">เลขประจำตัวผู้เสียภาษี</label>
                  <input
                    type="text"
                    value={sellerTaxId}
                    onChange={e => setSellerTaxId(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">เบอร์โทรศัพท์</label>
                  <input
                    type="text"
                    value={sellerPhone}
                    onChange={e => setSellerPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-500 mb-1">ที่อยู่</label>
                <textarea
                  rows={2}
                  value={sellerAddress}
                  onChange={e => setSellerAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-500 mb-1">เบอร์ / เลขพร้อมเพย์ (รับเงิน)</label>
                  <input
                    type="text"
                    value={sellerPromptPay}
                    onChange={e => setSellerPromptPay(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">โลโก้ร้านค้า</label>
                  <label className="flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl cursor-pointer text-gray-600 dark:text-gray-300 font-medium">
                    <Upload className="w-3.5 h-3.5" /> {logoUrl ? 'เปลี่ยนโลโก้' : 'อัปโหลดโลโก้'}
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Buyer Info */}
          <div className="bg-white dark:bg-gray-900 p-5 rounded-3xl border dark:border-gray-800 space-y-4">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-500" /> ข้อมูลผู้รับเอกสาร (ลูกค้า)
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-500 mb-1">ชื่อลูกค้า / บริษัท</label>
                <input
                  type="text"
                  value={buyerName}
                  onChange={e => setBuyerName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-500 mb-1">เลขประจำตัวผู้เสียภาษี</label>
                  <input
                    type="text"
                    value={buyerTaxId}
                    onChange={e => setBuyerTaxId(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">เบอร์โทรศัพท์</label>
                  <input
                    type="text"
                    value={buyerPhone}
                    onChange={e => setBuyerPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-500 mb-1">ที่อยู่ลูกค้า</label>
                <textarea
                  rows={2}
                  value={buyerAddress}
                  onChange={e => setBuyerAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl resize-none"
                />
              </div>
            </div>
          </div>

          {/* Tax & Discount Options */}
          <div className="bg-white dark:bg-gray-900 p-5 rounded-3xl border dark:border-gray-800 space-y-4">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <Percent className="w-4 h-4 text-amber-500" /> ภาษีมูลค่าเพิ่ม & ส่วนลด
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-gray-500 mb-1">ภาษีมูลค่าเพิ่ม (VAT)</label>
                <select
                  value={vatType}
                  onChange={e => setVatType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl"
                >
                  <option value="exclusive">VAT 7% (แยกนอกราคา)</option>
                  <option value="inclusive">VAT 7% (รวมในราคา)</option>
                  <option value="none">ไม่มี VAT (0%)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-500 mb-1">หัก ณ ที่จ่าย (WHT)</label>
                <select
                  value={withholdingTaxRate}
                  onChange={e => setWithholdingTaxRate(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl"
                >
                  <option value={0}>ไม่หัก (0%)</option>
                  <option value={1}>1% (ค่าขนส่ง)</option>
                  <option value={2}>2% (ค่าโฆษณา)</option>
                  <option value={3}>3% (บริการ / ฟรีแลนซ์)</option>
                  <option value={5}>5% (ค่าเช่า / นักแสดง)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-500 mb-1">ส่วนลดท้ายบิล (บาท)</label>
                <input
                  type="number"
                  min="0"
                  value={discountAmount || ''}
                  onChange={e => setDiscountAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-gray-500 mb-1">เลขที่เอกสาร</label>
                <input
                  type="text"
                  value={docNumber}
                  onChange={e => setDocNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Live Document Preview / Printable A4 Area (7 cols) */}
        <div className="lg:col-span-7 bg-white text-gray-900 p-8 sm:p-12 rounded-3xl shadow-xl border border-gray-200 space-y-8 print:p-0 print:border-none print:shadow-none print:m-0 print:w-full">
          {/* Header Row */}
          <div className="flex justify-between items-start border-b border-gray-200 pb-6">
            <div className="space-y-2 max-w-[60%]">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="h-14 object-contain mb-2" />
              ) : (
                <div className="text-xl font-extrabold text-blue-600 tracking-tight">
                  {sellerName}
                </div>
              )}
              <div className="text-xs text-gray-600 leading-relaxed">
                <p className="font-semibold text-gray-800">{sellerName}</p>
                <p>{sellerAddress}</p>
                <p>เลขประจำตัวผู้เสียภาษี: {sellerTaxId} | โทร: {sellerPhone}</p>
              </div>
            </div>

            <div className="text-right space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-wide uppercase">
                {docType}
              </h2>
              <p className="text-xs font-mono text-gray-500 font-bold">{docNumber}</p>
              <div className="text-xs text-gray-600 pt-2 space-y-0.5">
                <p><strong>วันที่:</strong> {docDate}</p>
                <p><strong>ครบกำหนด:</strong> {dueDate}</p>
              </div>
            </div>
          </div>

          {/* Buyer Block */}
          <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-200 text-xs space-y-1">
            <span className="font-bold text-gray-500 uppercase text-[10px] tracking-wider">ลูกค้า / ผู้รับบริการ</span>
            <p className="font-bold text-gray-900 text-sm">{buyerName}</p>
            <p className="text-gray-600">{buyerAddress}</p>
            <p className="text-gray-600">เลขประจำตัวผู้เสียภาษี: {buyerTaxId} | โทร: {buyerPhone}</p>
          </div>

          {/* Itemized Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b-2 border-gray-900 bg-gray-100/70 text-gray-800 font-bold">
                  <th className="py-2.5 px-3 w-10 text-center">#</th>
                  <th className="py-2.5 px-3">รายการสินค้า / บริการ</th>
                  <th className="py-2.5 px-3 text-right w-20">จำนวน</th>
                  <th className="py-2.5 px-3 text-right w-28">ราคา/หน่วย</th>
                  <th className="py-2.5 px-3 text-right w-28">รวมเงิน</th>
                  <th className="py-2.5 px-2 w-10 print:hidden text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map((item, idx) => (
                  <tr key={item.id} className="group">
                    <td className="py-3 px-3 text-center text-gray-400 font-medium">{idx + 1}</td>
                    <td className="py-3 px-3">
                      <input
                        type="text"
                        value={item.name}
                        placeholder="ระบุรายการสินค้า/บริการ..."
                        onChange={e => updateItem(item.id, 'name', e.target.value)}
                        className="w-full bg-transparent border-b border-transparent focus:border-blue-500 outline-none font-medium text-gray-900"
                      />
                    </td>
                    <td className="py-3 px-3 text-right">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={e => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                        className="w-full text-right bg-transparent border-b border-transparent focus:border-blue-500 outline-none font-medium"
                      />
                    </td>
                    <td className="py-3 px-3 text-right">
                      <input
                        type="number"
                        min="0"
                        value={item.price}
                        onChange={e => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                        className="w-full text-right bg-transparent border-b border-transparent focus:border-blue-500 outline-none font-medium"
                      />
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-gray-900">
                      ฿{(item.quantity * item.price).toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-2 text-center print:hidden">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors p-1"
                        title="ลบแถว"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pt-3 print:hidden">
              <button
                onClick={addItem}
                className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> เพิ่มรายการสินค้า
              </button>
            </div>
          </div>

          {/* Totals & Thai Baht Text */}
          <div className="grid sm:grid-cols-12 gap-6 pt-4 border-t border-gray-200">
            {/* Left Note & PromptPay QR (7 cols) */}
            <div className="sm:col-span-7 space-y-4">
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs">
                <span className="text-gray-500 font-semibold">จำนวนเงินตัวอักษร:</span>
                <p className="font-bold text-blue-900 text-sm mt-0.5">{calc.thaiBahtText}</p>
              </div>

              {sellerPromptPay && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="p-1.5 bg-white rounded-lg shadow-sm border">
                    <QRCodeSVG 
                      value={`promptpay:${sellerPromptPay}`} 
                      size={60} 
                    />
                  </div>
                  <div className="text-[11px] text-gray-600">
                    <p className="font-bold text-gray-900">สแกนจ่ายผ่าน PromptPay</p>
                    <p>เลขพร้อมเพย์: {sellerPromptPay}</p>
                    <p>ยอดชำระ: <strong>฿{calc.netPayable.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</strong></p>
                  </div>
                </div>
              )}

              <div className="text-xs space-y-1">
                <span className="font-bold text-gray-500">หมายเหตุ:</span>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full bg-transparent border-b border-transparent focus:border-gray-300 outline-none text-gray-600 resize-none text-[11px] leading-relaxed"
                />
              </div>
            </div>

            {/* Right Calculation Matrix (5 cols) */}
            <div className="sm:col-span-5 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>รวมเป็นเงิน (Subtotal):</span>
                <span className="font-medium">฿{calc.rawSubtotal.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>ส่วนลด (Discount):</span>
                  <span>-฿{discountAmount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
                </div>
              )}

              {vatType !== 'none' && (
                <div className="flex justify-between text-gray-600">
                  <span>ภาษีมูลค่าเพิ่ม VAT 7%:</span>
                  <span className="font-medium">฿{calc.vat.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
                </div>
              )}

              <div className="flex justify-between font-bold text-gray-900 pt-2 border-t text-sm">
                <span>ยอดรวมทั้งสิ้น (Grand Total):</span>
                <span>฿{calc.grandTotal.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
              </div>

              {withholdingTaxRate > 0 && (
                <div className="flex justify-between text-red-600 pt-1">
                  <span>หัก ณ ที่จ่าย ({withholdingTaxRate}%):</span>
                  <span>-฿{calc.withholdingTax.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
                </div>
              )}

              <div className="flex justify-between font-black text-blue-600 pt-2 border-t-2 border-blue-600 text-base">
                <span>ยอดชำระสุทธิ (Net Total):</span>
                <span>฿{calc.netPayable.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-12 pt-12 text-center text-xs text-gray-600">
            <div className="space-y-8">
              <div className="border-b border-gray-300 w-3/4 mx-auto"></div>
              <p>ผู้รับสินค้า / บริการ<br /><span className="text-[10px] text-gray-400">วันที่ _____/_____/_____</span></p>
            </div>
            <div className="space-y-8">
              <div className="border-b border-gray-300 w-3/4 mx-auto"></div>
              <p>ผู้มีอำนาจลงนาม / ผู้ออกเอกสาร<br /><span className="text-[10px] text-gray-400">วันที่ _____/_____/_____</span></p>
            </div>
          </div>
        </div>
      </div>

      <div className="print:hidden">
        <AdSlot />
      </div>
    </div>
  )
}
