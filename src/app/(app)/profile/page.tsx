'use client'
import { useState } from 'react'
import { useStore } from '@/lib/store'
import { Save, Edit3, User, Mail, Hash, BookOpen, Layers, GraduationCap } from 'lucide-react'

export default function ProfilePage() {
  const { user, setUser, tasks, attendance } = useStore()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(user)

  const handleSave = () => {
    const avatar = form.name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2)
    setUser({...form, avatar})
    setEditing(false)
  }

  const totalClasses = attendance.length
  const present = attendance.filter(a=>a.status==='present'||a.status==='late').length
  const pct = totalClasses > 0 ? Math.round((present/totalClasses)*100) : 0
  const completed = tasks.filter(t=>t.done).length
  const pending = tasks.filter(t=>!t.done).length

  const fields = [
    { label:'Full Name', key:'name', icon: User, type:'text' },
    { label:'Email', key:'email', icon: Mail, type:'email' },
    { label:'Roll Number', key:'rollNo', icon: Hash, type:'text' },
    { label:'Branch', key:'branch', icon: BookOpen, type:'text' },
    { label:'Semester', key:'semester', icon: Layers, type:'text' },
  ] as const

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Avatar card */}
      <div className="card p-8 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-brand-400 to-brand-600 rounded-2xl flex items-center justify-center text-white text-2xl font-display font-bold mx-auto mb-4 shadow-lg">
          {user.avatar}
        </div>
        <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white">{user.name}</h2>
        <p className="text-gray-400 text-sm mt-1">{user.rollNo} · {user.branch}</p>
        <div className="flex items-center justify-center gap-1 mt-2 text-xs text-gray-400">
          <GraduationCap size={13}/>{user.semester} Semester
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100 dark:border-gray-700/50">
          <div>
            <div className={`text-2xl font-display font-bold ${pct >= 75 ? 'text-brand-600' : 'text-red-500'}`}>{pct}%</div>
            <div className="text-xs text-gray-400">Attendance</div>
          </div>
          <div>
            <div className="text-2xl font-display font-bold text-orange-500">{pending}</div>
            <div className="text-xs text-gray-400">Pending Tasks</div>
          </div>
          <div>
            <div className="text-2xl font-display font-bold text-brand-500">{completed}</div>
            <div className="text-xs text-gray-400">Tasks Done</div>
          </div>
        </div>
      </div>

      {/* Edit form */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="section-title">Personal Information</h3>
          {!editing ? (
            <button onClick={()=>{ setForm(user); setEditing(true) }} className="btn-ghost">
              <Edit3 size={15}/>Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={()=>setEditing(false)} className="btn-ghost">Cancel</button>
              <button onClick={handleSave} className="btn-primary"><Save size={15}/>Save</button>
            </div>
          )}
        </div>
        <div className="space-y-4">
          {fields.map(({label, key, icon: Icon, type}) => (
            <div key={key}>
              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                <Icon size={13}/>{label}
              </label>
              {editing ? (
                <input type={type} className="input" value={form[key]} onChange={e=>setForm(p=>({...p,[key]:e.target.value}))} />
              ) : (
                <div className="px-4 py-2.5 bg-gray-50 dark:bg-dark-700 rounded-xl text-sm text-gray-900 dark:text-white">{user[key]}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
