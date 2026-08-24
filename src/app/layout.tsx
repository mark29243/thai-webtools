import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { BottomNav } from '@/components/BottomNav'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Toaster } from 'react-hot-toast'
import { ScrollToTop } from '@/components/ScrollToTop'
import { CookieBanner } from '@/components/CookieBanner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Thai WebTools - เครื่องมือออนไลน์ฟรี 100% สำหรับทุกคน",
  description: "ศูนย์รวมเครื่องมือออนไลน์ โหลดเร็ว ไม่ต้องติดตั้ง (แปลงหน่วย, สร้าง QR Code, ย่อรูป, สุ่มรหัส, แปลงสี, JSON Formatter และอื่นๆ) ใช้งานฟรีบนมือถือและคอมพิวเตอร์",
  manifest: "/manifest.json",
  keywords: "เครื่องมือออนไลน์, สร้าง qr code, แปลงหน่วย, ย่อรูป, สุ่มรหัสผ่าน, แปลงสี, web tools, developer tools",
  openGraph: {
    title: "Thai WebTools - รวมเครื่องมือออนไลน์ฟรี",
    description: "สารพัดเครื่องมือออนไลน์ที่ช่วยให้ชีวิตคุณง่ายขึ้น ใช้งานฟรี 100% ไม่มีโฆษณาคั่น โหลดเร็วมาก!",
    url: "https://thai-webtools.vercel.app",
    siteName: "Thai WebTools",
    locale: "th_TH",
    type: "website",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Thai WebTools",
  },
};

export const viewport = {
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
            {children}
          </main>
          <Footer />
          <BottomNav />
          <ScrollToTop />
          <CookieBanner />
          <Toaster position="bottom-center" toastOptions={{ className: 'dark:bg-gray-800 dark:text-white' }} />
        </ThemeProvider>
      </body>
    </html>
  )
}
