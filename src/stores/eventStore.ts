import { InjectionKey, ref, computed } from '@vue/composition-api'

import { Event, EventInfo, User, Reaction, IndexStore } from './indexStore'
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

    const date: Date = eventInfo.date
    const startHour: number = parseInt(eventInfo.startDatetime.split(':')[0])
    const startMinute: number = parseInt(eventInfo.startDatetime.split(':')[1])
    const endHour: number = parseInt(eventInfo.endDatetime.split(':')[0])
    const endMinute: number = parseInt(eventInfo.endDatetime.split(':')[1])

    await db.collection('events').doc(eventId).update({
      ...eventInfo,
      startDatetime: new Date(date.getFullYear(), date.getMonth(), date.getDate(), startHour, startMinute),
      endDatetime: new Date(date.getFullYear(), date.getMonth(), date.getDate(), endHour, endMinute)
    }).catch((_: any) => {
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

  const applyJoiningEvent = async () => {
    if (indexStore.currentUser.value === null) return false
    if (joining.value) return false
    if (applying.value) return false
    const joinRequestingUserRefs = event.value.joinRequestingUsers.map((user: User) => db.collection('users').doc(user.uid))
    joinRequestingUserRefs.push(db.collection('users').doc(indexStore.currentUser.value.uid))
    let result: boolean = true
    await db.collection('events').doc(eventId).update({ joinRequestingUserRefs }).catch((_: any) => {
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
    await db.collection('events').doc(eventId).update({ userRefs: userDocRefs }).catch((_: any) => {
      result = false
    })
    return result
  }
  const cancelEventApplying = async () => {
    if (indexStore.currentUser.value === null) return false
    const currentUserUid: string = indexStore.currentUser.value.uid
    if (!applying.value) return false
    const joinRequestingUserRefs = event.value.joinRequestingUsers
      .filter((user: User) => user.uid !== currentUserUid)
      .map((user: User) => db.collection('users').doc(user.uid))

    let result: boolean = true
    await db.collection('events').doc(eventId).update({ joinRequestingUserRefs }).catch((_: any) => {
      result = false
    })
    return result
  }
  const cancelEventJoining = async () => {
    if (indexStore.currentUser.value === null) return false
    const currentUserUid: string = indexStore.currentUser.value.uid
    if (!joining.value) return false
    const userDocRefs = event.value.users
      .filter((user: User) => user.uid !== currentUserUid)
      .map((user: User) => db.collection('users').doc(user.uid))

    let result: boolean = true
    await db.collection('events').doc(eventId).update({ userRefs: userDocRefs }).catch((_: any) => {
      result = false
    })
    return result
  }
  const joinUserToEvent = async (user: User) => {
    if (indexStore.currentUser.value === null) return false
    if (!hosting.value) return false
    if (!event.value.joinRequestingUsers.some((u: User) => u.uid === user.uid)) return false
    const userRefs = event.value.users.map((u: User) => db.collection('users').doc(u.uid))
    userRefs.push(db.collection('users').doc(user.uid))
    const joinRequestingUserRefs = event.value.joinRequestingUsers
      .filter((u: User) => u.uid !== user.uid)
      .map((u: User) => db.collection('users').doc(u.uid))
    let result: boolean = true
    await db.collection('events').doc(eventId).update({ userRefs, joinRequestingUserRefs }).catch((_: any) => {
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
    const currentUserUid: string = indexStore.currentUser.value.uid
    const reactionEqual = (reaction: Reaction) => {
      return reaction.key === key && reaction.user.uid === currentUserUid
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
    const currentUserUid: string = indexStore.currentUser.value.uid
    return event.value.users.some((user: User) => {
      return user.uid === currentUserUid
    })
  })

  const applying = computed<boolean>(() => {
    if (indexStore.currentUser.value === null) return false
    if (!event.value.joinRequestingUsers) return false
    const currentUserUid: string = indexStore.currentUser.value.uid
    return event.value.joinRequestingUsers.some((user: User) => {
      return user.uid === currentUserUid
    })
  })

  return {
    event,
    comments,
    getEvent,
    updateEvent,
    deleteEvent,
    applyJoiningEvent,
    joinEvent,
    cancelEventApplying,
    cancelEventJoining,
    joinUserToEvent,
    addTextComment,
    addImageComment,
    getComments,
    deleteComment,
    updateCommentContent,
    toggleReaction,
    hosting,
    joining,
    applying
  }
}

export type EventStore = ReturnType<typeof buildEventStore>
export const eventStoreInjectionKey: InjectionKey<EventStore> = Symbol('eventStore')
