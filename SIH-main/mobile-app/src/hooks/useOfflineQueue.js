import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { flushQueue, setupOfflineQueue } from '../services/offlineQueue'
import { useNetwork } from './useNetwork'

const OfflineQueueContext = createContext({
  pending: 0,
  lastSync: null,
  refresh: async () => {},
})

export const OfflineQueueProvider = ({ children }) => {
  const { isOnline } = useNetwork(3000)
  const [pending, setPending] = useState(0)
  const [lastSync, setLastSync] = useState(null)

  const refresh = async () => {
    await setupOfflineQueue()
    try {
      await flushQueue()
      setLastSync(new Date().toISOString())
      setPending(0)
    } catch (error) {
      console.warn('Offline queue refresh failed', error)
    }
  }

  useEffect(() => {
    setupOfflineQueue()
  }, [])

  useEffect(() => {
    if (isOnline) {
      refresh()
    }
  }, [isOnline])

  const value = useMemo(
    () => ({
      pending,
      lastSync,
      refresh,
    }),
    [pending, lastSync]
  )

  return <OfflineQueueContext.Provider value={value}>{children}</OfflineQueueContext.Provider>
}

export const useOfflineQueue = () => useContext(OfflineQueueContext)

