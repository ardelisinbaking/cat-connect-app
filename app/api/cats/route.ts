import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { data: cats, error } = await supabase
      .from('CatProfile')
      .select(`
        *,
        owner:User (*),
        VisitRequest (*)
      `)
    
    if (error) throw error
    return NextResponse.json(cats)
  } catch (error) {
    console.error('Failed to fetch cats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cats' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsedAge = body.age ? parseInt(body.age, 10) : null

    // Check if owner exists and is a CAT_OWNER
    const { data: owner, error: ownerError } = await supabase
      .from('User')
      .select('userType')
      .eq('id', body.ownerId)
      .single()

    if (ownerError || !owner) {
      return NextResponse.json(
        { error: 'Owner not found' },
        { status: 400 }
      )
    }

    if (owner.userType !== 'CAT_OWNER') {
      return NextResponse.json(
        { error: 'User must be a CAT_OWNER to create cat profiles' },
        { status: 400 }
      )
    }

    const { data: catProfile, error } = await supabase
      .from('CatProfile')
      .insert({
        name: body.name,
        age: parsedAge,
        description: body.description,
        available: body.available ?? true,
        ownerId: body.ownerId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .select(`
        *,
        owner:User (*)
      `)
      .single()

    if (error) throw error
    return NextResponse.json(catProfile)
  } catch (error) {
    console.error('Failed to create cat profile:', error)
    return NextResponse.json(
      { error: 'Failed to create cat profile' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    
    if (!body.id) {
      return NextResponse.json(
        { error: 'Cat ID is required' },
        { status: 400 }
      )
    }

    // Check if cat exists
    const { data: existingCat, error: fetchError } = await supabase
      .from('CatProfile')
      .select(`
        *,
        owner:User (*)
      `)
      .eq('id', body.id)
      .single()

    if (fetchError || !existingCat) {
      return NextResponse.json(
        { error: 'Cat profile not found' },
        { status: 404 }
      )
    }

    const parsedAge = body.age ? parseInt(body.age, 10) : undefined

    const { data: updatedCat, error } = await supabase
      .from('CatProfile')
      .update({
        name: body.name ?? undefined,
        age: parsedAge,
        description: body.description ?? undefined,
        available: body.available ?? undefined,
        updatedAt: new Date().toISOString()
      })
      .eq('id', body.id)
      .select(`
        *,
        owner:User (*)
      `)
      .single()

    if (error) throw error
    return NextResponse.json(updatedCat)
  } catch (error) {
    console.error('Error updating cat profile:', error)
    return NextResponse.json(
      { error: 'Failed to update cat profile' },
      { status: 500 }
    )
  }
}