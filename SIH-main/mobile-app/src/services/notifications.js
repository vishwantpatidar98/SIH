import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import { Platform } from 'react-native'
import io from 'socket.io-client'
import { SOCKET_URL } from '../utils/constants'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
})

let socket

export const connectSocket = (token) => {
  if (socket) return socket
  socket = io(SOCKET_URL, {
    transports: ['websocket'],
    auth: { token },
  })
  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export const registerForPushNotificationsAsync = async () => {
  if (!Device.isDevice) {
    console.log('Push notifications require a physical device.')
    return null
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync()
  let finalStatus = existingStatus
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }
  if (finalStatus !== 'granted') {
    console.log('Failed to get push token for push notification!')
    return null
  }

  const token = await Notifications.getExpoPushTokenAsync()

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('alerts', {
      name: 'Field Alerts',
      importance: Notifications.AndroidImportance.MAX,
    })
  }

  return token.data
}

