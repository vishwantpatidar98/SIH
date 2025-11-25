'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '../hooks/useAuth'

export default function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  const isActive = (path) => pathname === path

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/tasks', label: 'My Tasks', icon: '📝', roles: ['field_worker', 'site_admin', 'super_admin'] },
    { path: '/complaints', label: 'Complaints', icon: '📸', roles: ['field_worker', 'site_admin', 'super_admin'] },
    { path: '/messages', label: 'Messages', icon: '💬', roles: ['site_admin', 'gov_authority', 'super_admin'] },
    { path: '/sensors', label: 'Sensors', icon: '📡', roles: ['site_admin', 'super_admin'] },
    { path: '/slopes', label: 'Slopes', icon: '🏔️', roles: ['site_admin', 'super_admin'] },
    { path: '/alerts', label: 'Alerts', icon: '🚨', roles: ['site_admin', 'super_admin', 'gov_authority'] },
    { path: '/ml/predictions', label: 'ML Predictions', icon: '🤖', roles: ['site_admin', 'super_admin'] },
    { path: '/uploads/sensors', label: 'Upload Data', icon: '📤', roles: ['site_admin', 'super_admin'] },
    { path: '/admin', label: 'Admin Panel', icon: '⚙️', roles: ['site_admin', 'super_admin'] },
    { path: '/govt', label: 'Gov Advisories', icon: '🏛️', roles: ['gov_authority', 'super_admin', 'site_admin'] },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ]

  const filteredMenuItems = menuItems.filter(item => {
    if (!item.roles) return true;
    if (!user || !user.role_name) return false;
    return item.roles.includes(user.role_name);
  });  

  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-6">Menu</h2>
        <nav className="space-y-2">
          {filteredMenuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  )
}

