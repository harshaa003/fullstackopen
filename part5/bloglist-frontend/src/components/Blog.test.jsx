import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, test, expect, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import BlogView from './BlogView'

const blog = {
  title: 'Testing React applications',
  author: 'Fathima Harsha',
  url: 'https://example.com',
  likes: 5,
  user: {
    username: 'fathima5',
    name: 'Fathima Harsha',
    id: '12345'
  },
  id: '67890'
}

const renderBlogView = user => {
  render(
    <MemoryRouter initialEntries={[`/blogs/${blog.id}`]}>
      <Routes>
        <Route
          path="/blogs/:id"
          element={
            <BlogView
              blogs={[blog]}
              user={user}
              updateBlog={() => {}}
              removeBlog={() => {}}
            />
          }
        />
      </Routes>
    </MemoryRouter>
  )
}

describe('BlogView component', () => {
  test('unauthenticated user sees blog information and likes, but no buttons', () => {
    renderBlogView(null)

    expect(
      screen.getByText('Testing React applications')
    ).toBeInTheDocument()

    expect(
      screen.getByText('by Fathima Harsha')
    ).toBeInTheDocument()

    expect(
      screen.getByText('https://example.com')
    ).toBeInTheDocument()

    expect(
      screen.getByText('likes 5')
    ).toBeInTheDocument()

    expect(
      screen.queryByRole('button', { name: 'like' })
    ).not.toBeInTheDocument()

    expect(
      screen.queryByRole('button', { name: 'remove' })
    ).not.toBeInTheDocument()
  })

  test('authenticated non-creator sees like button but not remove button', () => {
    renderBlogView({
      username: 'seconduser',
      name: 'Second User'
    })

    expect(
      screen.getByRole('button', { name: 'like' })
    ).toBeInTheDocument()

    expect(
      screen.queryByRole('button', { name: 'remove' })
    ).not.toBeInTheDocument()
  })

  test('creator sees both like and remove buttons', () => {
    renderBlogView(blog.user)

    expect(
      screen.getByRole('button', { name: 'like' })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: 'remove' })
    ).toBeInTheDocument()
  })

  test('like button calls update handler', async () => {
    const user = userEvent.setup()
    const updateBlog = vi.fn()

    render(
      <MemoryRouter initialEntries={[`/blogs/${blog.id}`]}>
        <Routes>
          <Route
            path="/blogs/:id"
            element={
              <BlogView
                blogs={[blog]}
                user={blog.user}
                updateBlog={updateBlog}
                removeBlog={() => {}}
              />
            }
          />
        </Routes>
      </MemoryRouter>
    )

    await user.click(
      screen.getByRole('button', { name: 'like' })
    )

    expect(updateBlog).toHaveBeenCalledTimes(1)
  })
})