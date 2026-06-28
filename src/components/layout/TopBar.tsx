'use client'
import { usePathname } from 'next/navigation'
import { Moon, Sun } from 'lucide-react'
import { useStore } from '@/lib/store'

const titles: Record<string, string> = {
  '/': 'Dashboard',
  '/timetable': 'Timetable',
  '/tasks': 'Tasks',
  '/attendance': 'Attendance',
  '/notices': 'Notices',
  '/notes': 'Notes',
  '/profile': 'Profile',
}

export default function TopBar() {
  const pathname = usePathname()
  const { darkMode, toggleDark, user } = useStore()
  const title = titles[pathname] || 'Smart Campus'
  const now = new Date()
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <header className="h-16 bg-white dark:bg-dark-800 border-b border-gray-100 dark:border-gray-700/50 flex items-center px-4 md:px-6 gap-4 shrink-0">
      {/* Spacer for mobile hamburger */}
      <div className="w-8 md:hidden shrink-0" />

      <div className="flex-1 min-w-0">
        <h1 className="font-display font-bold text-xl text-gray-900 dark:text-white">{title}</h1>
        {pathname === '/' && <p className="text-xs text-gray-400 hidden sm:block">{greeting}, {user.name.split(' ')[0]}!</p>}
      </div>

      <button onClick={toggleDark}
        className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-700 text-gray-500 dark:text-gray-400 transition-colors shrink-0">
        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <div className="w-8 h-8 bg-gradient-to-br from-brand-400 to-brand-600 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
        {user.avatar}
      </div>
    </header>
  )
}
