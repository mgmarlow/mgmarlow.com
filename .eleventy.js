import CleanCSS from 'clean-css'
import mdFootnote from 'markdown-it-footnote'
import syntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight'
import pluginRss from '@11ty/eleventy-plugin-rss'

import pluginFilters from './_11ty/filters.js'

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig  */
export default async function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ public: '/' })
  eleventyConfig.addPlugin(pluginRss)
  eleventyConfig.addPlugin(syntaxHighlight)
  eleventyConfig.amendLibrary('md', (md) => md.use(mdFootnote))

  eleventyConfig.addFilter('cssmin', (code) => {
    return new CleanCSS({}).minify(code).styles
  })

  eleventyConfig.addPlugin(pluginFilters)

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
