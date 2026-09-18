import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

const FormContainer = styled.div`
  background: #f5f5f5;
  padding: 20px;
  margin-top: 20px;
  border-radius: 8px;
  max-width: 500px;
`

const FormRow = styled.div`
  margin-bottom: 12px;
`

const Label = styled.label`
  display: flex;
  flex-direction: column;
  font-weight: bold;
  gap: 5px;
`

const Input = styled.input`
  padding: 8px;
  border: 1px solid #aaa;
  border-radius: 4px;
  font-size: 16px;
`

const Button = styled.button`
  padding: 8px 16px;
  margin-right: 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 15px;
`

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [likes, setLikes] = useState('')

  const navigate = useNavigate()

  const handleSubmit = async event => {
    event.preventDefault()

    const blog = {
      title,
      author,
      url,
      likes: Number(likes) || 0
    }

    try {
      await createBlog(blog)

      setTitle('')
      setAuthor('')
      setUrl('')
      setLikes('')

      navigate('/')
    } catch {
      // error notification is handled by App
    }
  }

  return (
    <FormContainer>
      <h3>create new</h3>

      <form onSubmit={handleSubmit}>
        <FormRow>
          <Label>
            title
            <Input
              value={title}
              onChange={({ target }) =>
                setTitle(target.value)
              }
            />
          </Label>
        </FormRow>

        <FormRow>
          <Label>
            author
            <Input
              value={author}
              onChange={({ target }) =>
                setAuthor(target.value)
              }
            />
          </Label>
        </FormRow>

        <FormRow>
          <Label>
            url
            <Input
              value={url}
              onChange={({ target }) =>
                setUrl(target.value)
              }
            />
          </Label>
        </FormRow>

        <FormRow>
          <Label>
            likes
            <Input
              type="number"
              value={likes}
              onChange={({ target }) =>
                setLikes(target.value)
              }
            />
          </Label>
        </FormRow>

        <Button type="submit">
          create
        </Button>

        <Button
          type="button"
          onClick={() => navigate('/')}
        >
          cancel
        </Button>
      </form>
    </FormContainer>
  )
}

export default BlogForm