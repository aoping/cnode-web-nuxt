import moment from '@/plugins/moment'

/**
 * 格式化日期或时间
 * @param {string} time 需要格式化的时间
 * @param {bool} friendly 是否是fromNow
 */
export const getLastTimeStr = (time, friendly) => {
  if (friendly) {
    return moment(time).fromNow()
  } else {
    return moment(time).format('YYYY-MM-DD')
  }
}
