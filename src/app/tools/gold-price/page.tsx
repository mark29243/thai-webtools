'use client'

import { useState, useEffect, useMemo } from 'react'
import { AdSlot } from '@/components/AdSlot'
import { 
  Coins, 
  RefreshCw, 
  TrendingUp, 
  TrendingDown, 
  Calculator, 
  Clock, 
  Info, 
  ShieldCheck, 
  Scale, 
  Sparkles,
  ArrowRightLeft,
  DollarSign
} from 'lucide-react'
import toast from 'react-hot-toast'

interface GoldData {
  success: boolean
  timestamp: string
  update_date: string
  update_time: string
  prices: {
    gold_bar: {
      buy: number
      sell: number
      buy_formatted: string
      sell_formatted: string
    }
    gold_ornament: {
      buy: number
      sell: number
      buy_formatted: string
      sell_formatted: string
    }
  }
  fx?: {
    usd_thb: number
  }
}

const WEIGHT_PRESETS = [
  { label: '1 บาท', bahtValue: 1, grams: 15.244 },
  { label: '2 บาท', bahtValue: 2, grams: 30.488 },
  { label: '5 บาท', bahtValue: 5, grams: 76.22 },
  { label: '10 บาท', bahtValue: 10, grams: 152.44 },
  { label: '2 สลึง (50 สตางค์)', bahtValue: 0.5, grams: 7.622 },
  { label: '1 สลึง (25 สตางค์)', bahtValue: 0.25, grams: 3.811 },
  { label: 'ครึ่งสลึง', bahtValue: 0.125, grams: 1.905 },
  { label: '1 กรัม', bahtValue: 1 / 15.244, grams: 1 }
]

