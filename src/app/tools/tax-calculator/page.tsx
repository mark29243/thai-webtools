'use client'

import { useState, useMemo } from 'react'
import { AdSlot } from '@/components/AdSlot'
import { 
  Calculator, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  Sparkles, 
  TrendingDown, 
  CheckCircle2, 
  DollarSign,
  PiggyBank,
  HeartHandshake,
  Home,
  Info
} from 'lucide-react'

// Thai Tax Brackets 2026/2569
const TAX_BRACKETS = [
  { min: 0, max: 150000, rate: 0, label: '0 - 150,000', textRate: 'ยกเว้น' },
  { min: 150000, max: 300000, rate: 0.05, label: '150,001 - 300,000', textRate: '5%' },
  { min: 300000, max: 500000, rate: 0.10, label: '300,001 - 500,000', textRate: '10%' },
  { min: 500000, max: 750000, rate: 0.15, label: '500,001 - 750,000', textRate: '15%' },
  { min: 750000, max: 1000000, rate: 0.20, label: '750,001 - 1,000,000', textRate: '20%' },
  { min: 1000000, max: 2000000, rate: 0.25, label: '1,000,001 - 2,000,000', textRate: '25%' },
  { min: 2000000, max: 5000000, rate: 0.30, label: '2,000,001 - 5,000,000', textRate: '30%' },
  { min: 5000000, max: Infinity, rate: 0.35, label: 'มากกว่า 5,000,000', textRate: '35%' }
]

