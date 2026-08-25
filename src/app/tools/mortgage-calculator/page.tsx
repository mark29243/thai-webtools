'use client'

import { useState, useMemo } from 'react'
import { AdSlot } from '@/components/AdSlot'
import { 
  Home, 
  TrendingDown, 
  Sparkles, 
  PiggyBank, 
  Calendar, 
  Clock, 
  DollarSign, 
  Percent, 
  HelpCircle,
  BarChart3,
  CheckCircle2
} from 'lucide-react'
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

export default function MortgageCalculatorPage() {
  // Current Loan Info
  const [principal, setPrincipal] = useState<string>('3000000') // 3 ล้าน
  const [interestRate, setInterestRate] = useState<string>('4.5') // 4.5%
  const [loanTermYears, setLoanTermYears] = useState<string>('30') // 30 ปี
  const [customMonthlyPayment, setCustomMonthlyPayment] = useState<string>('')

  // Extra Payment Plan
  const [extraMonthly, setExtraMonthly] = useState<string>('3000') // โปะเพิ่มเดือนละ 3,000
  const [extraYearly, setExtraYearly] = useState<string>('20000') // โปะรายปี 20,000 (เช่น โบนัส)

  // Refinance Option
  const [enableRefinance, setEnableRefinance] = useState<boolean>(false)
  const [refinanceRate, setRefinanceRate] = useState<string>('3.2') // ดอกเบี้ยใหม่ 3.2%
  const [refinanceCost, setRefinanceCost] = useState<string>('15000') // ค่าธรรมเนียมรีไฟแนนซ์

  // Calculations
  const result = useMemo(() => {
    const P = parseFloat(principal) || 0
    const annualRate = (parseFloat(interestRate) || 0) / 100
    const monthlyRate = annualRate / 12
    const totalMonths = (parseInt(loanTermYears) || 0) * 12

    if (P <= 0 || totalMonths <= 0) {
      return null
    }

    // Standard Monthly Payment Formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
    const standardMonthly = monthlyRate > 0 
      ? (P * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) / (Math.pow(1 + monthlyRate, totalMonths) - 1)
      : P / totalMonths

    const baseMonthlyPayment = parseFloat(customMonthlyPayment) || standardMonthly
    const addMonthly = parseFloat(extraMonthly) || 0
    const addYearly = parseFloat(extraYearly) || 0

    // Simulation 1: Standard Plan
    let balanceStd = P
    let totalInterestStd = 0
    let monthsStd = 0
    const yearlyData: { year: number; standardBalance: number; extraBalance: number; refiBalance?: number }[] = []

    while (balanceStd > 0 && monthsStd < 600) {
      monthsStd++
      const interest = balanceStd * monthlyRate
      totalInterestStd += interest
      const principalPaid = Math.min(balanceStd, baseMonthlyPayment - interest)
      balanceStd -= principalPaid

      if (monthsStd % 12 === 0 || balanceStd <= 0) {
        const yr = Math.ceil(monthsStd / 12)
        yearlyData.push({
          year: yr,
          standardBalance: Math.round(Math.max(0, balanceStd)),
          extraBalance: 0
        })
      }
    }

    // Simulation 2: Extra Payment Plan
    let balanceExtra = P
    let totalInterestExtra = 0
    let monthsExtra = 0

    while (balanceExtra > 0 && monthsExtra < 600) {
      monthsExtra++
      const interest = balanceExtra * monthlyRate
      totalInterestExtra += interest
      
      let monthlyTotalPay = baseMonthlyPayment + addMonthly
      if (monthsExtra % 12 === 0) {
        monthlyTotalPay += addYearly
      }

      const principalPaid = Math.min(balanceExtra, monthlyTotalPay - interest)
      balanceExtra -= principalPaid

      const yr = Math.ceil(monthsExtra / 12)
      const existingYr = yearlyData.find(d => d.year === yr)
      if (existingYr) {
        existingYr.extraBalance = Math.round(Math.max(0, balanceExtra))
      }
    }

    // Savings
    const interestSaved = Math.max(0, totalInterestStd - totalInterestExtra)
    const monthsSaved = Math.max(0, monthsStd - monthsExtra)
    const yearsSaved = Math.floor(monthsSaved / 12)
    const remainingMonthsSaved = monthsSaved % 12

    // Simulation 3: Refinance (if enabled)
    let refiSavings = 0
    if (enableRefinance) {
      const refiAnnualRate = (parseFloat(refinanceRate) || 0) / 100
      const refiMonthlyRate = refiAnnualRate / 12
      const refiFee = parseFloat(refinanceCost) || 0

      let balanceRefi = P
      let totalInterestRefi = 0
      let monthsRefi = 0

      while (balanceRefi > 0 && monthsRefi < 600) {
        monthsRefi++
        const interest = balanceRefi * refiMonthlyRate
        totalInterestRefi += interest
        const principalPaid = Math.min(balanceRefi, baseMonthlyPayment - interest)
        balanceRefi -= principalPaid
      }

      refiSavings = Math.max(0, (totalInterestStd - totalInterestRefi) - refiFee)
    }

    return {
      standardMonthly,
      totalInterestStd,
      totalPaidStd: P + totalInterestStd,
      monthsStd,
      monthsExtra,
      totalInterestExtra,
      totalPaidExtra: P + totalInterestExtra,
      interestSaved,
      yearsSaved,
      remainingMonthsSaved,
      refiSavings,
      yearlyData: yearlyData.slice(0, 31)
    }
  }, [
    principal, interestRate, loanTermYears, customMonthlyPayment,
    extraMonthly, extraYearly, enableRefinance, refinanceRate, refinanceCost
  ])

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl text-white shadow-lg shadow-indigo-500/20">
            <Home className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">คำนวณโปะบ้าน & รีไฟแนนซ์ (Mortgage Calculator)</h1>
            <p className="text-gray-600 dark:text-gray-400">
              คำนวณการโปะเงินเพิ่มรายเดือน/รายปี ช่วยลดดอกเบี้ยได้กี่แสน และผ่อนบ้านหมดไวขึ้นกี่ปี พร้อมกราฟเปรียบเทียบ
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Current Loan Card */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border dark:border-gray-800 space-y-4">
            <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-indigo-600" /> 1. ข้อมูลสินเชื่อบ้านปัจจุบัน
            </h2>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                  ยอดหนี้คงเหลือ (บาท)
                </label>
                <input
                  type="number"
                  value={principal}
                  onChange={e => setPrincipal(e.target.value)}
                  placeholder="เช่น 3000000"
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                    อัตราดอกเบี้ย (% ต่อปี)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    value={interestRate}
                    onChange={e => setInterestRate(e.target.value)}
                    placeholder="เช่น 4.5"
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                    ระยะเวลาผ่อน (ปี)
                  </label>
                  <input
                    type="number"
                    value={loanTermYears}
                    onChange={e => setLoanTermYears(e.target.value)}
                    placeholder="เช่น 30"
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {result && (
                <div className="p-3 bg-indigo-50/60 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/50 flex justify-between items-center text-xs">
                  <span className="text-gray-600 dark:text-gray-400">ค่างวดผ่อนปกติโดยประมาณ:</span>
                  <span className="font-extrabold text-indigo-700 dark:text-indigo-300 text-sm">
                    ฿{result.standardMonthly.toLocaleString('th-TH', { maximumFractionDigits: 0 })} / เดือน
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Extra Payment Card */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border dark:border-gray-800 space-y-4">
            <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <PiggyBank className="w-5 h-5 text-emerald-600" /> 2. แผนการโปะเงินเพิ่ม (Extra Payment)
            </h2>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                  โปะเพิ่มทุกเดือน (บาท / เดือน)
                </label>
                <input
                  type="number"
                  value={extraMonthly}
                  onChange={e => setExtraMonthly(e.target.value)}
                  placeholder="เช่น 3000"
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                  โปะก้อนใหญ่รายปี (เช่น โบนัสปลายปี)
                </label>
                <input
                  type="number"
                  value={extraYearly}
                  onChange={e => setExtraYearly(e.target.value)}
                  placeholder="เช่น 20000"
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Refinance Option Card */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border dark:border-gray-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Percent className="w-5 h-5 text-purple-600" /> 3. คำนวณรีไฟแนนซ์ (Refinance)
              </h2>
              <input
                type="checkbox"
                checked={enableRefinance}
                onChange={e => setEnableRefinance(e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded cursor-pointer"
              />
            </div>

            {enableRefinance && (
              <div className="space-y-3 pt-2 text-xs animate-in fade-in duration-200">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                      ดอกเบี้ยใหม่ (% ต่อปี)
                    </label>
                    <input
                      type="number"
                      step="0.05"
                      value={refinanceRate}
                      onChange={e => setRefinanceRate(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl font-bold text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                      ค่าธรรมเนียมรีไฟแนนซ์
                    </label>
                    <input
                      type="number"
                      value={refinanceCost}
                      onChange={e => setRefinanceCost(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl font-bold text-sm"
                    />
                  </div>
                </div>

                {result && result.refiSavings > 0 && (
                  <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-300 font-semibold text-xs">
                    🎉 รีไฟแนนซ์จะช่วยประหยัดสุทธิ <strong>฿{result.refiSavings.toLocaleString('th-TH', { maximumFractionDigits: 0 })}</strong>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Summary Dashboard & Charts (7 cols) */}
        {result && (
          <div className="lg:col-span-7 space-y-6">
            {/* Big Highlight Card */}
            <div className="bg-gradient-to-br from-emerald-500 via-teal-600 to-indigo-700 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                  ผลลัพธ์จากการโปะเงินเพิ่ม
                </span>
                <Sparkles className="w-6 h-6 text-yellow-300" />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                  <div className="text-xs text-white/80">ประหยัดดอกเบี้ยได้ถึง</div>
                  <div className="text-2xl sm:text-3xl font-black mt-1">
                    ฿{result.interestSaved.toLocaleString('th-TH', { maximumFractionDigits: 0 })}
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                  <div className="text-xs text-white/80">ผ่อนบ้านหมดไวขึ้น</div>
                  <div className="text-2xl sm:text-3xl font-black mt-1">
                    {result.yearsSaved} ปี {result.remainingMonthsSaved > 0 ? `${result.remainingMonthsSaved} เดือน` : ''}
                  </div>
                </div>
              </div>

              <div className="text-xs text-white/90 pt-2 border-t border-white/20 flex flex-wrap justify-between gap-2">
                <span>จากเดิมผ่อน <strong>{Math.ceil(result.monthsStd / 12)} ปี</strong></span>
                <span>เหลือเพียง <strong>{(result.monthsExtra / 12).toFixed(1)} ปี</strong> เท่านั้น!</span>
              </div>
            </div>

            {/* Area Comparison Chart */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border dark:border-gray-800 space-y-4">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-600" /> กราฟเปรียบเทียบยอดหนี้คงเหลือรายปี (บาท)
              </h3>

              <div className="h-64 sm:h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={result.yearlyData}>
                    <defs>
                      <linearGradient id="colorStd" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
                      </linearGradient>
                      <linearGradient id="colorExtra" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.5}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="year" tickLine={false} unit=" ปี" tick={{ fontSize: 11 }} />
                    <YAxis 
                      tickLine={false} 
                      tickFormatter={v => `${(v / 1000000).toFixed(1)}M`} 
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip 
                      formatter={(val: any) => [`฿${Number(val).toLocaleString('th-TH')} บาท`]}
                      labelFormatter={label => `ปีที่ ${label}`}
                      contentStyle={{ borderRadius: '12px', fontSize: '12px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Area 
                      type="monotone" 
                      dataKey="standardBalance" 
                      name="ผ่อนปกติ" 
                      stroke="#6366f1" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorStd)" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="extraBalance" 
                      name="โปะเงินเพิ่ม" 
                      stroke="#10b981" 
                      strokeWidth={2.5}
                      fillOpacity={1} 
                      fill="url(#colorExtra)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Comparison Details Table */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border dark:border-gray-800 space-y-3">
              <h3 className="font-bold text-sm">ตารางสรุปเปรียบเทียบยอดรวมทั้งหมด</h3>
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl space-y-1.5">
                  <div className="font-bold text-gray-500">ผ่อนแบบปกติ</div>
                  <div className="text-gray-900 dark:text-white">ดอกเบี้ยรวม: <strong>฿{result.totalInterestStd.toLocaleString('th-TH', { maximumFractionDigits: 0 })}</strong></div>
                  <div className="text-gray-900 dark:text-white">ยอดจ่ายรวม: <strong>฿{result.totalPaidStd.toLocaleString('th-TH', { maximumFractionDigits: 0 })}</strong></div>
                </div>

                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 space-y-1.5 text-emerald-900 dark:text-emerald-300">
                  <div className="font-bold text-emerald-700 dark:text-emerald-400">เมื่อโปะเงินเพิ่ม</div>
                  <div>ดอกเบี้ยรวม: <strong>฿{result.totalInterestExtra.toLocaleString('th-TH', { maximumFractionDigits: 0 })}</strong></div>
                  <div>ยอดจ่ายรวม: <strong>฿{result.totalPaidExtra.toLocaleString('th-TH', { maximumFractionDigits: 0 })}</strong></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <AdSlot />
    </div>
  )
}
