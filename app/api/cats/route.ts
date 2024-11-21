import { prisma } from 'lib/prisma'
import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'

export async function GET() {
  try {
    const cats = await prisma.catProfile.findMany({
      include: {
        owner: true,
        visits: true,
      },
    })
    return NextResponse.json(cats)
  } catch (error) {
    console.error('Failed to fetch cats', error)
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
    const owner = await prisma.user.findUnique({
      where: { id: body.ownerId },
      select: { userType: true }
    })

    if (!owner) {
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

    const catProfile = await prisma.catProfile.create({
      data: {
        name: body.name,
        age: parsedAge,
        description: body.description,
        available: body.available ?? true,
        ownerId: body.ownerId, // This should be the ID of a CAT_OWNER user
      },
      include: {
        owner: true,
      },
    })
    return NextResponse.json(catProfile)
  } catch (error) {
    console.error('Failed to create cat profile:', error)

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        return NextResponse.json(
          { error: 'Invalid owner ID provided' },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to create cat profile' },
      { status: 500 }
    )
  }
}
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    
    // Ensure cat ID is provided
    if (!body.id) {
      return NextResponse.json(
        { error: 'Cat ID is required' },
        { status: 400 }
      )
    }

    // First check if cat exists and get owner info
    const existingCat = await prisma.catProfile.findUnique({
      where: { id: body.id },
      include: { owner: true }
    })

    if (!existingCat) {
      return NextResponse.json(
        { error: 'Cat profile not found' },
        { status: 404 }
      )
    }

    // Parse age if it's being updated
    const parsedAge = body.age ? parseInt(body.age, 10) : undefined

    // Update the cat profile
    const updatedCat = await prisma.catProfile.update({
      where: { id: body.id },
      data: {
        name: body.name ?? undefined,
        age: parsedAge,
        description: body.description ?? undefined,
        available: body.available ?? undefined,
      },
      include: {
        owner: true,
      },
    })
    
    return NextResponse.json(updatedCat)
  } catch (error) {
    console.error('Error updating cat profile:', error)
    return NextResponse.json(
      { error: 'Failed to update cat profile' },
      { status: 500 }
    )
  }
}