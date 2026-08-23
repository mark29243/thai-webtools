import { AdSlot } from '@/components/AdSlot'
import { ExternalLink, Sparkles } from 'lucide-react'

// Mocking the structure of a directory database
const directoryLinks = [
  { name: 'ChatGPT', url: 'https://chat.openai.com', desc: 'AI Chatbot ยอดฮิต ทำได้ทุกอย่าง', category: 'AI Assistant' },
  { name: 'Claude', url: 'https://claude.ai', desc: 'AI ที่เก่งเรื่องการเขียนและวิเคราะห์', category: 'AI Assistant' },
  { name: 'Midjourney', url: 'https://midjourney.com', desc: 'สร้างรูปภาพศิลปะด้วย AI', category: 'Image Generation' },
  { name: 'Canva', url: 'https://canva.com', desc: 'ออกแบบกราฟิกออนไลน์ที่ง่ายที่สุด', category: 'Design' },
  { name: 'Figma', url: 'https://figma.com', desc: 'ออกแบบ UI/UX ระดับมืออาชีพ', category: 'Design' },
  { name: 'Vercel', url: 'https://vercel.com', desc: 'Deploy เว็บไซต์ฟรีและเร็วที่สุด', category: 'Developer' },
  { name: 'GitHub', url: 'https://github.com', desc: 'เก็บโค้ดและทำงานร่วมกับนักพัฒนา', category: 'Developer' },
  { name: 'Photopea', url: 'https://photopea.com', desc: 'Photoshop แบบรันบนเบราว์เซอร์', category: 'Design' },
  { name: 'Remove.bg', url: 'https://remove.bg', desc: 'ลบพื้นหลังรูปภาพอัตโนมัติ', category: 'Image Utility' },
  { name: 'TinyPNG', url: 'https://tinypng.com', desc: 'บีบอัดรูปภาพให้เล็กสุดๆ', category: 'Image Utility' },
]

export default function DirectoryPage() {
  return (
    <div className="space-y-12">
      <section className="text-center py-16 bg-gradient-to-b from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-950 rounded-3xl shadow-sm border dark:border-gray-800 px-4">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-2xl">
            <Sparkles className="w-10 h-10 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
        <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          AI & Tools Directory
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
          สารบัญรวบรวมสุดยอดโปรแกรม AI และเว็บแอปพลิเคชันที่มีประโยชน์ 
          คัดสรรมาให้คุณครบ จบในหน้าเดียว (อัปเดตตลอดเวลา)
        </p>
      </section>

      <AdSlot />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {directoryLinks.map((link, idx) => (
          <a 
            key={idx} 
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col bg-white dark:bg-gray-900 p-6 rounded-2xl border dark:border-gray-800 shadow-sm hover:shadow-md hover:border-purple-300 dark:hover:border-purple-700 transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-xs font-semibold text-gray-600 dark:text-gray-300 rounded-full">
                {link.category}
              </span>
              <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              {link.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {link.desc}
            </p>
            <div className="mt-4 pt-4 border-t dark:border-gray-800 text-sm font-medium text-purple-600 dark:text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
              เยี่ยมชมเว็บไซต์ →
            </div>
          </a>
        ))}
      </div>

      <div className="text-center p-8 border-2 border-dashed dark:border-gray-800 rounded-2xl">
        <p className="text-gray-500 dark:text-gray-400">
          ระบบกำลังดึงข้อมูลเว็บไซต์เพิ่มเติมอีกกว่า 1,500 รายการ...
        </p>
      </div>
    </div>
  )
}
