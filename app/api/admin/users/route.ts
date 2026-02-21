import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

// GET - list all users
export async function GET() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || (user as any).app_metadata?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const adminSupabase = createAdminClient()
    const { data, error } = await adminSupabase
      .from('user_profiles')
      .select('id, full_name, company, expires_at, is_active, created_at')
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json({ users: data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST - create new user
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || (user as any).app_metadata?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { email, password, full_name, company, expires_days } = body

    if (!email || !password || !full_name || !company || !expires_days) {
      return NextResponse.json({ error: '모든 필드를 입력해주세요.' }, { status: 400 })
    }

    const adminSupabase = createAdminClient()

    // Create auth user
    const { data: authData, error: authError } = await adminSupabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (authError) throw authError

    // Calculate expiry
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + parseInt(expires_days))

    // Create profile
    const { error: profileError } = await adminSupabase
      .from('user_profiles')
      .insert([{
        id: authData.user.id,
        full_name,
        company,
        expires_at: expiresAt.toISOString(),
        created_by: user.id,
      }])

    if (profileError) {
      // Rollback user creation
      await adminSupabase.auth.admin.deleteUser(authData.user.id)
      throw profileError
    }

    return NextResponse.json({ success: true, userId: authData.user.id }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// PATCH - update user (activate/deactivate/extend)
export async function PATCH(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || (user as any).app_metadata?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { id, is_active, extends_days, expires_at } = body

    const adminSupabase = createAdminClient()
    const updates: any = {}

    if (typeof is_active === 'boolean') updates.is_active = is_active
    if (expires_at) updates.expires_at = expires_at
    if (extends_days) {
      const { data: current } = await adminSupabase
        .from('user_profiles')
        .select('expires_at')
        .eq('id', id)
        .single()

      const base = current?.expires_at ? new Date(current.expires_at) : new Date()
      if (base < new Date()) base.setTime(Date.now())
      base.setDate(base.getDate() + parseInt(extends_days))
      updates.expires_at = base.toISOString()
    }

    const { error } = await adminSupabase
      .from('user_profiles')
      .update(updates)
      .eq('id', id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// DELETE - delete user
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || (user as any).app_metadata?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    const adminSupabase = createAdminClient()
    await adminSupabase.from('user_profiles').delete().eq('id', id)
    await adminSupabase.auth.admin.deleteUser(id)

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
