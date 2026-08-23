'use client'
import { useState, useRef } from 'react'
import { AdSlot } from '@/components/AdSlot'
import { toPng } from 'html-to-image'
import { Download, Heart, MessageCircle, Repeat2, Share, Verified } from 'lucide-react'

export default function TweetGeneratorPage() {
  const [name, setName] = useState('Elon Musk')
  const [username, setUsername] = useState('elonmusk')
  const [verified, setVerified] = useState(true)
  const [text, setText] = useState('This is a fake tweet created for fun! 🚀\n\nWhat do you think?')
  const [time, setTime] = useState('10:45 AM · Aug 23, 2026')
  const [views, setViews] = useState('1.5M')
  const [retweets, setRetweets] = useState('15.2K')
  const [likes, setLikes] = useState('105K')
  const [avatar, setAvatar] = useState('https://ui-avatars.com/api/?name=Elon+Musk&background=0D8ABC&color=fff')
  
  const tweetRef = useRef<HTMLDivElement>(null)

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) setAvatar(e.target.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const exportImage = async () => {
    if (tweetRef.current) {
      try {
        const dataUrl = await toPng(tweetRef.current, { cacheBust: true, pixelRatio: 2 })
        const link = document.createElement('a')
        link.download = 'fake-tweet.png'
        link.href = dataUrl
        link.click()
      } catch (err) {
        alert('เกิดข้อผิดพลาดในการสร้างรูปภาพ')
      }
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Fake Tweet Generator</h1>
        <p className="text-gray-600 dark:text-gray-400">สร้างรูปจำลองโพสต์ทวีต (Twitter/X) ตลกๆ เพื่อเอาไปแกล้งเพื่อน</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border dark:border-gray-800 space-y-4">
          <h2 className="font-semibold text-lg border-b pb-2 dark:border-gray-800">ตั้งค่าทวีต</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">ชื่อ (Name)</label>
              <input type="text" className="w-full p-2 border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-lg outline-none" value={name} onChange={e=>setName(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">ยูสเซอร์ (@username)</label>
              <input type="text" className="w-full p-2 border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-lg outline-none" value={username} onChange={e=>setUsername(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">ข้อความ (Tweet Text)</label>
            <textarea className="w-full p-2 h-24 border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-lg outline-none resize-none" value={text} onChange={e=>setText(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">เวลา (Time/Date)</label>
              <input type="text" className="w-full p-2 border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-lg outline-none" value={time} onChange={e=>setTime(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">รูปโปรไฟล์ (Avatar)</label>
              <input type="file" accept="image/*" onChange={handleAvatarUpload} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 dark:file:bg-blue-900/30 dark:file:text-blue-400" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Retweets</label>
              <input type="text" className="w-full p-2 border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-lg outline-none" value={retweets} onChange={e=>setRetweets(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Likes</label>
              <input type="text" className="w-full p-2 border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-lg outline-none" value={likes} onChange={e=>setLikes(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Views</label>
              <input type="text" className="w-full p-2 border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-lg outline-none" value={views} onChange={e=>setViews(e.target.value)} />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer mt-2">
            <input type="checkbox" checked={verified} onChange={e=>setVerified(e.target.checked)} className="w-4 h-4" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">ติ๊กถูก Verified (ติ๊กฟ้า)</span>
          </label>
        </div>

        <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border dark:border-gray-800">
          {/* Tweet Preview */}
          <div 
            ref={tweetRef}
            className="w-full max-w-[500px] bg-white p-4 sm:p-5 rounded-2xl border border-gray-200"
            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
              <img src={avatar} alt="Avatar" className="w-12 h-12 rounded-full object-cover" crossOrigin="anonymous" />
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-gray-900 text-base">{name}</span>
                  {verified && <Verified className="w-4 h-4 text-[#1d9bf0] fill-current" />}
                </div>
                <div className="text-gray-500 text-sm">@{username}</div>
              </div>
            </div>
            
            {/* Body */}
            <div className="text-gray-900 text-[19px] whitespace-pre-wrap leading-tight mb-4 break-words">
              {text}
            </div>
            
            {/* Time */}
            <div className="text-gray-500 text-[15px] border-b border-gray-100 pb-3 mb-3">
              {time} <span className="px-1">·</span> <span className="font-medium text-gray-900">{views}</span> Views
            </div>
            
            {/* Stats */}
            <div className="flex gap-6 text-gray-500 text-sm border-b border-gray-100 pb-3 mb-3">
              <div className="flex items-center gap-2"><span className="font-bold text-gray-900">{retweets}</span> Retweets</div>
              <div className="flex items-center gap-2"><span className="font-bold text-gray-900">0</span> Quotes</div>
              <div className="flex items-center gap-2"><span className="font-bold text-gray-900">{likes}</span> Likes</div>
            </div>
            
            {/* Actions */}
            <div className="flex justify-around text-gray-500">
              <MessageCircle className="w-5 h-5" />
              <Repeat2 className="w-5 h-5" />
              <Heart className="w-5 h-5" />
              <Share className="w-5 h-5" />
            </div>
          </div>

          <button 
            onClick={exportImage}
            className="mt-8 flex items-center gap-2 px-8 py-3 bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-bold rounded-full shadow-md transition-colors"
          >
            <Download className="w-5 h-5" /> Export เป็นรูปภาพ
          </button>
        </div>
      </div>
      <AdSlot />
    </div>
  )
}
