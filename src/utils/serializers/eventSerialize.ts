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
  const startDatetime: Date = data.startDatetime.toDate()
  const endDatetime: Date = data.endDatetime.toDate()
  let startDatetimeString: string = dayjs(startDatetime).format('HH:mm')
  let endDatetimeString: string = dayjs(endDatetime).format('HH:mm')
  if (dayjs(date).add(1, 'day').isSameOrBefore(dayjs(startDatetime))) {
    const startTimeStrings: string[] = startDatetimeString.split(':')
    startDatetimeString = `${parseInt(startTimeStrings[0]) + 24}:${startTimeStrings[1]}`
  }
  if (dayjs(date).add(1, 'day').isSameOrBefore(dayjs(endDatetime))) {
    const endTimeStrings: string[] = endDatetimeString.split(':')
    endDatetimeString = `${parseInt(endTimeStrings[0]) + 24}:${endTimeStrings[1]}`
  }

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
