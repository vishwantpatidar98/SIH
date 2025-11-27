import { useEffect, useState } from 'react'
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native'
import { alertsService, mlService } from '../services/api'
import AlertCard from '../components/AlertCard'
import { useOfflineQueue } from '../hooks/useOfflineQueue'
import { useNetwork } from '../hooks/useNetwork'
import { COLORS } from '../utils/constants'

export default function HomeScreen() {
  const [alerts, setAlerts] = useState([])
  const [predictionMessage, setPredictionMessage] = useState('ML predictions are not integrated on mobile yet.')
  const [refreshing, setRefreshing] = useState(false)
  const { pending, lastSync } = useOfflineQueue()
  const { isOnline } = useNetwork()

  const loadAlerts = async () => {
    try {
      const { data } = await alertsService.getLatest()
      setAlerts(data || [])
    } catch (error) {
      console.warn('Failed to load alerts', error)
    }
  }

  const loadPredictionStatus = async () => {
    try {
      const { data } = await mlService.predict({ ping: true })
      setPredictionMessage(data?.message || predictionMessage)
    } catch (error) {
      setPredictionMessage('ML service placeholder — identical to the web dashboard. Results will appear once FastAPI is wired.')
    }
  }

  useEffect(() => {
    loadAlerts()
    loadPredictionStatus()
  }, [])

  const onRefresh = async () => {
    setRefreshing(true)
    await Promise.all([loadAlerts(), loadPredictionStatus()])
    setRefreshing(false)
  }

  return (
    <ScrollView contentContainerStyle={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>Field Status</Text>
        <Text style={styles.bannerSubtitle}>{isOnline ? 'Online' : 'Offline'} · Queue {pending} · Last sync {lastSync || 'n/a'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>ML Risk Snapshot</Text>
        <Text style={styles.cardBody}>{predictionMessage}</Text>
      </View>

      <View>
        <Text style={styles.sectionTitle}>Critical Alerts</Text>
        {alerts.length === 0 && <Text style={styles.empty}>No alerts fetched yet.</Text>}
        {alerts.map((alert) => (
          <AlertCard key={alert.id} alert={alert} />
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#0b1120',
    flexGrow: 1,
  },
  banner: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  bannerSubtitle: {
    color: '#94a3b8',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#1d263a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cardBody: {
    color: '#cbd5f5',
    marginTop: 8,
    lineHeight: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  empty: {
    color: '#94a3b8',
  },
})

