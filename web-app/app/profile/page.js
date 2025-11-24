'use client'

import { useState } from 'react'
import { useRequireAuth } from '../../hooks/useRoles'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import Card from '../../components/Card'

export default function ProfilePage() {
  const { user } = useRequireAuth()
  const [updating, setUpdating] = useState(false)

  if (!user) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            <Card title="Profile Information" subtitle="View your account details">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="text-lg font-semibold">{user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="text-lg font-semibold">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="text-lg font-semibold">{user.phone || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Role</p>
                  <p className="text-lg font-semibold">{user.role_name?.replace('_', ' ').toUpperCase() || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Member Since</p>
                  <p className="text-lg font-semibold">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </Card>

            <Card title="Change Password" subtitle="Update your account password">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  Password change functionality will be available when backend endpoint is implemented.
                </p>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

