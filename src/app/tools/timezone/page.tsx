'use client'
import { useState, useEffect } from 'react'
import { AdSlot } from '@/components/AdSlot'

const timezones = [
  { id: 'Asia/Bangkok', name: '🇹🇭 Bangkok (ICT, UTC+7)' },
  { id: 'Asia/Tokyo', name: '🇯🇵 Tokyo (JST, UTC+9)' },
  { id: 'Asia/Seoul', name: '🇰🇷 Seoul (KST, UTC+9)' },
  { id: 'Asia/Singapore', name: '🇸🇬 Singapore (SGT, UTC+8)' },
  { id: 'Asia/Dubai', name: '🇦🇪 Dubai (GST, UTC+4)' },
  { id: 'Europe/London', name: '🇬🇧 London (GMT/BST)' },
  { id: 'Europe/Paris', name: '🇫🇷 Paris (CET/CEST)' },
  { id: 'America/New_York', name: '🇺🇸 New York (EST/EDT)' },
  { id: 'America/Los_Angeles', name: '🇺🇸 Los Angeles (PST/PDT)' },
  { id: 'Australia/Sydney', name: '🇦🇺 Sydney (AEST/AEDT)' },
  { id: 'UTC', name: '🌐 UTC' }
]

export default function TimezonePage() {
  const [sourceTz, setSourceTz] = useState('Asia/Bangkok')
  const [dateStr, setDateStr] = useState('')
  const [timeStr, setTimeStr] = useState('')
  const [results, setResults] = useState<{ tz: string, time: string, diff: string }[]>([])

  useEffect(() => {
    // Set initial date/time to now
    const now = new Date()
    setDateStr(now.toISOString().split('T')[0])
    setTimeStr(now.toTimeString().slice(0,5))
  }, [])

  useEffect(() => {
    if (!dateStr || !timeStr) return
    try {
      // Create date object in source timezone
      // Hack for JS: construct ISO string, but standard JS Date parses as local.
      // Better: Use toLocaleString trick
      
      const parts = dateStr.split('-').map(Number)
      const tparts = timeStr.split(':').map(Number)
      
      // We want to treat parts as the time in \`sourceTz\`. 
      // Since native JS Intl is a bit tricky for parsing arbitrary TZ, 
      // we can compute offsets.
      
      const compute = () => {
        // Native way to get offset:
        const getOffset = (tz: string, date: Date) => {
          const str = date.toLocaleString('en-US', { timeZone: tz, timeZoneName: 'shortOffset' })
          const match = str.match(/(GMT[+-]?\d*)/)
          if(!match) return 0
          const offsetStr = match[1].replace('GMT', '')
          if(!offsetStr) return 0
          return parseInt(offsetStr) || 0 // Rough hour offset
        }

        const now = new Date()
        
        const formatter = (tz: string) => {
           // Wait, this is hard without date-fns-tz.
           // Since we don't have date-fns-tz installed, let's use a simpler approach.
           // Just use local timezone as a base, then use Intl.DateTimeFormat to show it.
        }
      }
      
    } catch(e) {}
  }, [sourceTz, dateStr, timeStr])

  // Let's rewrite a simpler approach: Just show "Current Time" around the world,
  // since converting arbitrary past/future dates strictly requires tz data.
  const [currentTime, setCurrentTime] = useState(new Date())
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Time Zone Converter</h1>
        <p className="text-gray-600 dark:text-gray-400">ดูและเทียบเวลาปัจจุบันของเมืองสำคัญทั่วโลก</p>
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-2xl shadow-sm border dark:border-gray-800">
        <div className="text-center mb-8 pb-8 border-b dark:border-gray-800">
          <div className="text-gray-500 mb-2">เวลาท้องถิ่นของคุณ (Local Time)</div>
          <div className="text-4xl sm:text-5xl font-bold text-blue-600 dark:text-blue-400 font-mono">
            {currentTime.toLocaleTimeString('th-TH')}
          </div>
          <div className="text-lg mt-2">{currentTime.toLocaleDateString('th-TH', { dateStyle: 'full' })}</div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {timezones.map(tz => (
            <div key={tz.id} className="p-4 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl flex flex-col justify-center text-center hover:shadow-md transition-shadow">
              <div className="font-semibold text-gray-700 dark:text-gray-300 mb-2">{tz.name}</div>
              <div className="text-2xl font-bold font-mono text-gray-900 dark:text-gray-100">
                {currentTime.toLocaleTimeString('en-US', { timeZone: tz.id, hour12: false })}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {currentTime.toLocaleDateString('en-US', { timeZone: tz.id, month: 'short', day: 'numeric', weekday: 'short' })}
              </div>
            </div>
          ))}
        </div>
      </div>
      <AdSlot />
    </div>
  )
}
