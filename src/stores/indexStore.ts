import { InjectionKey, ref } from '@vue/composition-api'
import eventSerialize from '@/utils/serializers/eventSerialize'

export interface EventInfo {
  title: string
  description: string
  date: Date
  startDatetime: string
  endDatetime: string
  url: string
}

export interface Event extends EventInfo {
  id: string
  dateString?: string
  users: User[]
  host: User
  createdAt: Date
}

export interface User {
  uid: string
  displayName: string
  photoURL: string
  hosting?: boolean
  providerId: string
}

export const buildIndexStore = (context: any) => {
  const db = context.root.$firebase.firestore()

  const currentUser = ref<User>({} as User)
  const getCurrentUser = () => {
    const user = context.root.$firebase.auth().currentUser
    const providerId: string = user.providerData[0].providerId.split('.')[0]
    currentUser.value = {
      uid: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL,
      providerId
    }
  }

  const events = ref<Event[]>([])
  const getEvents = async () => {
    const newEvents: Event[] = []
    let result: boolean = true
    const snapshot: any = await db.collection('events')
      .orderBy('createdAt', 'desc').get()
      .catch((_: any) => { result = false })
    if (!result) {
      return context.root.$message({
        message: '情報の読み込みに失敗しました。ネットワークの良い環境でご利用ください',
        type: 'error',
        duration: 5000
      })
    }
    snapshot.docs.forEach(async (docSnapshot: any) => {
      newEvents.push(await eventSerialize(context, docSnapshot.ref))
    })
    events.value = newEvents
  }

  const createEvent = async (eventInfo: EventInfo) => {
    let result: boolean = true
    const currentUser: any = context.root.$firebase.auth().currentUser
    const userDocRef = db.collection('users').doc(currentUser.uid)
    await db.collection('events').add({
      ...eventInfo,
      users: [userDocRef],
      host: userDocRef,
      createdAt: new Date()
    }).catch((_: any) => { result = false })
    return result
  }

  return {
    currentUser,
    getCurrentUser,
    events,
    getEvents,
    createEvent
  }
}

export type IndexStore = ReturnType<typeof buildIndexStore>
export const indexStoreInjectionKey: InjectionKey<IndexStore> = Symbol('indexStore')
