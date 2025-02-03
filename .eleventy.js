const CleanCSS = require('clean-css')
const mdFootnote = require('markdown-it-footnote')
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight')
const pluginRss = require('@11ty/eleventy-plugin-rss')

const postDate = require('./_11ty/filters/postDate')
const excerpt = require('./_11ty/filters/excerpt')
const allTags = require('./_11ty/collections/allTags')

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ public: '/' })
  eleventyConfig.addPlugin(pluginRss)
  eleventyConfig.addPlugin(syntaxHighlight)
  eleventyConfig.amendLibrary('md', (md) => md.use(mdFootnote))

  eleventyConfig.addFilter('cssmin', (code) => {
    return new CleanCSS({}).minify(code).styles
  })

  eleventyConfig.addFilter('postDate', postDate)
  eleventyConfig.addFilter('excerpt', excerpt)

  eleventyConfig.addFilter('head', (arr, n) => {
    const result = []

    for (let i = 0; i < n; i++) {
      result.push(arr[i])
    }

    return result
  })

  eleventyConfig.addFilter('tail', (arr, n) => {
    const result = []

    for (let i = arr.length - n; i < arr.length; i++) {
      result.push(arr[i])
    }

    return result
  })

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
