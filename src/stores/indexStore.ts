import { InjectionKey, ref } from '@vue/composition-api'

export interface Event {
  id?: string
  title: string
  description: string
  date: Date
  dateString?: string
  startDatetime: string
  endDatetime: string
  url: string
  users?: User[]
}

export interface User {
  uid: string
  displayName: string
  photoURL: string
}

export const buildIndexStore = (context: any) => {
  const db = context.root.$firebase.firestore()

  const serialize = async (data: any, id: string) => {
    const date: Date = data.date.toDate()
    const users: User[] = []
    await data.users.forEach(async (userDocRef: any) => {
      users.push((await userDocRef.get()).data())
    })
    return {
      ...data,
      id,
      date,
      dateString: context.root.$dayjs(date).format('YYYY-MM-DD'),
      users
    }
  }
  const events = ref<Event[]>([])
  const getEvents = async () => {
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
    collection.docs.forEach(async (doc: any) => {
      const id: string = doc.id
      const data = doc.data()
      newEvents.push(await serialize(data, id))
    })
    events.value = newEvents
  }

  const event = ref<Event | null>(null)
  const getEvent = async (eventId: string) => {
    try {
      const doc: any = await db.collection('events').doc(eventId).get()
      if (!doc.exists) throw 'not_found'
      const data = doc.data()
      event.value = await serialize(data, eventId)
    } catch (e) {
      context.root.$message({ message: 'イベントが見つかりませんでした', type: 'error', duration: 5000 })
      // TODO: redirect 404
      context.root.$router.push('/')
    }
  }

  const createEvent = async (newEvent: Event) => {
    let result: boolean = true
    const currentUser: any = context.root.$firebase.auth().currentUser
    const userDocRef = db.collection('users').doc(currentUser.uid)
    await db.collection('events').add({ ...newEvent, users: [userDocRef], host: userDocRef }).catch((_: any) => {
      result = false
    })
    return result
  }

  const updateEvent = async (event: Event) => {
    let result: boolean = true
    await db.collection('events').doc(event.id).update(event).catch((_: any) => {
      result = false
    })
    return result
  }

  const deleteEvent = async (eventId: string) => {
    let result: boolean = true
    await db.collection('events').doc(eventId).delete().catch((_: any) => {
      result = false
    })
    return result
  }

  return {
    events,
    getEvents,
    event,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent
  }
}

export type IndexStore = ReturnType<typeof buildIndexStore>
export const indexStoreInjectionKey: InjectionKey<IndexStore> = Symbol('indexStore')
