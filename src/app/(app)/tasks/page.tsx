'use client'
import { useState } from 'react'
import { useStore, Task } from '@/lib/store'
import { Plus, Trash2, CheckCircle2, Circle, Flag } from 'lucide-react'
import clsx from 'clsx'

const PRIORITIES = ['high','medium','low'] as const
const FILTERS = ['all','pending','completed'] as const

export default function TasksPage() {
  const { tasks, addTask, toggleTask, deleteTask } = useStore()
  const [filter, setFilter] = useState<typeof FILTERS[number]>('all')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title:'', subject:'', dueDate:'', priority:'medium' as typeof PRIORITIES[number], done:false })

  const filtered = tasks.filter(t => filter === 'all' ? true : filter === 'pending' ? !t.done : t.done)
    .sort((a,b) => {
      if (a.done !== b.done) return a.done ? 1 : -1
      const p = {high:0,medium:1,low:2}
      return p[a.priority] - p[b.priority]
    })

  const handleAdd = () => {
    if (!form.title.trim()) return
    addTask(form)
    setForm({ title:'', subject:'', dueDate:'', priority:'medium', done:false })
    setShowForm(false)
  }

  const priorityColor = { high:'text-red-500', medium:'text-yellow-500', low:'text-blue-400' }
  const priorityBadge = { high:'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', medium:'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', low:'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' }

  const pending = tasks.filter(t=>!t.done).length
  const done = tasks.filter(t=>t.done).length

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[{label:'Total',val:tasks.length,color:'text-gray-900 dark:text-white'},{label:'Pending',val:pending,color:'text-orange-500'},{label:'Done',val:done,color:'text-brand-500'}].map(s=>(
          <div key={s.label} className="card p-4 text-center">
            <div className={`text-2xl font-display font-bold ${s.color}`}>{s.val}</div>
            <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="card p-1 flex gap-1">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={clsx('px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all', filter === f ? 'bg-brand-500 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-700')}>
              {f}
            </button>
          ))}
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <Plus size={16} /> Add Task
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="card p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">New Task</h3>
          <div className="space-y-3">
            <input className="input" value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} placeholder="Task title *" />
            <div className="grid grid-cols-2 gap-3">
              <input className="input" value={form.subject} onChange={e=>setForm(p=>({...p,subject:e.target.value}))} placeholder="Subject" />
              <input className="input" type="date" value={form.dueDate} onChange={e=>setForm(p=>({...p,dueDate:e.target.value}))} />
            </div>
            <select className="input" value={form.priority} onChange={e=>setForm(p=>({...p,priority:e.target.value as typeof PRIORITIES[number]}))}>
              {PRIORITIES.map(p=><option key={p} value={p} className="capitalize">{p} priority</option>)}
            </select>
          </div>
          <div className="flex gap-2 justify-end mt-4">
            <button onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
            <button onClick={handleAdd} className="btn-primary">Add Task</button>
          </div>
        </div>
      )}

      {/* Task list */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-4xl mb-3">✅</div>
          <div className="text-gray-500 dark:text-gray-400">No {filter !== 'all' ? filter : ''} tasks</div>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(t => (
            <div key={t.id} className={clsx('card p-4 flex items-center gap-3 transition-opacity', t.done && 'opacity-60')}>
              <button onClick={() => toggleTask(t.id)} className="shrink-0">
                {t.done ? <CheckCircle2 size={20} className="text-brand-500" /> : <Circle size={20} className="text-gray-300 dark:text-gray-600 hover:text-brand-400 transition-colors" />}
              </button>
              <div className="flex-1 min-w-0">
                <div className={clsx('text-sm font-medium', t.done ? 'line-through text-gray-400' : 'text-gray-900 dark:text-white')}>{t.title}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  {t.subject && <span className="text-xs text-gray-400">{t.subject}</span>}
                  {t.subject && t.dueDate && <span className="text-gray-300">·</span>}
                  {t.dueDate && <span className="text-xs text-gray-400">Due {t.dueDate}</span>}
                </div>
              </div>
              <Flag size={14} className={`shrink-0 ${priorityColor[t.priority]}`} />
              <span className={`badge ${priorityBadge[t.priority]}`}>{t.priority}</span>
              <button onClick={() => deleteTask(t.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-300 hover:text-red-500 transition-colors">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
