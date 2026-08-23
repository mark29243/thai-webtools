import Link from 'next/link'
import { Wrench } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'

export function Header() {
  return (
    <header className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-blue-600 dark:text-blue-400">
          <Wrench className="w-6 h-6" />
          <span>Thai WebTools</span>
        </Link>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">เครื่องมือ (Native)</Link>
            <Link href="/directory" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">สารบัญ AI (Directory)</Link>
            <Link href="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">เกี่ยวกับเรา</Link>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
