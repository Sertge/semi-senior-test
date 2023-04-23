import * as express from 'express'
const router = express.Router()
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import * as cookie from 'cookie'
import { Request, Response, NextFunction } from 'express'
import datasource from '../config/db/postgres'
import { User } from '../domain/users'
import { UserPassword } from '../domain/userPassword'

const secretKey = process.env.JWT_KEY

/* GET User List. */
router.get('/', async function (req: Request, res: Response, next: NextFunction) {
  const usersRepository = datasource.getRepository(User)
  const [foundProperties, count] = await usersRepository.findAndCountBy(req.query)
  res.send({ data: foundProperties, count })
})

/* GET Current logged in user */
router.get('/me', async function (req: Request, res: Response, next: NextFunction) {
  res.status(500).send({ error: 'Not implemented' })
})

/* Create new User. */
router.post('/signup', async function (req: Request, res: Response) {
  const usersRepository = datasource.getRepository(User)
  const userPasswordRepository = datasource.getRepository(UserPassword)
  const { email, password, username, first_name, last_name } = req.body
  const hashedPassword = await bcrypt.hash(password, 10)
  const savedOperationResult = await usersRepository.save({ email, username, first_name, last_name, is_active: true })
  await userPasswordRepository.save({ id: savedOperationResult.id, username, hashedPassword })
  const token = jwt.sign({ id: savedOperationResult.id, username: savedOperationResult.username}, secretKey)
  res.setHeader('Set-Cookie', cookie.serialize('auth', `bearer ${token}`,{
    maxAge: 3600*12, // 12 hours
    httpOnly: true,
    sameSite: 'strict'
  }))
})

router.post('/login', async function (req: Request, res: Response) {
  const userPasswordRepository = datasource.getRepository(UserPassword)
  const { username, password } = req.body
  let userFound: UserPassword
  let isValidPassword: boolean
  try {
    const userFound = await userPasswordRepository.findOneByOrFail({ username })
    isValidPassword = await bcrypt.compare(password, userFound.password)
  } catch(err){
    res.status(400).send({error: err})
    res.end()
  }

  if (isValidPassword) {
    const token = jwt.sign({ id: userFound.id, username: userFound.username}, secretKey)
    res.setHeader('Set-Cookie', cookie.serialize('auth', `bearer ${token}`,{
      maxAge: 3600*12, // 12 hours
      httpOnly: true,
      sameSite: 'strict'
    }))
  } else {
    res.status(500).send('Error logging in')
  }
})

module.exports = router
