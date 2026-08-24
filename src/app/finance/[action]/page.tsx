'use client'

import { use, useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import { financeTools } from '@/data/finance-tools'
import { AdSlot } from '@/components/AdSlot'
import { RotateCcw } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'

export default function FinanceToolPage({ params }: { params: Promise<{ action: string }> }) {
  const resolvedParams = use(params)
  const tool = financeTools.find(t => t.id === resolvedParams.action)
  
  if (!tool) {
    notFound()
  }

  // Initialize state with default values
  const [inputs, setInputs] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {}
    tool.inputs.forEach(inp => {
      initial[inp.name] = inp.default || 0
    })
    return initial
  })

  const [output, setOutput] = useState<{ result: string, details?: string[], chartData?: any[], chartConfig?: any[] }>({ result: '' })

  const IconComponent = (LucideIcons as any)[tool.icon] || LucideIcons.Calculator

  useEffect(() => {
    try {
      setOutput(tool.action(inputs))
    } catch (e) {
      setOutput({ result: 'เกิดข้อผิดพลาดในการคำนวณ' })
    }
  }, [inputs, tool])

  const handleInputChange = (name: string, value: string) => {
    setInputs(prev => ({ ...prev, [name]: parseFloat(value) || 0 }))
  }

  const handleReset = () => {
    const initial: Record<string, number> = {}
    tool.inputs.forEach(inp => {
      initial[inp.name] = inp.default || 0
    })
    setInputs(initial)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <IconComponent className="w-8 h-8 text-green-600 dark:text-green-400" />
          <h1 className="text-3xl font-bold">{tool.name}</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">{tool.desc}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Input Panel */}
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
                  type="number"
                  value={inputs[inp.name] || ''}
                  onChange={(e) => handleInputChange(inp.name, e.target.value)}
                  className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500 text-lg transition-shadow"
                  placeholder={inp.placeholder}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Output Panel */}
        <div className="bg-green-50 dark:bg-green-900/10 p-6 md:p-8 rounded-3xl border border-green-100 dark:border-green-900/30 flex flex-col justify-center overflow-hidden">
          <h2 className="font-semibold text-green-800 dark:text-green-300 mb-4 opacity-80 text-sm uppercase tracking-wider">ผลการคำนวณ</h2>
          <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 leading-snug break-words">
            {output.result}
          </div>
          
          {output.details && output.details.length > 0 && (
            <div className="space-y-3 pt-6 border-t border-green-200 dark:border-green-800/50">
              {output.details.map((desc, idx) => (
                <div key={idx} className="text-gray-700 dark:text-gray-300 break-words">
                  {desc}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chart Panel */}
      {output.chartData && output.chartConfig && (
        <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-3xl shadow-sm border dark:border-gray-800 overflow-hidden">
          <h2 className="font-semibold text-lg mb-6">กราฟแสดงการเติบโต (Visual Projection)</h2>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={output.chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  {output.chartConfig.map((config, index) => (
                    <linearGradient key={`color${config.dataKey}`} id={`color${config.dataKey}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={config.color} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={config.color} stopOpacity={0}/>
                    </linearGradient>
                  ))}
                </defs>
                <XAxis dataKey="year" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis 
                  stroke="#888888" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `฿${(value / 1000).toFixed(0)}k`}
                />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <Tooltip 
                  formatter={(value: any) => [`฿${Number(value).toLocaleString()}`, '']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" />
                {output.chartConfig.map((config, index) => (
                  <Area
                    key={config.dataKey}
                    type="monotone"
                    dataKey={config.dataKey}
                    name={config.name}
                    stroke={config.color}
                    fillOpacity={1}
                    fill={`url(#color${config.dataKey})`}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <AdSlot />
    </div>
  )
}
