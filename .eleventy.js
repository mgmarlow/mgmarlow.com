const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight')
const pluginRss = require('@11ty/eleventy-plugin-rss')

const postDate = require('./_11ty/filters/postDate')
const excerpt = require('./_11ty/filters/excerpt')
const allTags = require('./_11ty/collections/allTags')

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ public: '/' })
  eleventyConfig.addPlugin(pluginRss)
  eleventyConfig.addPlugin(syntaxHighlight)

  eleventyConfig.addFilter('postDate', postDate)
  eleventyConfig.addFilter('excerpt', excerpt)

  eleventyConfig.addCollection('allTags', allTags)

  return {
    templateFormats: ['md', 'njk', 'html'],
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    dir: {
      input: 'content',
      includes: '../_includes',
      data: '../_data',
      output: '_site',
    },
  }
}
