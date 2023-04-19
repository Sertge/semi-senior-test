import * as express from 'express'
import datasource from '../config/db/postgres'
import * as cookieParser from 'cookie-parser'
var usersRouter = require('../routes/users')
var propertiesRouter = require('../routes/properties')

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
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/users', usersRouter)
app.use('/properties', propertiesRouter)

app.listen(3000)
