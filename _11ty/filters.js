import striptags from 'striptags'
import { format } from 'date-fns'

const pluginFilters = (eleventyConfig) => {
  eleventyConfig.addFilter('postDate', (dateObj) => format(dateObj, 'dd LLL, yyyy'))

  eleventyConfig.addFilter('excerpt', (content, n = 200) => {
    const start = content.toLowerCase().indexOf('<p>');
    const end = content.toLowerCase().indexOf('</p>');
    
    // length of <p>
    return striptags(content.substring(start + 3, end));
  })

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
}

export default pluginFilters
