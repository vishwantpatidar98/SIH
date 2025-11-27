import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import HomeScreen from '../screens/HomeScreen'
import MapScreen from '../screens/MapScreen'
import ComplaintScreen from '../screens/ComplaintScreen'
import SosScreen from '../screens/SosScreen'
import GovAlertsScreen from '../screens/GovAlertsScreen'
import { COLORS } from '../utils/constants'

const Tab = createBottomTabNavigator()

export default function AppNavigator({ onLogout }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: '#0b1120' },
        headerTintColor: '#fff',
        tabBarStyle: { backgroundColor: '#0b1120', borderTopColor: '#1e293b' },
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: '#475569',
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Home: 'home',
            Map: 'map',
            Report: 'camera',
            SOS: 'warning',
            Advisories: 'notifications',
          }
          return <Ionicons name={icons[route.name] || 'ellipse'} size={size} color={color} />
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Overview' }} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Report" component={ComplaintScreen} />
      <Tab.Screen name="SOS" component={SosScreen} />
      <Tab.Screen
        name="Advisories"
        component={GovAlertsScreen}
        options={{
          headerRight: () => (
            <Ionicons name="log-out" color="#f87171" size={20} style={{ marginRight: 16 }} onPress={onLogout} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

