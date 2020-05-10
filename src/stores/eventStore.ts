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
  reactions: Reaction[]
}

export interface Reaction {
  key: string
  user: User
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
    if (indexStore.currentUser.value === null) return false
    let result: boolean = true
    await db.collection('events').doc(eventId).update(eventInfo).catch((_: any) => {
      result = false
    })
    return result
  }

  const deleteEvent = async () => {
    if (indexStore.currentUser.value === null) return false
    let result: boolean = true
    await db.collection('events').doc(eventId).delete().catch((_: any) => {
      result = false
    })
    return result
  }

  const joinEvent = async () => {
    if (indexStore.currentUser.value === null) return false
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
    if (indexStore.currentUser.value === null) return false
    let result: boolean = true
    const commenterRef = db.collection('users').doc(indexStore.currentUser.value.uid)
    await db.collection('events').doc(eventId).collection('comments').add({
      commenter: commenterRef,
      type: 'text',
      content,
      createdAt: new Date(),
      reactions: []
    }).catch((_: any) => { result = false })
    return result
  }

  const addImageComment = async (imageUrl: string) => {
    if (indexStore.currentUser.value === null) return false
    let result: boolean = true
    const commenterRef = db.collection('users').doc(indexStore.currentUser.value.uid)
    await db.collection('events').doc(eventId).collection('comments').add({
      commenter: commenterRef,
      type: 'image',
      imageUrl,
      createdAt: new Date(),
      reactions: []
    }).catch((_: any) => { result = false })
    return result
  }

  const getComments = async () => {
    const commentsSnapshot: any = await db.collection('events').doc(eventId)
      .collection('comments').orderBy('createdAt', 'desc').get()
    const newComments: Comment[] = [...Array(commentsSnapshot.docs.length)]
    commentsSnapshot.docs.forEach(async (docSnapshot: any, i: number) => {
      const comment: Comment | null = await commentSerialize(
        docSnapshot,
        event.value.host.uid,
        event.value.users
      )
      if (comment !== null) newComments.splice(i, 1, comment)
    })
    comments.value = newComments
  }

  const deleteComment = async (commentId: string) => {
    if (indexStore.currentUser.value === null) return false
    let result: boolean = true
    await db.collection('events').doc(eventId)
      .collection('comments').doc(commentId).delete().catch((_: any) => {
        result = false
      })
    return result
  }

  const updateCommentContent = async (commentId: string, content: string) => {
    if (indexStore.currentUser.value === null) return false
    let result: boolean = true
    await db.collection('events').doc(eventId)
      .collection('comments').doc(commentId).update({ content }).catch((_: any) => {
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

  const toggleReaction = async (comment: Comment, key: string) => {
    if (indexStore.currentUser.value === null) return false
    const reactionEqual = (reaction: Reaction) => {
      return reaction.key === key && reaction.user.uid === indexStore.currentUser.value.uid
    }
    const reactionExists: boolean = comment.reactions.some((reaction: Reaction) => {
      return reactionEqual(reaction)
    })
    const newReactions: Reaction[] = []
    if (reactionExists) {
      comment.reactions.forEach((reaction: Reaction) => {
        if (reactionEqual(reaction)) return
        newReactions.push(reaction)
      })
    } else {
      newReactions.push(...comment.reactions, { key, user: indexStore.currentUser.value })
    }
    const reactionsForStore: { key: string, uid: string }[] = newReactions
      .map((reaction: Reaction) => {
        return { key: reaction.key, uid: reaction.user.uid }
      })
    let result: boolean = true
    await db.collection('events').doc(eventId).collection('comments').doc(comment.id)
      .update({ reactions: reactionsForStore }).catch((_: any) => { result = false })
    if (!result) return false
    comments.value = comments.value.map((c: Comment) => {
      if (c.id !== comment.id) return c
      return { ...c, reactions: newReactions }
    })
    return true
  }

  const hosting = computed<boolean>(() => {
    if (indexStore.currentUser.value === null) return false
    if (!event.value.host) return false
    return event.value.host.uid === indexStore.currentUser.value.uid
  })

  const joining = computed<boolean>(() => {
    if (indexStore.currentUser.value === null) return false
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
    updateCommentContent,
    toggleReaction,
    hosting,
    joining
  }
}

export type EventStore = ReturnType<typeof buildEventStore>
export const eventStoreInjectionKey: InjectionKey<EventStore> = Symbol('eventStore')
