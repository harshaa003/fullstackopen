require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const path = require('path')
const mongoose = require('mongoose')
const Person = require('./models/person')

const app = express()

const url = process.env.MONGODB_URI

mongoose.connect(url, { family: 4 })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.json())

// Morgan token for request body
morgan.token('body', request => {
  return JSON.stringify(request.body)
})

// Morgan logging
app.use(morgan((tokens, request, response) => {
  if (request.method === 'POST') {
    return [
      tokens.method(request, response),
      tokens.url(request, response),
      tokens.status(request, response),
      tokens.res(request, response, 'content-length'),
      '-',
      tokens['response-time'](request, response),
      'ms',
      JSON.stringify(request.body)
    ].join(' ')
  }

  return [
    tokens.method(request, response),
    tokens.url(request, response),
    tokens.status(request, response),
    tokens.res(request, response, 'content-length'),
    '-',
    tokens['response-time'](request, response),
    'ms'
  ].join(' ')
}))

// GET all persons
app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error => next(error))
})

// GET information
app.get('/info', (request, response, next) => {
  const currentTime = new Date()

  Person.countDocuments({})
    .then(count => {
      response.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${currentTime}</p>
      `)
    })
    .catch(error => next(error))
})

// GET one person
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// DELETE person
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(person => {
      if (person) {
        response.status(204).end()
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// POST new person
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

// PUT update person
app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    {
      new: true,
      runValidators: true,
      context: 'query'
    }
  )
    .then(updatedPerson => {
      if (updatedPerson) {
        response.json(updatedPerson)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// Error handler
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({
      error: 'malformatted id'
    })
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({
      error: error.message
    })
  }

  next(error)
}

app.use(errorHandler)

// Serve frontend
app.use(express.static(path.join(__dirname, 'dist')))

app.get('/{*splat}', (request, response) => {
  response.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})