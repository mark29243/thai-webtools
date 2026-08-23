'use client'

import { use, useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import { mathTools } from '@/data/math-tools'
import { AdSlot } from '@/components/AdSlot'
import { RotateCcw } from 'lucide-react'
import * as LucideIcons from 'lucide-react'

export default function MathToolPage({ params }: { params: Promise<{ action: string }> }) {
  const resolvedParams = use(params)
  const tool = mathTools.find(t => t.id === resolvedParams.action)
  
  if (!tool) {
    notFound()
  }

  const [inputs, setInputs] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {}
    tool.inputs.forEach(inp => {
      initial[inp.name] = inp.default || ''
    })
    return initial
  })

  const [output, setOutput] = useState<{ result: string, details?: string[] }>({ result: '' })

  const IconComponent = (LucideIcons as any)[tool.icon] || LucideIcons.Calculator

  useEffect(() => {
    try {
      setOutput(tool.action(inputs))
    } catch (e) {
      setOutput({ result: 'เกิดข้อผิดพลาดในการคำนวณ' })
    }
  }, [inputs, tool])

  const handleInputChange = (name: string, value: string, type: string) => {
    setInputs(prev => ({ 
      ...prev, 
      [name]: type === 'number' ? (parseFloat(value) || 0) : value 
    }))
  }

  const handleReset = () => {
    const initial: Record<string, any> = {}
    tool.inputs.forEach(inp => {
      initial[inp.name] = inp.default || ''
    })
    setInputs(initial)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <IconComponent className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-3xl font-bold">{tool.name}</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">{tool.desc}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-3xl shadow-sm border dark:border-gray-800 space-y-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold text-lg">ป้อนข้อมูล</h2>
            <button 
              onClick={handleReset}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> รีเซ็ต
            </button>
          </div>
          
          <div className="space-y-4">
            {tool.inputs.map(inp => (
              <div key={inp.name}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {inp.label}
                </label>
                <input 
                  type={inp.type}
                  value={inputs[inp.name] ?? ''}
                  onChange={(e) => handleInputChange(inp.name, e.target.value, inp.type)}
                  className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-lg transition-shadow"
                  placeholder={inp.placeholder}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/10 p-6 md:p-8 rounded-3xl border border-blue-100 dark:border-blue-900/30 flex flex-col justify-center">
          <h2 className="font-semibold text-blue-800 dark:text-blue-300 mb-4 opacity-80 text-sm uppercase tracking-wider">ผลลัพธ์</h2>
          <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 leading-snug">
            {output.result}
          </div>
          
          {output.details && output.details.length > 0 && (
            <div className="space-y-3 pt-6 border-t border-blue-200 dark:border-blue-800/50">
              {output.details.map((desc, idx) => (
                <div key={idx} className="text-gray-700 dark:text-gray-300">
                  {desc}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AdSlot />
    </div>
  )
}
