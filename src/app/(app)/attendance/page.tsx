'use client'
import { useState } from 'react'
import { useStore } from '@/lib/store'
import { Plus, TrendingUp, TrendingDown } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import clsx from 'clsx'

const SUBJECTS = ['Data Structures','Web Development','DBMS','Software Engineering']
const STATUSES = ['present','absent','late'] as const

export default function AttendancePage() {
  const { attendance, addAttendance } = useStore()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ subject: SUBJECTS[0], date: new Date().toISOString().split('T')[0], status: 'present' as typeof STATUSES[number] })

  // Per-subject stats
  const subjectStats = SUBJECTS.map(sub => {
    const records = attendance.filter(a => a.subject === sub)
    const present = records.filter(a => a.status === 'present' || a.status === 'late').length
    const total = records.length
    const pct = total > 0 ? Math.round((present / total) * 100) : 0
    return { sub, present, total, pct }
  })

  const overall = (() => {
    const total = attendance.length
    const present = attendance.filter(a => a.status === 'present' || a.status === 'late').length
    return { total, present, pct: total > 0 ? Math.round((present / total) * 100) : 0 }
  })()

  const pieData = [
    { name: 'Present', value: attendance.filter(a=>a.status==='present').length, color:'#17a07f' },
    { name: 'Late', value: attendance.filter(a=>a.status==='late').length, color:'#f59e0b' },
    { name: 'Absent', value: attendance.filter(a=>a.status==='absent').length, color:'#ef4444' },
  ].filter(d=>d.value>0)

  const handleAdd = () => {
    addAttendance(form)
    setShowForm(false)
  }

  const statusStyle = {
    present: 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400',
    absent: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    late: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  }

  const recent = [...attendance].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,10)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Overview */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card p-5 md:col-span-1">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Overall Attendance</h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={3} dataKey="value">
                  {pieData.map((e,i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip formatter={(v:number)=>[v,'Classes']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-2 flex-wrap mt-2">
            {pieData.map(d=>(
              <div key={d.name} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{background:d.color}} />
                <span className="text-xs text-gray-500 dark:text-gray-400">{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
          <div className={clsx('text-center mt-4 text-3xl font-display font-bold', overall.pct >= 75 ? 'text-brand-600' : 'text-red-500')}>{overall.pct}%</div>
          <div className="text-center text-xs text-gray-400">{overall.present}/{overall.total} classes attended</div>
          {overall.pct < 75 && <div className="mt-2 text-center text-xs text-red-500 flex items-center justify-center gap-1"><TrendingDown size={12}/>Below 75% threshold</div>}
          {overall.pct >= 75 && <div className="mt-2 text-center text-xs text-brand-500 flex items-center justify-center gap-1"><TrendingUp size={12}/>Above required threshold</div>}
        </div>

        {/* Subject-wise */}
        <div className="card p-5 md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title">Subject-wise Attendance</h3>
            <button onClick={() => setShowForm(true)} className="btn-primary"><Plus size={15}/>Mark</button>
          </div>
          <div className="space-y-4">
            {subjectStats.map(s => (
              <div key={s.sub}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{s.sub}</span>
                  <span className={clsx('text-sm font-bold', s.pct >= 75 ? 'text-brand-600' : 'text-red-500')}>{s.pct}%</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-dark-700 rounded-full overflow-hidden">
                  <div className={clsx('h-full rounded-full transition-all', s.pct >= 75 ? 'bg-brand-500' : 'bg-red-400')} style={{width:`${s.pct}%`}} />
                </div>
                <div className="text-xs text-gray-400 mt-0.5">{s.present}/{s.total} classes</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mark attendance form */}
      {showForm && (
        <div className="card p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Mark Attendance</h3>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Subject</label>
              <select className="input" value={form.subject} onChange={e=>setForm(p=>({...p,subject:e.target.value}))}>
                {SUBJECTS.map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Date</label>
              <input type="date" className="input" value={form.date} onChange={e=>setForm(p=>({...p,date:e.target.value}))} />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Status</label>
              <select className="input" value={form.status} onChange={e=>setForm(p=>({...p,status:e.target.value as typeof STATUSES[number]}))}>
                {STATUSES.map(s=><option key={s} className="capitalize">{s}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-2 justify-end mt-4">
            <button onClick={()=>setShowForm(false)} className="btn-ghost">Cancel</button>
            <button onClick={handleAdd} className="btn-primary">Mark</button>
          </div>
        </div>
      )}

      {/* Recent records */}
      <div className="card p-5">
        <h3 className="section-title mb-4">Recent Records</h3>
        <div className="space-y-2">
          {recent.map(r => (
            <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-dark-700">
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900 dark:text-white">{r.subject}</div>
                <div className="text-xs text-gray-400">{r.date}</div>
              </div>
              <span className={`badge ${statusStyle[r.status]} capitalize`}>{r.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
