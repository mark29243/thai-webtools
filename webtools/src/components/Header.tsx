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
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <Link href="/tools/qrcode" className="hover:text-blue-600">QR Code</Link>
          <Link href="/tools/password" className="hover:text-blue-600">Password</Link>
          <Link href="/tools/word-counter" className="hover:text-blue-600">Word Count</Link>
        </nav>
      </div>
    </header>
  )
}