export default function GoldPricePage() {
  const [data, setData] = useState<GoldData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date>(new Date())

  // Calculator State
  const [calcType, setCalcType] = useState<'bar' | 'ornament'>('ornament')
  const [selectedWeightMode, setSelectedWeightMode] = useState<'preset' | 'custom_baht' | 'custom_gram'>('preset')
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(0)
  const [customBaht, setCustomBaht] = useState<string>('1')
  const [customGram, setCustomGram] = useState<string>('15.244')
  const [craftFee, setCraftFee] = useState<number>(500) // ค่ากำเหน็จ

  const fetchGoldPrice = async (isManual = false) => {
    if (isManual) setIsRefreshing(true)
    try {
      const res = await fetch('/api/gold', { cache: 'no-store' })
      const json = await res.json()
      setData(json)
      setLastRefreshedAt(new Date())
      if (isManual) toast.success('อัปเดตราคาทองล่าสุดแล้ว')
    } catch (err) {
      console.error(err)
      if (isManual) toast.error('ไม่สามารถดึงข้อมูลราคาทองได้')
    } finally {
      setLoading(false)
      if (isManual) setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchGoldPrice()
    // Auto-refresh every 60 seconds
    const timer = setInterval(() => {
      fetchGoldPrice()
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  // Calculator Calculations
  const calcResult = useMemo(() => {
    if (!data) return { bahtAmount: 0, gramAmount: 0, buyPrice: 0, sellPrice: 0, costWithFee: 0 }

    let baht = 1
    let gram = 15.244

    if (selectedWeightMode === 'preset') {
      const preset = WEIGHT_PRESETS[selectedPresetIndex]
      baht = preset.bahtValue
      gram = preset.grams
    } else if (selectedWeightMode === 'custom_baht') {
      baht = parseFloat(customBaht) || 0
      gram = baht * 15.244
    } else if (selectedWeightMode === 'custom_gram') {
      gram = parseFloat(customGram) || 0
      baht = gram / 15.244
    }

    const priceTarget = calcType === 'bar' ? data.prices.gold_bar : data.prices.gold_ornament

    const buyPrice = baht * priceTarget.buy // ราคาที่ร้านรับซื้อคืน
    const sellPrice = baht * priceTarget.sell // ราคาที่ร้านขายให้เรา
    const costWithFee = sellPrice + (calcType === 'ornament' ? (craftFee * baht) : 0) // รวมค่ากำเหน็จถ้าเป็นรูปพรรณ

    return {
      bahtAmount: baht,
      gramAmount: gram,
      buyPrice,
      sellPrice,
      costWithFee
    }
  }, [data, calcType, selectedWeightMode, selectedPresetIndex, customBaht, customGram, craftFee])

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 rounded-2xl text-white shadow-lg shadow-amber-500/20">
              <Coins className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">ราคาทองวันนี้ (Thai Gold Price Live)</h1>
              <p className="text-gray-600 dark:text-gray-400">
                อัปเดตราคาทองคำแท่งและทองรูปพรรณ 96.5% ตามประกาศสมาคมค้าทองคำแบบเรียลไทม์
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => fetchGoldPrice(true)}
          disabled={isRefreshing}
          className="px-4 py-2.5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 text-gray-700 dark:text-gray-200 self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 text-amber-500 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>รีเฟรชราคา</span>
        </button>
      </div>

      {/* Live Status Bar */}
      <div className="bg-amber-50 dark:bg-amber-950/30 px-5 py-3.5 rounded-2xl border border-amber-200 dark:border-amber-900/50 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-medium">
          <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>
            {loading ? 'กำลังโหลดข้อมูลล่าสุด...' : `ประกาศ: ประจำวันที่ ${data?.update_date || '-'} (${data?.update_time || '-'})`}
          </span>
        </div>
        <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            อัปเดตอัตโนมัติทุก 1 นาที
          </span>
          {data?.fx?.usd_thb && (
            <span>ค่าเงิน: ฿{data.fx.usd_thb.toFixed(2)}/USD</span>
          )}
        </div>
      </div>

      {/* Main Gold Prices Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Card 1: ทองคำแท่ง 96.5% */}
        <div className="bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent dark:from-amber-500/15 dark:via-gray-900 dark:to-gray-900 p-6 sm:p-8 rounded-3xl border-2 border-amber-300/80 dark:border-amber-600/40 shadow-sm relative overflow-hidden space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🪙</span>
              <div>
                <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">ทองคำแท่ง 96.5%</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">ราคารับซื้อ - ขายออก (บาทละ)</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-bold rounded-full border border-amber-300 dark:border-amber-800">
              Gold Bar
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* ขายออก */}
            <div className="bg-white dark:bg-gray-800/90 p-4 sm:p-5 rounded-2xl border border-amber-200/60 dark:border-gray-700 shadow-sm text-center space-y-1">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                ขายออก (เราซื้อ)
              </span>
              <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
                {loading ? '...' : `฿${data?.prices.gold_bar.sell_formatted}`}
              </div>
            </div>

            {/* รับซื้อ */}
            <div className="bg-white dark:bg-gray-800/90 p-4 sm:p-5 rounded-2xl border border-amber-200/60 dark:border-gray-700 shadow-sm text-center space-y-1">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                รับซื้อคืน (เราขาย)
              </span>
              <div className="text-2xl sm:text-3xl font-black text-gray-800 dark:text-gray-100">
                {loading ? '...' : `฿${data?.prices.gold_bar.buy_formatted}`}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-amber-200/40 dark:border-gray-800">
            <span>ส่วนต่างราคา (Spread):</span>
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              {data ? `฿${(data.prices.gold_bar.sell - data.prices.gold_bar.buy).toLocaleString()} บาท` : '-'}
            </span>
          </div>
        </div>

        {/* Card 2: ทองรูปพรรณ 96.5% */}
        <div className="bg-gradient-to-b from-yellow-500/10 via-yellow-500/5 to-transparent dark:from-yellow-500/15 dark:via-gray-900 dark:to-gray-900 p-6 sm:p-8 rounded-3xl border-2 border-yellow-300/80 dark:border-yellow-600/40 shadow-sm relative overflow-hidden space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">💍</span>
              <div>
                <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">ทองรูปพรรณ 96.5%</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">ราคารับซื้อ - ขายออก (บาทละ)</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-300 text-xs font-bold rounded-full border border-yellow-300 dark:border-yellow-800">
              Ornament
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* ขายออก */}
            <div className="bg-white dark:bg-gray-800/90 p-4 sm:p-5 rounded-2xl border border-yellow-200/60 dark:border-gray-700 shadow-sm text-center space-y-1">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                ขายออก (ไม่รวมกำเหน็จ)
              </span>
              <div className="text-2xl sm:text-3xl font-black text-yellow-600 dark:text-yellow-400">
                {loading ? '...' : `฿${data?.prices.gold_ornament.sell_formatted}`}
              </div>
            </div>

            {/* รับซื้อ */}
            <div className="bg-white dark:bg-gray-800/90 p-4 sm:p-5 rounded-2xl border border-yellow-200/60 dark:border-gray-700 shadow-sm text-center space-y-1">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                ฐานภาษีรับซื้อคืน
              </span>
              <div className="text-2xl sm:text-3xl font-black text-gray-800 dark:text-gray-100">
                {loading ? '...' : `฿${data?.prices.gold_ornament.buy_formatted}`}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-yellow-200/40 dark:border-gray-800">
            <span>ราคาทองรูปพรรณรวมค่ากำเหน็จเฉลี่ย (~฿500):</span>
            <span className="font-semibold text-yellow-700 dark:text-yellow-400">
              {data ? `฿${(data.prices.gold_ornament.sell + 500).toLocaleString()} บาท` : '-'}
            </span>
          </div>
        </div>
      </div>

      {/* Smart Gold Calculator */}
      <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-3xl shadow-sm border dark:border-gray-800 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-xl">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              เครื่องคำนวณราคาทองคำตามน้ำหนัก (Gold Calculator)
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              คำนวณราคาทอง 1 สลึง, 2 สลึง, 1 บาท, 5 บาท หรือตามน้ำหนักกรัม พร้อมคิดค่ากำเหน็จ
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Controls */}
          <div className="lg:col-span-7 space-y-5">
            {/* Gold Type Radio */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                1. เลือกประเภททองคำ
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCalcType('ornament')}
                  className={`py-3 px-4 rounded-2xl border text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                    calcType === 'ornament'
                      ? 'bg-amber-500 text-white border-amber-500 shadow-md'
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  💍 ทองรูปพรรณ (สร้อย/แหวน)
                </button>
                <button
                  type="button"
                  onClick={() => setCalcType('bar')}
                  className={`py-3 px-4 rounded-2xl border text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                    calcType === 'bar'
                      ? 'bg-amber-500 text-white border-amber-500 shadow-md'
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  🪙 ทองคำแท่ง
                </button>
              </div>
            </div>

            {/* Weight Presets */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                2. เลือกน้ำหนักทองคำ
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {WEIGHT_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedWeightMode('preset')
                      setSelectedPresetIndex(idx)
                    }}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all text-center ${
                      selectedWeightMode === 'preset' && selectedPresetIndex === idx
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-400 dark:border-amber-700 shadow-sm'
                        : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div>{preset.label}</div>
                    <div className="text-[10px] font-normal opacity-70">({preset.grams.toFixed(2)} กรัม)</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Inputs */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  หรือระบุจำนวนบาททอง
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={selectedWeightMode === 'custom_baht' ? customBaht : ''}
                  placeholder="เช่น 1.5 บาท"
                  onFocus={() => setSelectedWeightMode('custom_baht')}
                  onChange={e => {
                    setSelectedWeightMode('custom_baht')
                    setCustomBaht(e.target.value)
                  }}
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {calcType === 'ornament' && (
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    ค่ากำเหน็จเฉลี่ย (บาท/ชิ้น)
                  </label>
                  <input
                    type="number"
                    value={craftFee}
                    onChange={e => setCraftFee(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Calculator Output */}
          <div className="lg:col-span-5 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/40 dark:to-yellow-950/30 p-6 rounded-3xl border border-amber-200 dark:border-amber-800/60 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                สรุปราคาประเมิน ({calcResult.bahtAmount.toFixed(3)} บาท / {calcResult.gramAmount.toFixed(2)} กรัม)
              </span>

              {/* Price to buy from shop */}
              <div className="mt-4 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-amber-100 dark:border-gray-800 shadow-sm space-y-1">
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  ราคาซื้อจากร้านทอง {calcType === 'ornament' && '(รวมค่ากำเหน็จ)'}
                </div>
                <div className="text-3xl font-black text-amber-600 dark:text-amber-400">
                  ฿{calcResult.costWithFee.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                {calcType === 'ornament' && craftFee > 0 && (
                  <div className="text-[11px] text-gray-400">
                    (ราคาทอง ฿{calcResult.sellPrice.toLocaleString('th-TH', { maximumFractionDigits: 2 })} + ค่ากำเหน็จ ฿{(craftFee * calcResult.bahtAmount).toLocaleString('th-TH', { maximumFractionDigits: 2 })})
                  </div>
                )}
              </div>

              {/* Price to sell back to shop */}
              <div className="mt-3 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-amber-100 dark:border-gray-800 shadow-sm space-y-1">
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  ราคาขายคืนให้ร้านทอง (โดยประมาณ)
                </div>
                <div className="text-2xl font-black text-gray-800 dark:text-gray-200">
                  ฿{calcResult.buyPrice.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-[11px] text-gray-400">
                  *ร้านทองอาจมีการหักค่าหลอม/ค่าสึกหรอ 3-5% ตามสภาพทอง
                </div>
              </div>
            </div>

            <div className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed border-t border-amber-200/50 dark:border-amber-800/40 pt-3">
              <ShieldCheck className="w-4 h-4 inline-block text-amber-600 mr-1" />
              คำนวณอิงตามราคาประกาศสมาคมค้าทองคำแห่งประเทศไทย
            </div>
          </div>
        </div>
      </div>

      {/* Thai Gold Weight Standard Table */}
      <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-3xl shadow-sm border dark:border-gray-800 space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Scale className="w-5 h-5 text-amber-500" /> ตารางมาตรฐานน้ำหนักทองคำไทย 96.5%
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold border-b dark:border-gray-700">
              <tr>
                <th className="p-3">หน่วยเรียก</th>
                <th className="p-3">จำนวนสลึง</th>
                <th className="p-3">น้ำหนักทองคำแท่ง</th>
                <th className="p-3">น้ำหนักทองรูปพรรณ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-700 dark:text-gray-300">
              <tr>
                <td className="p-3 font-bold">1 บาท</td>
                <td className="p-3">4 สลึง (100 สตางค์)</td>
                <td className="p-3 text-amber-600 font-semibold">15.244 กรัม</td>
                <td className="p-3">15.160 กรัม</td>
              </tr>
              <tr>
                <td className="p-3 font-bold">2 สลึง (50 สตางค์)</td>
                <td className="p-3">2 สลึง (0.5 บาท)</td>
                <td className="p-3 text-amber-600 font-semibold">7.622 กรัม</td>
                <td className="p-3">7.580 กรัม</td>
              </tr>
              <tr>
                <td className="p-3 font-bold">1 สลึง (25 สตางค์)</td>
                <td className="p-3">1 สลึง (0.25 บาท)</td>
                <td className="p-3 text-amber-600 font-semibold">3.811 กรัม</td>
                <td className="p-3">3.790 กรัม</td>
              </tr>
              <tr>
                <td className="p-3 font-bold">ครึ่งสลึง</td>
                <td className="p-3">0.5 สลึง (0.125 บาท)</td>
                <td className="p-3 text-amber-600 font-semibold">1.905 กรัม</td>
                <td className="p-3">1.895 กรัม</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <AdSlot />
    </div>
  )
}
