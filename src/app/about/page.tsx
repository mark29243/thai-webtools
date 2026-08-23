import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'เกี่ยวกับเรา - Thai WebTools',
  description: 'ทำความรู้จักกับ Thai WebTools ศูนย์รวมเครื่องมือออนไลน์สำหรับคนไทย',
}

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">เกี่ยวกับเรา (About Us)</h1>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border space-y-6 prose max-w-none text-gray-700">
        <p className="text-lg leading-relaxed">
          <strong>Thai WebTools</strong> ก่อตั้งขึ้นด้วยความตั้งใจที่จะเป็นศูนย์รวมเครื่องมือออนไลน์ฟรี ที่ใช้งานง่าย สะดวก และปลอดภัย สำหรับนักพัฒนา นักเรียน นักศึกษา และผู้ใช้งานทั่วไปในประเทศไทย
        </p>

        <h3 className="text-xl font-semibold text-gray-900 mt-8">ทำไมถึงสร้างเว็บไซต์นี้?</h3>
        <p>
          ในยุคดิจิทัล เรามักจะต้องใช้เครื่องมือเล็กๆ น้อยๆ ในชีวิตประจำวัน เช่น การสร้าง QR Code, การสุ่มรหัสผ่าน, การแปลงไฟล์ หรือแม้แต่การคำนวณภาษี บ่อยครั้งที่เราต้องเปิดหาหลายๆ เว็บไซต์ ซึ่งบางเว็บไซต์ก็เต็มไปด้วยโฆษณาที่กวนใจ หรือบางเว็บไซต์ก็เก็บข้อมูลของเรา
        </p>
        <p>
          เราจึงรวบรวมเครื่องมือทั้งหมดมาไว้ในที่เดียว ออกแบบให้หน้าตาสะอาดตา โหลดเร็ว และที่สำคัญคือ <strong>การประมวลผลส่วนใหญ่เกิดขึ้นบนเบราว์เซอร์ของคุณเอง (Client-side)</strong> ทำให้มั่นใจได้ว่าข้อมูลส่วนตัวของคุณจะไม่ถูกส่งกลับมาที่เซิร์ฟเวอร์ของเรา
        </p>

        <h3 className="text-xl font-semibold text-gray-900 mt-8">วิสัยทัศน์ของเรา</h3>
        <p>
          เรามุ่งมั่นที่จะพัฒนาและเพิ่มเครื่องมือใหม่ๆ อย่างต่อเนื่อง เพื่อตอบสนองความต้องการของผู้ใช้งาน และตั้งเป้าที่จะเป็นเว็บไซต์เครื่องมือออนไลน์อันดับหนึ่งในใจคนไทย
        </p>

        <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
          <p className="m-0 text-blue-800 font-medium">
            โปรเจกต์นี้พัฒนาด้วยความภาคภูมิใจ หากคุณชอบเว็บไซต์ของเรา สามารถสนับสนุนเราได้โดยการแชร์เว็บไซต์นี้ให้กับเพื่อนๆ ของคุณครับ!
          </p>
        </div>
      </div>
    </div>
  )
}
