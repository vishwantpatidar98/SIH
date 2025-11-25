'use client'

import { useState, useEffect } from 'react'
import { useRequireRole } from '../../../hooks/useRoles'
import { mlService } from '../../../services/ml'
import { slopesService } from '../../../services/slopes'
import Navbar from '../../../components/Navbar'
import Sidebar from '../../../components/Sidebar'
import Card from '../../../components/Card'

export default function MLExplainPage() {
  const { hasAccess } = useRequireRole(['site_admin', 'super_admin'])
  const [slopes, setSlopes] = useState([])
  const [selectedSlope, setSelectedSlope] = useState('')
  const [predictionId, setPredictionId] = useState('')
  const [explanation, setExplanation] = useState(null)
  const [mlStatus, setMlStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (hasAccess) {
      loadSlopes()
    }
  }, [hasAccess])

  const loadSlopes = async () => {
    try {
      const data = await slopesService.getAll()
      setSlopes(data)
    } catch (error) {
      console.error('Failed to load slopes:', error)
    }
  }

  const handleExplain = async () => {
    if (!selectedSlope || !predictionId) {
      alert('Please select a slope and enter prediction ID')
      return
    }

    setLoading(true)
    try {
      const result = await mlService.explain(selectedSlope, predictionId)
      setMlStatus(result)
      setExplanation(result?.data || null)
    } catch (error) {
      console.error('Explanation failed:', error)
      setMlStatus({
        ok: false,
        implemented: false,
        message: 'Unable to generate ML explanation',
      })
      setExplanation(null)
    } finally {
      setLoading(false)
    }
  }

  if (!hasAccess) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <Card
              title="ML Model Explainability"
              subtitle="Understand which features contribute most to risk predictions"
            >
              <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong>{' '}
                  {mlStatus?.message || 'ML is not integrated yet — placeholder only. Explainability results will appear once integration is complete.'}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Slope
                  </label>
                  <select
                    value={selectedSlope}
                    onChange={(e) => setSelectedSlope(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Choose a slope...</option>
                    {slopes.map((slope) => (
                      <option key={slope.id} value={slope.id}>
                        {slope.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prediction ID
                  </label>
                  <input
                    type="text"
                    value={predictionId}
                    onChange={(e) => setPredictionId(e.target.value)}
                    placeholder="Enter prediction ID from ML predictions"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  onClick={handleExplain}
                  disabled={!selectedSlope || !predictionId || loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50"
                >
                  {loading ? 'Generating Explanation...' : 'Get SHAP Explanation'}
                </button>
              </div>
            </Card>

            {explanation && (
              <Card title="SHAP Explanation Results">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Feature Importance</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <pre className="text-xs overflow-auto">
                        {JSON.stringify(explanation.feature_importance, null, 2)}
                      </pre>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">SHAP Values</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <pre className="text-xs overflow-auto">
                        {JSON.stringify(explanation.shap_values, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

