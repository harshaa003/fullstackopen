import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, test, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import BlogForm from './BlogForm'

describe('BlogForm component', () => {
  test('calls event handler with correct details when a new blog is created', async () => {
    const user = userEvent.setup()
    const createBlog = vi.fn().mockResolvedValue({})

    render(
      <MemoryRouter>
        <BlogForm
          createBlog={createBlog}
        />
      </MemoryRouter>
    )

    const titleInput = screen.getByLabelText('title')
    const authorInput = screen.getByLabelText('author')
    const urlInput = screen.getByLabelText('url')
    const likesInput = screen.getByLabelText('likes')

    await user.type(titleInput, 'My new blog')
    await user.type(authorInput, 'Fathima')
    await user.type(urlInput, 'https://example.com/new')
    await user.type(likesInput, '10')

    await user.click(screen.getByText('create'))

    expect(createBlog).toHaveBeenCalledWith({
      title: 'My new blog',
      author: 'Fathima',
      url: 'https://example.com/new',
      likes: 10
    })
  })
})