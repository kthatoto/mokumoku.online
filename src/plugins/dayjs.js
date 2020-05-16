import dayjs from 'dayjs'
import 'dayjs/locale/ja'
dayjs.locale('ja')
export default (_context, inject) => { inject('dayjs', dayjs) }
