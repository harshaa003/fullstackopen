const blogsRouter = require('express').Router()

const Blog = require('../models/blog')

const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1
  })

  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const user = request.user

  const blog = new Blog(request.body)

  blog.user = user._id

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)

  await user.save()

  const populatedBlog = await savedBlog.populate('user', {
    username: 1,
    name: 1
  })

  response.status(201).json(populatedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const user = request.user

  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).json({
      error: 'blog not found'
    })
  }

  if (!blog.user || blog.user.toString() !== user._id.toString()) {
    return response.status(403).json({
      error: 'only the creator can delete the blog'
    })
  }

  await Blog.findByIdAndDelete(request.params.id)

  user.blogs = user.blogs.filter(
    blogId => blogId.toString() !== blog._id.toString()
  )

  await user.save()

  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const blog = request.body

  const existingBlog = await Blog.findById(request.params.id)

  if (!existingBlog) {
    return response.status(404).json({
      error: 'blog not found'
    })
  }

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    {
      ...blog,
      user: blog.user || existingBlog.user
    },
    {
      new: true,
      runValidators: true
    }
  ).populate('user', {
    username: 1,
    name: 1
  })

  response.json(updatedBlog)
})

module.exports = blogsRouter