const mongoose = require('mongoose')

const password = process.argv[2]

const url = `mongodb+srv://phonebook:${encodeURIComponent(password)}@phonebook.sxr61bj.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Phonebook`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  Person.find({}).then(persons => {
    console.log('phonebook:')
    persons.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
} else {
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name,
    number
  })

  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}