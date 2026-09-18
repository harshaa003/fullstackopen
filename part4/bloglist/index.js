const mongoose = require('mongoose')
const config = require('./utils/config')
const app = require('./app')

mongoose.connect(config.MONGODB_URI, { family: 4 })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const PORT = config.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})