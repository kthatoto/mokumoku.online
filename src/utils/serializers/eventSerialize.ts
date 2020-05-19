import { User } from '@/stores/indexStore'
import timeConvertToOver24 from '@/utils/timeConvertToOver24'

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
  const startDatetimeString: string = timeConvertToOver24(date, data.startDatetime.toDate())
  const endDatetimeString: string = timeConvertToOver24(date, data.endDatetime.toDate())

  return {
    ...data,
    id,
    date,
    dateString: context.root.$dayjs(date).format('YYYY-MM-DD'),
    startDatetime: startDatetimeString,
    endDatetime: endDatetimeString,
    users,
    host,
    createdAt
  }
}
