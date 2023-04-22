import * as express from 'express'
import { authenticate } from './auth'
import datasource from '../config/db/postgres'
const propertiesRouter = require('../routes/properties')

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

app.use('/properties', authenticate, propertiesRouter)

app.listen(3000)
