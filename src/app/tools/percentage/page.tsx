'use client'

import { useState } from 'react'
import { AdSlot } from '@/components/AdSlot'

export default function PercentageCalculatorPage() {
  const [val1, setVal1] = useState('')
  const [val2, setVal2] = useState('')
  const [res1, setRes1] = useState<number | null>(null)
  
  const [val3, setVal3] = useState('')
  const [val4, setVal4] = useState('')
  const [res2, setRes2] = useState<number | null>(null)

  const calc1 = () => {
    const a = parseFloat(val1)
    const b = parseFloat(val2)
    if (!isNaN(a) && !isNaN(b)) {
      setRes1((a / 100) * b)
    }
  }

  const calc2 = () => {
    const a = parseFloat(val3)
    const b = parseFloat(val4)
    if (!isNaN(a) && !isNaN(b) && b !== 0) {
      setRes2((a / b) * 100)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Percentage Calculator</h1>
        <p className="text-gray-600">เครื่องมือคำนวณหาค่าเปอร์เซ็นต์ (ร้อยละ) และสัดส่วน</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Type 1 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
          <h2 className="font-semibold text-lg border-b pb-2">หาร้อยละของจำนวน</h2>
          <div className="flex items-center gap-2">
            <input type="number" className="w-20 border rounded p-2" value={val1} onChange={e => setVal1(e.target.value)} placeholder="X" />
            <span>% ของ</span>
            <input type="number" className="w-32 border rounded p-2" value={val2} onChange={e => setVal2(e.target.value)} placeholder="Y" />
            <span>คือ</span>
          </div>
          <button onClick={calc1} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">คำนวณ</button>
          {res1 !== null && <div className="text-2xl font-bold text-center text-blue-600 pt-2">{res1}</div>}
        </div>

        {/* Type 2 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
          <h2 className="font-semibold text-lg border-b pb-2">หาค่าสัดส่วนเปอร์เซ็นต์</h2>
          <div className="flex items-center gap-2">
            <input type="number" className="w-24 border rounded p-2" value={val3} onChange={e => setVal3(e.target.value)} placeholder="X" />
            <span>คิดเป็นกี่เปอร์เซ็นต์ของ</span>
            <input type="number" className="w-32 border rounded p-2" value={val4} onChange={e => setVal4(e.target.value)} placeholder="Y" />
          </div>
          <button onClick={calc2} className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">คำนวณ</button>
          {res2 !== null && <div className="text-2xl font-bold text-center text-green-600 pt-2">{res2.toFixed(2)} %</div>}
        </div>
      </div>

      <AdSlot />
    </div>
  )
}
