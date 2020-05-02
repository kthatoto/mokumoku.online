export default async (context: any, data: any, id: string) => {
  const date: Date = data.date.toDate()
  const users: User[] = []
  await data.users.forEach(async (userDocRef: any) => {
    users.push((await userDocRef.get()).data())
  })
  const host = (await data.host.get()).data()
  return {
    ...data,
    id,
    date,
    dateString: context.root.$dayjs(date).format('YYYY-MM-DD'),
    users,
    host
  }
}
