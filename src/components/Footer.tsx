export function Footer() {
  return (
    <footer className="border-t bg-gray-50 mt-12">
      <div className="container mx-auto px-4 py-8 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} Thai WebTools. All rights reserved.</p>
        <p className="mt-2 text-xs">
          เครื่องมือออนไลน์ฟรี สำหรับนักพัฒนาและผู้ใช้งานทั่วไป
        </p>
      </div>
    </footer>
  )
}
