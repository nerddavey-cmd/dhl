import { db } from '@/lib/db'
import { user } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import * as crypto from 'crypto'

export async function POST() {
  // Check for authorization token
  const authToken = process.env.SEED_AUTH_TOKEN
  if (!authToken || !process.env.NODE_ENV) {
    return NextResponse.json(
      { error: 'Seed endpoint is disabled in production' },
      { status: 403 }
    )
  }

  try {
    return NextResponse.json(
      { message: 'Seed users through the sign-up page' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
