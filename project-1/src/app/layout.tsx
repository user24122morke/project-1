

import { AuthProvider } from './context/AuthContext'
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'checkout payment',
  description: 'checkout app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
       
          <AuthProvider>
          {children}
          </AuthProvider>
        
      </body>
    </html>
    
  )
}
