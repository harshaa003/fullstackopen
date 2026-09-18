const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const blogs = [
  {
    _id: '1',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://example.com/dijkstra',
    likes: 5,
    __v: 0
  },
  {
    _id: '2',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '3',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    url: 'https://example.com/clean-code',
    likes: 10,
    __v: 0
  },
  {
    _id: '4',
    title: 'Test Driven Development',
    author: 'Robert C. Martin',
    url: 'https://example.com/tdd',
    likes: 6,
    __v: 0
  },
  {
    _id: '5',
    title: 'Algorithms',
    author: 'Robert C. Martin',
    url: 'https://example.com/algorithms',
    likes: 4,
    __v: 0
  }
]

test('dummy returns one', () => {
  const result = listHelper.dummy([])

  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes([blogs[0]])

    assert.strictEqual(result, 5)
  })

  test('when list has multiple blogs, equals the total likes', () => {
    const result = listHelper.totalLikes(blogs)

    assert.strictEqual(result, 32)
  })
})

describe('favorite blog', () => {
  test('returns the blog with the most likes', () => {
    const result = listHelper.favoriteBlog(blogs)

    assert.deepStrictEqual(result, blogs[2])
  })
})

describe('most blogs', () => {
  test('returns the author with the most blogs', () => {
    const result = listHelper.mostBlogs(blogs)

    assert.deepStrictEqual(result, {
      author: 'Robert C. Martin',
      blogs: 3
    })
  })
})

describe('most likes', () => {
  test('returns the author with the most likes', () => {
    const result = listHelper.mostLikes(blogs)

    assert.deepStrictEqual(result, {
      author: 'Robert C. Martin',
      likes: 20
    })
  })
})