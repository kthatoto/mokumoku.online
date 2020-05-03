import { User, Comment } from '@/stores/indexStore'
import commentSerialize from './events/commentSerialize'

interface Options {
  withComment?: boolean
}

export default async (context: any, docRef: any, options: Options | undefined) => {
  const id: string = docRef.id
  const docSnapshot: any = await docRef.get()
  const data: any = docSnapshot.data()
  const date: Date = data.date.toDate()
  const users: User[] = []
  await data.users.forEach(async (userDocRef: any) => {
    users.push((await userDocRef.get()).data())
  })
  const host = (await data.host.get()).data()

  const comments: Comment[] = []
  if (options && options.withComment) {
    const commentsSnapshot: any = await docRef.collection('comments').get()
    console.log(commentsSnapshot.docs)
    commentsSnapshot.docs.forEach(async (docSnapshot: any) => {
      comments.push(await commentSerialize(docSnapshot))
    })
  }
  return {
    ...data,
    id,
    date,
    dateString: context.root.$dayjs(date).format('YYYY-MM-DD'),
    users,
    host,
    comments
  }
}
