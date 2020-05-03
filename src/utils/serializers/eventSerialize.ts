import commentSerialize from './events/commentSerialize'
import { User, Comment } from '@/stores/indexStore'

interface Options {
  withComment?: boolean
}

export default async (context: any, docRef: any, options: Options | null) => {
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
    commentsSnapshot.docs.forEach(async (docSnapshot: any) => {
      const comment: Comment | null = await commentSerialize(docSnapshot)
      if (comment !== null) comments.push(comment)
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
