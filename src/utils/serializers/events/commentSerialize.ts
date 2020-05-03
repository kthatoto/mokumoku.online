import { User } from '@/stores/indexStore'
export default async (docSnapshot: any) => {
  const id: string = docSnapshot.id
  const data: any = docSnapshot.data()
  const commenter: User = (await data.commenter.get()).data()
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
