import api from './api'

export const adminService = {
  async getSlopes() {
    const response = await api.get('/admin/slopes')
    return response
  },

  async createSlope(data) {
    const response = await api.post('/admin/slopes', data)
    return response.data
  },

  async updateSlopeRisk(slopeId, riskLevel) {
    const response = await api.patch(`/admin/slopes/${slopeId}/risk`, { riskLevel })
    return response.data
  },

  async getUsers() {
    const response = await api.get('/admin/users')
    return response.data.data || []
  },

  async updateUserRole(userId, roleId) {
    const response = await api.patch(`/admin/users/${userId}/role`, { roleId })
    return response.data
  },
}
