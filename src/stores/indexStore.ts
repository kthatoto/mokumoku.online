import { InjectionKey, ref } from '@vue/composition-api'
import eventSerialize from '@/utils/serializers/eventSerialize'

export interface EventInfo {
  title: string
  description: string
  date: Date
  startDatetime: string
  endDatetime: string
  url: string
  limitUserCount: boolean
  maxUserCount: number | null
  joinPermission: boolean
  tags: string[]
}

export interface Event extends EventInfo {
  id: string
  dateString?: string
  users: User[]
  hostType: 'users' | 'groups'
  host: User // | Group
  achievements: Achievement[]
  joinRequestingUsers: User[]
  createdAt: Date
}

export interface User {
  uid: string
  displayName: string
  imageURL: string
  hosting?: boolean
  providerId: string
}

export interface Achievement {
  id: string
  content: string
  tags: string[]
  reactions: Reaction[]
  public: boolean
}

export interface Reaction {
  key: string
  user: User
}

interface DateRange {
  start: Date
  end: Date
}

export interface SearchForm {
  tags: string[]
  dateRange: DateRange
}

export const buildIndexStore = (context: any) => {
  const db = context.root.$firebase.firestore()
  const dayjs = context.root.$dayjs

  const currentUser = ref<User | null>(null)
  const getCurrentUser = () => {
    const user = context.root.$firebase.auth().currentUser
    if (user === null) return
    const providerId: string = user.providerData[0].providerId.split('.')[0]
    currentUser.value = {
      uid: user.uid,
      displayName: user.displayName,
      imageURL: user.photoURL,
      providerId
    }
  }

  const events = ref<Event[]>([])
  const getEvents = async () => {
    await searchEvents({
      tags: [],
      dateRange: { start: new Date(), end: dayjs().add(6, 'days').toDate() }
    })
  }

  const createEvent = async (eventInfo: EventInfo) => {
    if (currentUser.value === null) return false
    let result: boolean = true
    const userDocRef = db.collection('users').doc(currentUser.value.uid)

    const date: Date = eventInfo.date
    const startHour: number = parseInt(eventInfo.startDatetime.split(':')[0])
    const startMinute: number = parseInt(eventInfo.startDatetime.split(':')[1])
    const endHour: number = parseInt(eventInfo.endDatetime.split(':')[0])
    const endMinute: number = parseInt(eventInfo.endDatetime.split(':')[1])

    await db.collection('events').add({
      ...eventInfo,
      startDatetime: new Date(date.getFullYear(), date.getMonth(), date.getDate(), startHour, startMinute),
      endDatetime: new Date(date.getFullYear(), date.getMonth(), date.getDate(), endHour, endMinute),
      userRefs: [userDocRef],
      hostRef: userDocRef,
      achievementRefs: [],
      joinRequestingUserRefs: [],
      createdAt: new Date()
    }).catch((_: any) => { result = false })
    return result
  }

  const searchEvents = async (form: SearchForm) => {
    let result: boolean = true
    const startDate: Date = dayjs(form.dateRange.start).startOf('day').subtract(1, 'second').toDate()
    const endDate: Date = dayjs(form.dateRange.end).endOf('day').toDate()
    const snapshot: any = await db.collection('events')
      .where('date', '>=', startDate)
      .where('date', '<=', endDate)
      .orderBy('date', 'asc')
      .get()
      .catch((_: any) => { result = false })
    if (!result) {
      return context.root.$message({
        message: '情報の読み込みに失敗しました。ネットワークの良い環境でご利用ください',
        type: 'error',
        duration: 5000
      })
    }
    const newEvents: Event[] = []
    snapshot.docs.forEach(async (docSnapshot: any) => {
      const tagMatched: boolean = docSnapshot.data().tags
        .some((tag: string) => form.tags.includes(tag))
      if (form.tags.length > 0 && !tagMatched) return
      newEvents.push(await eventSerialize(context, docSnapshot.ref))
    })
    events.value = newEvents
  }

  return {
    currentUser,
    getCurrentUser,
    events,
    getEvents,
    createEvent,
    searchEvents
  }
}

export type IndexStore = ReturnType<typeof buildIndexStore>
export const indexStoreInjectionKey: InjectionKey<IndexStore> = Symbol('indexStore')
