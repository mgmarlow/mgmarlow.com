const { format } = require('date-fns')

module.exports = function postDate(dateObj) {
  return format(dateObj, 'dd LLL, yyyy')
}
