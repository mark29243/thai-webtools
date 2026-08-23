import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const res = await fetch('https://lotto.api.rayriffy.com/latest', {
      next: { revalidate: 1800 } // Cache for 30 minutes
    })
    
    if (!res.ok) throw new Error('API request failed')
    
    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error('Lottery API Error:', err)
    // Fallback Mock Data in case the API is down
    return NextResponse.json({
      response: {
        date: "ล่าสุด (Mock Data)",
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
