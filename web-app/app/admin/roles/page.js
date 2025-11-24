'use client'

import { useState, useEffect } from 'react'
import { useRequireRole } from '../../../hooks/useRoles'
import api from '../../../services/api'
import Navbar from '../../../components/Navbar'
import Sidebar from '../../../components/Sidebar'
import Card from '../../../components/Card'
import Table from '../../../components/Table'

export default function AdminRolesPage() {
  const { hasAccess } = useRequireRole(['super_admin'])
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (hasAccess) {
      loadRoles()
    }
  }, [hasAccess])

  const loadRoles = async () => {
    try {
      // TODO: Replace with actual roles endpoint when available
      // For now, using hardcoded roles
      setRoles([
        { id: 1, name: 'super_admin', description: 'Full system access' },
        { id: 2, name: 'site_admin', description: 'Site management access' },
        { id: 3, name: 'field_worker', description: 'Field worker access' },
        { id: 4, name: 'gov_authority', description: 'Government authority access' },
      ])
    } catch (error) {
      console.error('Failed to load roles:', error)
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    {
      header: 'ID',
      key: 'id',
    },
    {
      header: 'Role Name',
      key: 'name',
      render: (val) => <span className="font-semibold">{val.replace('_', ' ').toUpperCase()}</span>,
    },
    {
      header: 'Description',
      key: 'description',
    },
  ]

  if (!hasAccess || loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Card
              title="Role Management"
              subtitle="View all system roles and permissions"
            >
              <Table
                columns={columns}
                data={roles}
                emptyMessage="No roles found"
              />
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

