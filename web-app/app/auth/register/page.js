'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '../../../services/auth'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    roleId: 5   // Default = Citizen
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleRoleChange = (e) => {
    setFormData({
      ...formData,
      roleId: Number(e.target.value)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await authService.register(formData)
      if (res.success) {
        router.push('/auth/login')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>

          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="border p-2 w-full mb-3 rounded"
            required
          />

          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="border p-2 w-full mb-3 rounded"
            required
          />

          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="border p-2 w-full mb-3 rounded"
            required
          />

          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="border p-2 w-full mb-3 rounded"
            minLength={6}
            required
          />

          {/* Role Selection */}
          <label className="block text-sm font-medium mb-2">Role</label>
          <select
            value={formData.roleId}
            onChange={handleRoleChange}
            className="border p-2 w-full rounded mb-3 text-black"
            required
          >
            <option value="1">super_admin</option>
            <option value="2">site_admin</option>
            <option value="3">field_worker</option>
            <option value="4">gov_authority</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded mt-3"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/auth/login" className="text-blue-600">Login</a>
        </p>
      </div>
    </div>
  )
}
