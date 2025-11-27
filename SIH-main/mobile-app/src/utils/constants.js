import Constants from 'expo-constants'
import { Platform } from 'react-native'

const extra = Constants.expoConfig?.extra || Constants.manifest?.extra || {}

export const API_URL = extra.apiUrl || 'http://localhost:4000/api'
export const SOCKET_URL = extra.socketUrl || 'ws://localhost:4000'

export const MEDIA_MAX_SIZE_MB = 12
export const DEVICE_PLATFORM = Platform.OS

export const COLORS = {
  primary: '#0f172a',
  accent: '#38bdf8',
  danger: '#ef4444',
  warning: '#facc15',
  success: '#22c55e',
  surface: '#1e293b',
}

