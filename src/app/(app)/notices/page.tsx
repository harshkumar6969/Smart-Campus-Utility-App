'use client'
import { useState } from 'react'
import { useStore } from '@/lib/store'
import { Plus, Bell, BookOpen, Star, Info } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import clsx from 'clsx'

const CATEGORIES = ['academic','event','general'] as const

export default function NoticesPage() {
  const { notices, addNotice, markNoticeRead } = useStore()
  const [filter, setFilter] = useState<'all'|typeof CATEGORIES[number]>('all')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title:'', body:'', category:'general' as typeof CATEGORIES[number] })

  const filtered = notices.filter(n => filter === 'all' || n.category === filter)
    .sort((a,b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime())

  const handleAdd = () => {
    if (!form.title.trim()) return
    addNotice(form)
    setForm({ title:'', body:'', category:'general' })
    setShowForm(false)
  }

  const catIcon = { academic: BookOpen, event: Star, general: Info }
  const catStyle = {
    academic: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    event: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    general: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {label:'All Notices',val:notices.length,color:'text-gray-900 dark:text-white'},
          {label:'New',val:notices.filter(n=>n.isNew).length,color:'text-brand-500'},
          {label:'Academic',val:notices.filter(n=>n.category==='academic').length,color:'text-blue-500'},
        ].map(s=>(
          <div key={s.label} className="card p-4 text-center">
            <div className={`text-2xl font-display font-bold ${s.color}`}>{s.val}</div>
            <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="card p-1 flex gap-1">
          {(['all',...CATEGORIES] as const).map(f => (
            <button key={f} onClick={()=>setFilter(f)}
              className={clsx('px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all', filter === f ? 'bg-brand-500 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-700')}>
              {f}
            </button>
          ))}
        </div>
        <button onClick={()=>setShowForm(true)} className="btn-primary"><Plus size={16}/>Post Notice</button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Post New Notice</h3>
          <div className="space-y-3">
            <input className="input" value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} placeholder="Notice title *" />
            <textarea className="input min-h-[80px] resize-none" value={form.body} onChange={e=>setForm(p=>({...p,body:e.target.value}))} placeholder="Notice details..." />
            <select className="input" value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value as typeof CATEGORIES[number]}))}>
              {CATEGORIES.map(c=><option key={c} value={c} className="capitalize">{c}</option>)}
            </select>
          </div>
          <div className="flex gap-2 justify-end mt-4">
            <button onClick={()=>setShowForm(false)} className="btn-ghost">Cancel</button>
            <button onClick={handleAdd} className="btn-primary">Post</button>
          </div>
        </div>
      )}

      {/* Notices list */}
      <div className="space-y-3">
        {filtered.map(n => {
          const Icon = catIcon[n.category]
          return (
            <div key={n.id} onClick={()=>markNoticeRead(n.id)}
              className={clsx('card p-5 cursor-pointer transition-all hover:shadow-md', n.isNew && 'border-brand-200 dark:border-brand-700/50')}>
              <div className="flex items-start gap-3">
                <div className={clsx('p-2 rounded-xl shrink-0', catStyle[n.category])}>
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white leading-tight">{n.title}</h3>
                    <div className="flex items-center gap-2 shrink-0">
                      {n.isNew && <span className="badge bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400">New</span>}
                      <span className={`badge ${catStyle[n.category]} capitalize`}>{n.category}</span>
                    </div>
                  </div>
                  {n.body && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">{n.body}</p>}
                  <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                    <Bell size={11}/>{formatDistanceToNow(new Date(n.postedAt),{addSuffix:true})}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && (
          <div className="card p-12 text-center">
            <div className="text-4xl mb-3">📢</div>
            <div className="text-gray-500 dark:text-gray-400">No notices in this category</div>
          </div>
        )}
      </div>
    </div>
  )
}
