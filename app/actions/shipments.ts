'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { shipments } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { headers } from 'next/headers'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function getShipments() {
  const userId = await getUserId()
  return db
    .select()
    .from(shipments)
    .where(eq(shipments.userId, userId))
    .orderBy(desc(shipments.createdAt))
}

export async function getShipmentStats() {
  const userId = await getUserId()
  const allShipments = await db
    .select()
    .from(shipments)
    .where(eq(shipments.userId, userId))

  const stats = {
    total: allShipments.length,
    inTransit: allShipments.filter(s => s.status === 'in-transit').length,
    delivered: allShipments.filter(s => s.status === 'delivered').length,
    pending: allShipments.filter(s => s.status === 'pending').length,
  }

  return stats
}

export async function createShipment(formData: {
  trackingNumber: string
  origin: string
  destination: string
  weight: string
  status: 'pending' | 'in-transit' | 'delivered'
  estimatedDelivery?: string
}) {
  const userId = await getUserId()
  
  // Validate tracking number is unique
  const existing = await db
    .select()
    .from(shipments)
    .where(eq(shipments.trackingNumber, formData.trackingNumber))
  
  if (existing.length > 0) {
    throw new Error('Tracking number already exists')
  }

  const newShipment = await db
    .insert(shipments)
    .values({
      userId,
      trackingNumber: formData.trackingNumber,
      origin: formData.origin,
      destination: formData.destination,
      weight: formData.weight,
      status: formData.status,
      estimatedDelivery: formData.estimatedDelivery ? new Date(formData.estimatedDelivery) : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning()

  return newShipment[0]
}
