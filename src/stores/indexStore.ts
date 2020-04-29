import { InjectionKey, ref } from '@vue/composition-api'

export interface Event {
  id?: string
  title: string
  description: string
  date: Date
  startDatetime: string
  endDatetime: string
  users?: User[]
}

export interface User {
  uid: string
  displayName: string
  photoURL: string
}

export const buildIndexStore = (context: any) => {
  const events = ref<Event[]>([])
  const db = context.root.$firebase.firestore()

  const getResources = async () => {
    const newEvents: Event[] = []
    let result: boolean = true
    const collection: any = await db.collection('events').get().catch((_: any) => {
      result = false
    })
    if (!result) {
      return context.root.$message({
        message: '情報の読み込みに失敗しました。ネットワークの良い環境でご利用ください',
        type: 'error',
        duration: 5000
      })
    }
    collection.docs.forEach((doc: any) => {
      const id: string = doc.id
      const data = doc.data()
      newEvents.push({ ...data, id, date: data.date.toDate() })
    })
    events.value = newEvents
  }

  const event = ref<Event | null>(null)
  const getResource = async () => {
  }

  const createEvent = async (newEvent: Event) => {
    let result: boolean = true
    const currentUser: any = context.root.$firebase.auth().currentUser
    const user: User = { uid: currentUser.uid, displayName: currentUser.displayName, photoURL: currentUser.photoURL }
    await db.collection('events').add({ ...newEvent, users: [user] }).catch((_: any) => {
      result = false
    })
    return result
  }

  return {
    events,
    getResources,
    event,
    getResource,
    createEvent
  }
}

export type IndexStore = ReturnType<typeof buildIndexStore>
export const indexStoreInjectionKey: InjectionKey<IndexStore> = Symbol('indexStore')
