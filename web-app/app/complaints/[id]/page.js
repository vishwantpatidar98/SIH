'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useRequireAuth } from '../../../hooks/useRoles'
import { complaintsService } from '../../../services/complaints'
import Navbar from '../../../components/Navbar'
import Sidebar from '../../../components/Sidebar'
import Card from '../../../components/Card'
import RiskIndicator from '../../../components/RiskIndicator'

export default function ComplaintDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useRequireAuth()
  const [complaint, setComplaint] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (id) {
      loadComplaint()
    }
  }, [id])

  const loadComplaint = async () => {
    try {
      const complaints = await complaintsService.getAll()
      const found = complaints.find(c => c.id === parseInt(id))
      setComplaint(found)
    } catch (error) {
      console.error('Failed to load complaint:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true)
    try {
      await complaintsService.updateStatus(id, newStatus)
      await loadComplaint()
    } catch (error) {
      console.error('Failed to update status:', error)
      alert('Failed to update status')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!complaint) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-6">
            <Card title="Complaint Not Found">
              <p className="text-gray-600">The complaint you're looking for doesn't exist.</p>
              <button
                onClick={() => router.push('/complaints')}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Back to Complaints
              </button>
            </Card>
          </main>
        </div>
      </div>
    )
  }

  const isAdmin = ['site_admin', 'super_admin'].includes(user?.role_name)
  const isOwner = complaint.user_id === user?.id

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <Card
              title={`Complaint #${complaint.id}`}
              subtitle={`Submitted on ${new Date(complaint.created_at).toLocaleString()}`}
            >
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Status:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    complaint.status === 'resolved'
                      ? 'bg-green-100 text-green-800'
                      : complaint.status === 'in_progress'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {complaint.status?.toUpperCase() || 'PENDING'}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                  <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">{complaint.description}</p>
                </div>

                {complaint.media_url && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Evidence</h4>
                    <img
                      src={complaint.media_url}
                      alt="Evidence"
                      className="max-w-full rounded-lg border border-gray-200"
                    />
                  </div>
                )}

                {isAdmin && (
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Update Status</h4>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleStatusUpdate('in_progress')}
                        disabled={updating || complaint.status === 'in_progress'}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                      >
                        Mark In Progress
                      </button>
                      <button
                        onClick={() => handleStatusUpdate('resolved')}
                        disabled={updating || complaint.status === 'resolved'}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                      >
                        Mark Resolved
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

