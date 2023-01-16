const pluginRss = require('@11ty/eleventy-plugin-rss')
const { DateTime } = require('luxon')

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ 'public/*': '/' })
  eleventyConfig.addPlugin(pluginRss)

  eleventyConfig.addFilter('postDate', (dateObj) => {
    return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED)
  })

  eleventyConfig.addFilter('excerpt', (post) => {
    const content = post.replace(/(<([^>]+)>)/gi, '')
    return content.substr(0, content.lastIndexOf(' ', 200)) + '...'
  })

  eleventyConfig.addCollection('allTags', async (api) => {
    const items = await api.getAll()

    return items
      .flatMap((i) => i.data.tags)
      .filter((tag, i, self) => {
        if (!tag || tag === 'post') {
          return false
        }

        return self.indexOf(tag) === i
      })
  })
}
