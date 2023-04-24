import * as express from 'express'
const router = express.Router()
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import * as cookie from 'cookie'
import { Request, Response, NextFunction } from 'express'
import datasource from '../config/db/postgres'
import { User } from '../domain/users'
import { UserPassword } from '../domain/userPassword'
import { authenticate } from '../src/auth'

const secretKey = process.env.JWT_KEY

/* GET User List. */
router.get('/', async function (req: Request, res: Response) {
  const usersRepository = datasource.getRepository(User)
  try {
    const [foundProperties, count] = await usersRepository.findAndCountBy(req.query)
    res.send({ data: foundProperties, count })
  } catch (err) {
    res.status(500).send({ error: err })
  }
})

/* GET Current logged in user */
router.get('/me', authenticate, async function (req: Request & { user: any}, res: Response, next: NextFunction) {
  const usersRepository = datasource.getRepository(User)
  try {
    const userFound = await usersRepository.findOneByOrFail({ username: req.user.username })
    res.status(200).send({ user: userFound })
  } catch (err) {
    res.status(403).setHeader('Set-Cookie', cookie.serialize('auth', '', {
      maxAge: 0,
      sameSite: 'lax',
      httpOnly: true,
      path: '/'
    })).send('Token is not valid')
  }
})

/* Create new User. */
router.post('/signup', async function (req: Request, res: Response) {
  const { email, password, username, first_name, last_name } = req.body
  const hashedPassword = await bcrypt.hash(password, 10)
  const newUser = new User()
  newUser.email = email
  newUser.username = username
  newUser.first_name = first_name
  newUser.last_name = last_name
  newUser.is_active = true
  
  const newUserPassword = new UserPassword()
  newUserPassword.password = hashedPassword
  newUserPassword.username = username

  try {
    await datasource.transaction(async (transactionEntityManager) => {
      await transactionEntityManager.save(newUser)
      await transactionEntityManager.save(newUserPassword)
    })
    const token = jwt.sign({ email, username }, secretKey)
    res.setHeader('Set-Cookie', cookie.serialize('auth', `bearer ${token}`, {
      maxAge: 3600 * 12, // 12 hours
      httpOnly: true,
      sameSite: 'lax',
      path: '/'
    }))
    res.end()
  } catch (err) {
    res.status(500).send({ error: err })
  }
})

router.post('/login', async function (req: Request, res: Response) {
  const userPasswordRepository = datasource.getRepository(UserPassword)
  const { username, password } = req.body
  let isValidPassword: boolean
  try {
    const userFound = await userPasswordRepository.findOneByOrFail({ username })
    isValidPassword = await bcrypt.compare(password, userFound.password)
  } catch (err) {
    res.status(400).send({ error: err })
    res.end()
  }

  if (isValidPassword) {
    const token = jwt.sign({ username }, secretKey)
    res.setHeader('Set-Cookie', cookie.serialize('auth', `bearer ${token}`, {
      maxAge: 3600 * 12, // 12 hours
      httpOnly: true,
      sameSite: 'lax',
      path: '/'
    }))
    res.end()
  } else {
    res.status(500).send('Error logging in')
  }
})

router.post('/logout', async function (_: Request, res: Response) {
  res.setHeader('Set-Cookie', cookie.serialize('auth', '', { 
    maxAge: 0,
    sameSite: 'lax',
    httpOnly: true,
    path: '/'
  })).end()
})

module.exports = router
