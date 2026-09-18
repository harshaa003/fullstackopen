import { useEffect, useState } from 'react'
import personService from './services/persons'

const Notification = ({ message, error }) => {
  if (!message) {
    return null
  }

  return (
    <div className={error ? 'error' : 'notification'}>
      {message}
    </div>
  )
}

const PersonForm = ({
  addPerson,
  newName,
  newNumber,
  handleNameChange,
  handleNumberChange
}) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name:
        <input
          value={newName}
          onChange={handleNameChange}
        />
      </div>

      <div>
        number:
        <input
          value={newNumber}
          onChange={handleNumberChange}
        />
      </div>

      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({ persons, deletePerson }) => {
  return (
    <div>
      {persons.map(person => (
        <p key={person.id}>
          {person.name} {person.number}{' '}
          <button onClick={() => deletePerson(person.id, person.name)}>
            delete
          </button>
        </p>
      ))}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
      .catch(error => {
        showMessage(
          error.response?.data?.error || 'Failed to load phonebook',
          true
        )
      })
  }, [])

  const showMessage = (text, isError = false) => {
    setMessage(text)
    setError(isError)

    setTimeout(() => {
      setMessage(null)
      setError(false)
    }, 5000)
  }

  const addPerson = event => {
    event.preventDefault()

    const existingPerson = persons.find(
      person => person.name.toLowerCase() === newName.toLowerCase()
    )

    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${newName} is already added to phonebook, replace the old number with the new one?`
      )

      if (!confirmUpdate) {
        return
      }

      const updatedPerson = {
        ...existingPerson,
        number: newNumber
      }

      personService
        .update(existingPerson.id, updatedPerson)
        .then(returnedPerson => {
          setPersons(
            persons.map(person =>
              person.id !== existingPerson.id
                ? person
                : returnedPerson
            )
          )

          setNewName('')
          setNewNumber('')

          showMessage(`Updated ${returnedPerson.name}`)
        })
        .catch(error => {
          showMessage(
            error.response?.data?.error || 'Update failed',
            true
          )
        })

      return
    }

    const newPerson = {
      name: newName,
      number: newNumber
    }

    personService
      .create(newPerson)
      .then(createdPerson => {
        setPersons(persons.concat(createdPerson))
        setNewName('')
        setNewNumber('')

        showMessage(`Added ${createdPerson.name}`)
      })
      .catch(error => {
        showMessage(
          error.response?.data?.error || 'Validation failed',
          true
        )
      })
  }

  const deletePerson = (id, name) => {
    const confirmDelete = window.confirm(
      `Delete ${name}?`
    )

    if (!confirmDelete) {
      return
    }

    personService
      .remove(id)
      .then(() => {
        setPersons(
          persons.filter(person => person.id !== id)
        )

        showMessage(`Deleted ${name}`)
      })
      .catch(error => {
        showMessage(
          error.response?.data?.error || 'Delete failed',
          true
        )
      })
  }

  const handleNameChange = event => {
    setNewName(event.target.value)
  }

  const handleNumberChange = event => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = event => {
    setFilter(event.target.value)
  }

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification
        message={message}
        error={error}
      />

      <div>
        filter shown with
        <input
          value={filter}
          onChange={handleFilterChange}
        />
      </div>

      <h2>add a new</h2>

      <PersonForm
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />

      <h2>Numbers</h2>

      <Persons
        persons={personsToShow}
        deletePerson={deletePerson}
      />
    </div>
  )
}

export default App