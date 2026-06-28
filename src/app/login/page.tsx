'use client'
import { useState } from 'react'
import { useStore } from '@/lib/store'
import { useRouter } from 'next/navigation'
import { GraduationCap, Mail, Lock, User, Hash, BookOpen, Layers, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react'
import clsx from 'clsx'

type Mode = 'login' | 'signup'

const BRANCHES = ['Computer Science','Information Technology','Electronics & Communication','Mechanical Engineering','Civil Engineering','Electrical Engineering']
const SEMESTERS = ['1st','2nd','3rd','4th','5th','6th','7th','8th']

export default function LoginPage() {
  const { login, signup, darkMode, toggleDark } = useStore()
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('login')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    email: '', password: '', name: '', rollNo: '', branch: 'Computer Science', semester: '4th'
  })

  const set = (k: string, v: string) => { setForm(p => ({...p, [k]: v})); setError('') }

  const handleSubmit = async () => {
    setError('')
    if (mode === 'login') {
      if (!form.email || !form.password) { setError('Please fill in all fields'); return }
      setLoading(true)
      await new Promise(r => setTimeout(r, 600))
      const res = login(form.email, form.password)
      setLoading(false)
      if (res.success) router.replace('/')
      else setError(res.error || 'Login failed')
    } else {
      if (!form.name || !form.email || !form.password || !form.rollNo) { setError('Please fill in all required fields'); return }
      if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
      setLoading(true)
      await new Promise(r => setTimeout(r, 600))
      const res = signup({ email: form.email, password: form.password, name: form.name, rollNo: form.rollNo, branch: form.branch, semester: form.semester })
      setLoading(false)
      if (res.success) router.replace('/')
      else setError(res.error || 'Signup failed')
    }
  }

  const fillDemo = () => { setForm(p => ({...p, email:'demo@campus.edu', password:'demo123'})); setMode('login'); setError('') }

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-dark-900 transition-colors duration-300">

      {/* Left panel — branding (hidden on mobile) */}
      <div className="hidden lg:flex flex-col justify-between w-[52%] bg-gradient-to-br from-brand-600 via-brand-500 to-brand-700 p-12 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/5 rounded-full" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-white/5 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/3 rounded-full" />
          {/* Grid dots */}
          <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="white"/></pattern></defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
            <GraduationCap size={22} className="text-white" />
          </div>
          <div>
            <div className="font-display font-bold text-white text-lg">Smart Campus</div>
            <div className="text-white/60 text-xs">Utility App</div>
          </div>
        </div>

        {/* Hero text */}
        <div className="relative space-y-6">
          <h1 className="font-display font-bold text-white text-5xl leading-tight">
            Organize.<br/>Manage.<br/>
            <span className="text-white/70">Simplify.</span>
          </h1>
          <p className="text-white/70 text-lg leading-relaxed max-w-sm">
            Your all-in-one campus companion — timetables, tasks, attendance, and more in one place.
          </p>
          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 pt-2">
            {['Timetable','Task Tracker','Attendance','Notice Board','Notes'].map(f => (
              <span key={f} className="bg-white/15 text-white text-sm px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/20">{f}</span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="relative grid grid-cols-3 gap-4">
          {[{val:'8+',label:'Features'},{val:'100%',label:'Offline'},{val:'Free',label:'Forever'}].map(s=>(
            <div key={s.label} className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/10">
              <div className="text-white font-display font-bold text-2xl">{s.val}</div>
              <div className="text-white/60 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-10 overflow-y-auto">

        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center">
            <GraduationCap size={20} className="text-white" />
          </div>
          <span className="font-display font-bold text-gray-900 dark:text-white text-lg">Smart Campus</span>
        </div>

        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="mb-8">
            <h2 className="font-display font-bold text-2xl text-gray-900 dark:text-white">
              {mode === 'login' ? 'Welcome back 👋' : 'Create account'}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              {mode === 'login' ? 'Sign in to access your campus dashboard' : 'Join Smart Campus today'}
            </p>
          </div>

          {/* Demo badge */}
          {mode === 'login' && (
            <button onClick={fillDemo} className="w-full mb-5 flex items-center gap-2.5 p-3 rounded-xl bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-700/50 hover:bg-brand-100 dark:hover:bg-brand-900/30 transition-colors group">
              <Sparkles size={16} className="text-brand-500 shrink-0" />
              <div className="flex-1 text-left">
                <div className="text-sm font-medium text-brand-700 dark:text-brand-400">Try Demo Account</div>
                <div className="text-xs text-brand-500/70">demo@campus.edu · demo123</div>
              </div>
              <ArrowRight size={14} className="text-brand-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}

          {/* Mode tabs */}
          <div className="flex bg-gray-100 dark:bg-dark-700 rounded-xl p-1 mb-6">
            {(['login','signup'] as Mode[]).map(m => (
              <button key={m} onClick={() => { setMode(m); setError('') }}
                className={clsx('flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all', mode === m ? 'bg-white dark:bg-dark-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300')}>
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* Form fields */}
          <div className="space-y-3">
            {mode === 'signup' && (
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 flex items-center gap-1.5"><User size={12}/>Full Name *</label>
                <input className="input" value={form.name} onChange={e=>set('name',e.target.value)} placeholder="e.g. Harsh Singh" />
              </div>
            )}
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 flex items-center gap-1.5"><Mail size={12}/>Email *</label>
              <input className="input" type="email" value={form.email} onChange={e=>set('email',e.target.value)} placeholder="you@college.edu" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 flex items-center gap-1.5"><Lock size={12}/>Password *</label>
              <div className="relative">
                <input className="input pr-10" type={showPass?'text':'password'} value={form.password} onChange={e=>set('password',e.target.value)} placeholder={mode==='signup'?'Min 6 characters':'Your password'} />
                <button type="button" onClick={()=>setShowPass(p=>!p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>
            {mode === 'signup' && (
              <>
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 flex items-center gap-1.5"><Hash size={12}/>Roll Number *</label>
                  <input className="input" value={form.rollNo} onChange={e=>set('rollNo',e.target.value)} placeholder="e.g. CS2024001" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 flex items-center gap-1.5"><BookOpen size={12}/>Branch</label>
                    <select className="input" value={form.branch} onChange={e=>set('branch',e.target.value)}>
                      {BRANCHES.map(b=><option key={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 flex items-center gap-1.5"><Layers size={12}/>Semester</label>
                    <select className="input" value={form.semester} onChange={e=>set('semester',e.target.value)}>
                      {SEMESTERS.map(s=><option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="mt-3 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 rounded-xl text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Submit */}
          <button onClick={handleSubmit} disabled={loading}
            className="w-full mt-5 bg-brand-500 hover:bg-brand-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm">
            {loading ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>{mode==='login'?'Signing in...':'Creating account...'}</>
            ) : (
              <>{mode==='login'?'Sign In':'Create Account'}<ArrowRight size={16}/></>
            )}
          </button>

          {/* Dark mode toggle */}
          <button onClick={toggleDark} className="w-full mt-4 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors py-2">
            {darkMode ? '☀️ Switch to Light Mode' : '🌙 Switch to Dark Mode'}
          </button>
        </div>
      </div>
    </div>
  )
}
