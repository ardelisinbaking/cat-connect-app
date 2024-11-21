import { prisma } from 'lib/prisma'
import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        catProfiles: true,
      },
    })
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
    const user = await prisma.user.create({
      data: {
        email: body.email,
        name: body.name,
        userType: body.userType,
        location: body.location,
      },
    })
    return NextResponse.json(user)
  } catch (error) {
    console.error('Failed to create user:', error)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      )
    }
  }
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}