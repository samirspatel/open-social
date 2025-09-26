import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GitSocial - Distributed Social Media',
  description: 'A distributed social media platform where users own their data through GitHub repositories',
  keywords: 'social media, distributed, GitHub, open source, data ownership',
  authors: [{ name: 'GitSocial Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#E4405F',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  )
}
