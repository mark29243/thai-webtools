'use client'

import { useState, useMemo } from 'react'
import { AdSlot } from '@/components/AdSlot'
import { ShareBar } from '@/components/ShareBar'
import { 
  Clock, 
  Plus, 
  Minus, 
  ArrowRightLeft, 
  Briefcase, 
  Timer, 
  Sparkles, 
  Calendar, 
  CheckCircle2, 
  Copy, 
  RotateCcw,
  DollarSign
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function TimeCalculatorPage() {
  const [activeTab, setActiveTab] = useState<'math' | 'duration' | 'work' | 'convert'>('math')

  // --- Tab 1: Add / Subtract Time State ---
  const [baseDate, setBaseDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [baseTime, setBaseTime] = useState(() => {
    const d = new Date()
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`
  })
  const [mathOp, setMathOp] = useState<'+' | '-'>('+')
  const [addDays, setAddDays] = useState<string>('0')
  const [addHours, setAddHours] = useState<string>('3')
  const [addMinutes, setAddMinutes] = useState<string>('45')
  const [addSeconds, setAddSeconds] = useState<string>('0')

  // --- Tab 2: Duration Between Times State ---
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [startTime, setStartTime] = useState('08:30:00')
  const [endDate, setEndDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [endTime, setEndTime] = useState('17:45:30')

  // --- Tab 3: Work Hours & Wage State ---
  const [workStart, setWorkStart] = useState('08:30')
  const [workEnd, setWorkEnd] = useState('17:30')
  const [breakMinutes, setBreakMinutes] = useState('60')
  const [hourlyWage, setHourlyWage] = useState('100')
  const [standardWorkHours, setStandardWorkHours] = useState('8')
  const [otMultiplier, setOtMultiplier] = useState('1.5')

  // --- Tab 4: Unit Converter State ---
  const [convertVal, setConvertVal] = useState<string>('3600')
  const [convertUnit, setConvertUnit] = useState<'s' | 'm' | 'h' | 'd' | 'w'>('s')

  // --- Calculations ---

  // 1. Add / Subtract Result
  const mathResult = useMemo(() => {
    try {
      const [year, month, day] = baseDate.split('-').map(Number)
      const timeParts = baseTime.split(':').map(Number)
      const hour = timeParts[0] || 0
      const min = timeParts[1] || 0
      const sec = timeParts[2] || 0

      const d = new Date(year, month - 1, day, hour, min, sec)

      const totalOffsetMs = (
        (parseInt(addDays) || 0) * 86400 +
        (parseInt(addHours) || 0) * 3600 +
        (parseInt(addMinutes) || 0) * 60 +
        (parseInt(addSeconds) || 0)
      ) * 1000

      const newTimeMs = mathOp === '+' ? d.getTime() + totalOffsetMs : d.getTime() - totalOffsetMs
      const resDate = new Date(newTimeMs)

      return {
        dateStr: resDate.toLocaleDateString('th-TH', { dateStyle: 'full' }),
        timeStr: resDate.toTimeString().slice(0, 8),
        isoDate: resDate.toISOString().slice(0, 10),
      }
    } catch {
      return null
    }
  }, [baseDate, baseTime, mathOp, addDays, addHours, addMinutes, addSeconds])

  // 2. Duration Result
  const durationResult = useMemo(() => {
    try {
      const [sy, sm, sd] = startDate.split('-').map(Number)
      const [sh, smin, ss] = startTime.split(':').map(Number)
      const d1 = new Date(sy, sm - 1, sd, sh || 0, smin || 0, ss || 0)

      const [ey, em, ed] = endDate.split('-').map(Number)
      const [eh, emin, es] = endTime.split(':').map(Number)
      const d2 = new Date(ey, em - 1, ed, eh || 0, emin || 0, es || 0)

      let diffMs = d2.getTime() - d1.getTime()
      const isNegative = diffMs < 0
      diffMs = Math.abs(diffMs)

      const totalSeconds = Math.floor(diffMs / 1000)
      const totalMinutes = totalSeconds / 60
      const totalHours = totalSeconds / 3600
      const totalDays = totalSeconds / 86400

      const days = Math.floor(totalSeconds / 86400)
      const hours = Math.floor((totalSeconds % 86400) / 3600)
      const minutes = Math.floor((totalSeconds % 3600) / 60)
      const seconds = totalSeconds % 60

      return {
        isNegative,
        days,
        hours,
        minutes,
        seconds,
        totalHours: totalHours.toFixed(2),
        totalMinutes: totalMinutes.toLocaleString('th-TH', { maximumFractionDigits: 1 }),
        totalSeconds: totalSeconds.toLocaleString('th-TH'),
        totalDays: totalDays.toFixed(2)
      }
    } catch {
      return null
    }
  }, [startDate, startTime, endDate, endTime])

  // 3. Work Hours Result
  const workResult = useMemo(() => {
    try {
      const [sh, sm] = workStart.split(':').map(Number)
      const [eh, em] = workEnd.split(':').map(Number)

      let startMin = sh * 60 + sm
      let endMin = eh * 60 + em

      // If work crosses midnight (e.g. 22:00 to 06:00)
      if (endMin < startMin) {
        endMin += 24 * 60
      }

      const rawWorkMin = endMin - startMin
      const breakMin = parseInt(breakMinutes) || 0
      const netWorkMin = Math.max(0, rawWorkMin - breakMin)

      const totalWorkHours = netWorkMin / 60
      const stdHours = parseFloat(standardWorkHours) || 8
      const regularHours = Math.min(totalWorkHours, stdHours)
      const otHours = Math.max(0, totalWorkHours - stdHours)

      const wageRate = parseFloat(hourlyWage) || 0
      const otRate = parseFloat(otMultiplier) || 1.5

      const regularPay = regularHours * wageRate
      const otPay = otHours * (wageRate * otRate)
      const totalPay = regularPay + otPay

      const hoursPart = Math.floor(netWorkMin / 60)
      const minsPart = netWorkMin % 60

      return {
        netWorkMin,
        hoursPart,
        minsPart,
        totalWorkHours: totalWorkHours.toFixed(2),
        regularHours: regularHours.toFixed(2),
        otHours: otHours.toFixed(2),
        regularPay,
        otPay,
        totalPay
      }
    } catch {
      return null
    }
  }, [workStart, workEnd, breakMinutes, hourlyWage, standardWorkHours, otMultiplier])

  // 4. Conversion Result
  const convResult = useMemo(() => {
    const v = parseFloat(convertVal) || 0
    let inSeconds = 0

    switch (convertUnit) {
      case 's': inSeconds = v; break
      case 'm': inSeconds = v * 60; break
      case 'h': inSeconds = v * 3600; break
      case 'd': inSeconds = v * 86400; break
      case 'w': inSeconds = v * 604800; break
    }

    return {
      seconds: inSeconds,
      minutes: inSeconds / 60,
      hours: inSeconds / 3600,
      days: inSeconds / 86400,
      weeks: inSeconds / 604800,
      months: inSeconds / (86400 * 30.4375),
      years: inSeconds / (86400 * 365.25),
    }
  }, [convertVal, convertUnit])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('คัดลอกข้อความแล้ว!')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl text-white shadow-lg shadow-blue-500/20">
            <Clock className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">เครื่องคิดเลขเวลา (Time Calculator)</h1>
            <p className="text-gray-600 dark:text-gray-400">
              คำนวณบวก-ลบเวลา หาช่วงห่างเวลา คำนวณชั่วโมงทำงาน & คิดค่าแรง และแปลงหน่วยเวลา
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl border dark:border-gray-700 text-xs font-bold">
        <button
          onClick={() => setActiveTab('math')}
          className={`py-3 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'math'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Plus className="w-4 h-4" /> บวก / ลบเวลา
        </button>
        <button
          onClick={() => setActiveTab('duration')}
          className={`py-3 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'duration'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Timer className="w-4 h-4" /> ช่วงห่างระหว่างเวลา
        </button>
        <button
          onClick={() => setActiveTab('work')}
          className={`py-3 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'work'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Briefcase className="w-4 h-4" /> ชั่วโมงทำงาน & ค่าแรง
        </button>
        <button
          onClick={() => setActiveTab('convert')}
          className={`py-3 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'convert'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <ArrowRightLeft className="w-4 h-4" /> แปลงหน่วยเวลา
        </button>
      </div>

      {/* --- TAB 1: ADD / SUBTRACT TIME --- */}
      {activeTab === 'math' && (
        <div className="grid md:grid-cols-12 gap-6 items-start">
          {/* Inputs (7 cols) */}
          <div className="md:col-span-7 bg-white dark:bg-gray-900 p-6 rounded-3xl border dark:border-gray-800 shadow-sm space-y-5">
            <h2 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" /> ตั้งค่าเวลาเริ่มต้นและการคำนวณ
            </h2>

            {/* Base Time */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-gray-500 mb-1">วันที่เริ่มต้น</label>
                <input
                  type="date"
                  value={baseDate}
                  onChange={e => setBaseDate(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl font-bold"
                />
              </div>
              <div>
                <label className="block text-gray-500 mb-1">เวลาเริ่มต้น (ชม:นาที:วินาที)</label>
                <input
                  type="time"
                  step="1"
                  value={baseTime}
                  onChange={e => setBaseTime(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl font-bold"
                />
              </div>
            </div>

            {/* Operation Toggle */}
            <div className="flex items-center gap-3 pt-1">
              <span className="text-xs text-gray-500">การคำนวณ:</span>
              <div className="flex rounded-xl bg-gray-100 dark:bg-gray-800 p-1 border dark:border-gray-700 text-xs font-bold">
                <button
                  onClick={() => setMathOp('+')}
                  className={`px-4 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                    mathOp === '+'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" /> บวกเพิ่ม (+)
                </button>
                <button
                  onClick={() => setMathOp('-')}
                  className={`px-4 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                    mathOp === '-'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  <Minus className="w-3.5 h-3.5" /> ลบออก (-)
                </button>
              </div>
            </div>

            {/* Duration to add/sub */}
            <div className="grid grid-cols-4 gap-2 text-xs">
              <div>
                <label className="block text-gray-500 mb-1 text-center">วัน</label>
                <input
                  type="number"
                  min="0"
                  value={addDays}
                  onChange={e => setAddDays(e.target.value)}
                  className="w-full px-2 py-2 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl text-center font-bold text-sm"
                />
              </div>
              <div>
                <label className="block text-gray-500 mb-1 text-center">ชั่วโมง</label>
                <input
                  type="number"
                  min="0"
                  value={addHours}
                  onChange={e => setAddHours(e.target.value)}
                  className="w-full px-2 py-2 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl text-center font-bold text-sm"
                />
              </div>
              <div>
                <label className="block text-gray-500 mb-1 text-center">นาที</label>
                <input
                  type="number"
                  min="0"
                  value={addMinutes}
                  onChange={e => setAddMinutes(e.target.value)}
                  className="w-full px-2 py-2 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl text-center font-bold text-sm"
                />
              </div>
              <div>
                <label className="block text-gray-500 mb-1 text-center">วินาที</label>
                <input
                  type="number"
                  min="0"
                  value={addSeconds}
                  onChange={e => setAddSeconds(e.target.value)}
                  className="w-full px-2 py-2 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl text-center font-bold text-sm"
                />
              </div>
            </div>

            {/* Quick Add Buttons */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] text-gray-400">ปุ่มลัดบวกเวลาด่วน:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: '+15 นาที', h: '0', m: '15' },
                  { label: '+30 นาที', h: '0', m: '30' },
                  { label: '+1 ชม.', h: '1', m: '0' },
                  { label: '+8 ชม.', h: '8', m: '0' },
                  { label: '+24 ชม. (1 วัน)', h: '24', m: '0' },
                ].map((btn, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setAddHours(btn.h)
                      setAddMinutes(btn.m)
                      setAddSeconds('0')
                      setAddDays('0')
                    }}
                    className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-950 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg text-[11px] font-semibold border dark:border-gray-700 transition-colors"
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Result Card (5 cols) */}
          <div className="md:col-span-5 bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                เวลาผลลัพธ์ที่ได้
              </span>
              <Sparkles className="w-5 h-5 text-yellow-300" />
            </div>

            {mathResult && (
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-white/80">เวลาใหม่ (Result Time)</div>
                  <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight mt-1">
                    {mathResult.timeStr}
                  </div>
                </div>

                <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-xs space-y-1">
                  <div className="text-white/80">วันที่:</div>
                  <div className="font-bold text-sm">{mathResult.dateStr}</div>
                </div>

                <button
                  onClick={() => copyToClipboard(`${mathResult.dateStr} เวลา ${mathResult.timeStr}`)}
                  className="w-full py-3 bg-white text-blue-900 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 hover:bg-gray-100 transition-all shadow-md"
                >
                  <Copy className="w-4 h-4" /> คัดลอกวันและเวลา
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- TAB 2: DURATION BETWEEN TIMES --- */}
      {activeTab === 'duration' && (
        <div className="grid md:grid-cols-12 gap-6 items-start">
          {/* Inputs (7 cols) */}
          <div className="md:col-span-7 bg-white dark:bg-gray-900 p-6 rounded-3xl border dark:border-gray-800 shadow-sm space-y-5">
            <h2 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
              <Timer className="w-4 h-4 text-blue-500" /> ระบุวันและเวลาเริ่มต้น - สิ้นสุด
            </h2>

            {/* Start */}
            <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 rounded-2xl border border-blue-100 dark:border-blue-900/40 space-y-2">
              <span className="text-xs font-bold text-blue-800 dark:text-blue-300">1. เวลาเริ่มต้น</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-xl font-bold"
                />
                <input
                  type="time"
                  step="1"
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-xl font-bold"
                />
              </div>
            </div>

            {/* End */}
            <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-2xl border border-indigo-100 dark:border-indigo-900/40 space-y-2">
              <span className="text-xs font-bold text-indigo-800 dark:text-indigo-300">2. เวลาสิ้นสุด</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-xl font-bold"
                />
                <input
                  type="time"
                  step="1"
                  value={endTime}
                  onChange={e => setEndTime(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-xl font-bold"
                />
              </div>
            </div>
          </div>

          {/* Results (5 cols) */}
          <div className="md:col-span-5 bg-gradient-to-br from-indigo-600 to-blue-700 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                ระยะห่างเวลาทั้งหมด
              </span>
              <Timer className="w-5 h-5 text-yellow-300" />
            </div>

            {durationResult && (
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 space-y-2">
                  <div className="text-xs text-white/80">รวมระยะเวลา:</div>
                  <div className="text-2xl sm:text-3xl font-black">
                    {durationResult.days > 0 && `${durationResult.days} วัน `}
                    {durationResult.hours} ชม. {durationResult.minutes} นาที {durationResult.seconds} วินาที
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between p-2.5 bg-white/10 rounded-xl">
                    <span className="text-white/80">เทียบเป็นชั่วโมงทศนิยม:</span>
                    <span className="font-bold text-sm">{durationResult.totalHours} ชม.</span>
                  </div>
                  <div className="flex justify-between p-2.5 bg-white/10 rounded-xl">
                    <span className="text-white/80">เทียบเป็นนาที:</span>
                    <span className="font-bold text-sm">{durationResult.totalMinutes} นาที</span>
                  </div>
                  <div className="flex justify-between p-2.5 bg-white/10 rounded-xl">
                    <span className="text-white/80">เทียบเป็นวินาที:</span>
                    <span className="font-bold text-sm">{durationResult.totalSeconds} วินาที</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- TAB 3: WORK HOURS & WAGES --- */}
      {activeTab === 'work' && (
        <div className="grid md:grid-cols-12 gap-6 items-start">
          {/* Inputs (7 cols) */}
          <div className="md:col-span-7 bg-white dark:bg-gray-900 p-6 rounded-3xl border dark:border-gray-800 shadow-sm space-y-4">
            <h2 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-600" /> ข้อมูลเวลาทำงานและอัตราค่าจ้าง
            </h2>

            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-gray-500 mb-1">เวลาเข้างาน</label>
                <input
                  type="time"
                  value={workStart}
                  onChange={e => setWorkStart(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block text-gray-500 mb-1">เวลาออกงาน</label>
                <input
                  type="time"
                  value={workEnd}
                  onChange={e => setWorkEnd(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block text-gray-500 mb-1">หักเวลาพักเบรก (นาที)</label>
                <input
                  type="number"
                  min="0"
                  value={breakMinutes}
                  onChange={e => setBreakMinutes(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block text-gray-500 mb-1">ชั่วโมงทำงานปกติ/วัน (ชม.)</label>
                <input
                  type="number"
                  min="1"
                  value={standardWorkHours}
                  onChange={e => setStandardWorkHours(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block text-gray-500 mb-1">อัตราค่าจ้าง (บาท / ชม.)</label>
                <input
                  type="number"
                  min="0"
                  value={hourlyWage}
                  onChange={e => setHourlyWage(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block text-gray-500 mb-1">ตัวคูณ OT ล่วงเวลา (เช่น 1.5 เท่า)</label>
                <input
                  type="number"
                  step="0.5"
                  value={otMultiplier}
                  onChange={e => setOtMultiplier(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl font-bold"
                />
              </div>
            </div>
          </div>

          {/* Work Results (5 cols) */}
          <div className="md:col-span-5 bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                สรุปชั่วโมงทำงานและค่าแรง
              </span>
              <DollarSign className="w-5 h-5 text-yellow-300" />
            </div>

            {workResult && (
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-white/80">ค่าแรงรวมสุทธิ</div>
                  <div className="text-3xl sm:text-4xl font-black mt-1">
                    ฿{workResult.totalPay.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>

                <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-white/80">ชั่วโมงทำงานสุทธิ:</span>
                    <span className="font-bold">{workResult.hoursPart} ชม. {workResult.minsPart} นาที ({workResult.totalWorkHours} ชม.)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">ค่าจ้างเวลาปกติ ({workResult.regularHours} ชม.):</span>
                    <span className="font-semibold">฿{workResult.regularPay.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
                  </div>
                  {parseFloat(workResult.otHours) > 0 && (
                    <div className="flex justify-between text-yellow-200">
                      <span>ค่าล่วงเวลา OT ({workResult.otHours} ชม. × {otMultiplier}):</span>
                      <span className="font-bold">+฿{workResult.otPay.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- TAB 4: TIME UNIT CONVERTER --- */}
      {activeTab === 'convert' && (
        <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-3xl border dark:border-gray-800 shadow-sm space-y-6">
          <div className="max-w-md mx-auto space-y-3">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider text-center">
              กรอกค่าและเลือกหน่วยเริ่มต้น
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={convertVal}
                onChange={e => setConvertVal(e.target.value)}
                placeholder="ระบุตัวเลข..."
                className="flex-grow px-4 py-3 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-2xl font-black text-lg text-center"
              />
              <select
                value={convertUnit}
                onChange={e => setConvertUnit(e.target.value as any)}
                className="px-4 py-3 bg-blue-600 text-white font-bold rounded-2xl text-sm"
              >
                <option value="s">วินาที (Seconds)</option>
                <option value="m">นาที (Minutes)</option>
                <option value="h">ชั่วโมง (Hours)</option>
                <option value="d">วัน (Days)</option>
                <option value="w">สัปดาห์ (Weeks)</option>
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 pt-4 border-t dark:border-gray-800">
            {[
              { label: 'วินาที (Seconds)', val: convResult.seconds.toLocaleString('th-TH', { maximumFractionDigits: 2 }) },
              { label: 'นาที (Minutes)', val: convResult.minutes.toLocaleString('th-TH', { maximumFractionDigits: 4 }) },
              { label: 'ชั่วโมง (Hours)', val: convResult.hours.toLocaleString('th-TH', { maximumFractionDigits: 4 }) },
              { label: 'วัน (Days)', val: convResult.days.toLocaleString('th-TH', { maximumFractionDigits: 4 }) },
              { label: 'สัปดาห์ (Weeks)', val: convResult.weeks.toLocaleString('th-TH', { maximumFractionDigits: 4 }) },
              { label: 'เดือน (Months ~30.44d)', val: convResult.months.toLocaleString('th-TH', { maximumFractionDigits: 4 }) },
            ].map((item, idx) => (
              <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border dark:border-gray-700/60 space-y-1">
                <div className="text-[11px] text-gray-500">{item.label}</div>
                <div className="text-lg font-black text-blue-600 dark:text-blue-400 truncate">
                  {item.val}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ShareBar 
        title="เครื่องคิดเลขเวลา (Time Calculator) - Thai WebTools"
        description="คำนวณบวก-ลบเวลา หาช่วงห่างเวลา และคิดชั่วโมงทำงานพร้อมค่าแรงฟรี"
      />
      <AdSlot />
    </div>
  )
}
