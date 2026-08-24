'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Cookie, Shield, Check, X, Sliders, Info, Lock } from 'lucide-react'

interface CookieConsentSettings {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  consentGiven: boolean
  timestamp: string
}

const DEFAULT_SETTINGS: CookieConsentSettings = {
  necessary: true,
  analytics: true,
  marketing: false,
  consentGiven: false,
  timestamp: ''
}

export function CookieBanner() {
  const [isOpen, setIsOpen] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [settings, setSettings] = useState<CookieConsentSettings>(DEFAULT_SETTINGS)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('thai_webtools_cookie_consent')
      if (saved) {
        setSettings(JSON.parse(saved))
        setIsOpen(false)
      } else {
        // Show banner after a slight delay for better UX
        const timer = setTimeout(() => setIsOpen(true), 800)
        return () => clearTimeout(timer)
      }
    } catch (e) {
      console.error(e)
    }

    // Listen to custom event to re-open cookie settings from footer
    const handleOpenSettings = () => {
      setShowSettingsModal(true)
    }
    window.addEventListener('open-cookie-settings', handleOpenSettings)
    return () => window.removeEventListener('open-cookie-settings', handleOpenSettings)
  }, [])

  const saveConsent = (newSettings: CookieConsentSettings) => {
    const updated = {
      ...newSettings,
      necessary: true,
      consentGiven: true,
      timestamp: new Date().toISOString()
    }
    setSettings(updated)
    localStorage.setItem('thai_webtools_cookie_consent', JSON.stringify(updated))
    setIsOpen(false)
    setShowSettingsModal(false)
  }

  const handleAcceptAll = () => {
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      consentGiven: true,
      timestamp: new Date().toISOString()
    })
  }

  const handleRejectNonEssential = () => {
    saveConsent({
      necessary: true,
      analytics: false,
      marketing: false,
      consentGiven: true,
      timestamp: new Date().toISOString()
    })
  }

  const handleSaveCustom = () => {
    saveConsent(settings)
  }

  if (!isOpen && !showSettingsModal) return null

  return (
    <>
      {/* Floating Bottom Cookie Banner */}
      {isOpen && !showSettingsModal && (
        <aside
          aria-label="การแจ้งเตือนคุกกี้"
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300"
        >
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md p-5 sm:p-6 rounded-3xl shadow-2xl border border-gray-200/80 dark:border-gray-800 space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-2xl flex-shrink-0">
                <Cookie className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-gray-900 dark:text-white text-base flex items-center gap-1.5">
                  เว็บไซต์นี้ใช้คุกกี้ (Cookies)
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  เราใช้คุกกี้เพื่อจดจำการตั้งค่า (เช่น โหมดมืด, เครื่องมือติดดาว) และพัฒนาประสบการณ์การใช้งานให้ดียิ่งขึ้นตามมาตรฐาน PDPA{' '}
                  <Link href="/privacy" className="text-blue-600 dark:text-blue-400 underline font-medium hover:text-blue-700">
                    อ่านนโยบายความเป็นส่วนตัว
                  </Link>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={handleAcceptAll}
                className="py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1"
              >
                <Check className="w-3.5 h-3.5" /> ยอมรับทั้งหมด
              </button>
              <button
                onClick={handleRejectNonEssential}
                className="py-2.5 px-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1"
              >
                ปฏิเสธ (ใช้เฉพาะจำเป็น)
              </button>
            </div>

            <div className="text-center pt-1">
              <button
                onClick={() => setShowSettingsModal(true)}
                className="text-xs text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 flex items-center justify-center gap-1 mx-auto underline font-medium"
              >
                <Sliders className="w-3 h-3" /> ตั้งค่าคุกกี้ตามใจคุณ
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Detailed Cookie Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-lg w-full shadow-2xl border dark:border-gray-800 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-xl">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">ศูนย์การตั้งค่าความเป็นส่วนตัว</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Cookie & Privacy Preferences (PDPA)</p>
                </div>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-sm">
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                เมื่อท่านเข้าชมเว็บไซต์ ข้อมูลอาจถูกจัดเก็บหรือดึงดูดผ่านเบราว์เซอร์ของท่านในรูปแบบของคุกกี้ ท่านสามารถเลือกจัดการความยินยอมสำหรับคุกกี้แต่ละประเภทได้ด้านล่างนี้:
              </p>

              {/* Necessary */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-200/80 dark:border-gray-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white">
                    <Lock className="w-4 h-4 text-emerald-500" />
                    <span>1. คุกกี้ที่จำเป็นอย่างยิ่ง (Strictly Necessary)</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full">
                    จำเป็นเสมอ
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  คุกกี้ประเภทนี้จำเป็นสำหรับการทำงานของเว็บไซต์ เช่น การสลับโหมดมืด (Dark Mode), การติดดาวเครื่องมือโปรด (Favorites), และความปลอดภัยของระบบ ไม่สามารถปิดการใช้งานได้
                </p>
              </div>

              {/* Analytics */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-200/80 dark:border-gray-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-gray-900 dark:text-white">
                    2. คุกกี้เพื่อการวิเคราะห์และสถิติ (Analytics)
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.analytics}
                      onChange={e => setSettings(prev => ({ ...prev, analytics: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  ช่วยให้เราเข้าใจพฤติกรรมการใช้งาน เช่น จำนวนผู้เข้าชม หน้าที่ได้รับความนิยม เพื่อนำข้อมูลที่ไม่ระบุตัวตนไปปรับปรุงและพัฒนาเครื่องมือให้ดียิ่งขึ้น
                </p>
              </div>

              {/* Marketing */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-200/80 dark:border-gray-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-gray-900 dark:text-white">
                    3. คุกกี้เพื่อการโฆษณาและการตลาด (Marketing)
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.marketing}
                      onChange={e => setSettings(prev => ({ ...prev, marketing: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  ช่วยให้ผู้ให้บริการโฆษณา (เช่น Google AdSense) สามารถนำเสนอโฆษณาที่สอดคล้องกับความสนใจของท่าน
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t dark:border-gray-800 bg-gray-50 dark:bg-gray-900/80 flex gap-3">
              <button
                onClick={handleAcceptAll}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                ยอมรับทั้งหมด
              </button>
              <button
                onClick={handleSaveCustom}
                className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl text-xs font-bold transition-all"
              >
                บันทึกการตั้งค่า
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
