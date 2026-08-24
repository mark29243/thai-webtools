'use client'

import { useState, useMemo } from 'react'
import { AdSlot } from '@/components/AdSlot'
import { 
  Fuel, 
  TrendingDown, 
  Calculator, 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  Zap, 
  Layers, 
  Info,
  Car,
  Gauge
} from 'lucide-react'

interface StationPrice {
  brand: string
  name: string
  color: string
  bgLight: string
  textDark: string
  prices: { [fuelKey: string]: number }
}

interface FuelTypeInfo {
  key: string
  name: string
  category: 'gasohol' | 'diesel' | 'gasoline'
  desc: string
  badgeColor: string
}

const FUEL_TYPES: FuelTypeInfo[] = [
  { key: 'g95', name: 'แก๊สโซฮอล์ 95', category: 'gasohol', desc: 'Gasohol 95', badgeColor: 'bg-orange-500' },
  { key: 'g91', name: 'แก๊สโซฮอล์ 91', category: 'gasohol', desc: 'Gasohol 91', badgeColor: 'bg-green-500' },
  { key: 'e20', name: 'แก๊สโซฮอล์ E20', category: 'gasohol', desc: 'Gasohol E20', badgeColor: 'bg-teal-500' },
  { key: 'e85', name: 'แก๊สโซฮอล์ E85', category: 'gasohol', desc: 'Gasohol E85', badgeColor: 'bg-blue-500' },
  { key: 'ben95', name: 'เบนซิน 95', category: 'gasoline', desc: 'Gasoline 95', badgeColor: 'bg-yellow-500' },
  { key: 'diesel_b7', name: 'ดีเซล B7', category: 'diesel', desc: 'Diesel B7', badgeColor: 'bg-blue-600' },
  { key: 'diesel', name: 'ดีเซล', category: 'diesel', desc: 'Standard Diesel', badgeColor: 'bg-indigo-600' },
  { key: 'premium_diesel', name: 'ดีเซลพรีเมียม', category: 'diesel', desc: 'Premium Diesel', badgeColor: 'bg-purple-600' }
]

// Current standard market pricing in Thailand (THB/Litre)
const STATIONS: StationPrice[] = [
  {
    brand: 'PTT',
    name: 'PTT Station (ปตท.)',
    color: '#005BBB',
    bgLight: 'bg-blue-50 dark:bg-blue-950/40',
    textDark: 'text-blue-700 dark:text-blue-300',
    prices: {
      g95: 37.55,
      g91: 37.18,
      e20: 35.44,
      e85: 33.19,
      ben95: 45.44,
      diesel_b7: 32.94,
      diesel: 32.94,
      premium_diesel: 44.94
    }
  },
  {
    brand: 'BCP',
    name: 'บางจาก (Bangchak)',
    color: '#00A651',
    bgLight: 'bg-emerald-50 dark:bg-emerald-950/40',
    textDark: 'text-emerald-700 dark:text-emerald-300',
    prices: {
      g95: 37.55,
      g91: 37.18,
      e20: 35.44,
      e85: 33.19,
      ben95: 45.44,
      diesel_b7: 32.94,
      diesel: 32.94,
      premium_diesel: 44.94
    }
  },
  {
    brand: 'SHELL',
    name: 'เชลล์ (Shell)',
    color: '#DD1D21',
    bgLight: 'bg-rose-50 dark:bg-rose-950/40',
    textDark: 'text-rose-700 dark:text-rose-300',
    prices: {
      g95: 38.05,
      g91: 37.68,
      e20: 35.94,
      e85: 33.69,
      ben95: 46.14,
      diesel_b7: 33.24,
      diesel: 33.24,
      premium_diesel: 47.94
    }
  },
  {
    brand: 'CALTEX',
    name: 'คาลเท็กซ์ (Caltex)',
    color: '#008B8B',
    bgLight: 'bg-cyan-50 dark:bg-cyan-950/40',
    textDark: 'text-cyan-700 dark:text-cyan-300',
    prices: {
      g95: 37.55,
      g91: 37.18,
      e20: 35.44,
      e85: 33.19,
      ben95: 45.94,
      diesel_b7: 32.94,
      diesel: 32.94,
      premium_diesel: 45.14
    }
  },
  {
    brand: 'PT',
    name: 'พีที (PT)',
    color: '#E31B23',
    bgLight: 'bg-red-50 dark:bg-red-950/40',
    textDark: 'text-red-700 dark:text-red-300',
    prices: {
      g95: 37.55,
      g91: 37.18,
      e20: 35.44,
      e85: 33.19,
      ben95: 45.44,
      diesel_b7: 32.94,
      diesel: 32.94,
      premium_diesel: 44.94
    }
  },
  {
    brand: 'SUSCO',
    name: 'ซัสโก้ (Susco)',
    color: '#FFB81C',
    bgLight: 'bg-amber-50 dark:bg-amber-950/40',
    textDark: 'text-amber-700 dark:text-amber-300',
    prices: {
      g95: 37.55,
      g91: 37.18,
      e20: 35.44,
      e85: 33.19,
      ben95: 45.44,
      diesel_b7: 32.94,
      diesel: 32.94,
      premium_diesel: 44.94
    }
  }
]

