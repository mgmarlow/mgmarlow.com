const ArticlePreview = ({ article }) => {
  return (
    <div className="columns">
      <div className="column is-2 is-hidden-mobile">
        {article.date.substring(0, 10)}
      </div>
      <div className="column">
        <a href={article.url}>{article.title}</a>
      </div>
    </div>
  )
}

export default ArticlePreview
