'use client'

import { useState, useMemo } from 'react'
import { AdSlot } from '@/components/AdSlot'
import { 
  PhoneCall, 
  Search, 
  ShieldAlert, 
  HeartPulse, 
  Car, 
  Landmark, 
  Zap, 
  Bus, 
  Copy, 
  Check, 
  Phone, 
  AlertTriangle,
  Info
} from 'lucide-react'
import toast from 'react-hot-toast'

interface EmergencyContact {
  number: string
  name: string
  desc: string
  category: 'police' | 'medical' | 'traffic' | 'bank' | 'utility' | 'transport'
  highlight?: boolean
}

const EMERGENCY_CONTACTS: EmergencyContact[] = [
  // เหตุด่วนเหตุร้าย
  { number: '191', name: 'แจ้งเหตุด่วนเหตุร้าย (ตำรวจ)', desc: 'เหตุด่วนเหตุร้าย ปล้น ชิงทรัพย์ ทำร้ายร่างกาย', category: 'police', highlight: true },
  { number: '199', name: 'แจ้งเหตุเพลิงไหม้-ดับเพลิง-สัตว์มีพิษ', desc: 'ดับเพลิง สัตว์เลื้อยคลานเข้าบ้าน บรรเทาสาธารณภัย', category: 'police', highlight: true },
  { number: '1155', name: 'ตำรวจท่องเที่ยว', desc: 'ขอความช่วยเหลือสำหรับนักท่องเที่ยว ชาวต่างชาติ', category: 'police' },
  { number: '1192', name: 'ศูนย์ปราบปรามโจรกรรมรถยนต์-รถจักรยานยนต์', desc: 'แจ้งรถหาย สกัดจับรถถูกขโมย', category: 'police' },
  { number: '1195', name: 'กองบังคับการปราบปราม (กองปราบ)', desc: 'คดีอาชญากรรมร้ายแรง มาเฟีย ผู้มีอิทธิพล', category: 'police' },
  { number: '1300', name: 'ศูนย์ช่วยเหลือสังคม พม.', desc: 'ความรุนแรงในครอบครัว เด็ก สตรี คนไร้ที่พึ่ง', category: 'police' },

  // กู้ชีพ - การแพทย์
  { number: '1669', name: 'สถาบันการแพทย์ฉุกเฉินแห่งชาติ (สพฉ.)', desc: 'กู้ชีพ เจ็บป่วยฉุกเฉินวิกฤต อุบัติเหตุรุนแรง ฟรี 24 ชม.', category: 'medical', highlight: true },
  { number: '1646', name: 'ศูนย์เอราวัณ (กทม.)', desc: 'หน่วยกู้ชีพและบริการการแพทย์ฉุกเฉิน กรุงเทพมหานคร', category: 'medical' },
  { number: '1554', name: 'หน่วยกู้ชีพวชิรพยาบาล', desc: 'บริการแพทย์ฉุกเฉินและรถพยาบาล', category: 'medical' },
  { number: '1323', name: 'สายด่วนสุขภาพจิต (กรมสุขภาพจิต)', desc: 'ปรึกษาปัญหาความเครียด ซึมเศร้า ทุกข์ใจ ฟรี 24 ชม.', category: 'medical', highlight: true },
  { number: '1422', name: 'กรมควบคุมโรค', desc: 'สอบถามข้อมูลโรคระบาด ไข้เลือดออก พิษสุนัขบ้า', category: 'medical' },
  { number: '1667', name: 'สถาบันโรคทรวงอก', desc: 'ปรึกษาอาการแน่นหน้าอก เจ็บหน้าอกเฉียบพลัน', category: 'medical' },
  { number: '1165', name: 'สายด่วนยาเสพติด (สถาบันบำบัดรักษาฯ)', desc: 'ปรึกษาและส่งตัวบำบัดผู้ติดยาเสพติด', category: 'medical' },

  // จราจร - อุบัติเหตุ - ทางด่วน
  { number: '1193', name: 'ตำรวจทางหลวง', desc: 'อุบัติเหตุ รถเสีย ขอความช่วยเหลือบนทางหลวงทั่วประเทศ', category: 'traffic', highlight: true },
  { number: '1543', name: 'สายด่วนการทางพิเศษฯ (EXAT ทางด่วน)', desc: 'กู้ภัย รถเสีย อุบัติเหตุบนทางด่วน', category: 'traffic', highlight: true },
  { number: '1586', name: 'สายด่วนกรมทางหลวง / มอเตอร์เวย์', desc: 'สอบถามเส้นทาง รถเสียบนมอเตอร์เวย์', category: 'traffic' },
  { number: '1197', name: 'ศูนย์ควบคุมและสั่งการจราจร (บก.จร.)', desc: 'สอบถามสภาพการจราจร กทม. และปริมณฑล', category: 'traffic' },
  { number: '1137', name: 'จส.100 (JS100)', desc: 'แจ้งข่าวสารจราจร ของหาย อุบัติเหตุ สัตว์เลี้ยงหาย', category: 'traffic' },
  { number: '1644', name: 'สวพ.FM91', desc: 'รายงานจราจร ขอความช่วยเหลือ ของหายได้คืน', category: 'traffic' },
  { number: '1677', name: 'ร่วมด้วยช่วยกัน', desc: 'ศูนย์ประสานงานช่วยเหลือประชาชนทุกประเภท', category: 'traffic' },
  { number: '1146', name: 'สายด่วนกรมทางหลวงชนบท', desc: 'แจ้งถนนชำรุด ไฟดับบนถนนชนบท', category: 'traffic' },

  // ธนาคาร - อาชญากรรมไซเบอร์ - อายัดบัญชี
  { number: '1441', name: 'ศูนย์ปราบปรามอาชญากรรมทางเทคโนโลยี (AOC)', desc: 'สายด่วนตำรวจไซเบอร์ ระงับและอายัดบัญชีมิจฉาชีพ 24 ชม.', category: 'bank', highlight: true },
  { number: '02-777-7777', name: 'ธนาคารไทยพาณิชย์ (SCB)', desc: 'อายัดบัตร / บัญชี / SCB EASY Call Center', category: 'bank' },
  { number: '02-888-8888', name: 'ธนาคารกสิกรไทย (KBANK)', desc: 'อายัดบัญชี / บัตรเครดิต K-Contact Center', category: 'bank' },
  { number: '02-111-1111', name: 'ธนาคารกรุงไทย (KTB)', desc: 'อายัดบัตร / แอปเป๋าตัง / Krungthai Next', category: 'bank' },
  { number: '1333', name: 'ธนาคารกรุงเทพ (BBL)', desc: 'Bualuang Phone อายัดบัตรและบัญชี', category: 'bank' },
  { number: '1428', name: 'ธนาคารทหารไทยธนชาต (ttb)', desc: 'ttb contact center แจ้งอายัดบัญชี', category: 'bank' },
  { number: '1115', name: 'ธนาคารออมสิน (GSB)', desc: 'GSB Contact Center อายัดบัตรและบัญชี', category: 'bank' },
  { number: '1572', name: 'ธนาคารกรุงศรีอยุธยา (BAY)', desc: 'Krungsri Call Center อายัดบัญชี', category: 'bank' },
  { number: '1240', name: 'TrueMoney Wallet', desc: 'ศูนย์บริการทรูมันนี่ แจ้งปัญหาและอายัดวอลเล็ท', category: 'bank' },

  // สาธารณูปโภค - ร้องเรียน
  { number: '1129', name: 'การไฟฟ้าส่วนภูมิภาค (PEA)', desc: 'แจ้งไฟดับ เสาไฟล้ม ไฟฟ้าขัดข้องต่างจังหวัด', category: 'utility' },
  { number: '1130', name: 'การไฟฟ้านครหลวง (MEA)', desc: 'แจ้งไฟดับ ไฟฟ้าขัดข้อง กทม. นนทบุรี สมุทรปราการ', category: 'utility' },
  { number: '1125', name: 'การประปานครหลวง (MWA)', desc: 'แจ้งท่อแตก น้ำไม่ไหล กทม. นนทบุรี สมุทรปราการ', category: 'utility' },
  { number: '1662', name: 'การประปาส่วนภูมิภาค (PWA)', desc: 'แจ้งท่อน้ำแตก น้ำประปาไม่ไหลต่างจังหวัด', category: 'utility' },
  { number: '1506', name: 'สำนักงานประกันสังคม', desc: 'สอบถามสิทธิประโยชน์ เงินชดเชย รักษาพยาบาล', category: 'utility' },
  { number: '1166', name: 'สำนักงานคุ้มครองผู้บริโภค (สคบ.)', desc: 'ร้องเรียนถูกเอาเปรียบ ซื้อสินค้าไม่เป็นธรรม', category: 'utility' },
  { number: '1672', name: 'การท่องเที่ยวแห่งประเทศไทย (ททท.)', desc: 'สอบถามข้อมูลแหล่งท่องเที่ยวทั่วไทย', category: 'utility' },

  // ขนส่ง - เดินทาง
  { number: '1348', name: 'องค์การขนส่งมวลชนกรุงเทพ (ขสมก.)', desc: 'สอบถามสายรถเมล์ ร้องเรียนการบริการรถโดยสาร', category: 'transport' },
  { number: '1690', name: 'การรถไฟแห่งประเทศไทย (รฟท.)', desc: 'สอบถามตารางเวลาเดินรถไฟ จองตั๋วรถไฟ', category: 'transport' },
  { number: '1584', name: 'ศูนย์คุ้มครองผู้โดยสารรถสาธารณะ (ขบ.)', desc: 'ร้องเรียนแท็กซี่ รถตู้ รถทัวร์ ขับเร็ว ปฏิเสธผู้โดยสาร', category: 'transport' },
  { number: '1199', name: 'กรมเจ้าท่า (สายด่วนทางน้ำ)', desc: 'แจ้งอุบัติเหตุทางน้ำ เรือล่ม เรือโดยสารไม่ปลอดภัย', category: 'transport' },
  { number: '1722', name: 'ท่าอากาศยานไทย (AOT)', desc: 'สอบถามเที่ยวบิน สุวรรณภูมิ ดอนเมือง ภูเก็ต เชียงใหม่', category: 'transport' }
]

