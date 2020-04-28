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
  const getResources = async () => {
    return
    const db = context.root.$firebase.firestore()

    const newEvents: Event[] = []
    const collection: any = await db.collection('events').get()
    collection.docs.forEach((doc: any) => {
      const data = doc.data()
      newEvents.push({ ...data })
    })
    events.value = newEvents
  }

  const createEvent = (newEvent: Event) => {
    console.log(newEvent)
  }

  return { getResources, events, createEvent }
}

export type IndexStore = ReturnType<typeof buildIndexStore>
export const indexStoreInjectionKey: InjectionKey<IndexStore> = Symbol('indexStore')
