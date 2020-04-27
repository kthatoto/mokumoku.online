import { InjectionKey, ref } from '@vue/composition-api'

interface Event {
  title: string
  description: string
}

export const buildIndexStore = (context: any) => {
  const getResources = async () => {
    const db = context.root.$firebase.firestore()

    const newEvents: Event[] = []
    const collection: any = await db.collection('events').get()
    collection.docs.forEach((doc: any) => {
      const data = doc.data()
      newEvents.push({ ...data })
    })
    events.value = newEvents
  }
  const events = ref<Event[]>([])
  return { getResources, events }
}

export type IndexStore = ReturnType<typeof buildIndexStore>
export const indexStoreInjectionKey: InjectionKey<IndexStore> = Symbol('indexStore')