const CATEGORIES = [
  { key: 'all', label: 'ทั้งหมด', icon: PhoneCall },
  { key: 'police', label: 'เหตุด่วนเหตุร้าย', icon: ShieldAlert },
  { key: 'medical', label: 'กู้ชีพ / การแพทย์', icon: HeartPulse },
  { key: 'traffic', label: 'จราจร / ทางด่วน', icon: Car },
  { key: 'bank', label: 'อายัดบัญชี / ธนาคาร', icon: Landmark },
  { key: 'utility', label: 'สาธารณูปโภค / ไฟฟ้า-ประปา', icon: Zap },
  { key: 'transport', label: 'ขนส่ง / เดินทาง', icon: Bus }
]

export default function EmergencyNumbersPage() {
  const [search, setSearch] = useState('')
  const [selectedCat, setSelectedCat] = useState<string>('all')
  const [copiedNum, setCopiedNum] = useState<string | null>(null)

  const filteredContacts = useMemo(() => {
    return EMERGENCY_CONTACTS.filter(contact => {
      const matchCat = selectedCat === 'all' || contact.category === selectedCat
      const q = search.toLowerCase().trim()
      const matchSearch = !q || 
        contact.number.toLowerCase().includes(q) || 
        contact.name.toLowerCase().includes(q) || 
        contact.desc.toLowerCase().includes(q)
      return matchCat && matchSearch
    })
  }, [search, selectedCat])

  const copyNumber = (num: string) => {
    navigator.clipboard.writeText(num.replace(/-/g, ''))
    setCopiedNum(num)
    toast.success(`คัดลอกเบอร์ ${num} แล้ว`)
    setTimeout(() => setCopiedNum(null), 2000)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-br from-rose-500 to-red-600 rounded-2xl text-white shadow-md">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">รวมเบอร์โทรฉุกเฉิน (Thailand Emergency Numbers)</h1>
            <p className="text-gray-600 dark:text-gray-400">
              สายด่วนเหตุด่วนเหตุร้าย กู้ชีพการแพทย์ แจ้งอุบัติเหตุ อายัดบัญชีมิจฉาชีพ และสาธารณูปโภค โทรออกได้ทันที 24 ชั่วโมง
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Notice Card */}
      <div className="bg-rose-50 dark:bg-rose-950/40 p-4 sm:p-5 rounded-2xl border border-rose-200 dark:border-rose-900/60 flex items-start gap-3.5">
        <AlertTriangle className="w-6 h-6 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-rose-900 dark:text-rose-200 leading-relaxed">
          <span className="font-bold">คำแนะนำเมื่อเกิดเหตุฉุกเฉิน:</span> ตั้งสติ บอกสถานที่เกิดเหตุให้ชัดเจน (จุดสังเกต/ถนน/ซอย) แจ้งจำนวนผู้บาดเจ็บ และอาการเบื้องต้น เพื่อให้เจ้าหน้าที่ส่งความช่วยเหลือได้เร็วที่สุด
        </div>
      </div>

      {/* Search & Filter */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="ค้นหาชื่อหน่วยงาน, บริการ หรือเบอร์โทรศัพท์ (เช่น 191, 1669, อายัด, รถเสีย, ไฟดับ)..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-rose-500 text-sm"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCat(cat.key)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  selectedCat === cat.key
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Contact Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredContacts.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-400 bg-white dark:bg-gray-900 rounded-3xl border dark:border-gray-800">
            ไม่พบเบอร์โทรศัพท์ที่ตรงกับการค้นหา
          </div>
        ) : (
          filteredContacts.map((contact, idx) => (
            <div
              key={idx}
              className={`bg-white dark:bg-gray-900 p-5 rounded-3xl shadow-sm border transition-all flex flex-col justify-between space-y-4 ${
                contact.highlight
                  ? 'border-rose-300 dark:border-rose-800 ring-1 ring-rose-200 dark:ring-rose-900/50'
                  : 'border-gray-200/80 dark:border-gray-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-2xl font-black text-rose-600 dark:text-rose-400 tracking-tight">
                    {contact.number}
                  </span>
                  {contact.highlight && (
                    <span className="text-[10px] font-extrabold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-800">
                      เบอร์สำคัญ
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-base leading-snug">
                  {contact.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                  {contact.desc}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                <a
                  href={`tel:${contact.number.replace(/-/g, '')}`}
                  className="py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" /> โทรออก
                </a>
                <button
                  onClick={() => copyNumber(contact.number)}
                  className="py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copiedNum === contact.number ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedNum === contact.number ? 'คัดลอกแล้ว' : 'คัดลอกเบอร์'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <AdSlot />
    </div>
  )
}
