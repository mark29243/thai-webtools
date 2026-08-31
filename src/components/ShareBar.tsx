'use client'

import { useState } from 'react'
import { Share2, Copy, Check, MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'

interface ShareBarProps {
  title?: string
  description?: string
  url?: string
}

export function ShareBar({ title, description, url }: ShareBarProps) {
  const [copied, setCopied] = useState(false)

  const shareUrl = typeof window !== 'undefined' ? (url || window.location.href) : 'https://thai-webtools.vercel.app'
  const shareTitle = title || 'Thai WebTools - รวมเครื่องมือออนไลน์ฟรี 100%'

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    toast.success('คัดลอกลิงก์เรียบร้อยแล้ว!')
    setTimeout(() => setCopied(false), 2000)
  }

  const shareToLine = () => {
    const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}`
    window.open(lineUrl, '_blank', 'width=500,height=500')
  }

  const shareToFacebook = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    window.open(fbUrl, '_blank', 'width=600,height=400')
  }

  const shareToTwitter = () => {
    const twUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`
    window.open(twUrl, '_blank', 'width=600,height=400')
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-gradient-to-r from-blue-50/50 via-indigo-50/30 to-purple-50/50 dark:from-blue-950/20 dark:via-indigo-950/10 dark:to-purple-950/20 rounded-2xl border border-blue-100 dark:border-blue-900/40 text-xs">
      <div className="flex items-center gap-2 font-bold text-gray-700 dark:text-gray-200">
        <Share2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <span>แชร์เครื่องมือนี้ให้เพื่อน:</span>
      </div>

      <div className="flex items-center gap-2">
        {/* LINE */}
        <button
          onClick={shareToLine}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#06C755] hover:bg-[#05b04c] text-white rounded-xl font-bold transition-all shadow-sm active:scale-95"
          title="แชร์ลง LINE"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 5.91 2 10.74c0 4.3 3.55 7.9 8.35 8.6.33.07.78.22.89.51.1.26.07.67.03.93l-.15.93c-.05.28-.22 1.1 1 .6 1.22-.5 6.6-3.89 9-6.66C23.2 13.06 22 10.74 22 10.74 22 5.91 17.52 2 12 2z"/>
          </svg>
          <span>LINE</span>
        </button>

        {/* Facebook */}
        <button
          onClick={shareToFacebook}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-xl font-bold transition-all shadow-sm active:scale-95"
          title="แชร์ลง Facebook"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          <span>Facebook</span>
        </button>

        {/* X / Twitter */}
        <button
          onClick={shareToTwitter}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 hover:bg-black dark:bg-gray-800 dark:hover:bg-gray-700 text-white rounded-xl font-bold transition-all shadow-sm active:scale-95"
          title="แชร์ลง X (Twitter)"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          <span>X</span>
        </button>

        {/* Copy Link */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-xl font-bold transition-all shadow-sm active:scale-95"
          title="คัดลอกลิงก์"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอกลิงก์'}</span>
        </button>
      </div>
    </div>
  )
}
