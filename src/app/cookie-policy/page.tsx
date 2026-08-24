import { Cookie, Lock, Sliders, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'นโยบายการใช้คุกกี้ (Cookie Policy) - Thai WebTools',
  description: 'นโยบายและรายละเอียดการใช้งานคุกกี้ (Cookies) ของ Thai WebTools ตามกฎหมาย PDPA',
}

export default function CookiePolicyPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="border-b dark:border-gray-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-full text-xs font-semibold mb-3 border border-amber-200 dark:border-amber-800">
          <Cookie className="w-3.5 h-3.5" /> Cookie Policy
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
          นโยบายการใช้คุกกี้ (Cookie Policy)
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          ปรับปรุงล่าสุด: {new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="space-y-6 text-sm sm:text-base leading-relaxed text-gray-700 dark:text-gray-300">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">คุกกี้ (Cookies) คืออะไร?</h2>
          <p>
            คุกกี้ คือ ไฟล์ข้อความขนาดเล็กที่ถูกจัดเก็บบนอุปกรณ์คอมพิวเตอร์ หรือสมาร์ตโฟนของท่านเมื่อท่านเข้าชมเว็บไซต์ คุกกี้จะช่วยให้เว็บไซต์สามารถจดจำอุปกรณ์และการตั้งค่าของท่าน เพื่ออำนวยความสะดวกในการใช้งานอย่างต่อเนื่องในครั้งถัดไป
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">ประเภทของคุกกี้ที่เราใช้งาน</h2>
          <p>Thai WebTools มีการใช้งานคุกกี้แบ่งออกเป็น 3 ประเภทหลักตามมาตรฐาน PDPA:</p>

          <div className="space-y-4">
            {/* 1. Necessary */}
            <div className="p-5 bg-white dark:bg-gray-900 rounded-2xl border dark:border-gray-800 space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900 dark:text-white text-base">
                  1. คุกกี้ที่จำเป็นอย่างยิ่ง (Strictly Necessary Cookies)
                </span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full">
                  จำเป็นเสมอ
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                คุกกี้ประเภทนี้มีความจำเป็นต่อการทำงานพื้นฐานของเว็บไซต์ เช่น การเลือกโหมดแสดงผลมืด/สว่าง (Dark Theme), การจดจำเครื่องมือที่ท่านกดติดดาวไว้ (Favorite Tools), และการรักษาความปลอดภัยของระบบ เว็บไซต์ไม่สามารถทำงานได้อย่างสมบูรณ์หากไม่มีคุกกี้เหล่านี้
              </p>
            </div>

            {/* 2. Analytics */}
            <div className="p-5 bg-white dark:bg-gray-900 rounded-2xl border dark:border-gray-800 space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900 dark:text-white text-base">
                  2. คุกกี้เพื่อการวิเคราะห์และวัดผล (Analytics Cookies)
                </span>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-950 px-2.5 py-0.5 rounded-full">
                  เลือกได้
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                คุกกี้ประเภทนี้ช่วยให้เราสามารถวัดผลและทำความเข้าใจพฤติกรรมการใช้งานภาพรวมของผู้ใช้ (เช่น เครื่องมือไหนที่มีผู้ใช้งานมากที่สุด) ข้อมูลทั้งหมดจะถูกรวบรวมในรูปแบบที่ไม่สามารถระบุตัวตนได้ เพื่อนำไปปรับปรุงคุณภาพและการบริการให้ดียิ่งขึ้น
              </p>
            </div>

            {/* 3. Marketing */}
            <div className="p-5 bg-white dark:bg-gray-900 rounded-2xl border dark:border-gray-800 space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900 dark:text-white text-base">
                  3. คุกกี้เพื่อการโฆษณาและการตลาด (Marketing Cookies)
                </span>
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-950 px-2.5 py-0.5 rounded-full">
                  เลือกได้
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                คุกกี้ประเภทนี้ใช้เพื่อช่วยให้ผู้ให้บริการเครือข่ายโฆษณาภายนอก (เช่น Google AdSense) สามารถนำเสนอโฆษณาที่เหมาะสมและสอดคล้องกับความสนใจของท่าน
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">ท่านจะควบคุมหรือลบคุกกี้ได้อย่างไร?</h2>
          <p>
            ท่านสามารถเปลี่ยนแปลงหรือถอนความยินยอมในการใช้งานคุกกี้ได้ตลอดเวลา โดยสามารถเข้าไปที่การตั้งค่าในเบราว์เซอร์ของท่านเพื่อลบคุกกี้ หรือปิดกั้นการทำงานของคุกกี้บางประเภทได้
          </p>
          <p className="text-xs text-gray-500">
            *หมายเหตุ: หากท่านปิดการใช้งานคุกกี้ที่จำเป็นอย่างยิ่ง ฟังก์ชันบางอย่างของเว็บไซต์ เช่น การจำเครื่องมือโปรด อาจไม่สามารถทำงานได้อย่างถูกต้อง
          </p>
        </section>
      </div>
    </div>
  )
}
