'use client'

import { useState, useMemo } from 'react'
import { AdSlot } from '@/components/AdSlot'
import { ShareBar } from '@/components/ShareBar'
import { 
  Banknote, 
  Printer, 
  Clock, 
  ShieldCheck, 
  PiggyBank, 
  FileText, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  Building, 
  User, 
  Calendar,
  DollarSign,
  Receipt
} from 'lucide-react'

export default function SalaryCalculatorPage() {
  // Mode: Calculator vs Payslip View
  const [viewMode, setViewMode] = useState<'calc' | 'payslip'>('calc')

  // Employee & Company Info (for Payslip)
  const [companyName, setCompanyName] = useState('บริษัท ดิจิทัล โซลูชันส์ จำกัด')
  const [employeeName, setEmployeeName] = useState('นายสมชาย ใจดี')
  const [employeeId, setEmployeeId] = useState('EMP-2026-001')
  const [department, setDepartment] = useState('ฝ่ายพัฒนาซอฟต์แวร์')
  const [payPeriod, setPayPeriod] = useState(() => {
    const d = new Date()
    return `${d.toLocaleDateString('th-TH', { month: 'long', year: 'numeric' })}`
  })

  // Earnings
  const [baseSalary, setBaseSalary] = useState<string>('35000')
  const [workDaysPerMonth, setWorkDaysPerMonth] = useState<number>(30)
  const [workHoursPerDay, setWorkHoursPerDay] = useState<number>(8)

  // OT Hours
  const [ot15Hours, setOt15Hours] = useState<string>('10') // วันปกติ 1.5 เท่า
  const [ot10Hours, setOt10Hours] = useState<string>('0')  // วันหยุดปกติ 1 เท่า
  const [ot30Hours, setOt30Hours] = useState<string>('0')  // วันหยุดล่วงเวลา 3 เท่า

  // Other Earnings
  const [allowance, setAllowance] = useState<string>('2000') // เบี้ยเลี้ยง/ค่าเดินทาง
  const [commission, setCommission] = useState<string>('0') // ค่าคอมมิชชัน
  const [bonus, setBonus] = useState<string>('0') // โบนัส

  // Deductions
  const [enableSocialSecurity, setEnableSocialSecurity] = useState<boolean>(true)
  const [socialSecurityCap, setSocialSecurityCap] = useState<number>(750) // เพดาน 750 (ฐานเงินเดือน 15,000)
  const [pvdRate, setPvdRate] = useState<string>('5') // กองทุนสำรองเลี้ยงชีพ %
  const [autoTax, setAutoTax] = useState<boolean>(true)
  const [customTax, setCustomTax] = useState<string>('0')
  const [studentLoan, setStudentLoan] = useState<string>('0') // หัก กยศ.
  const [lateDeduction, setLateDeduction] = useState<string>('0') // หัก ขาด/ลา/สาย
  const [otherDeduction, setOtherDeduction] = useState<string>('0') // หักอื่นๆ

  // Calculations
  const calc = useMemo(() => {
    const salary = parseFloat(baseSalary) || 0
    const days = workDaysPerMonth || 30
    const hours = workHoursPerDay || 8
    const hourlyRate = days > 0 && hours > 0 ? (salary / days) / hours : 0

    // OT Calculations
    const ot15Val = (parseFloat(ot15Hours) || 0) * (hourlyRate * 1.5)
    const ot10Val = (parseFloat(ot10Hours) || 0) * (hourlyRate * 1.0)
    const ot30Val = (parseFloat(ot30Hours) || 0) * (hourlyRate * 3.0)
    const totalOT = ot15Val + ot10Val + ot30Val

    const allowVal = parseFloat(allowance) || 0
    const commVal = parseFloat(commission) || 0
    const bonusVal = parseFloat(bonus) || 0
    const grossIncome = salary + totalOT + allowVal + commVal + bonusVal

    // Deductions
    // Social Security: 5% of salary, capped
    let ssoVal = 0
    if (enableSocialSecurity) {
      ssoVal = Math.min(salary * 0.05, socialSecurityCap)
    }

    // Provident Fund: % of Base Salary
    const pvdPercent = parseFloat(pvdRate) || 0
    const pvdVal = (salary * pvdPercent) / 100

    // Approximate monthly withholding tax
    let taxVal = 0
    if (autoTax) {
      // Annual estimate
      const annualGross = grossIncome * 12
      const annualExpense = Math.min(annualGross * 0.5, 100000)
      const annualPersonal = 60000
      const annualSSO = ssoVal * 12
      const annualPVD = pvdVal * 12
      const taxable = Math.max(0, annualGross - annualExpense - annualPersonal - annualSSO - annualPVD)

      let annualTax = 0
      if (taxable > 150000) {
        if (taxable <= 300000) {
          annualTax = (taxable - 150000) * 0.05
        } else if (taxable <= 500000) {
          annualTax = (150000 * 0.05) + ((taxable - 300000) * 0.10)
        } else if (taxable <= 750000) {
          annualTax = (150000 * 0.05) + (200000 * 0.10) + ((taxable - 500000) * 0.15)
        } else if (taxable <= 1000000) {
          annualTax = (150000 * 0.05) + (200000 * 0.10) + (250000 * 0.15) + ((taxable - 750000) * 0.20)
        } else {
          annualTax = (150000 * 0.05) + (200000 * 0.10) + (250000 * 0.15) + (250000 * 0.20) + ((taxable - 1000000) * 0.25)
        }
      }
      taxVal = annualTax / 12
    } else {
      taxVal = parseFloat(customTax) || 0
    }

    const loanVal = parseFloat(studentLoan) || 0
    const lateVal = parseFloat(lateDeduction) || 0
    const otherVal = parseFloat(otherDeduction) || 0

    const totalDeductions = ssoVal + pvdVal + taxVal + loanVal + lateVal + otherVal
    const netIncome = Math.max(0, grossIncome - totalDeductions)

    return {
      hourlyRate,
      ot15Val,
      ot10Val,
      ot30Val,
      totalOT,
      grossIncome,
      ssoVal,
      pvdVal,
      taxVal,
      totalDeductions,
      netIncome,
    }
  }, [
    baseSalary, workDaysPerMonth, workHoursPerDay,
    ot15Hours, ot10Hours, ot30Hours, allowance, commission, bonus,
    enableSocialSecurity, socialSecurityCap, pvdRate, autoTax, customTax,
    studentLoan, lateDeduction, otherDeduction
  ])

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="print:hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl text-white shadow-lg shadow-emerald-500/20">
              <Banknote className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">คำนวณเงินเดือนสุทธิ & สลิปเงินเดือน (Salary Calculator)</h1>
              <p className="text-gray-600 dark:text-gray-400">
                คำนวณเงินเดือนสุทธิเข้าบัญชีจริง หักประกันสังคม กองทุนสำรองเลี้ยงชีพ ภาษี OT พร้อมออกสลิปเงินเดือน
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl border dark:border-gray-700 text-xs font-bold">
              <button
                onClick={() => setViewMode('calc')}
                className={`px-4 py-2 rounded-xl transition-all ${
                  viewMode === 'calc'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                คำนวณเงินเดือน
              </button>
              <button
                onClick={() => setViewMode('payslip')}
                className={`px-4 py-2 rounded-xl transition-all ${
                  viewMode === 'payslip'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                ดูสลิปเงินเดือน (Payslip)
              </button>
            </div>

            {viewMode === 'payslip' && (
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-xs transition-all shadow-md"
              >
                <Printer className="w-4 h-4" /> สั่งพิมพ์ / PDF
              </button>
            )}
          </div>
        </div>
      </div>

      {viewMode === 'calc' ? (
        /* Calculator View */
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Inputs (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Section 1: Base Salary & OT */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border dark:border-gray-800 space-y-4">
              <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" /> 1. รายรับและค่าล่วงเวลา (Earnings & OT)
              </h2>

              <div className="grid sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    เงินเดือนประจำ (บาท / เดือน)
                  </label>
                  <input
                    type="number"
                    value={baseSalary}
                    onChange={e => setBaseSalary(e.target.value)}
                    placeholder="เช่น 35000"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl font-black text-base text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 dark:text-gray-400 mb-1">OT วันทำงาน 1.5 เท่า (ชั่วโมง)</label>
                  <input
                    type="number"
                    value={ot15Hours}
                    onChange={e => setOt15Hours(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl font-bold"
                  />
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    = ฿{calc.ot15Val.toLocaleString('th-TH', { maximumFractionDigits: 0 })}
                  </span>
                </div>

                <div>
                  <label className="block text-gray-600 dark:text-gray-400 mb-1">OT วันหยุด 1.0 เท่า (ชั่วโมง)</label>
                  <input
                    type="number"
                    value={ot10Hours}
                    onChange={e => setOt10Hours(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl font-bold"
                  />
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    = ฿{calc.ot10Val.toLocaleString('th-TH', { maximumFractionDigits: 0 })}
                  </span>
                </div>

                <div>
                  <label className="block text-gray-600 dark:text-gray-400 mb-1">เบี้ยเลี้ยง / ค่าเดินทาง / ค่ากะ</label>
                  <input
                    type="number"
                    value={allowance}
                    onChange={e => setAllowance(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 dark:text-gray-400 mb-1">ค่าคอมมิชชัน / เงินพิเศษ</label>
                  <input
                    type="number"
                    value={commission}
                    onChange={e => setCommission(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Deductions */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border dark:border-gray-800 space-y-4">
              <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-rose-500" /> 2. รายการหัก (Deductions)
              </h2>

              <div className="space-y-3.5 text-xs">
                {/* Social Security */}
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl border dark:border-gray-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white">
                      <ShieldCheck className="w-4 h-4 text-blue-500" />
                      <span>ประกันสังคม (5% สูงสุด 750 บ.)</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={enableSocialSecurity}
                      onChange={e => setEnableSocialSecurity(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                    />
                  </div>
                  {enableSocialSecurity && (
                    <div className="flex justify-between items-center text-gray-600 dark:text-gray-400 pt-1">
                      <span>ยอดหักประกันสังคมงวดนี้:</span>
                      <span className="font-extrabold text-rose-500">
                        -฿{calc.ssoVal.toLocaleString('th-TH', { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                  )}
                </div>

                {/* Provident Fund */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-600 dark:text-gray-400 mb-1">
                      กองทุนสำรองเลี้ยงชีพ PVD (% เงินเดือน)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max="15"
                        value={pvdRate}
                        onChange={e => setPvdRate(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl font-bold"
                      />
                      <span className="font-bold text-gray-500">%</span>
                    </div>
                    <span className="text-[10px] text-gray-400 mt-1 block">
                      = ฿{calc.pvdVal.toLocaleString('th-TH', { maximumFractionDigits: 0 })}
                    </span>
                  </div>

                  <div>
                    <label className="block text-gray-600 dark:text-gray-400 mb-1">
                      ภาษีหัก ณ ที่จ่าย (ประมาณการ)
                    </label>
                    <input
                      type="number"
                      value={autoTax ? calc.taxVal.toFixed(0) : customTax}
                      disabled={autoTax}
                      onChange={e => setCustomTax(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl font-bold disabled:opacity-75"
                    />
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-500">
                      <input
                        type="checkbox"
                        checked={autoTax}
                        onChange={e => setAutoTax(e.target.checked)}
                        className="w-3 h-3 rounded"
                      />
                      <span>คำนวณภาษีอัตโนมัติ</span>
                    </div>
                  </div>
                </div>

                {/* Other Deductions */}
                <div className="grid sm:grid-cols-3 gap-3 pt-1">
                  <div>
                    <label className="block text-gray-600 dark:text-gray-400 mb-1">หัก กยศ. (บาท)</label>
                    <input
                      type="number"
                      value={studentLoan}
                      onChange={e => setStudentLoan(e.target.value)}
                      placeholder="0"
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 dark:text-gray-400 mb-1">หัก ขาด/ลา/สาย</label>
                    <input
                      type="number"
                      value={lateDeduction}
                      onChange={e => setLateDeduction(e.target.value)}
                      placeholder="0"
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 dark:text-gray-400 mb-1">หักอื่นๆ (เช่น สหกรณ์)</label>
                    <input
                      type="number"
                      value={otherDeduction}
                      onChange={e => setOtherDeduction(e.target.value)}
                      placeholder="0"
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Summary Card (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gradient-to-br from-emerald-500 via-teal-600 to-indigo-700 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-6 sticky top-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                  เงินเดือนสุทธิรับจริง (Net Pay)
                </span>
                <Sparkles className="w-6 h-6 text-yellow-300" />
              </div>

              <div>
                <div className="text-xs text-white/80">ยอดเงินโอนเข้าบัญชีสุทธิ</div>
                <div className="text-3xl sm:text-4xl font-black mt-1">
                  ฿{calc.netIncome.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>

              {/* Matrix */}
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span>รายได้รวมทั้งหมด (Gross Income):</span>
                  <span className="font-bold">฿{calc.grossIncome.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-rose-200">
                  <span>รายการหักทั้งหมด (Total Deductions):</span>
                  <span className="font-bold">-฿{calc.totalDeductions.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/20 text-emerald-200 font-semibold">
                  <span>อัตราค่าจ้างรายชั่วโมง (โดยประมาณ):</span>
                  <span>฿{calc.hourlyRate.toFixed(2)} / ชม.</span>
                </div>
              </div>

              {/* Button to View / Print Payslip */}
              <button
                onClick={() => setViewMode('payslip')}
                className="w-full py-3.5 bg-white hover:bg-gray-100 text-emerald-900 rounded-2xl font-bold text-xs transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" /> ดูและพิมพ์ใบสลิปเงินเดือน (Payslip)
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Payslip Printable Document View */
        <div className="space-y-6">
          {/* Company & Employee Editable Fields (Hidden on print) */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border dark:border-gray-800 space-y-4 print:hidden">
            <h3 className="font-bold text-sm">ข้อมูลสำหรับออกสลิปเงินเดือน</h3>
            <div className="grid sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-gray-500 mb-1">ชื่อบริษัท / องค์กร</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-gray-500 mb-1">ชื่อพนักงาน</label>
                <input
                  type="text"
                  value={employeeName}
                  onChange={e => setEmployeeName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-gray-500 mb-1">รหัสพนักงาน / แผนก</label>
                <input
                  type="text"
                  value={employeeId}
                  onChange={e => setEmployeeId(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Printable Payslip Container */}
          <div className="bg-white text-gray-900 p-8 sm:p-12 rounded-3xl shadow-xl border border-gray-200 space-y-6 print:p-0 print:border-none print:shadow-none print:m-0 print:w-full">
            {/* Header */}
            <div className="text-center border-b-2 border-gray-900 pb-4 space-y-1">
              <h2 className="text-xl font-extrabold text-gray-900 uppercase tracking-tight">
                {companyName}
              </h2>
              <p className="text-sm font-bold text-gray-700">ใบแจ้งยอดเงินเดือน / PAYSLIP</p>
              <p className="text-xs text-gray-500">ประจำงวดเดือน: {payPeriod}</p>
            </div>

            {/* Employee Block */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-gray-50 p-4 rounded-xl border border-gray-200">
              <div>
                <p><strong>ชื่อ-นามสกุล:</strong> {employeeName}</p>
                <p><strong>รหัสพนักงาน:</strong> {employeeId}</p>
              </div>
              <div className="text-right">
                <p><strong>แผนก/ฝ่าย:</strong> {department}</p>
                <p><strong>วันที่จ่าย:</strong> {new Date().toLocaleDateString('th-TH')}</p>
              </div>
            </div>

            {/* Table */}
            <div className="grid grid-cols-2 border border-gray-900 rounded-xl overflow-hidden text-xs">
              {/* Income Col */}
              <div className="border-r border-gray-900 divide-y divide-gray-200">
                <div className="bg-gray-100 font-bold p-2.5 text-center text-gray-800">
                  รายรับ (Earnings)
                </div>
                <div className="p-3 space-y-2">
                  <div className="flex justify-between">
                    <span>เงินเดือนประจำ:</span>
                    <span>฿{parseFloat(baseSalary || '0').toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
                  </div>
                  {calc.totalOT > 0 && (
                    <div className="flex justify-between">
                      <span>ค่าล่วงเวลา (OT):</span>
                      <span>฿{calc.totalOT.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}
                  {parseFloat(allowance || '0') > 0 && (
                    <div className="flex justify-between">
                      <span>เบี้ยเลี้ยง / ค่าเดินทาง:</span>
                      <span>฿{parseFloat(allowance).toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}
                  {parseFloat(commission || '0') > 0 && (
                    <div className="flex justify-between">
                      <span>ค่าคอมมิชชัน:</span>
                      <span>฿{parseFloat(commission).toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Deduction Col */}
              <div className="divide-y divide-gray-200">
                <div className="bg-gray-100 font-bold p-2.5 text-center text-gray-800">
                  รายการหัก (Deductions)
                </div>
                <div className="p-3 space-y-2">
                  {calc.ssoVal > 0 && (
                    <div className="flex justify-between">
                      <span>ประกันสังคม:</span>
                      <span className="text-rose-600">฿{calc.ssoVal.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}
                  {calc.pvdVal > 0 && (
                    <div className="flex justify-between">
                      <span>กองทุนสำรองเลี้ยงชีพ ({pvdRate}%):</span>
                      <span className="text-rose-600">฿{calc.pvdVal.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}
                  {calc.taxVal > 0 && (
                    <div className="flex justify-between">
                      <span>ภาษีหัก ณ ที่จ่าย:</span>
                      <span className="text-rose-600">฿{calc.taxVal.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}
                  {parseFloat(studentLoan || '0') > 0 && (
                    <div className="flex justify-between">
                      <span>กยศ.:</span>
                      <span className="text-rose-600">฿{parseFloat(studentLoan).toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Total Row */}
            <div className="grid grid-cols-2 text-xs border-t-2 border-gray-900 pt-2 font-bold">
              <div className="flex justify-between pr-4">
                <span>รวมรายรับทั้งสิ้น:</span>
                <span>฿{calc.grossIncome.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between pl-4 text-rose-600">
                <span>รวมรายการหักทั้งสิ้น:</span>
                <span>-฿{calc.totalDeductions.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* Net Pay Highlight */}
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-300 flex justify-between items-center">
              <span className="font-extrabold text-sm text-emerald-950">ยอดรับสุทธิ (NET PAY):</span>
              <span className="font-black text-xl text-emerald-700">
                ฿{calc.netIncome.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
              </span>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-2 gap-12 pt-8 text-center text-xs text-gray-500">
              <div className="space-y-6">
                <div className="border-b border-gray-300 w-3/4 mx-auto"></div>
                <p>ลายมือชื่อพนักงาน</p>
              </div>
              <div className="space-y-6">
                <div className="border-b border-gray-300 w-3/4 mx-auto"></div>
                <p>ผู้อนุมัติ / เจ้าหน้าที่การเงิน</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="print:hidden space-y-6">
        <ShareBar 
          title="คำนวณเงินเดือนสุทธิ & สลิปเงินเดือนฟรี - Thai WebTools" 
          description="คำนวณเงินเดือนสุทธิ หักประกันสังคม ภาษี กองทุน PVD และออกสลิปเงินเดือน"
        />
        <AdSlot />
      </div>
    </div>
  )
}
