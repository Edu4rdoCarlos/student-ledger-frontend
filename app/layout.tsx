import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ToastProvider } from '@/components/providers/toast-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Academic Ledger - Sistema de Gestão Acadêmica',
  description: 'Sistema de gerenciamento de documentos acadêmicos com blockchain Hyperledger Fabric',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png?v=3',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png?v=3',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg?v=3',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png?v=3',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <ThemeProvider>
          {children}
          <ToastProvider />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
