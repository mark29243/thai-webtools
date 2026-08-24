import { FileText, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'ข้อกำหนดและเงื่อนไขการใช้งาน (Terms of Service) - Thai WebTools',
  description: 'ข้อกำหนดและเงื่อนไขการใช้งานเว็บไซต์ Thai WebTools',
}

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="border-b dark:border-gray-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-xs font-semibold mb-3 border dark:border-slate-700">
          <FileText className="w-3.5 h-3.5" /> Terms & Conditions
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
          ข้อกำหนดและเงื่อนไขการใช้งาน (Terms of Service)
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          ปรับปรุงล่าสุด: {new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="space-y-6 text-sm sm:text-base leading-relaxed text-gray-700 dark:text-gray-300">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">1. การยอมรับข้อกำหนด</h2>
          <p>
            การเข้าถึงและการใช้งานเว็บไซต์ Thai WebTools ถือว่าท่านได้รับทราบ เข้าใจ และตกลงที่จะปฏิบัติตามข้อกำหนดและเงื่อนไขการใช้งานเหล่านี้ทั้งหมด หากท่านไม่ยอมรับข้อกำหนดเหล่านี้ กรุณาระงับการใช้งานเว็บไซต์
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">2. การอนุญาตให้ใช้งาน (License to Use)</h2>
          <p>
            Thai WebTools ให้บริการเครื่องมือออนไลน์ฟรีแก่บุคคลทั่วไปและองค์กร เพื่อการใช้งานส่วนบุคคลหรือเชิงพาณิชย์โดยไม่มีค่าใช้จ่าย ท่านตกลงที่จะไม่ใช้งานเว็บไซต์นี้ในลักษณะที่เป็นการละเมิดกฎหมาย ละเมิดสิทธิ์ของผู้อื่น หรือสร้างความเสียหายต่อระบบการให้บริการ
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">3. ข้อจำกัดความรับผิดชอบ (Disclaimer)</h2>
          <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-900/50 text-xs sm:text-sm text-amber-900 dark:text-amber-200 space-y-1.5">
            <div className="font-bold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600" /> ข้อมูลและผลลัพธ์เพื่อการอ้างอิงเบื้องต้น
            </div>
            <p>
              เครื่องมือและผลการคำนวณทั้งหมดบนเว็บไซต์ (เช่น การตรวจสลากกินแบ่งรัฐบาล, การคำนวณราคาทองคำ, การคำนวณภาษี, การเทียบราคาน้ำมัน, การคำนวณเงินกู้ดอกเบี้ย) จัดทำขึ้นเพื่อให้ความสะดวกและเป็นข้อมูลอ้างอิงเบื้องต้นเท่านั้น ทางเว็บไซต์ไม่รับประกันความถูกต้องสมบูรณ์ 100% ในทุกกรณี และไม่รับผิดชอบต่อความเสียหายทางการเงินหรือการตัดสินใจใดๆ ที่เกิดขึ้นจากการนำข้อมูลไปใช้
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">4. ทรัพย์สินทางปัญญา</h2>
          <p>
            โค้ด รูปแบบหน้าตาเว็บไซต์ เครื่องหมายการค้า และเนื้อหาที่เป็นเอกลักษณ์ของ Thai WebTools เป็นทรัพย์สินทางปัญญาของผู้พัฒนา โดยห้ามทำซ้ำ ดัดแปลง หรือนำไปแจกจ่ายเพื่อแสวงหากำไรโดยไม่ได้รับอนุญาตเป็นลายลักษณ์อักษร
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">5. การเปลี่ยนแปลงข้อกำหนด</h2>
          <p>
            เราขอสงวนสิทธิ์ในการแก้ไข ปรับปรุง หรือเปลี่ยนแปลงข้อกำหนดและเงื่อนไขเหล่านี้ได้ตลอดเวลาตามความเหมาะสม โดยจะมีผลบังคับใช้ทันทีที่ประกาศลงบนเว็บไซต์
          </p>
        </section>
      </div>
    </div>
  )
}
