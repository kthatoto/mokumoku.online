import { InjectionKey, ref, computed } from '@vue/composition-api'

import { Event, IndexStore } from './indexStore'
import eventSerialize from '@/utils/serializers/eventSerialize'

export const buildEventStore = (context: any, indexStore: IndexStore, eventId: string) => {
  const db = context.root.$firebase.firestore()

  const event = ref<Event | null>(null)
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
  getEvent()

  const updateEvent = async (event: Event) => {
    let result: boolean = true
    await db.collection('events').doc(eventId).update(event).catch((_: any) => {
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

  const hosting = computed<boolean>(() => {
    if (event.value === null) return false
    if (indexStore.currentUser.value === null) return false
    return event.value.host.uid === indexStore.currentUser.value.uid
  })

  return {
    event,
    updateEvent,
    deleteEvent,
    hosting
  }
}

export type EventStore = ReturnType<typeof buildEventStore>
export const eventStoreInjectionKey: InjectionKey<EventStore> = Symbol('eventStore')
