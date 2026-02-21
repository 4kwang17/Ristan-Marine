import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const startRow = parseInt(searchParams.get('startRow') || '0')
    const endRow = parseInt(searchParams.get('endRow') || '100')
    const category = searchParams.get('category') || ''
    const search = searchParams.get('search') || ''
    const sortField = searchParams.get('sortField') || 'id'
    const sortDir = searchParams.get('sortDir') || 'asc'

    let query = supabase
      .from('products')
      .select('id,item_name_kr,item_name_en,impa_code,issa_code,category,unit,price_krw,brand,image', { count: 'exact' })

    if (category) {
      query = query.eq('category', category)
    }

    if (search) {
      query = query.or(
        `item_name_kr.ilike.%${search}%,item_name_en.ilike.%${search}%,impa_code.ilike.%${search}%,brand.ilike.%${search}%`
      )
    }

    const validSortFields = ['id', 'item_name_kr', 'item_name_en', 'impa_code', 'category', 'brand', 'price_krw']
    const safeField = validSortFields.includes(sortField) ? sortField : 'id'
    query = query.order(safeField, { ascending: sortDir === 'asc' })
    query = query.range(startRow, endRow - 1)

    const { data, error, count } = await query
    if (error) throw error

    return NextResponse.json({ rows: data || [], totalCount: count || 0 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Check admin role
    const { data: { user: fullUser } } = await supabase.auth.getUser()
    const role = (fullUser as any)?.app_metadata?.role
    if (role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await request.json()
    const { id, ...updates } = body
    delete updates.created_at

    const { data, error } = await supabase
      .from('products')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: { user: fullUser } } = await supabase.auth.getUser()
    const role = (fullUser as any)?.app_metadata?.role
    if (role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await request.json()
    const { data, error } = await supabase
      .from('products')
      .insert([body])
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ data }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: { user: fullUser } } = await supabase.auth.getUser()
    const role = (fullUser as any)?.app_metadata?.role
    if (role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
