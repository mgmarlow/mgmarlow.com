const { DateTime } = require('luxon')

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ 'public/*': '/' })

  eleventyConfig.addFilter('postDate', (dateObj) => {
    return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED)
  })
}
