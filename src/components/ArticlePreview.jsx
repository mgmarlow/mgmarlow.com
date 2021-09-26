const ArticlePreview = ({ article }) => {
  return <a href={article.url}>{article.title}</a>
}

export default ArticlePreview
