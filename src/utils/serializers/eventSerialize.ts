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

  const dayjs: any = context.root.$dayjs
  const startDatetime: string = dayjs(data.startDatetime.toDate()).format('HH:mm')
  const endDatetime: string = dayjs(data.endDatetime.toDate()).format('HH:mm')

  return {
    ...data,
    id,
    date,
    dateString: context.root.$dayjs(date).format('YYYY-MM-DD'),
    startDatetime,
    endDatetime,
    users,
    host,
    createdAt
  }
}
