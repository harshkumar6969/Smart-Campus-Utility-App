'use client'
import { useStore } from '@/lib/store'
import { CheckSquare, Bell, TrendingUp, Clock, ChevronRight, Circle } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

export default function Dashboard() {
  const { tasks, timetable, notices, attendance, user } = useStore()

  const pendingTasks = tasks.filter(t => !t.done)
  const newNotices = notices.filter(n => n.isNew)
  const totalClasses = attendance.length
  const presentCount = attendance.filter(a => a.status === 'present' || a.status === 'late').length
  const attendancePct = totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 0

  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
  const todayName = days[new Date().getDay()]
  const todayClasses = timetable.filter(e => e.day === todayName).sort((a,b) => a.time.localeCompare(b.time))

  const priorityColor = { high:'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', medium:'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', low:'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <CheckSquare size={15} className="text-brand-500" /> Tasks Due
          </div>
          <div className="text-3xl font-display font-bold text-gray-900 dark:text-white">{pendingTasks.length}</div>
          <div className="text-xs text-gray-400">{tasks.filter(t=>t.done).length} completed</div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <TrendingUp size={15} className="text-brand-500" /> Attendance
          </div>
          <div className={`text-3xl font-display font-bold ${attendancePct >= 75 ? 'text-brand-600' : 'text-red-500'}`}>{attendancePct}%</div>
          <div className="text-xs text-gray-400">{presentCount}/{totalClasses} classes</div>
        </div>
        <div className="stat-card col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Bell size={15} className="text-brand-500" /> New Notices
          </div>
          <div className="text-3xl font-display font-bold text-gray-900 dark:text-white">{newNotices.length}</div>
          <div className="text-xs text-gray-400">{notices.length} total notices</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Today&apos;s Schedule</h2>
            <Link href="/timetable" className="text-xs text-brand-500 hover:text-brand-600 flex items-center gap-0.5">View all <ChevronRight size={13}/></Link>
          </div>
          {todayClasses.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">No classes today 🎉</div>
          ) : (
            <div className="space-y-3">
              {todayClasses.map(c => (
                <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-dark-700">
                  <div className="text-xs text-gray-400 w-16 shrink-0">{c.time}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{c.subject}</div>
                    <div className="text-xs text-gray-400">{c.room}</div>
                  </div>
                  <span className={`badge ${c.type === 'lab' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : c.type === 'tutorial' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' : 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400'}`}>
                    {c.type}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Tasks */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Upcoming Tasks</h2>
            <Link href="/tasks" className="text-xs text-brand-500 hover:text-brand-600 flex items-center gap-0.5">View all <ChevronRight size={13}/></Link>
          </div>
          {pendingTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">All caught up! ✨</div>
          ) : (
            <div className="space-y-3">
              {pendingTasks.slice(0,4).map(t => (
                <div key={t.id} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-dark-700">
                  <Circle size={16} className="text-gray-300 dark:text-gray-600 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{t.title}</div>
                    <div className="text-xs text-gray-400">{t.subject} · Due {t.dueDate}</div>
                  </div>
                  <span className={`badge ${priorityColor[t.priority]}`}>{t.priority}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Notices */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Recent Notices</h2>
          <Link href="/notices" className="text-xs text-brand-500 hover:text-brand-600 flex items-center gap-0.5">View all <ChevronRight size={13}/></Link>
        </div>
        <div className="space-y-3">
          {notices.slice(0,3).map(n => (
            <div key={n.id} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-dark-700">
              <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.isNew ? 'bg-brand-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 dark:text-white">{n.title}</div>
                <div className="text-xs text-gray-400 mt-0.5">{formatDistanceToNow(new Date(n.postedAt), {addSuffix:true})}</div>
              </div>
              {n.isNew && <span className="badge bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400">New</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
