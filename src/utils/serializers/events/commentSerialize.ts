import { User } from '@/stores/indexStore'
export default async (docSnapshot: any, hostUid: string) => {
  const id: string = docSnapshot.id
  const data: any = docSnapshot.data()
  const user: User = (await data.commenter.get()).data()
  const commenter: User = { ...user, hosting: user.uid === hostUid }
  if (data.type === 'text') {
    return {
      id,
      commenter,
      type: 'text',
      content: data.content,
      imageUrl: null,
      createdAt: data.createdAt
    }
  }
  if (data.type === 'image') {
    return {
      id,
      commenter,
      type: 'image',
      content: null,
      imageUrl: data.imageUrl,
      createdAt: data.createdAt
    }
  }
  return null
}
