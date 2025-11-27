import { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import FieldMapView from '../components/MapView'
import { COLORS } from '../utils/constants'

const demoMarkers = [
  { id: '1', latitude: 30.3165, longitude: 78.0322, title: 'Slope 12', subtitle: 'Last updated 5m ago', riskColor: '#f97316' },
  { id: '2', latitude: 31.1048, longitude: 77.1734, title: 'Slope 4', subtitle: 'Monitoring', riskColor: '#22c55e' },
]

export default function MapScreen() {
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    setSelected(demoMarkers[0])
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <FieldMapView markers={demoMarkers} onMarkerPress={setSelected} />
      </View>
      <View style={styles.details}>
        <Text style={styles.title}>{selected?.title || 'Select a slope'}</Text>
        <Text style={styles.meta}>{selected?.subtitle || 'Tap markers to view live metadata.'}</Text>
        <Text style={styles.placeholder}>
          ML overlays (risk polygons, explainability) will appear here. This mirrors the placeholder message in `web-app/app/ml/*`.
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1120',
  },
  mapContainer: {
    flex: 1,
  },
  details: {
    padding: 16,
    backgroundColor: COLORS.surface,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  meta: {
    color: '#94a3b8',
    marginTop: 4,
  },
  placeholder: {
    color: '#cbd5f5',
    marginTop: 10,
    lineHeight: 20,
  },
})

