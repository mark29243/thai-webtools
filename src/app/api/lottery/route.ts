import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const res = await fetch('https://www.glo.or.th/api/lottery/getLatestLottery', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      cache: 'no-store' // Always fetch real-time fresh data
    })
    
    if (!res.ok) throw new Error('GLO API request failed')
    
    const gloData = await res.json()
    
    if (!gloData.response || !gloData.response.data) {
      throw new Error('Invalid GLO API format')
    }

    const d = gloData.response.data
    
    // Map Thai months
    const thaiMonths = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ]
    const mStr = gloData.response.displayDate.month
    const monthName = thaiMonths[parseInt(mStr, 10) - 1]
    const yearTh = parseInt(gloData.response.displayDate.year, 10) + 543
    const formattedDate = `${gloData.response.displayDate.date} ${monthName} ${yearTh}`

    // Helper to safely extract values
    const getVals = (obj: any) => (obj?.number || []).map((n: any) => n.value)

    const mappedData = {
      response: {
        date: formattedDate,
        endpoint: "https://www.glo.or.th/api/lottery/getLatestLottery",
        prizes: [
          { id: "prizeFirst", name: "รางวัลที่ 1", reward: d.first?.price?.replace(/\.00$/, '') || "6000000", amount: 1, number: getVals(d.first) },
          { id: "prizeFirstNear", name: "รางวัลข้างเคียงรางวัลที่ 1", reward: d.near1?.price?.replace(/\.00$/, '') || "100000", amount: 2, number: getVals(d.near1) },
          { id: "prizeSecond", name: "รางวัลที่ 2", reward: d.second?.price?.replace(/\.00$/, '') || "200000", amount: 5, number: getVals(d.second) },
          { id: "prizeThird", name: "รางวัลที่ 3", reward: d.third?.price?.replace(/\.00$/, '') || "80000", amount: 10, number: getVals(d.third) },
          { id: "prizeFourth", name: "รางวัลที่ 4", reward: d.fourth?.price?.replace(/\.00$/, '') || "40000", amount: 50, number: getVals(d.fourth) },
          { id: "prizeFifth", name: "รางวัลที่ 5", reward: d.fifth?.price?.replace(/\.00$/, '') || "20000", amount: 100, number: getVals(d.fifth) },
          { id: "runningNumberFrontThree", name: "รางวัลเลขหน้า 3 ตัว", reward: d.last3f?.price?.replace(/\.00$/, '') || "4000", amount: 2, number: getVals(d.last3f) },
          { id: "runningNumberBackThree", name: "รางวัลเลขท้าย 3 ตัว", reward: d.last3b?.price?.replace(/\.00$/, '') || "4000", amount: 2, number: getVals(d.last3b) },
          { id: "runningNumberBackTwo", name: "รางวัลเลขท้าย 2 ตัว", reward: d.last2?.price?.replace(/\.00$/, '') || "2000", amount: 1, number: getVals(d.last2) }
        ]
      }
    }
    
    return NextResponse.json(mappedData)
  } catch (err) {
    console.error('Lottery API Error:', err)
    // Fallback Mock Data
    return NextResponse.json({
      response: {
        date: "ล่าสุด (กำลังปรับปรุงระบบดึงข้อมูล)",
        endpoint: "fallback",
        prizes: [
          { id: "prizeFirst", name: "รางวัลที่ 1", reward: "6000000", amount: 1, number: ["111111"] },
          { id: "prizeFirstNear", name: "รางวัลข้างเคียงรางวัลที่ 1", reward: "100000", amount: 2, number: ["111110", "111112"] },
          { id: "runningNumberFrontThree", name: "รางวัลเลขหน้า 3 ตัว", reward: "4000", amount: 2, number: ["222", "333"] },
          { id: "runningNumberBackThree", name: "รางวัลเลขท้าย 3 ตัว", reward: "4000", amount: 2, number: ["444", "555"] },
          { id: "runningNumberBackTwo", name: "รางวัลเลขท้าย 2 ตัว", reward: "2000", amount: 1, number: ["66"] }
        ]
      }
    })
  }
}
