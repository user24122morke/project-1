

import { AuthProvider } from './context/AuthContext'
import './globals.css'
import { Inter } from 'next/font/google'
import Head from 'next/head';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Safe Pay Go',
  description: 'Safe Pay Go - a modern and secure platform for online payment processing.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" />
      </head>
      <body className={inter.className}>
       
          <AuthProvider>
          {children}
          </AuthProvider>
        
      </body>
    </html>
    
  )
}
