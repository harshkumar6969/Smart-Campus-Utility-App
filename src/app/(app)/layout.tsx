import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'
import BottomNav from '@/components/layout/BottomNav'
import AuthGuard from '@/components/layout/AuthGuard'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6">
            {children}
          </main>
        </div>
        <BottomNav />
      </div>
    </AuthGuard>
  )
}
