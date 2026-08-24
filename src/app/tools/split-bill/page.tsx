'use client'

import { useState, useMemo } from 'react'
import { AdSlot } from '@/components/AdSlot'
import { 
  Users, 
  Plus, 
  Trash2, 
  Receipt, 
  Copy, 
  Check, 
  Percent, 
  DollarSign, 
  UserPlus, 
  Utensils, 
  Share2, 
  CheckSquare, 
  Square,
  Sparkles,
  Calculator
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Member {
  id: string
  name: string
}

interface BillItem {
  id: string
  name: string
  price: number
  quantity: number
  sharedBy: string[] // member ids
}

export default function SplitBillPage() {
  const [members, setMembers] = useState<Member[]>([
    { id: '1', name: 'สมชาย' },
    { id: '2', name: 'สมศรี' },
    { id: '3', name: 'มานี' },
    { id: '4', name: 'ปิติ' }
  ])
  const [newMemberName, setNewMemberName] = useState('')

  const [items, setItems] = useState<BillItem[]>([
    { id: '1', name: 'ข้าวผัดทะเล', price: 120, quantity: 1, sharedBy: ['1', '2'] },
    { id: '2', name: 'ต้มยำกุ้งหม้อไฟ', price: 250, quantity: 1, sharedBy: ['1', '2', '3', '4'] },
    { id: '3', name: 'ไก่ทอดเกาหลี', price: 180, quantity: 1, sharedBy: ['3', '4'] },
    { id: '4', name: 'น้ำเปล่า + น้ำแข็ง', price: 60, quantity: 1, sharedBy: ['1', '2', '3', '4'] }
  ])

  const [newItemName, setNewItemName] = useState('')
  const [newItemPrice, setNewItemPrice] = useState('')
  const [newItemQty, setNewItemQty] = useState('1')
  const [newItemSharedBy, setNewItemSharedBy] = useState<string[]>(['1', '2', '3', '4'])

  // Extra fees
  const [serviceChargePercent, setServiceChargePercent] = useState<number>(0)
  const [vatPercent, setVatPercent] = useState<number>(0)
  const [discountAmount, setDiscountAmount] = useState<number>(0)
  const [deliveryFee, setDeliveryFee] = useState<number>(0)
  const [promptPay, setPromptPay] = useState<string>('')
  const [copied, setCopied] = useState(false)

  // Add Member
  const addMember = () => {
    const trimmed = newMemberName.trim()
    if (!trimmed) {
      toast.error('กรุณาระบุชื่อเพื่อน')
      return
    }
    const newId = Date.now().toString()
    setMembers(prev => [...prev, { id: newId, name: trimmed }])
    setNewMemberName('')
    setNewItemSharedBy(prev => [...prev, newId])
    toast.success(`เพิ่ม ${trimmed} แล้ว`)
  }

  // Remove Member
  const removeMember = (id: string) => {
    if (members.length <= 1) {
      toast.error('ต้องมีสมาชิกอย่างน้อย 1 คน')
      return
    }
    setMembers(prev => prev.filter(m => m.id !== id))
    setItems(prev => prev.map(item => ({
      ...item,
      sharedBy: item.sharedBy.filter(mId => mId !== id)
    })))
    setNewItemSharedBy(prev => prev.filter(mId => mId !== id))
  }

  // Add Item
  const addItem = () => {
    const trimmedName = newItemName.trim()
    const price = parseFloat(newItemPrice)
    const qty = parseInt(newItemQty) || 1

    if (!trimmedName) {
      toast.error('กรุณาระบุชื่อรายการอาหาร')
      return
    }
    if (isNaN(price) || price <= 0) {
      toast.error('กรุณาระบุราคาที่ถูกต้อง')
      return
    }
    if (newItemSharedBy.length === 0) {
      toast.error('ต้องเลือกคนหารอย่างน้อย 1 คน')
      return
    }

    const newItem: BillItem = {
      id: Date.now().toString(),
      name: trimmedName,
      price,
      quantity: qty,
      sharedBy: [...newItemSharedBy]
    }

    setItems(prev => [...prev, newItem])
    setNewItemName('')
    setNewItemPrice('')
    setNewItemQty('1')
    setNewItemSharedBy(members.map(m => m.id))
    toast.success(`เพิ่ม ${trimmedName} เรียบร้อย`)
  }

  // Remove Item
  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  // Toggle Member for Item
  const toggleItemMember = (itemId: string, memberId: string) => {
    setItems(prev => prev.map(item => {
      if (item.id !== itemId) return item
      const exists = item.sharedBy.includes(memberId)
      const nextShared = exists
        ? item.sharedBy.filter(id => id !== memberId)
        : [...item.sharedBy, memberId]
      if (nextShared.length === 0) {
        toast.error('ต้องมีคนหารอย่างน้อย 1 คน')
        return item
      }
      return { ...item, sharedBy: nextShared }
    }))
  }

  // Toggle New Item Member
  const toggleNewItemMember = (memberId: string) => {
    setNewItemSharedBy(prev => 
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    )
  }

  // Select all / none for new item
  const selectAllNewItem = () => {
    setNewItemSharedBy(members.map(m => m.id))
  }

  // Calculations
  const calculations = useMemo(() => {
    const rawFoodTotal = items.reduce((acc, it) => acc + (it.price * it.quantity), 0)
    
    // Subtotal after food
    const discountedFoodTotal = Math.max(0, rawFoodTotal - discountAmount)
    const serviceChargeVal = (discountedFoodTotal * (serviceChargePercent / 100))
    const vatVal = ((discountedFoodTotal + serviceChargeVal) * (vatPercent / 100))
    const grandTotal = discountedFoodTotal + serviceChargeVal + vatVal + deliveryFee

    // Calculate per person
    // Ratio multiplier for extra fees (taxes/discounts applied proportionally to what they consumed)
    const multiplier = rawFoodTotal > 0 ? (grandTotal / rawFoodTotal) : 1

    const memberBreakdown = members.map(m => {
      const memberItems: { name: string; cost: number; portion: number }[] = []
      let rawPersonalTotal = 0

      items.forEach(it => {
        if (it.sharedBy.includes(m.id)) {
          const itemTotal = it.price * it.quantity
          const shareCost = itemTotal / it.sharedBy.length
          rawPersonalTotal += shareCost
          memberItems.push({
            name: it.name,
            cost: shareCost,
            portion: it.sharedBy.length
          })
        }
      })

      const finalAmount = rawPersonalTotal * multiplier

      return {
        member: m,
        items: memberItems,
        rawTotal: rawPersonalTotal,
        finalTotal: finalAmount
      }
    })

    return {
      rawFoodTotal,
      discountedFoodTotal,
      serviceChargeVal,
      vatVal,
      grandTotal,
      memberBreakdown
    }
  }, [members, items, serviceChargePercent, vatPercent, discountAmount, deliveryFee])

  // Copy LINE message
  const copyForLine = () => {
    let msg = `🧾 สรุปยอดหารค่าอาหาร\n`
    msg += `------------------------\n`
    calculations.memberBreakdown.forEach(({ member, items, finalTotal }) => {
      msg += `👤 ${member.name}: ${finalTotal.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท\n`
      items.forEach(it => {
        msg += `  - ${it.name} (${it.portion > 1 ? `หาร ${it.portion} คน` : 'กินคนเดียว'}) = ${it.cost.toFixed(2)} บ.\n`
      })
      msg += `\n`
    })
    msg += `------------------------\n`
    msg += `💵 ยอดรวมทั้งหมด: ${calculations.grandTotal.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท\n`
    if (promptPay.trim()) {
      msg += `📲 พร้อมเพย์: ${promptPay.trim()}\n`
    }
    msg += `\n(คำนวณโดย thai-webtools.vercel.app/tools/split-bill)`

    navigator.clipboard.writeText(msg)
    setCopied(true)
    toast.success('คัดลอกข้อความสรุปสำหรับส่ง LINE แล้ว!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl text-white shadow-md">
            <Receipt className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">ระบบหารบิลแยกรายการ (Split Bill Pro)</h1>
            <p className="text-gray-600 dark:text-gray-400">
              หารค่าอาหารตามจริง ใครกินอะไรจ่ายอันนั้น รองรับ VAT, Service Charge, ส่วนลด และค่าส่ง
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Column: People & Items */}
        <div className="lg:col-span-7 space-y-6">
          {/* Members Box */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border dark:border-gray-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center gap-2 text-gray-800 dark:text-gray-200">
                <Users className="w-5 h-5 text-emerald-500" /> สมาชิกในโต๊ะ ({members.length} คน)
              </h2>
            </div>

            {/* Member Input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="ใส่ชื่อเพื่อน..."
                value={newMemberName}
                onChange={e => setNewMemberName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addMember()}
                className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
              <button
                onClick={addMember}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl text-sm flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <UserPlus className="w-4 h-4" /> เพิ่มเพื่อน
              </button>
            </div>

            {/* Member Badges */}
            <div className="flex flex-wrap gap-2 pt-2">
              {members.map(m => (
                <div
                  key={m.id}
                  className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-sm font-medium"
                >
                  <span>👤 {m.name}</span>
                  <button
                    onClick={() => removeMember(m.id)}
                    className="text-emerald-600 dark:text-emerald-400 hover:text-red-500 transition-colors"
                    title="ลบ"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Add Item Box */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border dark:border-gray-800 space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2 text-gray-800 dark:text-gray-200">
              <Utensils className="w-5 h-5 text-emerald-500" /> เพิ่มรายการอาหาร / เมนู
            </h2>

            <div className="grid grid-cols-12 gap-2">
              <input
                type="text"
                placeholder="ชื่อเมนู (เช่น ชาบู, ข้าวผัด, เบียร์)"
                value={newItemName}
                onChange={e => setNewItemName(e.target.value)}
                className="col-span-6 px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
              <input
                type="number"
                placeholder="ราคา (บาท)"
                value={newItemPrice}
                onChange={e => setNewItemPrice(e.target.value)}
                className="col-span-4 px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
              <input
                type="number"
                placeholder="จน."
                value={newItemQty}
                onChange={e => setNewItemQty(e.target.value)}
                min="1"
                className="col-span-2 px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-center"
              />
            </div>

            {/* Who shared this item */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs font-semibold text-gray-500 dark:text-gray-400">
                <span>เลือกคนหารเมนูนี้:</span>
                <button
                  type="button"
                  onClick={selectAllNewItem}
                  className="text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  เลือกทุกคน ({members.length})
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {members.map(m => {
                  const isChecked = newItemSharedBy.includes(m.id)
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => toggleNewItemMember(m.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
                        isChecked
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {isChecked ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
                      {m.name}
                    </button>
                  )
                })}
              </div>
            </div>

            <button
              onClick={addItem}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" /> เพิ่มเมนูนี้ลงบิล
            </button>
          </div>

          {/* List of Added Items */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border dark:border-gray-800 space-y-4">
            <h2 className="text-lg font-bold flex items-center justify-between text-gray-800 dark:text-gray-200">
              <span>รายการอาหารทั้งหมด ({items.length} รายการ)</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-base">
                ฿{calculations.rawFoodTotal.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
              </span>
            </h2>

            <div className="space-y-3">
              {items.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">
                  ยังไม่มีรายการอาหาร กดเพิ่มเมนูด้านบนได้เลย
                </div>
              ) : (
                items.map(item => (
                  <div
                    key={item.id}
                    className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-gray-100">
                          {item.name} {item.quantity > 1 && <span className="text-xs text-gray-500 font-normal">x{item.quantity}</span>}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          ฿{item.price.toLocaleString()} x {item.quantity} = ฿{(item.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 p-1.5 transition-colors"
                        title="ลบรายการ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Member checklist */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {members.map(m => {
                        const isChecked = item.sharedBy.includes(m.id)
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => toggleItemMember(item.id, m.id)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1 ${
                              isChecked
                                ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                                : 'bg-white dark:bg-gray-800 text-gray-400 border-gray-200 dark:border-gray-700 opacity-60'
                            }`}
                          >
                            <span>{isChecked ? '✓' : '+'}</span>
                            {m.name}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Extra Adjustments: Service, VAT, Discount, Delivery */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border dark:border-gray-800 space-y-4">
            <h2 className="text-base font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <Percent className="w-4 h-4 text-emerald-500" /> ค่าบริการ, ภาษี และส่วนลดเพิ่มเติม
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Service Charge (%)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={serviceChargePercent || ''}
                  onChange={e => setServiceChargePercent(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  VAT (%)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={vatPercent || ''}
                  onChange={e => setVatPercent(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  ส่วนลด (บาท)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={discountAmount || ''}
                  onChange={e => setDiscountAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  ค่าส่ง / อื่นๆ (บาท)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={deliveryFee || ''}
                  onChange={e => setDeliveryFee(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Breakdown Summary & LINE Copy */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20 p-6 rounded-3xl border border-emerald-200 dark:border-emerald-800/50 space-y-6 sticky top-6">
            <div className="flex items-center justify-between border-b border-emerald-200 dark:border-emerald-800/50 pb-4">
              <div>
                <h2 className="text-xl font-black text-gray-900 dark:text-white">
                  สรุปยอดรายบุคคล
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  คำนวณตามสัดส่วนที่กินจริง
                </p>
              </div>
              <div className="text-right">
                <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase">ยอดรวมทั้งโต๊ะ</div>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  ฿{calculations.grandTotal.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>

            {/* Individual Cards */}
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {calculations.memberBreakdown.map(({ member, items, finalTotal }) => (
                <div
                  key={member.id}
                  className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-emerald-100 dark:border-emerald-900/30 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                      {member.name}
                    </span>
                    <span className="font-black text-emerald-600 dark:text-emerald-400 text-lg">
                      ฿{finalTotal.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1 pl-4 border-l-2 border-emerald-100 dark:border-emerald-800">
                    {items.length === 0 ? (
                      <span className="italic">ไม่ได้แชร์เมนูใดๆ</span>
                    ) : (
                      items.map((it, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span className="truncate max-w-[180px]">
                            {it.name} {it.portion > 1 ? `(หาร ${it.portion})` : ''}
                          </span>
                          <span className="font-medium">฿{it.cost.toFixed(2)}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* PromptPay & Share */}
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  เบอร์โทร / เลขพร้อมเพย์คนรับเงิน (ใส่หรือไม่ใส่ก็ได้)
                </label>
                <input
                  type="text"
                  placeholder="เช่น 081-234-5678"
                  value={promptPay}
                  onChange={e => setPromptPay(e.target.value)}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-emerald-200 dark:border-emerald-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                onClick={copyForLine}
                className="w-full py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
              >
                {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                {copied ? 'คัดลอกสำเร็จแล้ว!' : '📲 คัดลอกสรุปส่งเข้ากลุ่ม LINE'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <AdSlot />
    </div>
  )
}
