import api from './api'

// TODO: ML Service Integration
// This service will call the backend ML microservice when it's implemented
// Backend will handle FastAPI ML service calls
// Frontend only needs to call backend endpoints which will proxy to ML service

export const mlService = {
  /**
   * Get risk prediction for a slope
   * TODO: Backend will call ML service /predict endpoint
   * @param {number} slopeId - Slope ID
   * @param {object} sensorData - Sensor readings data
   * @returns {Promise<object>} Risk prediction with score and level
   */
  async predict(slopeId, sensorData) {
    // TODO: Replace with actual backend endpoint when ML service is integrated
    // Backend endpoint: POST /api/ml/predict
    // Backend will call FastAPI ML service and return results
    try {
      const response = await api.post('/ml/predict', {
        slopeId,
        sensorData,
      })
      return response.data.data
    } catch (error) {
      console.error('ML prediction failed:', error)
      // Return placeholder data for now
      return {
        risk_score: 0.5,
        risk_level: 'medium',
        prediction: {},
        explainability: {},
      }
    }
  },

  /**
   * Get 72-hour forecast for a slope
   * TODO: Backend will call ML service /forecast endpoint
   * @param {number} slopeId - Slope ID
   * @returns {Promise<object>} Forecast data
   */
  async forecast(slopeId) {
    // TODO: Replace with actual backend endpoint when ML service is integrated
    // Backend endpoint: POST /api/ml/forecast
    try {
      const response = await api.post('/ml/forecast', { slopeId })
      return response.data.data
    } catch (error) {
      console.error('ML forecast failed:', error)
      return {
        forecast: [],
        timestamps: [],
      }
    }
  },

  /**
   * Detect cracks/defects in an image
   * TODO: Backend will call ML service /detect endpoint
   * @param {File|string} image - Image file or URL
   * @returns {Promise<object>} Detection results
   */
  async detect(image) {
    // TODO: Replace with actual backend endpoint when ML service is integrated
    // Backend endpoint: POST /api/ml/detect
    // Backend will handle image upload and call FastAPI ML service
    try {
      const formData = new FormData()
      if (image instanceof File) {
        formData.append('image', image)
      } else {
        formData.append('image_url', image)
      }

      const response = await api.post('/ml/detect', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data.data
    } catch (error) {
      console.error('ML detection failed:', error)
      return {
        detected: false,
        confidence: 0,
        locations: [],
      }
    }
  },

  /**
   * Get SHAP explanation for a prediction
   * TODO: Backend will call ML service /explain endpoint
   * @param {number} slopeId - Slope ID
   * @param {object} predictionId - Prediction ID
   * @returns {Promise<object>} SHAP explanation data
   */
  async explain(slopeId, predictionId) {
    // TODO: Replace with actual backend endpoint when ML service is integrated
    // Backend endpoint: GET /api/ml/explain/:predictionId
    try {
      const response = await api.get(`/ml/explain/${predictionId}`, {
        params: { slopeId },
      })
      return response.data.data
    } catch (error) {
      console.error('ML explanation failed:', error)
      return {
        shap_values: {},
        feature_importance: {},
      }
    }
  },
}

