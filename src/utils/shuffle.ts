export default (arr: any[]): any[] => {
  let m: number = arr.length
  while (m) {
    const i: number = Math.floor(Math.random() * m--)
    const t: any = arr[m]
    arr[m] = arr[i]
    arr[i] = t
  }
  return arr
}
