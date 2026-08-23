'use client'

import { useState } from 'react'
import { AdSlot } from '@/components/AdSlot'

export default function JwtDecoderPage() {
  const [token, setToken] = useState('')
  const [header, setHeader] = useState('')
  const [payload, setPayload] = useState('')
  const [error, setError] = useState('')

  const decodeJWT = (t: string) => {
    setToken(t)
    setError('')
    
    if (!t) {
      setHeader('')
      setPayload('')
      return
    }

    const parts = t.split('.')
    if (parts.length !== 3) {
      setError('รูปแบบ JWT ไม่ถูกต้อง (ต้องประกอบด้วย 3 ส่วนคั่นด้วยจุด)')
      setHeader('')
      setPayload('')
      return
    }

    try {
      const decodedHeader = JSON.parse(atob(parts[0]))
      const decodedPayload = JSON.parse(atob(parts[1]))
      
      setHeader(JSON.stringify(decodedHeader, null, 2))
      setPayload(JSON.stringify(decodedPayload, null, 2))
    } catch (e) {
      setError('ไม่สามารถถอดรหัสข้อมูลได้ อาจมีการเข้ารหัสผิดรูปแบบ')
      setHeader('')
      setPayload('')
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">JWT Decoder</h1>
        <p className="text-gray-600">ถอดรหัส JSON Web Token (JWT) เพื่อดูข้อมูล Header และ Payload แบบเรียลไทม์</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border space-y-6">
        <div className="space-y-2">
          <label className="block font-medium text-sm text-gray-700">วาง JWT ของคุณที่นี่ (Encoded String)</label>
          <textarea
            className="w-full h-32 border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm break-all"
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            value={token}
            onChange={(e) => decodeJWT(e.target.value)}
            spellCheck="false"
          />
          {error && <p className="text-red-500 text-sm font-medium mt-1">{error}</p>}
        </div>

        <div className="grid md:grid-cols-2 gap-6 pt-4 border-t">
          <div className="space-y-2">
            <h3 className="font-semibold text-rose-500">Header</h3>
            <textarea
              className="w-full h-48 bg-rose-50 border border-rose-100 rounded-lg p-3 outline-none font-mono text-sm text-rose-900"
              readOnly
              value={header}
              placeholder="Header JSON จะแสดงที่นี่..."
            />
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-purple-600">Payload (Data)</h3>
            <textarea
              className="w-full h-64 bg-purple-50 border border-purple-100 rounded-lg p-3 outline-none font-mono text-sm text-purple-900"
              readOnly
              value={payload}
              placeholder="Payload JSON จะแสดงที่นี่..."
            />
          </div>
        </div>
      </div>

      <AdSlot />
    </div>
  )
}
