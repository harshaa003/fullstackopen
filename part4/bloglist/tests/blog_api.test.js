const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const config = require('../utils/config')

const api = supertest(app)

let token
let testUser

beforeEach(async () => {
  await mongoose.connect(config.MONGODB_URI, { family: 4 })

  await Blog.deleteMany({})
  await User.deleteMany({})

  const userResponse = await api
    .post('/api/users')
    .send({
      username: 'testuser',
      name: 'Test User',
      password: 'password123'
    })
    .expect(201)

  testUser = userResponse.body

  const loginResponse = await api
    .post('/api/login')
    .send({
      username: 'testuser',
      password: 'password123'
    })
    .expect(200)

  token = loginResponse.body.token
})

test('blogs are returned as json', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.length, 0)
})

test('returned blogs have id instead of _id', async () => {
  const blog = new Blog({
    title: 'Test Blog',
    author: 'Test Author',
    url: 'https://example.com',
    likes: 5
  })

  await blog.save()

  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body[0].id !== undefined, true)
  assert.strictEqual(response.body[0]._id, undefined)
  assert.strictEqual(response.body[0].__v, undefined)
})

test('a valid blog can be added', async () => {
  const blogsAtStart = await Blog.find({})

  const newBlog = {
    title: 'New Blog',
    author: 'New Author',
    url: 'https://example.com/new',
    likes: 10
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await Blog.find({})

  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1)
})

test('a blog without likes defaults to 0', async () => {
  const newBlog = {
    title: 'Blog Without Likes',
    author: 'Test Author',
    url: 'https://example.com/no-likes'
  }

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, 0)
})

test('blog without title is not added', async () => {
  const newBlog = {
    author: 'Test Author',
    url: 'https://example.com'
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)

  const blogs = await Blog.find({})

  assert.strictEqual(blogs.length, 0)
})

test('blog without url is not added', async () => {
  const newBlog = {
    title: 'Test Blog',
    author: 'Test Author'
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)

  const blogs = await Blog.find({})

  assert.strictEqual(blogs.length, 0)
})

test('a blog can be deleted', async () => {
  const user = await User.findOne({ username: 'testuser' })

  const blog = new Blog({
    title: 'Blog to Delete',
    author: 'Test Author',
    url: 'https://example.com/delete',
    likes: 5,
    user: user._id
  })

  await blog.save()

  await api
    .delete(`/api/blogs/${blog._id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const blogsAtEnd = await Blog.find({})

  assert.strictEqual(blogsAtEnd.length, 0)
})

test('a blog can be updated', async () => {
  const blog = new Blog({
    title: 'Blog to Update',
    author: 'Test Author',
    url: 'https://example.com/update',
    likes: 5
  })

  await blog.save()

  const updatedBlog = {
    title: 'Blog to Update',
    author: 'Test Author',
    url: 'https://example.com/update',
    likes: 20
  }

  const response = await api
    .put(`/api/blogs/${blog._id}`)
    .send(updatedBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, 20)
})

test('adding a blog without a token fails with status code 401', async () => {
  const newBlog = {
    title: 'No Token Blog',
    author: 'Test Author',
    url: 'https://example.com/no-token',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)

  const blogs = await Blog.find({})

  assert.strictEqual(blogs.length, 0)
})

after(async () => {
  await mongoose.connection.close()
})