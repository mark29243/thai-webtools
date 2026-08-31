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
import { PwaInstallPrompt } from '@/components/PwaInstallPrompt'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://thai-webtools.vercel.app'),
  title: {
    default: "Thai WebTools - เครื่องมือออนไลน์ฟรี 100% สำหรับทุกคน",
    template: "%s | Thai WebTools"
  },
  description: "ศูนย์รวมเครื่องมือออนไลน์ โหลดเร็ว ไม่ต้องติดตั้ง (คำนวณภาษี, ออกใบเสนอราคา, สลิปเงินเดือน, ราคาทองวันนี้, แปลงรูป HEIC, ย่อรูป, สุ่มรายชื่อ, QR Code และอื่นๆ กว่า 60+ รายการ) ใช้งานฟรีบนมือถือและคอมพิวเตอร์",
  manifest: "/manifest.json",
  keywords: [
    "เครื่องมือออนไลน์", "เว็บทูล", "คำนวณภาษี", "สร้างใบเสนอราคา", "คำนวณเงินเดือน", 
    "ราคาทองวันนี้", "แปลงรูป iPhone", "สร้าง qr code", "ย่อรูป", "ตรวจหวย", 
    "เครื่องคิดเลขเวลา", "คำนวณโปะบ้าน", "หารบิล", "web tools thailand"
  ],
  authors: [{ name: "Thai WebTools Team", url: "https://thai-webtools.vercel.app" }],
  creator: "Thai WebTools",
  openGraph: {
    title: "Thai WebTools - รวมสุดยอดเครื่องมือออนไลน์ฟรี 100%",
    description: "สารพัดเครื่องมือออนไลน์ภาษาไทย 60+ ตัว ที่ช่วยให้ชีวิตคุณง่ายขึ้น ใช้งานฟรี ปลอดภัย ไม่เก็บข้อมูล ประมวลผลในเครื่อง โหลดเร็วมาก!",
    url: "https://thai-webtools.vercel.app",
    siteName: "Thai WebTools",
    locale: "th_TH",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Thai WebTools Banner"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Thai WebTools - รวมเครื่องมือออนไลน์ฟรี 100%",
    description: "สารพัดเครื่องมือออนไลน์ภาษาไทย ใช้งานฟรี โหลดเร็ว ปลอดภัย!",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Thai WebTools",
  },
  alternates: {
    canonical: "https://thai-webtools.vercel.app",
  }
};

export const viewport = {
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Thai WebTools",
    "url": "https://thai-webtools.vercel.app",
    "description": "ศูนย์รวมเครื่องมือออนไลน์ฟรี 100% สำหรับคนไทย (คำนวณภาษี, ใบเสนอราคา, สลิปเงินเดือน, ราคาทอง, แปลงไฟล์, PDF ฯลฯ)",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "All",
    "inLanguage": "th",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "THB"
    }
  }

  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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
          <PwaInstallPrompt />
          <Toaster position="bottom-center" toastOptions={{ className: 'dark:bg-gray-800 dark:text-white' }} />
        </ThemeProvider>
      </body>
    </html>
  )
}
