import { InjectionKey, ref, computed } from '@vue/composition-api'

import { Event, EventInfo, User, IndexStore } from './indexStore'
import eventSerialize from '@/utils/serializers/eventSerialize'
import commentSerialize from '@/utils/serializers/events/commentSerialize'

export interface Comment {
  id: string
  commenter: User
  type: string
  content: string | null
  imageUrl: string | null
  createdAt: Date
  favoritedUsers: User[]
}

export const buildEventStore = (context: any, indexStore: IndexStore, eventId: string) => {
  const db = context.root.$firebase.firestore()

  const event = ref<Event>({} as Event)
  const comments = ref<Comment[]>([])

  const getEvent = async () => {
    try {
      const docRef: any = db.collection('events').doc(eventId)
      event.value = await eventSerialize(context, docRef)
      if (event.value === null) throw new Error('not_found')
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
    await db.collection('events').doc(eventId).update({ users: userDocRefs }).catch((_: any) => {
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

  const addImageComment = async (imageUrl: string) => {
    let result: boolean = true
    const commenterRef = db.collection('users').doc(indexStore.currentUser.value.uid)
    await db.collection('events').doc(eventId).collection('comments').add({
      commenter: commenterRef,
      type: 'image',
      imageUrl,
      createdAt: new Date()
    }).catch((_: any) => { result = false })
    return result
  }

  const getComments = async () => {
    const commentsSnapshot: any = await db.collection('events').doc(eventId)
      .collection('comments').orderBy('createdAt', 'desc').get()
    const newComments: Comment[] = [...Array(commentsSnapshot.docs.length)]
    commentsSnapshot.docs.forEach(async (docSnapshot: any, i: number) => {
      const comment: Comment | null = await commentSerialize(docSnapshot, event.value.host.uid)
      if (comment !== null) newComments.splice(i, 1, comment)
    })
    comments.value = newComments
  }

  const deleteComment = async (commentId: string) => {
    let result: boolean = true
    await db.collection('events').doc(eventId)
      .collection('comments').doc(commentId).delete().catch((_: any) => {
        result = false
      })
    return result
  }

  const updateComment = async (commentId: string, content: string) => {
    let result: boolean = true
    await db.collection('events').doc(eventId)
      .collection('comments').doc(commentId).set({ content }).catch((_: any) => {
        result = false
      })
    if (result) {
      comments.value = comments.value.map((comment: Comment) => {
        if (comment.id !== commentId) return comment
        return { ...comment, content }
      })
    }
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
    comments,
    getEvent,
    updateEvent,
    deleteEvent,
    joinEvent,
    addTextComment,
    addImageComment,
    getComments,
    deleteComment,
    updateComment,
    hosting,
    joining
  }
}

export type EventStore = ReturnType<typeof buildEventStore>
export const eventStoreInjectionKey: InjectionKey<EventStore> = Symbol('eventStore')
