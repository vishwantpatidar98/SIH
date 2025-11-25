const buildPlaceholder = (type, data = {}) => ({
  ok: false,
  implemented: false,
  message: 'ML not integrated yet — placeholder only',
  data: {
    type,
    generated_at: new Date().toISOString(),
    ...data
  }
});

const predict = async ({ slopeId, sensorData = {} }) =>
  buildPlaceholder('predict', {
    slopeId,
    sensor_preview: sensorData,
    risk_score: 0.48,
    risk_level: 'medium'
  });

const detect = async ({ file, imageUrl }) =>
  buildPlaceholder('detect', {
    detected: false,
    confidence: 0,
    source: file ? { filename: file.originalname, size: file.size } : { imageUrl }
  });

const forecast = async ({ slopeId }) =>
  buildPlaceholder('forecast', {
    slopeId,
    timestamps: ['+12h', '+24h', '+36h', '+48h', '+60h', '+72h'],
    forecast: [0.35, 0.4, 0.45, 0.5, 0.52, 0.55]
  });

const explain = async ({ predictionId, slopeId }) =>
  buildPlaceholder('explain', {
    predictionId,
    slopeId,
    shap_values: {
      rainfall: 0.24,
      tilt_angle: 0.31,
      vibration: 0.18
    },
    feature_importance: {
      rainfall: 'medium',
      tilt_angle: 'high',
      vibration: 'low'
    }
  });

const listPredictions = async () =>
  buildPlaceholder('predictions', {
    predictions: []
  });

module.exports = {
  predict,
  detect,
  forecast,
  explain,
  listPredictions
};

