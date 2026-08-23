import Link from 'next/link'
import { Wrench } from 'lucide-react'

export function Header() {
  return (
    <header className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-blue-600">
          <Wrench className="w-6 h-6" />
          <span>Thai WebTools</span>
        </Link>
        <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
          <Link href="/" className="hover:text-blue-600 transition-colors">หน้าแรก</Link>
          <Link href="/about" className="hover:text-blue-600 transition-colors">เกี่ยวกับเรา</Link>
          <Link href="/contact" className="hover:text-blue-600 transition-colors">ติดต่อเรา</Link>
        </nav>
      </div>
    </header>
  )
}
