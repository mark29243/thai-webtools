'use client'

import { useState } from 'react'
import { AdSlot } from '@/components/AdSlot'

export default function RandomNumberPage() {
  const [min, setMin] = useState(1)
  const [max, setMax] = useState(100)
  const [count, setCount] = useState(1)
  const [allowDuplicates, setAllowDuplicates] = useState(true)
  const [results, setResults] = useState<number[]>([])

  const generateNumbers = () => {
    if (min >= max) {
      alert('ค่าต่ำสุดต้องน้อยกว่าค่าสูงสุด')
      return
    }
    
    if (!allowDuplicates && count > (max - min + 1)) {
      alert('จำนวนที่สุ่มต้องไม่เกินช่วงตัวเลขทั้งหมด (เมื่อไม่ให้ซ้ำกัน)')
      return
    }

    let nums: number[] = []
    
    if (allowDuplicates) {
      for (let i = 0; i < count; i++) {
        nums.push(Math.floor(Math.random() * (max - min + 1)) + min)
      }
    } else {
      const available = Array.from({ length: max - min + 1 }, (_, i) => i + min)
      for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * available.length)
        nums.push(available[randomIndex])
        available.splice(randomIndex, 1) // Remove used number
      }
    }
    
    setResults(nums)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Random Number Generator</h1>
        <p className="text-gray-600">เครื่องมือสุ่มตัวเลข กำหนดช่วงและจำนวนที่ต้องการได้</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ค่าต่ำสุด (Min)</label>
            <input
              type="number"
              className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
              value={min}
              onChange={(e) => setMin(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ค่าสูงสุด (Max)</label>
            <input
              type="number"
              className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
              value={max}
              onChange={(e) => setMax(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">จำนวนที่สุ่ม (Count)</label>
            <input
              type="number"
              min="1"
              max="1000"
              className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
            />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={allowDuplicates}
              onChange={(e) => setAllowDuplicates(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">อนุญาตให้สุ่มได้เลขซ้ำกัน (Allow duplicates)</span>
          </label>
        </div>

        <button
          onClick={generateNumbers}
          className="w-full py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold text-lg shadow-sm"
        >
          สุ่มตัวเลข
        </button>

        {results.length > 0 && (
          <div className="p-6 bg-gray-50 border rounded-xl text-center space-y-4">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">ผลลัพธ์</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {results.map((num, idx) => (
                <div key={idx} className="bg-white border-2 border-blue-100 text-blue-700 font-bold text-2xl w-16 h-16 flex items-center justify-center rounded-xl shadow-sm">
                  {num}
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
