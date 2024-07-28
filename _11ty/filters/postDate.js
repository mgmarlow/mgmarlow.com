const { DateTime } = require('luxon')

module.exports = function postDate(dateObj) {
  return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED)
}
