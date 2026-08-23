'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Compass, Info } from 'lucide-react'

export function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    { name: 'เครื่องมือ', href: '/', icon: Home },
    { name: 'สารบัญ AI', href: '/directory', icon: Compass },
    { name: 'เกี่ยวกับเรา', href: '/about', icon: Info },
  ]

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t dark:border-gray-800 pb-safe">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'fill-blue-100 dark:fill-blue-900/50' : ''}`} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
