import { User } from '@/stores/indexStore'
import { FavoriteList } from '@/stores/eventStore'

export default async (docSnapshot: any, hostUid: string, users: User[]) => {
  const id: string = docSnapshot.id
  const data: any = docSnapshot.data()
  const user: User = (await data.commenter.get()).data()
  const commenter: User = { ...user, hosting: user.uid === hostUid }

  // const findUserById = (userId: string) => {
  //   const user: User | undefined = users.find((u: User) => { u.uid === userId })
  //   return user === undefined ? null : user
  // }
  const favorites: FavoriteList[] = []
  // if (data.favorites) {
  //   data.favorites.forEach((favorite: { key: string, userUids: string[] }) => {
  //     const favoriteList: FavoriteList = data.favorites
  //       .find((f: any) => f.key === favorite.key) || { key: favorite.key, users: [] }
  //   })
  // }

  if (data.type === 'text') {
    return {
      id,
      commenter,
      type: 'text',
      content: data.content,
      imageUrl: null,
      createdAt: data.createdAt.toDate(),
      favorites
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
      favorites
    }
  }
  return null
}
