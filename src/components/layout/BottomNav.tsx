'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Calendar, CheckSquare, Bell, BookOpen } from 'lucide-react'
import clsx from 'clsx'

const nav = [
  { href: '/', label: 'Home', icon: LayoutDashboard },
  { href: '/timetable', label: 'Timetable', icon: Calendar },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/notices', label: 'Notices', icon: Bell },
  { href: '/notes', label: 'Notes', icon: BookOpen },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-dark-800 border-t border-gray-100 dark:border-gray-700/50 px-2 pb-safe">
      <div className="flex items-center justify-around">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link key={href} href={href}
              className={clsx('flex flex-col items-center gap-1 py-3 px-3 rounded-xl transition-all min-w-0 flex-1',
                active ? 'text-brand-500' : 'text-gray-400 dark:text-gray-500')}>
              <Icon size={20} strokeWidth={active ? 2.5 : 2} />
              <span className={clsx('text-[10px] font-medium truncate', active ? 'text-brand-500' : 'text-gray-400 dark:text-gray-500')}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
