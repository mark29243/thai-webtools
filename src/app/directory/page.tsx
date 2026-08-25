'use client'

import { useState, useMemo } from 'react'
import { AdSlot } from '@/components/AdSlot'
import { ExternalLink, Sparkles, Search, Compass, Bot, Palette, Code2, PenTool, Music, Zap } from 'lucide-react'

interface DirectoryItem {
  name: string
  url: string
  desc: string
  category: string
  tag?: string
}

const DIRECTORY_LINKS: DirectoryItem[] = [
  // AI Assistants
  { name: 'ChatGPT', url: 'https://chat.openai.com', desc: 'AI Chatbot ยอดฮิตจาก OpenAI สำหรับตอบคำถาม เขียนบทความ และเขียนโค้ด', category: 'AI Assistant', tag: 'ยอดนิยม' },
  { name: 'Claude', url: 'https://claude.ai', desc: 'AI สุดฉลาดจาก Anthropic โดดเด่นด้านการวิเคราะห์ข้อมูลยาวๆ และเขียนโค้ด', category: 'AI Assistant', tag: 'แนะนำ' },
  { name: 'Google Gemini', url: 'https://gemini.google.com', desc: 'AI อัจฉริยะจาก Google เชื่อมต่อกับระบบนิเวศ Google Workspace', category: 'AI Assistant' },
  { name: 'Perplexity AI', url: 'https://perplexity.ai', desc: 'เสิร์ชเอนจินพลัง AI ค้นหาข้อมูลพร้อมอ้างอิงแหล่งที่มาแบบเรียลไทม์', category: 'AI Assistant', tag: 'ค้นหาแม่น' },
  { name: 'Microsoft Copilot', url: 'https://copilot.microsoft.com', desc: 'ผู้ช่วย AI จาก Microsoft สำหรับงานเอกสาร ค้นหา และสร้างภาพ', category: 'AI Assistant' },

  // Image & Design
  { name: 'Midjourney', url: 'https://midjourney.com', desc: 'สุดยอด AI เจนรูปภาพแนวศิลปะและสมจริงที่สวยที่สุดในโลก', category: 'Design & Image', tag: 'อันดับ 1' },
  { name: 'Canva', url: 'https://canva.com', desc: 'แพลตฟอร์มออกแบบกราฟิก สื่อโซเชียล และพรีเซนเทชันที่ง่ายที่สุด', category: 'Design & Image', tag: 'ยอดนิยม' },
  { name: 'Figma', url: 'https://figma.com', desc: 'เครื่องมือออกแบบ UI/UX สำหรับเว็บไซต์และแอปพลิเคชันระดับมืออาชีพ', category: 'Design & Image' },
  { name: 'Photopea', url: 'https://photopea.com', desc: 'Photoshop เวอร์ชันออนไลน์ ใช้งานได้ฟรีบนเบราว์เซอร์ไม่ต้องติดตั้ง', category: 'Design & Image' },
  { name: 'Remove.bg', url: 'https://remove.bg', desc: 'ลบพื้นหลังรูปภาพอัตโนมัติด้วย AI ภายใน 3 วินาที', category: 'Design & Image' },
  { name: 'Clipdrop', url: 'https://clipdrop.co', desc: 'รวมชุดเครื่องมือ AI แต่งภาพ ลบวัตถุ ปรับแสง และขยายภาพ', category: 'Design & Image' },

  // Developer & Coding
  { name: 'v0 by Vercel', url: 'https://v0.dev', desc: 'สร้าง UI React และ Tailwind CSS จากคำสั่ง Prompt ทันที', category: 'Developer', tag: 'มาแรง' },
  { name: 'Cursor', url: 'https://cursor.com', desc: 'Code Editor พลัง AI ที่ช่วยให้นักพัฒนาเขียนโค้ดได้เร็วกว่าเดิม 10 เท่า', category: 'Developer', tag: 'ยอดฮิต' },
  { name: 'GitHub Copilot', url: 'https://github.com/features/copilot', desc: 'AI Pair Programmer ช่วยแนะนำโค้ดและฟังก์ชันขณะพิมพ์', category: 'Developer' },
  { name: 'Vercel', url: 'https://vercel.com', desc: 'แพลตฟอร์ม Deploy เว็บไซต์และ Next.js ที่เร็วและสะดวกที่สุด', category: 'Developer' },
  { name: 'GitHub', url: 'https://github.com', desc: 'คลังเก็บซอร์สโค้ดและระบบจัดการเวอร์ชัน (Git) ระดับโลก', category: 'Developer' },

  // Productivity & Writing
  { name: 'Notion AI', url: 'https://notion.so', desc: 'สมุดบันทึกและจัดการงานออลอินวัน พร้อม AI ช่วยสรุปและเขียนบทความ', category: 'Productivity' },
  { name: 'Grammarly', url: 'https://grammarly.com', desc: 'ผู้ช่วยตรวจไวยากรณ์ภาษาอังกฤษและปรับระดับภาษาให้สละสลวย', category: 'Productivity' },
  { name: 'DeepL Translate', url: 'https://deepl.com', desc: 'ระบบแปลภาษาที่แปลได้เป็นธรรมชาติและแม่นยำที่สุด', category: 'Productivity', tag: 'แปลเป๊ะ' },

  // Audio & Video
  { name: 'Suno AI', url: 'https://suno.com', desc: 'แต่งเพลงและใส่เสียงร้องเพราะๆ ด้วย AI เพียงแค่พิมพ์เนื้อเพลง', category: 'Video & Audio', tag: 'เจ๋งมาก' },
  { name: 'ElevenLabs', url: 'https://elevenlabs.io', desc: 'แปลงข้อความเป็นเสียงพูดเสมือนจริง (Text to Speech) คุณภาพระดับสตูดิโอ', category: 'Video & Audio' },
  { name: 'Runway ML', url: 'https://runwayml.com', desc: 'สร้างและตัดต่อวิดีโอระดับภาพยนตร์ด้วย Generative AI (Gen-2 / Gen-3)', category: 'Video & Audio' },
]

