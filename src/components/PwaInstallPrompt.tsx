'use client'

import { useState, useEffect } from 'react'
import { Download, X, Smartphone, Sparkles } from 'lucide-react'

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    // Check if user dismissed recently
    const dismissed = localStorage.getItem('pwa_prompt_dismissed')
    if (dismissed && Date.now() - parseInt(dismissed) < 7 * 24 * 60 * 60 * 1000) {
      return // Don't show within 7 days
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setShowPrompt(false)
    }
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('pwa_prompt_dismissed', Date.now().toString())
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 left-4 sm:left-auto sm:right-6 sm:max-w-sm z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-white dark:bg-gray-900 border-2 border-blue-500/80 rounded-3xl p-4 shadow-2xl shadow-blue-500/20 flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl text-white shadow-md">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-black text-sm text-gray-900 dark:text-white">
                <span>ติดตั้ง Thai WebTools</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                เปิดใช้งานได้เร็วทันทีจากหน้าจอมือถือ/คอม
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full"
            aria-label="ปิด"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleInstall}
            className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95"
          >
            <Download className="w-4 h-4" /> ติดตั้งแอปฟรี
          </button>
          <button
            onClick={handleDismiss}
            className="px-3 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl font-medium text-xs transition-colors"
          >
            ไว้ทีหลัง
          </button>
        </div>
      </div>
    </div>
  )
}
