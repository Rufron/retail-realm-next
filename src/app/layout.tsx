
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import QueryProvider from '@/components/query-provider'

const inter = Inter({ subsets: ['latin'] })

// Define metadata for the entire application (shows up in browser tabs and SEO)
export const metadata: Metadata = {
  title: 'Product Dashboard',
  description: 'Modern product dashboard with search and filtering capabilities',
  keywords: ['products', 'dashboard', 'e-commerce', 'catalog'],
}

// This is the root layout that wraps all pages in the app
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            {children}
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
