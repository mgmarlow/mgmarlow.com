const striptags = require('striptags')

module.exports = function excerpt(post) {
  return striptags(post)
    .replace(/&quot;/g, '"')
    .substring(0, 200)
    .trim()
    .concat('...')
}
