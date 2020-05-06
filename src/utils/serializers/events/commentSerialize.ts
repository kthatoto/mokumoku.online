import { User } from '@/stores/indexStore'
import { Reaction } from '@/stores/eventStore'

export default async (docSnapshot: any, hostUid: string, users: User[]) => {
  const id: string = docSnapshot.id
  const data: any = docSnapshot.data()
  const user: User = (await data.commenter.get()).data()
  const commenter: User = { ...user, hosting: user.uid === hostUid }

  const findUserByUid = (uid: string) => {
    const user: User | undefined = users.find((u: User) => u.uid === uid)
    return user === undefined ? null : user
  }
  const reactions: Reaction[] = []
  data.reactions.forEach((reaction: { key: string, uid: string }) => {
    const user: User | null = findUserByUid(reaction.uid)
    if (user) reactions.push({ key: reaction.key, user })
  })

  if (data.type === 'text') {
    return {
      id,
      commenter,
      type: 'text',
      content: data.content,
      imageUrl: null,
      createdAt: data.createdAt.toDate(),
      reactions
    }
  }
  if (data.type === 'image') {
    return {
      id,
      commenter,
      type: 'image',
      content: null,
      imageUrl: data.imageUrl,
      createdAt: data.createdAt.toDate(),
      reactions
    }
  }
  return null
}
