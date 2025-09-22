import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Prefer private server vars if present; fall back to NEXT_PUBLIC_* for compatibility
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY

export async function POST() {
  try {
    if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { ok: false, error: 'Supabase server credentials are not configured (SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY)' },
        { status: 500 }
      )
    }

    // Admin client (service role) for privileged operations
    const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

    // 1) If a SUPER_ADMIN already exists, succeed early
    const { data: existing, error: existingError } = await supabaseAdmin
      .from('users')
      .select('id, email')
      .eq('role', 'SUPER_ADMIN')
      .maybeSingle()

    if (existingError && (existingError as any).code !== 'PGRST116') {
      return NextResponse.json({ ok: false, error: existingError.message }, { status: 500 })
    }

    if (existing) {
      return NextResponse.json({ ok: true, alreadyExists: true, user: existing })
    }

    // 2) Create auth user with confirmed email so we get an ID immediately
    const email = 'admin@wecon.events'
    const password = 'SuperAdmin123!'

    const { data: createdUser, error: createUserError } = await (supabaseAdmin as any).auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (createUserError) {
      return NextResponse.json({ ok: false, error: createUserError.message }, { status: 500 })
    }

    const authUser = createdUser?.user
    if (!authUser?.id) {
      return NextResponse.json({ ok: false, error: 'Failed to create auth user' }, { status: 500 })
    }

    // 3) Insert profile into public.users with service role (bypasses RLS safely)
    const { error: profileError } = await supabaseAdmin
      .from('users')
      .insert({
        id: authUser.id,
        email,
        role: 'SUPER_ADMIN',
        first_name: 'Super',
        last_name: 'Admin',
        display_name: 'WECON Super Administrator',
        privacy_level: 'PRIVATE',
        networking_available: false,
        email_notifications: true,
        push_notifications: true,
        email_verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

    if (profileError) {
      return NextResponse.json({ ok: false, error: profileError.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, user: { id: authUser.id, email } })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Unexpected error' }, { status: 500 })
  }
}

