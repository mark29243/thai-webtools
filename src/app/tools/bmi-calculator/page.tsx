'use client'

import { useState } from 'react'
import { AdSlot } from '@/components/AdSlot'

export default function BmiCalculatorPage() {
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [bmi, setBmi] = useState<number | null>(null)
  const [category, setCategory] = useState('')
  const [color, setColor] = useState('')

  const calculateBMI = () => {
    const w = parseFloat(weight)
    const h = parseFloat(height) / 100 // cm to m

    if (w > 0 && h > 0) {
      const bmiValue = w / (h * h)
      setBmi(parseFloat(bmiValue.toFixed(1)))

      if (bmiValue < 18.5) {
        setCategory('น้ำหนักน้อยเกินไป')
        setColor('text-blue-500')
      } else if (bmiValue >= 18.5 && bmiValue < 23) {
        setCategory('น้ำหนักปกติ / สุขภาพดี')
        setColor('text-green-500')
      } else if (bmiValue >= 23 && bmiValue < 25) {
        setCategory('ท้วม / โรคอ้วนระดับ 1')
        setColor('text-yellow-500')
      } else if (bmiValue >= 25 && bmiValue < 30) {
        setCategory('อ้วน / โรคอ้วนระดับ 2')
        setColor('text-orange-500')
      } else {
        setCategory('อ้วนมาก / โรคอ้วนระดับ 3')
        setColor('text-red-500')
      }
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">BMI Calculator</h1>
        <p className="text-gray-600">เครื่องมือคำนวณดัชนีมวลกาย (Body Mass Index)</p>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">น้ำหนัก (กิโลกรัม)</label>
            <input
              type="number"
              className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="เช่น 65"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ส่วนสูง (เซนติเมตร)</label>
            <input
              type="number"
              className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="เช่น 170"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={calculateBMI}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-lg transition-colors"
        >
          คำนวณ BMI
        </button>

        {bmi !== null && (
          <div className="mt-8 p-6 bg-gray-50 rounded-lg text-center border">
            <p className="text-gray-500 mb-2">ค่าดัชนีมวลกายของคุณคือ</p>
            <div className={`text-5xl font-bold mb-4 ${color}`}>{bmi}</div>
            <p className={`text-lg font-medium ${color}`}>{category}</p>
          </div>
        )}
      </div>

      <AdSlot />
    </div>
  )
}
