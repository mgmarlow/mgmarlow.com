import CleanCSS from 'clean-css'
import mdFootnote from 'markdown-it-footnote'
import syntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight'
import pluginRss from '@11ty/eleventy-plugin-rss'

import postDate from './_11ty/filters/postDate.js'
import excerpt from './_11ty/filters/excerpt.js'
import allTags from './_11ty/collections/allTags.js'

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig  */
export default async function (eleventyConfig) {
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
