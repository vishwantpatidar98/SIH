import api from './api'

export const govtService = {
  async postAdvisory(data) {
    const response = await api.post('/govt/advisories', data)
    return response.data
  },

  async getAdvisories(slopeId = null) {
    const params = slopeId ? { slopeId } : {}
    const response = await api.get('/govt/advisories', { params })
    return response.data.data || []
  },
}
