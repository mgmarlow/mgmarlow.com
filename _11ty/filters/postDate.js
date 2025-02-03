import { format } from 'date-fns'

export default function postDate(dateObj) {
  return format(dateObj, 'dd LLL, yyyy')
}
