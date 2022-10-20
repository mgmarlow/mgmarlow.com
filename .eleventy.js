const pluginRss = require('@11ty/eleventy-plugin-rss')
const { DateTime } = require('luxon')

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ 'public/*': '/' })
  eleventyConfig.addPlugin(pluginRss)

  eleventyConfig.addFilter('postDate', (dateObj) => {
    return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED)
  })

  eleventyConfig.addFilter('excerpt', (post) => {
    const content = post.replace(/(<([^>]+)>)/gi, "");
    return content.substr(0, content.lastIndexOf(" ", 200)) + "...";
  })
}
