import { Shield, Lock, Eye, FileCheck, HelpCircle } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'นโยบายความเป็นส่วนตัว (Privacy Policy) - Thai WebTools',
  description: 'นโยบายความเป็นส่วนตัวตามมาตรฐาน พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA) ของ Thai WebTools',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="border-b dark:border-gray-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-full text-xs font-semibold mb-3 border border-blue-200 dark:border-blue-800">
          <Shield className="w-3.5 h-3.5" /> PDPA & GDPR Compliant
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
          นโยบายความเป็นส่วนตัว (Privacy Policy)
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          ปรับปรุงล่าสุด: {new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="space-y-6 text-sm sm:text-base leading-relaxed text-gray-700 dark:text-gray-300">
        <div className="p-5 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 space-y-2">
          <div className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
            <Lock className="w-5 h-5" /> นโยบายความเป็นส่วนตัวแบบ Client-Side 100%
          </div>
          <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-200">
            Thai WebTools ให้ความสำคัญสูงสุดกับความเป็นส่วนตัวของคุณ เครื่องมือเกือบทั้งหมดในระบบของเรา (เช่น การบีบอัดรูปภาพ, การแปลง PDF, การแกะตัวอักษร OCR, การแปลงรหัส Base64, การตัดต่อข้อความ) <strong>ทำงานและประมวลผลบนเบราว์เซอร์ในเครื่องของท่าน 100%</strong> ไฟล์และข้อมูลส่วนตัวของท่านจะไม่ถูกส่งไปจัดเก็บบนเซิร์ฟเวอร์ของเราอย่างเด็ดขาด
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">1. ข้อมูลที่เราเก็บรวบรวม</h2>
          <p>เมื่อท่านเข้าใช้งานเว็บไซต์ Thai WebTools เราอาจเก็บรวบรวมข้อมูลบางประเภทดังนี้:</p>
          <ul className="list-disc pl-6 space-y-1.5 text-sm">
            <li><strong>ข้อมูลการใช้งานอุปกรณ์ (Device & Browser Data):</strong> เช่น ประเภทเบราว์เซอร์, ระบบปฏิบัติการ, ความละเอียดหน้าจอ, ข้อมูล IP Address โดยข้อมูลเหล่านี้จะถูกเก็บเพื่อการแสดงผลที่ถูกต้องและเสถียรภาพของระบบ</li>
            <li><strong>ข้อมูลการตั้งค่าของผู้ใช้ (Local Preferences):</strong> เช่น การเลือกเปิดโหมดมืด (Dark Mode), รายการเครื่องมือโปรดที่ท่านติดดาวไว้ (Favorite Tools) ซึ่งข้อมูลนี้จะถูกเก็บไว้ใน <code>localStorage</code> ภายในเครื่องของท่านเท่านั้น</li>
            <li><strong>ข้อมูลทางสถิติ (Analytics Data):</strong> เราอาจใช้เครื่องมือวิเคราะห์ เช่น Google Analytics เพื่อเก็บสถิติเชิงภาพรวม (เช่น จำนวนครั้งที่มีการเข้าชมหน้าเว็บ) โดยไม่ระบุตัวตนของผู้ใช้งาน</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">2. วัตถุประสงค์ในการประมวลผลข้อมูล</h2>
          <p>เรานำข้อมูลที่ได้มาใช้ตามวัตถุประสงค์ดังต่อไปนี้:</p>
          <ul className="list-disc pl-6 space-y-1.5 text-sm">
            <li>เพื่อให้บริการเครื่องมือออนไลน์ทำงานได้อย่างถูกต้องและราบรื่น</li>
            <li>เพื่อจดจำการตั้งค่าการใช้งานของท่านเมื่อกลับมาใช้งานซ้ำ</li>
            <li>เพื่อวิเคราะห์และปรับปรุงประสิทธิภาพการทำงาน ตลอดจนพัฒนาเครื่องมือใหม่ๆ ให้ตรงกับความต้องการของผู้ใช้งาน</li>
            <li>เพื่อรักษาความปลอดภัยและป้องกันการโจมตีหรือการใช้งานระบบที่ผิดปกติ</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">3. การใช้คุกกี้ (Cookies)</h2>
          <p>
            เว็บไซต์ของเรามีการใช้คุกกี้เพื่อจดจำการตั้งค่าและเก็บสถิติการใช้งาน ท่านสามารถอ่านรายละเอียดประเภทของคุกกี้และวิธีตั้งค่าได้ที่{' '}
            <Link href="/cookie-policy" className="text-blue-600 dark:text-blue-400 underline font-medium">
              นโยบายการใช้คุกกี้ (Cookie Policy)
            </Link>
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">4. สิทธิของเจ้าของข้อมูลส่วนบุคคลตามกฎหมาย PDPA</h2>
          <p>ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA) ท่านมีสิทธิตามกฎหมายดังต่อไปนี้:</p>
          <ul className="list-disc pl-6 space-y-1.5 text-sm">
            <li>สิทธิในการเพิกถอนความยินยอมในการประมวลผลข้อมูลส่วนบุคคล</li>
            <li>สิทธิในการเข้าถึงและขอรับสำเนาข้อมูลส่วนบุคคลของท่าน</li>
            <li>สิทธิในการขอให้แก้ไขข้อมูลที่ไม่ถูกต้องหรือไม่สมบูรณ์</li>
            <li>สิทธิในการขอให้ลบ ทำลาย หรือทำให้ข้อมูลส่วนบุคคลไม่สามารถระบุตัวบุคคลได้</li>
            <li>สิทธิในการขอระงับการใช้ข้อมูลส่วนบุคคล</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">5. การติดต่อเรา</h2>
          <p>
            หากท่านมีข้อสงสัย ข้อเสนอแนะ หรือต้องการใช้สิทธิเกี่ยวกับข้อมูลส่วนบุคคลของท่าน สามารถติดต่อทีมงานผู้พัฒนาได้ที่หน้าระบบ{' '}
            <Link href="/contact" className="text-blue-600 dark:text-blue-400 underline font-medium">
              ติดต่อเรา (Contact Us)
            </Link>
          </p>
        </section>
      </div>
    </div>
  )
}
