import '@/app/globals.css'
import type { Metadata } from 'next'
import { ThemeProvider } from '@/providers/theme-provider'
import { AuthProvider } from '@/providers/auth-provider'

export const metadata: Metadata = {
  title: 'Cat Connection',
  description: 'Connect cat lovers with furry friends',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <AuthProvider>
          <ThemeProvider defaultTheme="dark" storageKey="cat-connection-theme">
            <div className="relative flex min-h-screen flex-col">
              <div className="flex-1">{children}</div>
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}