import { InjectionKey, ref, computed } from '@vue/composition-api'

import { Event, EventInfo, User, IndexStore } from './indexStore'
import eventSerialize from '@/utils/serializers/eventSerialize'

export const buildEventStore = (context: any, indexStore: IndexStore, eventId: string) => {
  const db = context.root.$firebase.firestore()

  const event = ref<Event>({} as Event)
  const getEvent = async () => {
    try {
      const docRef: any = await db.collection('events').doc(eventId)
      event.value = await eventSerialize(context, docRef, { withComment: true })
      if (event.value === null) throw 'not_found'
    } catch (e) {
      context.root.$message({
        message: 'イベントが見つかりませんでした',
        type: 'error',
        duration: 5000
      })
      // TODO: redirect 404
      context.root.$router.push('/')
    }
  }

  const updateEvent = async (eventInfo: EventInfo) => {
    let result: boolean = true
    await db.collection('events').doc(eventId).update(eventInfo).catch((_: any) => {
      result = false
    })
    return result
  }

  const deleteEvent = async () => {
    let result: boolean = true
    await db.collection('events').doc(eventId).delete().catch((_: any) => {
      result = false
    })
    return result
  }

  const joinEvent = async () => {
    if (joining.value) return false
    const userDocRefs = event.value.users.map((user: User) => db.collection('users').doc(user.uid))
    userDocRefs.push(db.collection('users').doc(indexStore.currentUser.value.uid))
    let result: boolean = true
    await db.collection('events').doc(eventId).update({users: userDocRefs}).catch((_: any) => {
      result = false
    })
    return result
  }

  const addTextComment = async (content: string) => {
    let result: boolean = true
    const commenterRef = db.collection('users').doc(indexStore.currentUser.value.uid)
    await db.collection('events').doc(eventId).collection('comments').add({
      commenter: commenterRef,
      type: 'text',
      content,
      createdAt: new Date()
    }).catch((_: any) => { result = false })
    return result
  }

  const hosting = computed<boolean>(() => {
    if (!event.value.host) return false
    return event.value.host.uid === indexStore.currentUser.value.uid
  })

  const joining = computed<boolean>(() => {
    if (!event.value.users) return false
    return event.value.users.some((user: User) => {
      return user.uid === indexStore.currentUser.value.uid
    })
  })

  return {
    event,
    getEvent,
    updateEvent,
    deleteEvent,
    joinEvent,
    addTextComment,
    hosting,
    joining
  }
}

export type EventStore = ReturnType<typeof buildEventStore>
export const eventStoreInjectionKey: InjectionKey<EventStore> = Symbol('eventStore')
