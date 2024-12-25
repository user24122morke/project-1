

import { AuthProvider } from './context/AuthContext'
import './globals.css'
import { Inter } from 'next/font/google'
import Head from 'next/head';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'safe pay',
  description: 'checkout app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" />
      </head>
      <body className={inter.className}>
       
          <AuthProvider>
          {children}
          </AuthProvider>
        
      </body>
    </html>
    
  )
}
