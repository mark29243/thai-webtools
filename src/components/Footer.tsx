'use client'

import Link from 'next/link'
import { Shield, Cookie, FileText, Heart, Sliders } from 'lucide-react'

export function Footer() {
  const openCookieSettings = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('open-cookie-settings'))
    }
  }

  return (
    <footer className="border-t dark:border-gray-800 bg-white dark:bg-gray-900/60 mt-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-sm">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <Link href="/" className="text-lg font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent inline-block">
              Thai WebTools
            </Link>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed">
              ศูนย์รวมเครื่องมือออนไลน์ฟรี 100% ใช้งานง่าย โหลดเร็ว ประมวลผลแบบ Client-Side ปลอดภัย ไม่เก็บข้อมูลและไฟล์ส่วนตัวของคุณบนเซิร์ฟเวอร์
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900 dark:text-gray-100">
              เมนูหลัก
            </h4>
            <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
              <li>
                <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  หน้าแรก (Home)
                </Link>
              </li>
              <li>
                <Link href="/directory" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  สารบัญเครื่องมือทั้งหมด
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  เกี่ยวกับเรา (About)
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  ติดต่อเรา (Contact)
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Privacy */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900 dark:text-gray-100">
              ความปลอดภัย & กฎหมาย
            </h4>
            <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
              <li>
                <Link href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-blue-500" /> นโยบายความเป็นส่วนตัว (PDPA)
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  <Cookie className="w-3.5 h-3.5 text-amber-500" /> นโยบายคุกกี้ (Cookie Policy)
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-gray-400" /> ข้อกำหนดการใช้งาน (Terms)
                </Link>
              </li>
              <li>
                <button
                  onClick={openCookieSettings}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5 text-left text-blue-600 dark:text-blue-400 font-medium"
                >
                  <Sliders className="w-3.5 h-3.5" /> ตั้งค่าคุกกี้ (Cookie Settings)
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} Thai WebTools. All rights reserved.</p>
          <p className="flex items-center gap-1">
            สร้างด้วย <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> เพื่อคนไทยทุกคน
          </p>
        </div>
      </div>
    </footer>
  )
}
