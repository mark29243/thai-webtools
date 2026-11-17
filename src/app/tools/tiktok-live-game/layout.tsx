import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'เกมไลฟ์ TikTok ศึกเรือยาว - เกมอินเทอร์แอคทีฟให้คนดูคอมเมนต์เล่น',
  description: 'เกมไลฟ์สด TikTok แบบอินเทอร์แอคทีฟ คนดูคอมเมนต์เลือกทีม พิมพ์ "พาย" แข่งเรือยาว ส่งของขวัญเทอร์โบหรือโยนผักตบใส่ทีมคู่แข่ง ใช้กับ OBS / TikTok LIVE Studio ได้ฟรี',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
