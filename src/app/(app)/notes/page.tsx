'use client'
import { useState } from 'react'
import { useStore, Note } from '@/lib/store'
import { Plus, Trash2, Pin, Edit3, X, Check } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import clsx from 'clsx'

const SUBJECTS = ['Data Structures','Web Development','DBMS','Software Engineering','General']

export default function NotesPage() {
  const { notes, addNote, updateNote, deleteNote } = useStore()
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string|null>(null)
  const [form, setForm] = useState({ title:'', content:'', subject:'General', pinned:false })
  const [editContent, setEditContent] = useState('')

  const sorted = [...notes].sort((a,b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  })

  const handleAdd = () => {
    if (!form.title.trim()) return
    addNote(form)
    setForm({title:'',content:'',subject:'General',pinned:false})
    setShowForm(false)
  }

  const handleSaveEdit = (id:string) => {
    updateNote(id, {content:editContent})
    setEditId(null)
  }

  const startEdit = (n: Note) => {
    setEditId(n.id)
    setEditContent(n.content)
  }

  const subjectColors: Record<string,string> = {
    'Data Structures':'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'Web Development':'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    'DBMS':'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    'Software Engineering':'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400',
    'General':'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="section-title">My Notes</h2>
          <p className="text-sm text-gray-400">{notes.length} notes · {notes.filter(n=>n.pinned).length} pinned</p>
        </div>
        <button onClick={()=>setShowForm(true)} className="btn-primary"><Plus size={16}/>New Note</button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">New Note</h3>
          <div className="space-y-3">
            <input className="input" value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} placeholder="Note title *" />
            <div className="grid grid-cols-2 gap-3">
              <select className="input" value={form.subject} onChange={e=>setForm(p=>({...p,subject:e.target.value}))}>
                {SUBJECTS.map(s=><option key={s}>{s}</option>)}
              </select>
              <label className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-gray-600 rounded-xl cursor-pointer">
                <input type="checkbox" checked={form.pinned} onChange={e=>setForm(p=>({...p,pinned:e.target.checked}))} className="accent-brand-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Pin this note</span>
              </label>
            </div>
            <textarea className="input min-h-[120px] resize-none font-mono text-sm" value={form.content} onChange={e=>setForm(p=>({...p,content:e.target.value}))} placeholder="Write your notes here..." />
          </div>
          <div className="flex gap-2 justify-end mt-4">
            <button onClick={()=>setShowForm(false)} className="btn-ghost">Cancel</button>
            <button onClick={handleAdd} className="btn-primary">Save Note</button>
          </div>
        </div>
      )}

      {/* Notes grid */}
      {sorted.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-4xl mb-3">📝</div>
          <div className="text-gray-500 dark:text-gray-400">No notes yet. Start writing!</div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {sorted.map(n => (
            <div key={n.id} className={clsx('card p-4 flex flex-col gap-3', n.pinned && 'ring-2 ring-brand-200 dark:ring-brand-700/50')}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {n.pinned && <Pin size={13} className="text-brand-500 shrink-0" />}
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{n.title}</h3>
                  </div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className={`badge ${subjectColors[n.subject] || subjectColors['General']}`}>{n.subject}</span>
                    <span className="text-xs text-gray-400">{formatDistanceToNow(new Date(n.updatedAt),{addSuffix:true})}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={()=>updateNote(n.id,{pinned:!n.pinned})} className={clsx('p-1.5 rounded-lg transition-colors', n.pinned ? 'text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20' : 'text-gray-300 hover:text-brand-400 hover:bg-gray-50 dark:hover:bg-dark-700')}>
                    <Pin size={14} />
                  </button>
                  <button onClick={()=>startEdit(n)} className="p-1.5 rounded-lg text-gray-300 hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                    <Edit3 size={14} />
                  </button>
                  <button onClick={()=>deleteNote(n.id)} className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              {editId === n.id ? (
                <div>
                  <textarea className="input min-h-[100px] resize-none font-mono text-xs" value={editContent} onChange={e=>setEditContent(e.target.value)} />
                  <div className="flex gap-2 mt-2 justify-end">
                    <button onClick={()=>setEditId(null)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-700"><X size={14}/></button>
                    <button onClick={()=>handleSaveEdit(n.id)} className="p-1.5 rounded-lg text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20"><Check size={14}/></button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-pre-wrap leading-relaxed flex-1 font-mono">{n.content || <span className="italic">Empty note</span>}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
