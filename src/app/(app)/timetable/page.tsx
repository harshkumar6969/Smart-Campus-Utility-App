'use client'
import { useState } from 'react'
import { useStore } from '@/lib/store'
import { Plus, Trash2, Clock, MapPin } from 'lucide-react'
import clsx from 'clsx'

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
const TYPES = ['lecture','lab','tutorial'] as const

export default function TimetablePage() {
  const { timetable, addEntry, deleteEntry } = useStore()
  const [activeDay, setActiveDay] = useState('Monday')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ day:'Monday', time:'09:00 AM', subject:'', room:'', type:'lecture' as typeof TYPES[number] })

  const dayEntries = timetable.filter(e => e.day === activeDay).sort((a,b) => a.time.localeCompare(b.time))

  const typeStyle = {
    lecture: 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400',
    lab: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    tutorial: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  }

  const handleAdd = () => {
    if (!form.subject.trim() || !form.room.trim()) return
    addEntry(form)
    setForm({ day:'Monday', time:'09:00 AM', subject:'', room:'', type:'lecture' })
    setShowForm(false)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Day tabs */}
      <div className="card p-2 flex gap-1 overflow-x-auto">
        {DAYS.map(d => (
          <button key={d} onClick={() => setActiveDay(d)}
            className={clsx('px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all', activeDay === d ? 'bg-brand-500 text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700')}>
            {d}
          </button>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="section-title">{activeDay}</h2>
          <p className="text-sm text-gray-400">{dayEntries.length} class{dayEntries.length !== 1 ? 'es' : ''} scheduled</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <Plus size={16} /> Add Class
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="card p-5 border-brand-200 dark:border-brand-700/50">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Add New Class</h3>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Day</label>
              <select className="input" value={form.day} onChange={e => setForm(p=>({...p,day:e.target.value}))}>
                {DAYS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Time</label>
              <input className="input" value={form.time} onChange={e => setForm(p=>({...p,time:e.target.value}))} placeholder="09:00 AM" />
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Subject</label>
              <input className="input" value={form.subject} onChange={e => setForm(p=>({...p,subject:e.target.value}))} placeholder="e.g. Data Structures" />
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Room</label>
              <input className="input" value={form.room} onChange={e => setForm(p=>({...p,room:e.target.value}))} placeholder="e.g. Room 201" />
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Type</label>
              <select className="input" value={form.type} onChange={e => setForm(p=>({...p,type:e.target.value as typeof TYPES[number]}))}>
                {TYPES.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
            <button onClick={handleAdd} className="btn-primary">Add Class</button>
          </div>
        </div>
      )}

      {/* Entries */}
      {dayEntries.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-4xl mb-3">📅</div>
          <div className="text-gray-500 dark:text-gray-400">No classes on {activeDay}</div>
          <button onClick={() => setShowForm(true)} className="mt-4 text-brand-500 text-sm hover:underline">Add a class</button>
        </div>
      ) : (
        <div className="space-y-3">
          {dayEntries.map(e => (
            <div key={e.id} className="card p-4 flex items-center gap-4">
              <div className="flex-shrink-0 text-center w-20">
                <div className="text-xs text-gray-400 flex items-center gap-1 justify-center">
                  <Clock size={12}/> {e.time}
                </div>
              </div>
              <div className="w-px h-8 bg-brand-200 dark:bg-brand-700/50 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 dark:text-white">{e.subject}</div>
                <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                  <MapPin size={12}/> {e.room}
                </div>
              </div>
              <span className={`badge ${typeStyle[e.type]}`}>{e.type}</span>
              <button onClick={() => deleteEntry(e.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-300 hover:text-red-500 transition-colors">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
