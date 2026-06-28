'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Calendar, CheckSquare, Users, Bell, BookOpen, User, GraduationCap, X, LogOut, Menu } from 'lucide-react'
import { useState } from 'react'
import { useStore } from '@/lib/store'
import clsx from 'clsx'

const nav = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/timetable', label: 'Timetable', icon: Calendar },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/attendance', label: 'Attendance', icon: Users },
  { href: '/notices', label: 'Notices', icon: Bell },
  { href: '/notes', label: 'Notes', icon: BookOpen },
  { href: '/profile', label: 'Profile', icon: User },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, notices, logout } = useStore()
  const newNotices = notices.filter(n => n.isNew).length
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.replace('/login')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100 dark:border-gray-700/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center shadow-sm">
            <GraduationCap size={18} className="text-white" />
          </div>
          <div>
            <div className="font-display font-bold text-sm text-gray-900 dark:text-white">Smart Campus</div>
            <div className="text-xs text-gray-400">{user.branch}</div>
          </div>
        </div>
        <button className="md:hidden text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1" onClick={() => setMobileOpen(false)}>
          <X size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link key={href} href={href} onClick={() => setMobileOpen(false)}
              className={clsx('nav-item', active ? 'nav-active' : 'nav-inactive')}>
              <Icon size={18} />
              <span>{label}</span>
              {label === 'Notices' && newNotices > 0 && (
                <span className={clsx('ml-auto text-xs px-1.5 py-0.5 rounded-full font-semibold',
                  active ? 'bg-white/20 text-white' : 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400')}>
                  {newNotices}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t border-gray-100 dark:border-gray-700/50 space-y-1">
        <Link href="/profile" onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
          <div className="w-8 h-8 bg-gradient-to-br from-brand-400 to-brand-600 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
            {user.avatar}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.name}</div>
            <div className="text-xs text-gray-400 truncate">{user.rollNo}</div>
          </div>
        </Link>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400 transition-colors text-sm font-medium">
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && <div className="md:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />}

      {/* Mobile hamburger in topbar — triggered via custom event or state lift; 
          instead we expose a menu button here fixed top-left on mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white dark:bg-dark-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 p-2 rounded-xl shadow-sm"
        onClick={() => setMobileOpen(true)}
      >
        <Menu size={20} />
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-dark-800 border-r border-gray-100 dark:border-gray-700/50 shrink-0 h-full">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      <aside className={clsx(
        'md:hidden fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-dark-800 shadow-2xl transition-transform duration-300 ease-out',
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <SidebarContent />
      </aside>
    </>
  )
}
