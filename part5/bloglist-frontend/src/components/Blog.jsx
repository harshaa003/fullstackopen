import { Link } from 'react-router-dom'

const Blog = ({ blog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle} className="blog">
      <div>
        <strong className="blog-title">
          {blog.title}
        </strong>{' '}

        <span className="blog-author">
          {blog.author}
        </span>{' '}

        <Link to={`/blogs/${blog.id}`}>
          view
        </Link>
      </div>
    </div>
  )
}

export default Blog