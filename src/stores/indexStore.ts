import { InjectionKey, ref } from '@vue/composition-api'

export interface Event {
  id?: string
  title: string
  description: string
  date: Date
  startDatetime: string
  endDatetime: string
}

export const buildIndexStore = (context: any) => {
  const events = ref<Event[]>([])
  const db = context.root.$firebase.firestore()
  const getResources = async () => {
    const newEvents: Event[] = []
    const collection: any = await db.collection('events').get()
    collection.docs.forEach((doc: any) => {
      const data = doc.data()
      newEvents.push({ ...data })
    })
    events.value = newEvents
  }

  const createEvent = async (newEvent: Event) => {
    try {
      await db.collection('events').add({ ...newEvent })
      return true
    } catch (_e) {
      return false
    }
  }

  return { getResources, events, createEvent }
}

export type IndexStore = ReturnType<typeof buildIndexStore>
export const indexStoreInjectionKey: InjectionKey<IndexStore> = Symbol('indexStore')
