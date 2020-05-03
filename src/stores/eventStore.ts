import { InjectionKey, ref, computed } from '@vue/composition-api'

import { Event, User, IndexStore } from './indexStore'
import eventSerialize from '@/utils/serializers/eventSerialize'

export const buildEventStore = (context: any, indexStore: IndexStore, eventId: string) => {
  const db = context.root.$firebase.firestore()

  const event = ref<Event>({} as Event)
  const getEvent = async () => {
    try {
      const doc: any = await db.collection('events').doc(eventId).get()
      if (!doc.exists) throw 'not_found'
      const data = doc.data()
      event.value = await eventSerialize(context, data, eventId)
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

  const updateEvent = async (event: Event) => {
    let result: boolean = true
    const updatingEvent = {
      title: event.title,
      description: event.description,
      date: event.date,
      startDatetime: event.startDatetime,
      endDatetime: event.endDatetime,
      url: event.url
    }
    await db.collection('events').doc(eventId).update(updatingEvent).catch((_: any) => {
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
    await db.collection('events').doc(eventId).collection('comments').add({
      type: 'text',
      content,
      createdAt: new Date()
    }).catch((_: any) => { result = false })
    return result
  }

  const hosting = computed<boolean>(() => {
    return event.value.host.uid === indexStore.currentUser.value.uid
  })

  const joining = computed<boolean>(() => {
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
