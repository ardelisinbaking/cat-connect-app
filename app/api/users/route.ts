import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { data: users, error } = await supabase
      .from('User')
      .select(`
        *,
        CatProfile (*)
      `)
    
    if (error) throw error
    return NextResponse.json(users)
  } catch (error) {
    console.error('Failed to fetch users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!['CAT_OWNER', 'CAT_LOVER'].includes(body.userType)) {
      return NextResponse.json(
        { error: 'Invalid userType. Must be CAT_OWNER or CAT_LOVER' },
        { status: 400 }
      )
    }

    const { data: user, error } = await supabase
      .from('User')
      .insert({
        email: body.email,
        name: body.name,
        userType: body.userType,  // Keeping camelCase as per schema
        location: body.location,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') { // Postgres unique violation code
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 400 }
        )
      }
      throw error
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Failed to create user:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}