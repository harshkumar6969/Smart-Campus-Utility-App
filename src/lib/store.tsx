'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'

export type Task = {
  id: string; title: string; subject: string; dueDate: string; priority: 'high'|'medium'|'low'; done: boolean; createdAt: string;
}
export type TimetableEntry = {
  id: string; day: string; time: string; subject: string; room: string; type: 'lecture'|'lab'|'tutorial';
}
export type AttendanceRecord = {
  id: string; subject: string; date: string; status: 'present'|'absent'|'late';
}
export type Notice = {
  id: string; title: string; body: string; category: 'academic'|'event'|'general'; postedAt: string; isNew: boolean;
}
export type Note = {
  id: string; title: string; content: string; subject: string; updatedAt: string; pinned: boolean;
}
export type User = {
  name: string; email: string; rollNo: string; branch: string; semester: string; avatar: string;
}
export type AuthAccount = {
  email: string; password: string; name: string; rollNo: string; branch: string; semester: string;
}

type Store = {
  user: User; setUser: (u: User) => void;
  isLoggedIn: boolean; login: (email:string, password:string) => { success:boolean; error?:string };
  signup: (data: AuthAccount) => { success:boolean; error?:string };
  logout: () => void;
  tasks: Task[]; addTask: (t: Omit<Task,'id'|'createdAt'>) => void; toggleTask: (id:string) => void; deleteTask: (id:string) => void;
  timetable: TimetableEntry[]; addEntry: (e: Omit<TimetableEntry,'id'>) => void; deleteEntry: (id:string) => void;
  attendance: AttendanceRecord[]; addAttendance: (a: Omit<AttendanceRecord,'id'>) => void;
  notices: Notice[]; addNotice: (n: Omit<Notice,'id'|'postedAt'|'isNew'>) => void; markNoticeRead: (id:string) => void;
  notes: Note[]; addNote: (n: Omit<Note,'id'|'updatedAt'>) => void; updateNote: (id:string, n: Partial<Note>) => void; deleteNote: (id:string) => void;
  darkMode: boolean; toggleDark: () => void;
}

const defaultUser: User = { name:'Harsh Singh', email:'harsh@college.edu', rollNo:'CS2024001', branch:'Computer Science', semester:'4th', avatar:'HS' }

