'use client'
import { useStore } from '@/lib/store'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useStore()
  const router = useRouter()

  useEffect(() => {
    if (!isLoggedIn) router.replace('/login')
  }, [isLoggedIn, router])

  if (!isLoggedIn) return null
  return <>{children}</>
}
