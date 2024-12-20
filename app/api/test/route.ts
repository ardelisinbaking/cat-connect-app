import { prisma } from 'lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    await prisma.$connect()
    return NextResponse.json({ status: 'Database connection successful!' })
  } catch (error) {
    console.error('Database connection error:', error)
    return NextResponse.json(
      { error: 'Database connection failed' },
      { status: 500 }
    )
  }
}