const defaultTimetable: TimetableEntry[] = [
  {id:'t1',day:'Monday',time:'09:00 AM',subject:'Data Structures',room:'Room 201',type:'lecture'},
  {id:'t2',day:'Monday',time:'11:00 AM',subject:'Web Development',room:'Lab 3',type:'lab'},
  {id:'t3',day:'Monday',time:'01:00 PM',subject:'DBMS',room:'Room 105',type:'lecture'},
  {id:'t4',day:'Monday',time:'03:00 PM',subject:'Software Engineering',room:'Room 202',type:'lecture'},
  {id:'t5',day:'Tuesday',time:'09:00 AM',subject:'DBMS',room:'Room 105',type:'lecture'},
  {id:'t6',day:'Tuesday',time:'11:00 AM',subject:'Data Structures',room:'Lab 1',type:'lab'},
  {id:'t7',day:'Wednesday',time:'09:00 AM',subject:'Web Development',room:'Room 301',type:'lecture'},
  {id:'t8',day:'Wednesday',time:'02:00 PM',subject:'Software Engineering',room:'Room 202',type:'tutorial'},
  {id:'t9',day:'Thursday',time:'10:00 AM',subject:'DBMS',room:'Lab 2',type:'lab'},
  {id:'t10',day:'Friday',time:'09:00 AM',subject:'Data Structures',room:'Room 201',type:'lecture'},
]
const defaultTasks: Task[] = [
  {id:'tk1',title:'DBMS Assignment',subject:'DBMS',dueDate:'2024-12-20',priority:'high',done:false,createdAt:'2024-12-15'},
  {id:'tk2',title:'Web Project Submission',subject:'Web Development',dueDate:'2024-12-22',priority:'high',done:false,createdAt:'2024-12-14'},
  {id:'tk3',title:'Lab Record',subject:'Data Structures',dueDate:'2024-12-25',priority:'medium',done:false,createdAt:'2024-12-13'},
  {id:'tk4',title:'Read Chapter 5',subject:'Software Engineering',dueDate:'2024-12-19',priority:'low',done:true,createdAt:'2024-12-10'},
]
const defaultAttendance: AttendanceRecord[] = [
  {id:'a1',subject:'Data Structures',date:'2024-12-16',status:'present'},
  {id:'a2',subject:'Web Development',date:'2024-12-16',status:'present'},
  {id:'a3',subject:'DBMS',date:'2024-12-16',status:'absent'},
  {id:'a4',subject:'Software Engineering',date:'2024-12-16',status:'present'},
  {id:'a5',subject:'Data Structures',date:'2024-12-15',status:'present'},
  {id:'a6',subject:'Web Development',date:'2024-12-15',status:'late'},
  {id:'a7',subject:'DBMS',date:'2024-12-15',status:'present'},
  {id:'a8',subject:'Software Engineering',date:'2024-12-14',status:'present'},
  {id:'a9',subject:'Data Structures',date:'2024-12-14',status:'present'},
  {id:'a10',subject:'DBMS',date:'2024-12-13',status:'present'},
  {id:'a11',subject:'Web Development',date:'2024-12-13',status:'absent'},
  {id:'a12',subject:'Software Engineering',date:'2024-12-12',status:'present'},
]
const defaultNotices: Notice[] = [
  {id:'n1',title:'Internal Hackathon Registration Open',body:'The annual internal hackathon registrations are now open. Register your team of 2-4 members by December 25. Cash prizes worth ₹50,000 to be won.',category:'event',postedAt:'2024-12-16T10:00:00',isNew:true},
  {id:'n2',title:'Department Meeting on Friday',body:'All CS students are required to attend the department meeting scheduled for Friday at 2 PM in the seminar hall.',category:'academic',postedAt:'2024-12-16T08:00:00',isNew:true},
  {id:'n3',title:'End Semester Exam Schedule Released',body:'The end semester examination schedule has been released. Check the notice board and college website for detailed timetable.',category:'academic',postedAt:'2024-12-14T09:00:00',isNew:false},
  {id:'n4',title:'Library Holiday Hours',body:'The library will have reduced hours during the upcoming holidays. 9 AM to 5 PM on weekdays, closed on weekends.',category:'general',postedAt:'2024-12-12T11:00:00',isNew:false},
]
const defaultNotes: Note[] = [
  {id:'no1',title:'B+ Tree Notes',content:'A B+ tree is a balanced tree data structure where all values are stored in leaf nodes and leaf nodes are linked for efficient range queries...',subject:'Data Structures',updatedAt:'2024-12-16T14:00:00',pinned:true},
  {id:'no2',title:'SQL Joins Cheatsheet',content:'INNER JOIN: returns matching rows\nLEFT JOIN: all left + matching right\nRIGHT JOIN: all right + matching left\nFULL JOIN: all rows from both tables',subject:'DBMS',updatedAt:'2024-12-15T16:00:00',pinned:false},
]

const Ctx = createContext<Store>({} as Store)

function load<T>(key:string, fallback:T): T {
  if (typeof window === 'undefined') return fallback
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback } catch { return fallback }
}
function save(key:string, val: unknown) {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(val))
}
const uid = () => Math.random().toString(36).slice(2,10)

