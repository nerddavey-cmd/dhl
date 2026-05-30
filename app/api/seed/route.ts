import { db } from '@/lib/db'
import { user } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import * as crypto from 'crypto'

export async function POST() {
  try {
    // Check if admin user already exists
    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.email, 'nerddavey@gmail.com'))
      .limit(1)

    if (existingUser.length > 0) {
      return NextResponse.json(
        { message: 'Admin user already exists' },
        { status: 200 }
      )
    }

    // Create admin user - password will be set through the auth API
    // For now, we'll just create the user record
    const userId = crypto.randomUUID()

    await db.insert(user).values({
      id: userId,
      name: 'Admin',
      email: 'nerddavey@gmail.com',
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json(
      {
        message: 'Admin user created successfully',
        userId,
        email: 'nerddavey@gmail.com',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    )
  }
}
