import _ from 'lodash'
import moment from 'moment'

export const renderPrice = (value) => {
  let numValue
  if (!_.isNumber(value)) numValue = Number(value)
  else numValue = value
  if (numValue > 0) return '$' + value.toFixed(2)
  else return ''
}

export const timestampToDate = timestamp => {
  let date = new moment(timestamp)
  return date.format('MMM D YY, h:mm a')
}