export default function FuelPricePage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'gasohol' | 'diesel' | 'gasoline'>('all')
  const [calcBudget, setCalcBudget] = useState<number>(1000)
  const [calcFuelKey, setCalcFuelKey] = useState<string>('g95')
  
  // Trip Calculator
  const [tripDistance, setTripDistance] = useState<number>(150)
  const [fuelEfficiency, setFuelEfficiency] = useState<number>(15) // km / litre

  // Find lowest price for each fuel
  const lowestPrices = useMemo(() => {
    const map: { [fuelKey: string]: number } = {}
    FUEL_TYPES.forEach(fuel => {
      let min = Infinity
      STATIONS.forEach(st => {
        const p = st.prices[fuel.key]
        if (p && p < min) min = p
      })
      map[fuel.key] = min
    })
    return map
  }, [])

  const filteredFuelTypes = useMemo(() => {
    if (selectedCategory === 'all') return FUEL_TYPES
    return FUEL_TYPES.filter(f => f.category === selectedCategory)
  }, [selectedCategory])

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl text-white shadow-md">
            <Fuel className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">เทียบราคาน้ำมันวันนี้ (Thai Fuel Price Comparison)</h1>
            <p className="text-gray-600 dark:text-gray-400">
              เช็กและเปรียบเทียบราคาน้ำมันทุกชนิด จากปั๊ม ปตท. บางจาก เชลล์ คาลเท็กซ์ พีที และซัสโก้ พร้อมเครื่องคำนวณค่าน้ำมันเดินทาง
            </p>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'all', label: '⛽ น้ำมันทุกชนิด' },
          { key: 'gasohol', label: '🌿 แก๊สโซฮอล์ (95, 91, E20, E85)' },
          { key: 'diesel', label: '🚛 ดีเซล (B7, ธรรมดา, พรีเมียม)' },
          { key: 'gasoline', label: '🔥 เบนซิน 95' }
        ].map(cat => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key as any)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              selectedCategory === cat.key
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Comparison Table Card */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border dark:border-gray-800 overflow-hidden">
        <div className="p-6 border-b dark:border-gray-800 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-500" /> ตารางเปรียบเทียบราคาน้ำมัน (บาท/ลิตร)
          </h2>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full font-bold border border-emerald-200 dark:border-emerald-800">
            ไฮไลท์สีเขียว = ราคาถูกที่สุด
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 font-bold border-b dark:border-gray-700">
              <tr>
                <th className="p-4 pl-6 min-w-[160px]">ประเภทน้ำมัน</th>
                {STATIONS.map(st => (
                  <th key={st.brand} className="p-4 text-center min-w-[110px]">
                    <div className="font-extrabold text-sm">{st.brand}</div>
                    <div className="text-[11px] font-normal opacity-70 truncate max-w-[100px] mx-auto">{st.name.split(' ')[0]}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 font-medium">
              {filteredFuelTypes.map(fuel => {
                const minPrice = lowestPrices[fuel.key]
                return (
                  <tr key={fuel.key} className="hover:bg-amber-50/20 dark:hover:bg-amber-950/10 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${fuel.badgeColor}`}></span>
                        <div>
                          <div className="font-bold text-gray-900 dark:text-gray-100">{fuel.name}</div>
                          <div className="text-xs text-gray-400 font-normal">{fuel.desc}</div>
                        </div>
                      </div>
                    </td>

                    {STATIONS.map(st => {
                      const price = st.prices[fuel.key]
                      const isLowest = price === minPrice

                      return (
                        <td key={st.brand} className="p-4 text-center">
                          {price ? (
                            <span
                              className={`inline-block px-2.5 py-1 rounded-lg font-bold ${
                                isLowest
                                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                                  : 'text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              ฿{price.toFixed(2)}
                            </span>
                          ) : (
                            <span className="text-gray-300 dark:text-gray-600">-</span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Calculators */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Calculator 1: Budget to Litres */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border dark:border-gray-800 space-y-4">
          <div className="flex items-center gap-2 font-bold text-lg text-gray-800 dark:text-gray-200">
            <Calculator className="w-5 h-5 text-amber-500" />
            <h3>เติมเงิน X บาท ได้น้ำมันกี่ลิตร?</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                จำนวนเงิน (บาท)
              </label>
              <input
                type="number"
                value={calcBudget}
                onChange={e => setCalcBudget(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                ชนิดน้ำมัน
              </label>
              <select
                value={calcFuelKey}
                onChange={e => setCalcFuelKey(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-amber-500"
              >
                {FUEL_TYPES.map(f => (
                  <option key={f.key} value={f.key}>{f.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Result cards per station */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
            {STATIONS.map(st => {
              const price = st.prices[calcFuelKey]
              const litres = price && calcBudget > 0 ? (calcBudget / price) : 0
              return (
                <div
                  key={st.brand}
                  className={`p-3 rounded-2xl border ${st.bgLight} border-gray-200/60 dark:border-gray-800 text-center space-y-1`}
                >
                  <div className="text-xs font-bold text-gray-600 dark:text-gray-400">{st.brand}</div>
                  <div className="text-lg font-black text-gray-900 dark:text-white">
                    {litres.toFixed(2)} <span className="text-xs font-normal">ลิตร</span>
                  </div>
                  <div className="text-[11px] text-gray-400">@฿{price?.toFixed(2)}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Calculator 2: Trip Fuel Cost */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border dark:border-gray-800 space-y-4">
          <div className="flex items-center gap-2 font-bold text-lg text-gray-800 dark:text-gray-200">
            <Car className="w-5 h-5 text-amber-500" />
            <h3>คำนวณค่าน้ำมันออกทริป / เดินทาง</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                ระยะทางไป-กลับ (กิโลเมตร)
              </label>
              <input
                type="number"
                value={tripDistance}
                onChange={e => setTripDistance(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                อัตรากินน้ำมัน (กม./ลิตร)
              </label>
              <input
                type="number"
                value={fuelEfficiency}
                onChange={e => setFuelEfficiency(parseFloat(e.target.value) || 1)}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Trip Cost Result */}
          {(() => {
            const litresNeeded = tripDistance > 0 && fuelEfficiency > 0 ? (tripDistance / fuelEfficiency) : 0
            const avgG95 = STATIONS[0].prices.g95 || 37.55
            const avgDiesel = STATIONS[0].prices.diesel || 32.94
            const costG95 = litresNeeded * avgG95
            const costDiesel = litresNeeded * avgDiesel

            return (
              <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-2xl border border-amber-200 dark:border-amber-900/40 space-y-3">
                <div className="flex justify-between items-center text-xs font-semibold text-gray-600 dark:text-gray-300">
                  <span>น้ำมันที่ต้องใช้ทั้งหมด:</span>
                  <span className="font-extrabold text-amber-700 dark:text-amber-400 text-sm">
                    {litresNeeded.toFixed(2)} ลิตร
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="bg-white dark:bg-gray-900 p-3 rounded-xl border border-amber-100 dark:border-gray-800">
                    <div className="text-xs text-gray-500">ถ้าเติม แก๊สโซฮอล์ 95</div>
                    <div className="text-lg font-black text-orange-600 dark:text-orange-400">
                      ฿{costG95.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-900 p-3 rounded-xl border border-amber-100 dark:border-gray-800">
                    <div className="text-xs text-gray-500">ถ้าเติม ดีเซล (Diesel)</div>
                    <div className="text-lg font-black text-blue-600 dark:text-blue-400">
                      ฿{costDiesel.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              </div>
            )
          })()}
        </div>
      </div>

      <AdSlot />
    </div>
  )
}
