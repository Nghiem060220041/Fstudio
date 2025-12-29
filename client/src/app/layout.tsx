import { AuthProvider } from '@/components/Providers'
import { ThemeProvider } from '@/components/themes'
import { ToasterProvider } from '@/providers/toast-provider'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "FStudio | Điện thoại iphone chính hãng",
  description: "Chào mừng quay trở lại",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
  }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <link rel="icon" href="/favicon.png" sizes="any" />
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ToasterProvider/>
              {children}
            </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
