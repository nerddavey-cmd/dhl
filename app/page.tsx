'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in by looking at session cookie
    router.push('/dashboard')
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <p className="text-gray-600">Loading...</p>
    </div>
  )
}
