import * as express from 'express'
const router = express.Router()
import { Request, Response, NextFunction } from 'express'
import datasource from '../config/db/postgres'
import { Like } from '../domain/likes'
import { User } from '../domain/users'

/* GET Liked properties. */
router.get('/property', async function (req: Request, res: Response) {
  const likesRepository = datasource.getRepository(Like)
  const id = req.query.id as string
  try {
    const [foundProperties, count] = await likesRepository.findAndCount({ where: { property: { id: parseInt(id) } } })
    res.send({ data: foundProperties, count })
  } catch (err) {
    res.status(500).send({ error: err })
  }
})

router.get('/user', async function (req: Request, res: Response) {
  const likesRepository = datasource.getRepository(Like)
  const id = req.query.id as string
  try {
    const [foundUsers, count] = await likesRepository.findAndCount({ where: { user: { id: parseInt(id) } }, loadEagerRelations: true })
    res.send({ data: foundUsers, count })
  } catch (err) {
    res.status(500).send({ error: err })
  }
})

/* POST Liked property. */
router.post('/property', async function (req: Request & { user: any }, res: Response) {
  const likesRepository = datasource.getRepository(Like)
  const usersRepository = datasource.getRepository(User)
  const { id } = req.body
  try {
    const foundUser = await usersRepository.findOneByOrFail({ username: req.user.username })
    const savedOperationResult = await likesRepository.save({ property: id, user: foundUser })
    res.send(savedOperationResult)
  } catch (err) {
    res.status(404).send('Not found')
  }
})

/* DELETE Liked property. */
router.delete('/property', async function (req: Request & { user: any }, res: Response) {
  const likesRepository = datasource.getRepository(Like)
  const { id } = req.body
  if (!id) {
    res.status(400).send({ error: 'Invalid id number' })
  }
  try {
    const foundLike = await likesRepository.findOneByOrFail({ property: { id }, user: {username: req.user.username} })
    await likesRepository.delete(foundLike)
    res.status(200).end()
  } catch (err) {
    res.status(200).end()
  }
})

module.exports = router