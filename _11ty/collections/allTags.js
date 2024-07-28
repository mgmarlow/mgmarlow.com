module.exports = async function allTags(api) {
  const items = await api.getAll()

  return items
    .flatMap((i) => i.data.tags)
    .filter((tag, i, self) => {
      if (!tag || tag === 'post') {
        return false
      }

      return self.indexOf(tag) === i
    })
}
