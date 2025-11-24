import api from './api'

export const authService = {
  async login(email, password) {
    try {
      const res = await api.post('/auth/login', { email, password })
  
      if (!res.data?.success) {
        throw new Error(res.data?.message || 'Invalid credentials')
      }
  
      // Role mapping (IMPORTANT for Sidebar + Role-based routing)
      const roleNameMap = {
        1: "super_admin",
        2: "site_admin",
        3: "field_worker",
        4: "gov_authority",
        5: "citizen"
      }
  
      const user = res.data.data
      user.role_name = roleNameMap[user.role_id]   // 🔥 Add readable role
  
      // Save token
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('user', JSON.stringify(user))
      }
  
      return { success: true, data: user, token: res.data.token }
  
    } catch (err) {
      if (err.response) {
        throw new Error(err.response.data?.message || 'Login failed')
      }
      throw new Error('Unable to connect to server')
    }
  }
  ,

  async register(userData) {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  },

  getCurrentUser() {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user')
      return userStr ? JSON.parse(userStr) : null
    }
    return null
  },

  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token')
    }
    return null
  }
}
