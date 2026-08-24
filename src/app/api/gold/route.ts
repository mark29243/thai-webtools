import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const [goldRes, exchangeRes] = await Promise.allSettled([
      fetch('https://api.chnwt.dev/thai-gold-api/latest', {
        cache: 'no-store',
        headers: { 'User-Agent': 'Mozilla/5.0' }
      }).then(res => res.json()),
      fetch('https://open.er-api.com/v6/latest/USD', {
        next: { revalidate: 3600 }
      }).then(res => res.json())
    ])

    const goldData = goldRes.status === 'fulfilled' ? goldRes.value : null
    const exchangeData = exchangeRes.status === 'fulfilled' ? exchangeRes.value : null

    if (!goldData || goldData.status !== 'success') {
      throw new Error('Upstream Gold API failed')
    }

    const { update_date, update_time, price } = goldData.response

    // Clean numbers from comma
    const parsePrice = (val: string) => parseFloat(val.replace(/,/g, '')) || 0

    const goldBarBuy = parsePrice(price.gold_bar.buy)
    const goldBarSell = parsePrice(price.gold_bar.sell)
    const goldOrnamentBuy = parsePrice(price.gold.buy)
    const goldOrnamentSell = parsePrice(price.gold.sell)

    const usdThbRate = exchangeData?.rates?.THB || 36.50

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      update_date,
      update_time,
      prices: {
        gold_bar: {
          buy: goldBarBuy,
          sell: goldBarSell,
          buy_formatted: price.gold_bar.buy,
          sell_formatted: price.gold_bar.sell
        },
        gold_ornament: {
          buy: goldOrnamentBuy,
          sell: goldOrnamentSell,
          buy_formatted: price.gold.buy,
          sell_formatted: price.gold.sell
        }
      },
      fx: {
        usd_thb: usdThbRate
      }
    })
  } catch (error: any) {
    console.error('Error fetching gold price:', error)
    // Fallback response with realistic standard fallback
    return NextResponse.json({
      success: false,
      timestamp: new Date().toISOString(),
      update_date: 'วันนี้',
      update_time: 'ล่าสุด',
      prices: {
        gold_bar: {
          buy: 71650,
          sell: 71850,
          buy_formatted: '71,650.00',
          sell_formatted: '71,850.00'
        },
        gold_ornament: {
          buy: 70221.12,
          sell: 72650,
          buy_formatted: '70,221.12',
          sell_formatted: '72,650.00'
        }
      },
      fx: {
        usd_thb: 36.50
      },
      note: 'ใช้ข้อมูลสำรองเนื่องจากเซิร์ฟเวอร์ภายนอกขัดข้อง'
    }, { status: 200 })
  }
}
