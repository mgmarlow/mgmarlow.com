const esbuild = require('esbuild')
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

  eleventyConfig.addFilter('postDate', postDate)
  eleventyConfig.addFilter('excerpt', excerpt)

  eleventyConfig.addCollection('allTags', allTags)

  eleventyConfig.addWatchTarget('assets/js/')
  eleventyConfig.on('afterBuild', () => {
    return esbuild.build({
      entryPoints: ['assets/js/application.js'],
      outdir: '_site/assets/js/',
      minify: process.env.NODE_ENV === 'production',
      bundle: true,
    })
  })

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
