import { User } from '@/stores/indexStore'

export default async (context: any, docRef: any) => {
  const id: string = docRef.id
  const docSnapshot: any = await docRef.get()
  const data: any = docSnapshot.data()
  const date: Date = data.date.toDate()
  const createdAt: Date = data.createdAt.toDate()
  const host = (await data.host.get()).data()

  const users: User[] = []
  await data.users.forEach(async (userDocRef: any) => {
    const user: User = (await userDocRef.get()).data()
    users.push({ ...user, hosting: user.uid === host.uid })
  })

  // const comments: Comment[] = []
  // if (options && options.withComment) {
  //   const commentsSnapshot: any = await docRef.collection('comments')
  //     .orderBy('createdAt', 'desc').get()
  //   comments.length = commentsSnapshot.docs.length
  //   commentsSnapshot.docs.forEach(async (docSnapshot: any, i: number) => {
  //     const comment: Comment | null = await commentSerialize(docSnapshot, host.uid)
  //     if (comment !== null) comments.splice(i, 1, comment)
  //     console.log(comment)
  //   })
  // }
  return {
    ...data,
    id,
    date,
    dateString: context.root.$dayjs(date).format('YYYY-MM-DD'),
    users,
    host,
    createdAt
  }
}
