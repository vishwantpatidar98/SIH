'use client'

import { useEffect, useState } from 'react'
import io from 'socket.io-client'
import { useAuth } from './useAuth'

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000'

export function useWebSocket() {
  const { user } = useAuth()
  const [socket, setSocket] = useState(null)
  const [events, setEvents] = useState([])

  useEffect(() => {
    if (!user) return

    const s = io(SOCKET_URL, {
      auth: { token: localStorage.getItem('token') },
    })

    s.on('connect', () => {
      s.emit('join', user.id)
    })

    s.on('alert', (data) => {
      setEvents((prev) => [...prev, data])
    })

    setSocket(s)

    return () => s.disconnect()
  }, [user])

  return { socket, events }
}
