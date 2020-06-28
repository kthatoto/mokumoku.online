import { User } from '@/stores/indexStore'
import timeConvertToOver24 from '@/utils/timeConvertToOver24'

export default async (context: any, docRef: any) => {
  const id: string = docRef.id
  const docSnapshot: any = await docRef.get()
  const data: any = docSnapshot.data()
  const date: Date = data.date.toDate()
  const createdAt: Date = data.createdAt.toDate()
  const host = (await data.hostRef.get()).data()

  const users: User[] = []
  await data.userRefs.forEach(async (userDocRef: any) => {
    const user: User = (await userDocRef.get()).data()
    users.push({ ...user, hosting: user.uid === host.uid })
  })
  const joinRequestingUsers: User[] = []
  await data.joinRequestingUserRefs.forEach(async (userDocRef: any) => {
    const user: User = (await userDocRef.get()).data()
    joinRequestingUsers.push(user)
  })

  const startDatetimeString: string = timeConvertToOver24(date, data.startDatetime.toDate())
  const endDatetimeString: string = timeConvertToOver24(date, data.endDatetime.toDate())

  return {
    id,
    title: data.title as string,
    description: data.description as string,
    url: data.url as string,
    limitUserCount: data.limitUserCount as boolean,
    maxUserCount: data.maxUserCount as number | null,
    joinPermission: data.joinPermission as boolean,
    tags: data.tags as string[],
    achievements: [], // TODO
    joinRequestingUsers,
    date,
    dateString: context.root.$dayjs(date).format('YYYY-MM-DD'),
    startDatetime: startDatetimeString,
    endDatetime: endDatetimeString,
    users,
    host,
    createdAt,
  }
}