const CATEGORIES = [
  { id: 'all', label: 'ทั้งหมด' },
  { id: 'AI Assistant', label: '🤖 AI Assistant' },
  { id: 'Design & Image', label: '🎨 ออกแบบ & แต่งรูป' },
  { id: 'Developer', label: '💻 นักพัฒนา & เขียนโค้ด' },
  { id: 'Productivity', label: '⚡ เอกสาร & การทำงาน' },
  { id: 'Video & Audio', label: '🎬 วิดีโอ & เพลง' },
]

export default function DirectoryPage() {
  const [search, setSearch] = useState('')
  const [selectedCat, setSelectedCat] = useState('all')

  const filteredLinks = useMemo(() => {
    return DIRECTORY_LINKS.filter(link => {
      const matchSearch = 
        link.name.toLowerCase().includes(search.toLowerCase()) ||
        link.desc.toLowerCase().includes(search.toLowerCase()) ||
        link.category.toLowerCase().includes(search.toLowerCase())

      const matchCat = selectedCat === 'all' || link.category === selectedCat

      return matchSearch && matchCat
    })
  }, [search, selectedCat])

  return (
    <div className="space-y-10 pb-12">
      {/* Banner */}
      <section className="text-center py-12 sm:py-16 bg-gradient-to-b from-purple-50/80 via-white to-transparent dark:from-purple-950/20 dark:via-gray-900 dark:to-transparent rounded-3xl border border-purple-100 dark:border-gray-800 px-4">
        <div className="flex justify-center mb-4">
          <div className="p-3.5 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-2xl shadow-lg shadow-purple-500/20">
            <Compass className="w-8 h-8" />
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black mb-3 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
          AI & Tools Directory
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          สารบัญรวบรวมสุดยอดโปรแกรม AI, แพลตฟอร์มออกแบบ และเครื่องมือระดับโลก คัดสรรมาให้คุณครบ จบในหน้าเดียว
        </p>

        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto mt-8">
          <div className="absolute inset-y-0 left-4 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="ค้นหา AI หรือเครื่องมือ (เช่น ChatGPT, Midjourney, Figma)..."
            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full shadow-md text-sm outline-none focus:ring-2 focus:ring-purple-500 transition-all text-gray-900 dark:text-white placeholder-gray-400"
          />
          {search && (
            <button 
              onClick={() => setSearch('')}
              className="absolute inset-y-0 right-4 pr-3 flex items-center text-xs text-gray-400 hover:text-gray-600"
            >
              ล้าง
            </button>
          )}
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-6 no-scrollbar justify-start sm:justify-center">
          {CATEGORIES.map(cat => {
            const isActive = selectedCat === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20 scale-105'
                    : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:border-purple-300 dark:hover:border-purple-700'
                }`}
              >
                {cat.label}
              </button>
            )
          })}
        </div>
      </section>

      <AdSlot />

      {/* Grid */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-lg text-gray-900 dark:text-white">
            เครื่องมือทั้งหมด ({filteredLinks.length})
          </h2>
        </div>

        {filteredLinks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredLinks.map((link, idx) => (
              <a 
                key={idx} 
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col bg-white dark:bg-gray-900 p-5 rounded-3xl border border-gray-200/80 dark:border-gray-800 shadow-sm hover:shadow-lg hover:border-purple-400 dark:hover:border-purple-600 transition-all h-full"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="px-2.5 py-1 bg-purple-50 dark:bg-purple-950/60 text-[11px] font-bold text-purple-600 dark:text-purple-300 rounded-full border border-purple-100 dark:border-purple-900/40">
                    {link.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {link.tag && (
                      <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 rounded-md text-[10px] font-bold">
                        {link.tag}
                      </span>
                    )}
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-purple-500 transition-colors" />
                  </div>
                </div>

                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1.5 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {link.name}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed flex-grow line-clamp-2">
                  {link.desc}
                </p>

                <div className="mt-4 pt-3 border-t dark:border-gray-800 text-xs font-semibold text-purple-600 dark:text-purple-400 flex items-center justify-between">
                  <span>เยี่ยมชมเว็บไซต์</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500 bg-white dark:bg-gray-900 rounded-3xl border dark:border-gray-800">
            <p className="text-lg">ไม่พบเครื่องมือ AI ที่ตรงกับคำค้นหา "{search}"</p>
          </div>
        )}
      </div>
    </div>
  )
}
