import { User } from '@/stores/indexStore'
export default async (docSnapshot: any) => {
  const data: any = docSnapshot.data()
  const commenter: User = (await data.commenter.get()).data()
  if (data.type === 'text') {
    return {
      commenter,
      type: data.type,
      content: data.content,
      imageUrl: null,
      createdAt: data.createdAt
    }
  }
  if (data.type === 'image') {
    return {
      commenter,
      type: data.type,
      content: null,
      imageUrl: data.imageUrl,
      createdAt: data.createdAt
    }
  }
}
