import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'

const BlogContainer = styled.div`
  max-width: 700px;
  margin: 30px auto;
  padding: 25px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background: #f9f9f9;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`

const Title = styled.h2`
  margin-bottom: 10px;
  color: #333;
`

const Author = styled.div`
  font-size: 18px;
  margin-bottom: 15px;
  color: #555;
`

const BlogLink = styled.a`
  display: block;
  margin-bottom: 20px;
  color: #0066cc;
  word-break: break-word;
`

const Likes = styled.div`
  font-size: 18px;
  margin-bottom: 15px;
`

const Button = styled.button`
  padding: 7px 14px;
  margin-left: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`

const RemoveButton = styled(Button)`
  background: #d9534f;
  color: white;
`

const Creator = styled.div`
  margin-top: 15px;
  color: #666;
  font-style: italic;
`

const BlogView = ({
  blogs,
  user,
  updateBlog,
  removeBlog
}) => {
  const { id } = useParams()
  const navigate = useNavigate()

  const blog = blogs.find(blog => blog.id === id)

  if (!blog) {
    return <div>Blog not found</div>
  }

  const handleLike = () => {
    if (!user) {
      return
    }

    const updatedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user ? blog.user.id : undefined
    }

    updateBlog(updatedBlog, blog.id)
  }

  const handleDelete = async () => {
    if (
      window.confirm(
        `Remove blog ${blog.title} by ${blog.author}?`
      )
    ) {
      await removeBlog(blog.id)
      navigate('/')
    }
  }

  const isCreator =
    blog.user &&
    user &&
    blog.user.username === user.username

  return (
    <BlogContainer>
      <Title>{blog.title}</Title>

      <Author>
        by {blog.author}
      </Author>

      <BlogLink
        href={blog.url}
        target="_blank"
        rel="noreferrer"
      >
        {blog.url}
      </BlogLink>

      <Likes>
        likes {blog.likes}

        {user && (
          <Button onClick={handleLike}>
            like
          </Button>
        )}
      </Likes>

      {blog.user && (
        <Creator>
          added by {blog.user.name}
        </Creator>
      )}

      {isCreator && (
        <RemoveButton onClick={handleDelete}>
          remove
        </RemoveButton>
      )}
    </BlogContainer>
  )
}

export default BlogView