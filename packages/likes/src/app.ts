import * as express from 'express'
import datasource from '../config/db/postgres'
const { authenticate } = require('./auth')
const likesRouter = require('../routes/likes')
const usersRoutes = require('../routes/users')

// Establish database connection
datasource
  .initialize()
  .then(() => {
    console.log("Data Source has been initialized!")
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err)
  })

// Create and setup express app
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false}))

app.use('/like', authenticate, likesRouter)
app.use('/users', usersRoutes)

app.listen(3001)