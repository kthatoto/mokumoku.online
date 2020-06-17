import { User } from '@/stores/indexStore'
import timeConvertToOver24 from '@/utils/timeConvertToOver24'

export default async (context: any, docRef: any) => {
  const id: string = docRef.id
  const docSnapshot: any = await docRef.get()
  const data: any = docSnapshot.data()
  const date: Date = data.date.toDate()
  const createdAt: Date = data.createdAt.toDate()
  const hostType: string = data.hostRef.path.split("/")[0]
  const host = (await data.hostRef.get()).data()

  const users: User[] = []
  await data.userRefs.forEach(async (userDocRef: any) => {
    const user: User = (await userDocRef.get()).data()
    users.push({ ...user, hosting: user.uid === host.uid })
  })
  const startDatetimeString: string = timeConvertToOver24(date, data.startDatetime.toDate())
  const endDatetimeString: string = timeConvertToOver24(date, data.endDatetime.toDate())

  return {
    id,
    title: data.title,
    description: data.description,
    url: data.url,
    limitUserCount: data.limitUserCount,
    maxUserCount: data.maxUserCount,
    joinPermission: data.joinPermission,
    tags: data.tags,
    date,
    dateString: context.root.$dayjs(date).format('YYYY-MM-DD'),
    startDatetime: startDatetimeString,
    endDatetime: endDatetimeString,
    users,
    hostType,
    host,
    createdAt,
  }
}
