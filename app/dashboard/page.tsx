'use client'

import { useState, useEffect } from 'react'
import { getShipments, getShipmentStats } from '@/app/actions/shipments'
import { CreateShipmentModal } from '@/components/create-shipment-modal'
import { useRouter } from 'next/navigation'

interface Shipment {
  id: number
  trackingNumber: string
  origin: string
  destination: string
  status: 'pending' | 'in-transit' | 'delivered'
  weight: string
  estimatedDelivery: string | null
}

interface Stats {
  total: number
  inTransit: number
  delivered: number
  pending: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, inTransit: 0, delivered: 0, pending: 0 })
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [shipmentsData, statsData] = await Promise.all([
        getShipments(),
        getShipmentStats(),
      ])
      setShipments(shipmentsData as Shipment[])
      setStats(statsData as Stats)
      
      // Get user info from session
      const response = await fetch('/api/auth/get-session')
      if (response.ok) {
        const { session } = await response.json()
        if (session?.user) {
          setUserName(session.user.name || session.user.email)
        }
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/sign-out', { method: 'POST' })
    router.push('/sign-in')
  }

  const handleCreateSuccess = () => {
    loadData()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome, {userName}</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-medium">Total Shipments</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-medium">In Transit</p>
            <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.inTransit}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-medium">Delivered</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{stats.delivered}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-medium">Pending</p>
            <p className="text-3xl font-bold text-orange-600 mt-2">{stats.pending}</p>
          </div>
        </div>

        {/* Recent Shipments */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Recent Shipments</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tracking #</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Origin</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Destination</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Weight</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Est. Delivery</th>
                </tr>
              </thead>
              <tbody>
                {shipments.map((shipment) => (
                  <tr key={shipment.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{shipment.trackingNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{shipment.origin}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{shipment.destination}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          shipment.status === 'delivered'
                            ? 'bg-green-100 text-green-800'
                            : shipment.status === 'in-transit'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        {shipment.status.charAt(0).toUpperCase() + shipment.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{shipment.weight}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {shipment.estimatedDelivery
                        ? new Date(shipment.estimatedDelivery).toLocaleDateString()
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      {/* Admin Actions */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Admin Actions</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-lg transition">
            📋 View All Shipments
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="p-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-lg transition"
          >
            ➕ Create New Shipment
          </button>
          <button className="p-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-lg transition">
            👥 Manage Users
          </button>
          <button className="p-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-lg transition">
            ⚙️ Settings
          </button>
          <button className="p-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-lg transition">
            📊 Reports
          </button>
          <button className="p-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-lg transition">
            🔔 Notifications
          </button>
        </div>
      </div>
    </div>

      <CreateShipmentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  )
}
