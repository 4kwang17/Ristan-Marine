import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { company, name, phone, email, message } = body

    if (!company || !name || !email || !message) {
      return NextResponse.json({ error: '필수 항목을 모두 입력해 주세요.' }, { status: 400 })
    }

    const supabase = createClient()
    const { error } = await supabase
      .from('inquiries')
      .insert([{ company, name, phone, email, message }])

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Inquiry error:', err)
    return NextResponse.json({ error: err.message || '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}
