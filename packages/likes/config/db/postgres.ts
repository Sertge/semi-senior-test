import * as path from 'path'
import Container from 'typedi'
import { DataSource } from 'typeorm'

const datasource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  database: process.env.DB_SCHEMA,
  entities: [path.join(__dirname, '../../domain/**/*.js')],
  logging: ['query', 'error']
})

Container.set(DataSource.name, datasource)

export default datasource
