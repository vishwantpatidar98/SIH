'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '../hooks/useAuth'
import { useWebSocket } from '../hooks/useWebSocket'

export default function Navbar() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [notificationCount, setNotificationCount] = useState(0)

  // FIX: always default to empty array
  const { alerts = [] } = useWebSocket()

  useEffect(() => {
    const unread = (alerts || []).filter(a => !a.acknowledged).length
    setNotificationCount(unread)
  }, [alerts])

  const handleLogout = () => {
    logout()
    router.push('/auth/login')
  }

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'super_admin':
        return 'bg-purple-100 text-purple-800'
      case 'site_admin':
        return 'bg-blue-100 text-blue-800'
      case 'gov_authority':
        return 'bg-green-100 text-green-800'
      case 'field_worker':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg h-16 flex items-center justify-between px-6 text-white">
      <div className="flex items-center space-x-4">
        <div className="text-xl font-bold">🛡️ SIH Rockfall Detection</div>
        {pathname !== '/dashboard' && (
          <button
            onClick={() => router.push('/dashboard')}
            className="text-sm hover:underline"
          >
            Dashboard
          </button>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {/* Notifications */}
        {notificationCount > 0 && (
          <button
            onClick={() => router.push('/dashboard')}
            className="relative p-2 hover:bg-blue-700 rounded-full transition"
            title={`${notificationCount} new alerts`}
          >
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {notificationCount}
            </span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
        )}

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center space-x-2 hover:bg-blue-700 px-3 py-2 rounded transition"
          >
            <div className="text-right">
              <div className="font-medium text-sm">{user?.name || 'User'}</div>
              <div className="text-xs text-blue-200">{user?.email || ''}</div>
            </div>
            <div className={`px-2 py-1 rounded text-xs font-semibold ${getRoleBadgeColor(user?.role_name)}`}>
              {user?.role_name?.replace('_', ' ').toUpperCase() || 'USER'}
            </div>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 bg-white text-gray-800 shadow-xl rounded-lg w-48 border border-gray-200 z-50">
              <div className="p-3 border-b border-gray-200">
                <div className="font-semibold text-sm">{user?.name}</div>
                <div className="text-xs text-gray-500">{user?.email}</div>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    router.push('/dashboard')
                    setMenuOpen(false)
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                >
                  📊 Dashboard
                </button>
                {(user?.role_name === 'field_worker') && (
                  <button
                    onClick={() => {
                      router.push('/complaints')
                      setMenuOpen(false)
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                    📸 Report Issue
                  </button>
                )}
                <button
                  onClick={() => {
                    handleLogout()
                    setMenuOpen(false)
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 text-sm"
                >
                  🚪 Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
