'use client'

import { useState, useEffect } from 'react'
import { useRequireRole } from '../../../hooks/useRoles'
import { mlService } from '../../../services/ml'
import { slopesService } from '../../../services/slopes'
import Navbar from '../../../components/Navbar'
import Sidebar from '../../../components/Sidebar'
import Card from '../../../components/Card'
import RiskIndicator from '../../../components/RiskIndicator'

export default function MLPredictionsPage() {
  const { hasAccess } = useRequireRole(['site_admin', 'super_admin'])
  const [slopes, setSlopes] = useState([])
  const [selectedSlope, setSelectedSlope] = useState('')
  const [prediction, setPrediction] = useState(null)
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

  const handlePredict = async () => {
    if (!selectedSlope) {
      alert('Please select a slope')
      return
    }

    setLoading(true)
    try {
      const result = await mlService.predict(selectedSlope, {})
      setMlStatus(result)
      setPrediction(result?.data || null)
    } catch (error) {
      console.error('Prediction failed:', error)
      setMlStatus({
        ok: false,
        implemented: false,
        message: 'Unable to generate ML prediction',
      })
      setPrediction(null)
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
              title="ML Risk Prediction"
              subtitle="Get AI-powered risk assessment for slopes"
            >
              <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong>{' '}
                  {mlStatus?.message || 'ML is not integrated yet — placeholder only. Predictions will appear once integration is complete.'}
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

                <button
                  onClick={handlePredict}
                  disabled={!selectedSlope || loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50"
                >
                  {loading ? 'Predicting...' : 'Get Risk Prediction'}
                </button>
              </div>
            </Card>

            {prediction && (
              <Card title="Prediction Results">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Risk Score</p>
                      <p className="text-2xl font-bold">
                        {prediction?.risk_score !== undefined
                          ? `${(Number(prediction.risk_score) * 100).toFixed(1)}%`
                          : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Risk Level</p>
                      <RiskIndicator riskLevel={prediction?.risk_level} />
                    </div>
                  </div>
                  {prediction.explainability && Object.keys(prediction.explainability).length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Feature Importance</p>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <pre className="text-xs overflow-auto">
                          {JSON.stringify(prediction.explainability, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

