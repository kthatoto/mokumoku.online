import dayjs from 'dayjs'

export default (originDate: Date, time: Date): string => {
  const diffDates: number = dayjs(time).startOf('day').diff(dayjs(originDate).startOf('day'), 'day')
  const calculatedHour: number = parseInt(dayjs(time).format("HH")) + 24 * diffDates
  const zeroPadding = (num: number) => `0${num}`.slice(-2)
  return `${calculatedHour}:${dayjs(time).format("mm")}`
}