export default function TaxCalculatorPage() {
  // Income State
  const [salaryPerMonth, setSalaryPerMonth] = useState<string>('45000')
  const [bonus, setBonus] = useState<string>('50000')
  const [otherIncome, setOtherIncome] = useState<string>('0')
  const [withheldTax, setWithheldTax] = useState<string>('0') // ภาษีหัก ณ ที่จ่าย

  // Deductions State
  // 1. ตัวเองและครอบครัว
  const [hasSpouse, setHasSpouse] = useState<boolean>(false) // คู่สมรสไม่มีเงินได้ 60,000
  const [childrenCount, setChildrenCount] = useState<string>('0') // บุตรคนละ 30,000
  const [parentsCount, setParentsCount] = useState<string>('0') // บิดามารดา คนละ 30,000

  // 2. ประกันและเงินออม
  const [socialSecurity, setSocialSecurity] = useState<string>('9000') // ประกันสังคม สูงสุด 9,000
  const [providentFund, setProvidentFund] = useState<string>('0') // กองทุนสำรองเลี้ยงชีพ / กบข.
  const [lifeInsurance, setLifeInsurance] = useState<string>('0') // ประกันชีวิต+สุขภาพ (สูงสุด 100,000)
  const [healthInsuranceParents, setHealthInsuranceParents] = useState<string>('0') // ประกันสุขภาพพ่อแม่ (สูงสุด 15,000)

  // 3. กองทุนลดหย่อนภาษี
  const [ssf, setSsf] = useState<string>('0') // SSF (สูงสุด 200,000)
  const [rmf, setRmf] = useState<string>('0') // RMF (สูงสุด 500,000)
  const [thaiEsg, setThaiEsg] = useState<string>('0') // Thai ESG (สูงสุด 300,000)

  // 4. อสังหาฯ และบริจาค
  const [homeLoanInterest, setHomeLoanInterest] = useState<string>('0') // ดอกเบี้ยบ้าน สูงสุด 100,000
  const [generalDonation, setGeneralDonation] = useState<string>('0') // บริจาคทั่วไป (ไม่เกิน 10%)
  const [eduDonation, setEduDonation] = useState<string>('0') // บริจาคการศึกษา/กีฬา (ลดหย่อน 2 เท่า)

  // UI Tabs / Accordion
  const [showAdvancedDeductions, setShowAdvancedDeductions] = useState<boolean>(true)

  // Calculations
  const calculations = useMemo(() => {
    const monthly = parseFloat(salaryPerMonth) || 0
    const bns = parseFloat(bonus) || 0
    const other = parseFloat(otherIncome) || 0
    const totalIncome = (monthly * 12) + bns + other

    // ค่าใช้จ่าย: 50% ของรายได้ แต่ไม่เกิน 100,000 บาท
    const expenseDeduction = Math.min(totalIncome * 0.5, 100000)

    // ค่าลดหย่อนส่วนตัวและครอบครัว
    const personalDeduction = 60000 // ค่าลดหย่อนผู้มีเงินได้
    const spouseDeduction = hasSpouse ? 60000 : 0
    const childDeduction = (parseInt(childrenCount) || 0) * 30000
    const parentDeduction = Math.min(parseInt(parentsCount) || 0, 4) * 30000

    // ค่าลดหย่อนประกันและเงินออม
    const ssoDeduction = Math.min(parseFloat(socialSecurity) || 0, 9000)
    const pvdDeduction = Math.min(parseFloat(providentFund) || 0, totalIncome * 0.15, 500000)
    const lifeInsDeduction = Math.min(parseFloat(lifeInsurance) || 0, 100000)
    const parentHealthDeduction = Math.min(parseFloat(healthInsuranceParents) || 0, 15000)

    // กองทุนลดหย่อน (SSF, RMF, ThaiESG)
    const ssfDeduction = Math.min(parseFloat(ssf) || 0, totalIncome * 0.3, 200000)
    const rmfDeduction = Math.min(parseFloat(rmf) || 0, totalIncome * 0.3, 500000)
    const thaiEsgDeduction = Math.min(parseFloat(thaiEsg) || 0, totalIncome * 0.3, 300000)

    // ดอกเบี้ยบ้าน
    const homeInterestDeduction = Math.min(parseFloat(homeLoanInterest) || 0, 100000)

    // ยอดรวมลดหย่อนกลุ่มแรก (ก่อนบริจาค)
    const preDonationDeductions = 
      personalDeduction + 
      spouseDeduction + 
      childDeduction + 
      parentDeduction + 
      ssoDeduction + 
      pvdDeduction + 
      lifeInsDeduction + 
      parentHealthDeduction + 
      ssfDeduction + 
      rmfDeduction + 
      thaiEsgDeduction + 
      homeInterestDeduction

    // รายได้หลังหักค่าใช้จ่ายและค่าลดหย่อนกลุ่มแรก
    const incomeAfterPreDonations = Math.max(0, totalIncome - expenseDeduction - preDonationDeductions)

    // เงินบริจาค
    const eduDonationVal = (parseFloat(eduDonation) || 0) * 2 // ลดหย่อน 2 เท่า
    const generalDonationVal = parseFloat(generalDonation) || 0
    const maxDonationAllowed = incomeAfterPreDonations * 0.10 // รวมไม่เกิน 10%
    const totalDonationDeduction = Math.min(eduDonationVal + generalDonationVal, maxDonationAllowed)

    const totalDeductions = preDonationDeductions + totalDonationDeduction

    // เงินได้สุทธิ (Net Taxable Income)
    const netTaxableIncome = Math.max(0, totalIncome - expenseDeduction - totalDeductions)

    // คำนวณภาษีตามขั้นบันได
    let remainingIncome = netTaxableIncome
    let totalTax = 0
    const bracketBreakdown: { label: string; rateText: string; taxableInBracket: number; taxAmount: number }[] = []
    let highestBracketRate = 0

    for (let i = 0; i < TAX_BRACKETS.length; i++) {
      const b = TAX_BRACKETS[i]
      const bracketRange = b.max - b.min

      if (netTaxableIncome > b.min) {
        const taxableInBracket = Math.min(remainingIncome, bracketRange)
        const taxInThisBracket = taxableInBracket * b.rate
        totalTax += taxInThisBracket
        remainingIncome = Math.max(0, remainingIncome - taxableInBracket)

        if (taxableInBracket > 0 && b.rate > highestBracketRate) {
          highestBracketRate = b.rate
        }

        bracketBreakdown.push({
          label: b.label,
          rateText: b.textRate,
          taxableInBracket,
          taxAmount: taxInThisBracket
        })
      }
    }

    const prepaidTax = parseFloat(withheldTax) || 0
    const taxDiff = totalTax - prepaidTax // > 0 ต้องจ่ายเพิ่ม, < 0 ได้คืนภาษี
    const effectiveRate = totalIncome > 0 ? (totalTax / totalIncome) * 100 : 0

    return {
      totalIncome,
      expenseDeduction,
      totalDeductions,
      netTaxableIncome,
      totalTax,
      prepaidTax,
      taxDiff,
      effectiveRate,
      highestBracketRate: highestBracketRate * 100,
      bracketBreakdown
    }
  }, [
    salaryPerMonth, bonus, otherIncome, withheldTax,
    hasSpouse, childrenCount, parentsCount,
    socialSecurity, providentFund, lifeInsurance, healthInsuranceParents,
    ssf, rmf, thaiEsg, homeLoanInterest, generalDonation, eduDonation
  ])

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl text-white shadow-lg shadow-blue-500/20">
            <Calculator className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">คำนวณภาษีเงินได้บุคคลธรรมดา (Thai Tax Calculator)</h1>
            <p className="text-gray-600 dark:text-gray-400">
              คำนวณภาษี ภ.ง.ด. 91/90 ตามเกณฑ์กรมสรรพากร พร้อมแจกแจงขั้นบันไดภาษีและสิทธิ์ลดหย่อนครบถ้วน
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Income */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border dark:border-gray-800 space-y-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-blue-600" /> 1. รายได้ทั้งปี (Annual Income)
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  เงินเดือน (บาท / เดือน)
                </label>
                <input
                  type="number"
                  value={salaryPerMonth}
                  onChange={e => setSalaryPerMonth(e.target.value)}
                  placeholder="เช่น 45000"
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  โบนัสทั้งปี (บาท)
                </label>
                <input
                  type="number"
                  value={bonus}
                  onChange={e => setBonus(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  รายได้อื่นๆ ทั้งปี (บาท)
                </label>
                <input
                  type="number"
                  value={otherIncome}
                  onChange={e => setOtherIncome(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  ภาษีที่ถูกหัก ณ ที่จ่ายไว้แล้ว (บาท)
                </label>
                <input
                  type="number"
                  value={withheldTax}
                  onChange={e => setWithheldTax(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-between items-center p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-100 dark:border-blue-900/40 text-xs">
              <span className="text-gray-600 dark:text-gray-400">รายได้รวมทั้งปี:</span>
              <span className="font-extrabold text-blue-700 dark:text-blue-300 text-sm">
                ฿{calculations.totalIncome.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Section 2: Deductions */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border dark:border-gray-800 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <PiggyBank className="w-5 h-5 text-emerald-600" /> 2. ค่าลดหย่อนภาษี (Tax Deductions)
              </h2>
              <span className="text-xs text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                หักส่วนตัว ฿60,000 อัตโนมัติ
              </span>
            </div>

            {/* Family Deductions */}
            <div className="space-y-3 pt-1">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">ครอบครัว</h3>
              <div className="grid sm:grid-cols-3 gap-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                  <span className="text-xs font-medium">คู่สมรสไม่มีรายได้</span>
                  <input
                    type="checkbox"
                    checked={hasSpouse}
                    onChange={e => setHasSpouse(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1">จำนวนบุตร (คน)</label>
                  <input
                    type="number"
                    min="0"
                    value={childrenCount}
                    onChange={e => setChildrenCount(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1">พ่อแม่ที่เลี้ยงดู (คน)</label>
                  <input
                    type="number"
                    min="0"
                    max="4"
                    value={parentsCount}
                    onChange={e => setParentsCount(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Insurance & Savings */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">ประกันและการออม</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1">ประกันสังคมทั้งปี (สูงสุด 9,000)</label>
                  <input
                    type="number"
                    value={socialSecurity}
                    onChange={e => setSocialSecurity(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1">เบี้ยประกันชีวิต + สุขภาพ (สูงสุด 100,000)</label>
                  <input
                    type="number"
                    value={lifeInsurance}
                    onChange={e => setLifeInsurance(e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1">กองทุนสำรองเลี้ยงชีพ / กบข.</label>
                  <input
                    type="number"
                    value={providentFund}
                    onChange={e => setProvidentFund(e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1">เบี้ยประกันสุขภาพพ่อแม่ (สูงสุด 15,000)</label>
                  <input
                    type="number"
                    value={healthInsuranceParents}
                    onChange={e => setHealthInsuranceParents(e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Funds & Property */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">กองทุนลดหย่อนภาษี & ดอกเบี้ยบ้าน</h3>
              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1">SSF (สูงสุด 200,000)</label>
                  <input
                    type="number"
                    value={ssf}
                    onChange={e => setSsf(e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1">RMF (สูงสุด 500,000)</label>
                  <input
                    type="number"
                    value={rmf}
                    onChange={e => setRmf(e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1">Thai ESG (สูงสุด 300,000)</label>
                  <input
                    type="number"
                    value={thaiEsg}
                    onChange={e => setThaiEsg(e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1">ดอกเบี้ยกู้ซื้อบ้าน/คอนโด (สูงสุด 100,000)</label>
                  <input
                    type="number"
                    value={homeLoanInterest}
                    onChange={e => setHomeLoanInterest(e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Donations */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">เงินบริจาค</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1">บริจาคการศึกษา/กีฬา/รพ.รัฐ (ลดหย่อน 2 เท่า)</label>
                  <input
                    type="number"
                    value={eduDonation}
                    onChange={e => setEduDonation(e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1">บริจาคทั่วไป (ลดหย่อนตามจริง)</label>
                  <input
                    type="number"
                    value={generalDonation}
                    onChange={e => setGeneralDonation(e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Summary Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-br from-blue-50 via-indigo-50/40 to-slate-50 dark:from-blue-950/40 dark:via-indigo-950/20 dark:to-gray-900 p-6 rounded-3xl border-2 border-blue-200/80 dark:border-blue-800/60 space-y-6 sticky top-6">
            <div>
              <span className="text-xs font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wider">
                สรุปผลการคำนวณภาษี
              </span>
              <div className="mt-3 p-5 bg-white dark:bg-gray-900 rounded-2xl border border-blue-100 dark:border-gray-800 shadow-sm space-y-2">
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  ภาษีสุทธิที่ต้องจ่ายทั้งหมด
                </div>
                <div className="text-3xl sm:text-4xl font-black text-blue-600 dark:text-blue-400">
                  ฿{calculations.totalTax.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>

                {calculations.prepaidTax > 0 && (
                  <div className={`text-xs font-bold pt-2 border-t dark:border-gray-800 flex justify-between ${
                    calculations.taxDiff < 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    <span>{calculations.taxDiff < 0 ? '🎉 ได้รับเงินคืนภาษี:' : '⚠️ ต้องชำระภาษีเพิ่ม:'}</span>
                    <span>฿{Math.abs(calculations.taxDiff).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Detailed Steps */}
            <div className="space-y-2.5 text-xs text-gray-600 dark:text-gray-300 bg-white/70 dark:bg-gray-900/70 p-4 rounded-2xl border border-blue-100 dark:border-gray-800">
              <div className="flex justify-between">
                <span>รายได้รวมทั้งปี:</span>
                <span className="font-semibold text-gray-900 dark:text-white">฿{calculations.totalIncome.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-red-500">
                <span>หักค่าใช้จ่าย (50% ไม่เกิน 1 แสน):</span>
                <span>-฿{calculations.expenseDeduction.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-red-500">
                <span>หักค่าลดหย่อนรวมทั้งหมด:</span>
                <span>-฿{calculations.totalDeductions.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between pt-2 border-t dark:border-gray-800 font-bold text-gray-900 dark:text-white text-sm">
                <span>เงินได้สุทธิ (คำนวณภาษี):</span>
                <span className="text-blue-600 dark:text-blue-400">฿{calculations.netTaxableIncome.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-3 bg-white dark:bg-gray-900 rounded-xl border border-blue-100 dark:border-gray-800">
                <div className="text-gray-400">ฐานภาษีสูงสุด</div>
                <div className="text-base font-extrabold text-gray-900 dark:text-white mt-0.5">
                  {calculations.highestBracketRate}%
                </div>
              </div>
              <div className="p-3 bg-white dark:bg-gray-900 rounded-xl border border-blue-100 dark:border-gray-800">
                <div className="text-gray-400">อัตราภาษีเฉลี่ย</div>
                <div className="text-base font-extrabold text-gray-900 dark:text-white mt-0.5">
                  {calculations.effectiveRate.toFixed(2)}%
                </div>
              </div>
            </div>

            {/* Bracket Breakdown Table */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-gray-700 dark:text-gray-300">
                ตารางแจกแจงขั้นบันไดภาษี
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-xl border dark:border-gray-800 overflow-hidden text-[11px]">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 border-b dark:border-gray-700">
                    <tr>
                      <th className="p-2 pl-3">ขั้นเงินได้สุทธิ</th>
                      <th className="p-2 text-center">อัตรา</th>
                      <th className="p-2 text-right pr-3">ภาษีขั้นนี้</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {calculations.bracketBreakdown.map((b, idx) => (
                      <tr key={idx} className="text-gray-700 dark:text-gray-300">
                        <td className="p-2 pl-3 font-medium">{b.label}</td>
                        <td className="p-2 text-center font-bold text-blue-600">{b.rateText}</td>
                        <td className="p-2 text-right pr-3 font-semibold">฿{b.taxAmount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AdSlot />
    </div>
  )
}
