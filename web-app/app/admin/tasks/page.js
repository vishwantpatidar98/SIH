'use client'

import { useState, useEffect } from 'react'
import { useRequireRole } from '../../../hooks/useRoles'
import { adminService } from '../../../services/admin'
import Navbar from '../../../components/Navbar'
import Sidebar from '../../../components/Sidebar'
import Card from '../../../components/Card'
import Table from '../../../components/Table'

export default function AdminTasksPage() {
  const { hasAccess } = useRequireRole(['site_admin', 'super_admin'])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (hasAccess) {
      loadTasks()
    }
  }, [hasAccess])

  const loadTasks = async () => {
    try {
      const data = await adminService.getTasks()
      setTasks(data)
    } catch (error) {
      console.error('Failed to load tasks:', error)
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
      header: 'Title',
      key: 'title',
    },
    {
      header: 'Assigned To',
      key: 'assigned_to',
      render: (val) => `User #${val}`,
    },
    {
      header: 'Status',
      key: 'status',
      render: (val) => (
        <span className={`px-2 py-1 rounded text-xs font-semibold ${
          val === 'completed'
            ? 'bg-green-100 text-green-800'
            : val === 'accepted'
            ? 'bg-blue-100 text-blue-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {val?.toUpperCase() || 'PENDING'}
        </span>
      ),
    },
    {
      header: 'Created',
      key: 'created_at',
      render: (val) => new Date(val).toLocaleString(),
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
              title="Task Management"
              subtitle="View and manage all assigned tasks"
              actions={[
                <button
                  key="new"
                  onClick={() => alert('Task creation coming soon')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
                >
                  + New Task
                </button>
              ]}
            >
              <Table
                columns={columns}
                data={tasks}
                emptyMessage="No tasks found"
              />
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

