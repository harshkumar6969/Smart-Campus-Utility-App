import type { Metadata } from 'next'
import '../styles/globals.css'
import { StoreProvider } from '@/lib/store'

export const metadata: Metadata = {
  title: 'Smart Campus — Organize. Manage. Simplify.',
  description: 'Your all-in-one campus utility app',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  )
}
