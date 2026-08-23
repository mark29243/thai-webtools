'use client'

import { useState, use } from 'react'
import { notFound } from 'next/navigation'
import { converters } from '@/data/converters'
import { AdSlot } from '@/components/AdSlot'
import { ArrowRightLeft } from 'lucide-react'

export default function ConverterPage({ params }: { params: Promise<{ type: string }> }) {
  const resolvedParams = use(params)
  const converter = converters[resolvedParams.type]

  if (!converter) {
    notFound()
  }

  const [fromUnit, setFromUnit] = useState(converter.units[0].id)
  const [toUnit, setToUnit] = useState(converter.units[1].id)
  const [inputValue, setInputValue] = useState('1')

  const handleConvert = () => {
    const val = parseFloat(inputValue)
    if (isNaN(val)) return ''

    const fromRatio = converter.units.find(u => u.id === fromUnit)?.ratio || 1
    const toRatio = converter.units.find(u => u.id === toUnit)?.ratio || 1

    // Convert to base unit first, then to target unit
    const baseValue = val * fromRatio
    const result = baseValue / toRatio

    // Format nicely
    return Number.isInteger(result) ? result.toString() : result.toFixed(6).replace(/\.?0+$/, '')
  }

  const handleSwap = () => {
    const temp = fromUnit
    setFromUnit(toUnit)
    setToUnit(temp)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">{converter.title}</h1>
        <p className="text-gray-600 dark:text-gray-400">{converter.description}</p>
      </div>

      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border dark:border-gray-800">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* From */}
          <div className="flex-1 w-full space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">จาก (From)</label>
            <input 
              type="number" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full text-2xl p-4 border dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select 
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full p-3 border dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
            >
              {converter.units.map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <button 
            onClick={handleSwap}
            className="p-4 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors mt-6 md:mt-0"
          >
            <ArrowRightLeft className="w-6 h-6" />
          </button>

          {/* To */}
          <div className="flex-1 w-full space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">เป็น (To)</label>
            <input 
              type="text" 
              readOnly
              value={handleConvert()}
              className="w-full text-2xl p-4 border dark:border-gray-700 rounded-xl bg-blue-50/50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-400 font-semibold outline-none"
            />
            <select 
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full p-3 border dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
            >
              {converter.units.map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <AdSlot />
    </div>
  )
}
