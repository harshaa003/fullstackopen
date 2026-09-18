import { test, expect } from '@playwright/test'

const backendUrl = 'http://localhost:3003'

const login = async (page, username, password) => {
  await page.goto('/login')

  await page.getByRole('textbox').nth(0).fill(username)
  await page.getByRole('textbox').nth(1).fill(password)

  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url, likes) => {
  await page.getByRole('link', { name: 'create' }).click()

  await page.getByLabel('title').fill(title)
  await page.getByLabel('author').fill(author)
  await page.getByLabel('url').fill(url)
  await page.getByLabel('likes').fill(String(likes))

  await page.getByRole('button', { name: 'create' }).click()

  await expect(
    page.getByText(title, { exact: true })
  ).toBeVisible()
}

const findBlog = (page, title) => {
  return page.locator('.blog').filter({
    has: page.getByText(title, { exact: true })
  })
}

test.describe('Blog app', () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post(`${backendUrl}/api/testing/reset`)

    await request.post(`${backendUrl}/api/users`, {
      data: {
        username: 'fathima5',
        name: 'Fathima Harsha',
        password: 'password123'
      }
    })

    await page.goto('/login')
  })

  test('login succeeds with correct credentials', async ({ page }) => {
    await login(page, 'fathima5', 'password123')

    await expect(
      page.getByText('Fathima Harsha logged in')
    ).toBeVisible()
  })

  test('login fails with incorrect credentials', async ({ page }) => {
    await login(page, 'fathima5', 'wrongpassword')

    await expect(
      page.getByText('Wrong username or password')
    ).toBeVisible()

    await expect(
      page.getByText('Log in to application')
    ).toBeVisible()
  })

  test('logged-in user can create a blog', async ({ page }) => {
    await login(page, 'fathima5', 'password123')

    const title = `Create Test ${Date.now()}`

    await createBlog(
      page,
      title,
      'Fathima',
      'https://example.com',
      10
    )

    await expect(
      page.getByText(title, { exact: true })
    ).toBeVisible()
  })

  test('logged-in user can like a blog', async ({ page }) => {
    await login(page, 'fathima5', 'password123')

    const title = `Like Test ${Date.now()}`

    await createBlog(
      page,
      title,
      'Fathima',
      'https://example.com',
      5
    )

    const blog = findBlog(page, title)

    await blog.getByRole('link', { name: 'view' }).click()

    await expect(
      page.getByText('likes 5')
    ).toBeVisible()

    await page.getByRole('button', { name: 'like' }).click()

    await expect(
      page.getByText('likes 6')
    ).toBeVisible()
  })

  test('logged-in user can delete a blog', async ({ page }) => {
    await login(page, 'fathima5', 'password123')

    const title = `Delete Test ${Date.now()}`

    await createBlog(
      page,
      title,
      'Fathima',
      'https://example.com',
      5
    )

    const blog = findBlog(page, title)

    await blog.getByRole('link', { name: 'view' }).click()

    page.on('dialog', dialog => dialog.accept())

    await page.getByRole('button', { name: 'remove' }).click()

    await expect(
      page.getByText(title, { exact: true })
    ).not.toBeVisible()
  })
})