export function StoreProvider({children}:{children:React.ReactNode}) {
  const [user, setUserState] = useState<User>(defaultUser)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [tasks, setTasks] = useState<Task[]>(defaultTasks)
  const [timetable, setTimetable] = useState<TimetableEntry[]>(defaultTimetable)
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(defaultAttendance)
  const [notices, setNotices] = useState<Notice[]>(defaultNotices)
  const [notes, setNotes] = useState<Note[]>(defaultNotes)
  const [darkMode, setDarkMode] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setIsLoggedIn(load<boolean>('sc_loggedin', false))
    setUserState(load('sc_user', defaultUser))
    setTasks(load('sc_tasks', defaultTasks))
    setTimetable(load('sc_timetable', defaultTimetable))
    setAttendance(load('sc_attendance', defaultAttendance))
    setNotices(load('sc_notices', defaultNotices))
    setNotes(load('sc_notes', defaultNotes))
    const dm = load<boolean>('sc_dark', false)
    setDarkMode(dm)
    if (dm) document.documentElement.classList.add('dark')
    setHydrated(true)
  }, [])

  const login = (email: string, password: string) => {
    const accounts: AuthAccount[] = load('sc_accounts', [])
    // Demo account always works
    if (email === 'demo@campus.edu' && password === 'demo123') {
      setIsLoggedIn(true); save('sc_loggedin', true)
      return { success: true }
    }
    const found = accounts.find(a => a.email === email && a.password === password)
    if (!found) return { success: false, error: 'Invalid email or password' }
    const u: User = { name: found.name, email: found.email, rollNo: found.rollNo, branch: found.branch, semester: found.semester, avatar: found.name.split(' ').map((n:string)=>n[0]).join('').toUpperCase().slice(0,2) }
    setUserState(u); save('sc_user', u)
    setIsLoggedIn(true); save('sc_loggedin', true)
    return { success: true }
  }

  const signup = (data: AuthAccount) => {
    const accounts: AuthAccount[] = load('sc_accounts', [])
    if (accounts.find(a => a.email === data.email)) return { success: false, error: 'Email already registered' }
    const newAccounts = [...accounts, data]
    save('sc_accounts', newAccounts)
    const u: User = { name: data.name, email: data.email, rollNo: data.rollNo, branch: data.branch, semester: data.semester, avatar: data.name.split(' ').map((n:string)=>n[0]).join('').toUpperCase().slice(0,2) }
    setUserState(u); save('sc_user', u)
    setIsLoggedIn(true); save('sc_loggedin', true)
    return { success: true }
  }

  const logout = () => { setIsLoggedIn(false); save('sc_loggedin', false) }

  const setUser = (u:User) => { setUserState(u); save('sc_user', u) }
  const addTask = (t: Omit<Task,'id'|'createdAt'>) => { const n={...t,id:uid(),createdAt:new Date().toISOString()}; setTasks(p=>{const u=[...p,n];save('sc_tasks',u);return u}) }
  const toggleTask = (id:string) => setTasks(p=>{const u=p.map(t=>t.id===id?{...t,done:!t.done}:t);save('sc_tasks',u);return u})
  const deleteTask = (id:string) => setTasks(p=>{const u=p.filter(t=>t.id!==id);save('sc_tasks',u);return u})
  const addEntry = (e: Omit<TimetableEntry,'id'>) => { const n={...e,id:uid()}; setTimetable(p=>{const u=[...p,n];save('sc_timetable',u);return u}) }
  const deleteEntry = (id:string) => setTimetable(p=>{const u=p.filter(e=>e.id!==id);save('sc_timetable',u);return u})
  const addAttendance = (a: Omit<AttendanceRecord,'id'>) => { const n={...a,id:uid()}; setAttendance(p=>{const u=[...p,n];save('sc_attendance',u);return u}) }
  const addNotice = (n: Omit<Notice,'id'|'postedAt'|'isNew'>) => { const no={...n,id:uid(),postedAt:new Date().toISOString(),isNew:true}; setNotices(p=>{const u=[no,...p];save('sc_notices',u);return u}) }
  const markNoticeRead = (id:string) => setNotices(p=>{const u=p.map(n=>n.id===id?{...n,isNew:false}:n);save('sc_notices',u);return u})
  const addNote = (n: Omit<Note,'id'|'updatedAt'>) => { const no={...n,id:uid(),updatedAt:new Date().toISOString()}; setNotes(p=>{const u=[no,...p];save('sc_notes',u);return u}) }
  const updateNote = (id:string, n: Partial<Note>) => setNotes(p=>{const u=p.map(o=>o.id===id?{...o,...n,updatedAt:new Date().toISOString()}:o);save('sc_notes',u);return u})
  const deleteNote = (id:string) => setNotes(p=>{const u=p.filter(o=>o.id!==id);save('sc_notes',u);return u})
  const toggleDark = () => { const nd=!darkMode; setDarkMode(nd); save('sc_dark',nd); document.documentElement.classList.toggle('dark',nd) }

  if (!hydrated) return null
  return <Ctx.Provider value={{user,setUser,isLoggedIn,login,signup,logout,tasks,addTask,toggleTask,deleteTask,timetable,addEntry,deleteEntry,attendance,addAttendance,notices,addNotice,markNoticeRead,notes,addNote,updateNote,deleteNote,darkMode,toggleDark}}>{children}</Ctx.Provider>
}

export const useStore = () => useContext(Ctx)
