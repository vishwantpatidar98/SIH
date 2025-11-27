import api from './api'
import { addQueueItem, deleteQueueItem, getQueueItems, initQueue } from '../storage/queue'

export const QUEUE_TYPES = {
  COMPLAINT: 'complaint',
  SOS: 'sos',
}

export const setupOfflineQueue = async () => {
  await initQueue()
}

export const enqueueComplaint = async (payload) => {
  await addQueueItem(QUEUE_TYPES.COMPLAINT, payload)
}

export const flushQueue = async () => {
  const items = await getQueueItems()
  for (const item of items) {
    try {
      switch (item.type) {
        case QUEUE_TYPES.COMPLAINT:
          await api.post('/complaints', JSON.parse(item.payload))
          break
        default:
          console.warn('Unhandled queue type', item.type)
      }
      await deleteQueueItem(item.id)
    } catch (error) {
      console.error('Queue flush failed', error)
      break
    }
  }
}

