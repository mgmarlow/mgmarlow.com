import striptags from 'striptags'

export default function excerpt(post, n = 200) {
  return striptags(post)
    .replace(/&quot;/g, '"')
    .substring(0, n)
    .trim()
    .concat('...')
}
