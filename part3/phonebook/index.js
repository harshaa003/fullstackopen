const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

// 3.8 - Custom Morgan token for POST data
morgan.token('body', (request) => {
  return JSON.stringify(request.body)
})

// 3.7 + 3.8 - Morgan logging
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

const persons = [
  {
    id: '1',
    name: 'Arto Hellas',
    number: '040-123456'
  },
  {
    id: '2',
    name: 'Ada Lovelace',
    number: '39-44-5323523'
  },
  {
    id: '3',
    name: 'Dan Abramov',
    number: '12-43-234345'
  },
  {
    id: '4',
    name: 'Mary Poppendieck',
    number: '39-23-6423122'
  }
]

// 3.1
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

// 3.2
app.get('/info', (request, response) => {
  const currentTime = new Date()

  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${currentTime}</p>
  `)
})

// 3.3
app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

// 3.4
app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id

  const personIndex = persons.findIndex(person => person.id === id)

  if (personIndex === -1) {
    return response.status(404).end()
  }

  persons.splice(personIndex, 1)

  response.status(204).end()
})

// 3.5 + 3.6
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  }

  if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }

  if (persons.some(person => person.name === body.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    id: String(Math.floor(Math.random() * 1000000)),
    name: body.name,
    number: body.number
  }

  persons.push(person)

  response.json(person)
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})