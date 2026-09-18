const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const User = require('../models/user')
const config = require('../utils/config')

const api = supertest(app)

beforeEach(async () => {
  await mongoose.connect(config.MONGODB_URI, { family: 4 })
  await User.deleteMany({})
})

test('a valid user can be created', async () => {
  const newUser = {
    username: 'testuser',
    name: 'Test User',
    password: 'password123'
  }

  const response = await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.username, 'testuser')
  assert.strictEqual(response.body.name, 'Test User')
  assert.strictEqual(response.body.passwordHash, undefined)
})

test('user with too short username is not created', async () => {
  const newUser = {
    username: 'ab',
    name: 'Test User',
    password: 'password123'
  }

  const response = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  assert.strictEqual(response.body.error !== undefined, true)

  const users = await User.find({})
  assert.strictEqual(users.length, 0)
})

test('user with too short password is not created', async () => {
  const newUser = {
    username: 'testuser',
    name: 'Test User',
    password: 'ab'
  }

  const response = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  assert.strictEqual(response.body.error !== undefined, true)

  const users = await User.find({})
  assert.strictEqual(users.length, 0)
})

test('user without username is not created', async () => {
  const newUser = {
    name: 'Test User',
    password: 'password123'
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  const users = await User.find({})
  assert.strictEqual(users.length, 0)
})

test('user without password is not created', async () => {
  const newUser = {
    username: 'testuser',
    name: 'Test User'
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  const users = await User.find({})
  assert.strictEqual(users.length, 0)
})

test('username must be unique', async () => {
  const firstUser = {
    username: 'testuser',
    name: 'First User',
    password: 'password123'
  }

  const secondUser = {
    username: 'testuser',
    name: 'Second User',
    password: 'password456'
  }

  await api
    .post('/api/users')
    .send(firstUser)
    .expect(201)

  const response = await api
    .post('/api/users')
    .send(secondUser)
    .expect(400)

  assert.strictEqual(response.body.error, 'username must be unique')

  const users = await User.find({})
  assert.strictEqual(users.length, 1)
})

after(async () => {
  await mongoose.connection.close()
})
