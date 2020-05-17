import dayjs from 'dayjs'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import 'dayjs/locale/ja'
dayjs.locale('ja')
dayjs.extend(isSameOrBefore)
export default (_context, inject) => { inject('dayjs', dayjs) }
