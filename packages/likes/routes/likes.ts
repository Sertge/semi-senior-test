import * as express from 'express'
const router = express.Router()
import { Request, Response, NextFunction } from 'express'
import datasource from '../config/db/postgres'
import { Like } from '../domain/likes'

/* GET Liked properties. */
router.get('/', async function (req: Request, res: Response, next: NextFunction) {
  const likesRepository = datasource.getRepository(Like)
  const [ foundProperties, count ] = await likesRepository.findAndCountBy(req.query)
  res.send({ data: foundProperties, count })
})

/* POST Liked property. */
router.post('/like-property', async function(req: Request, res: Response) {
  const likesRepository = datasource.getRepository(Like)
  const { body } = req
  const savedOperationResult = await likesRepository.save(body)
  res.send(savedOperationResult)
})

/* DELETE Liked property. */
router.delete('like-property', async function(req: Request, res: Response) {
  const likesRepository = datasource.getRepository(Like)
  const { id } = req.body
  if (!id) {
    res.status(400).send({ error: 'Invalid id number'})
  }
  try {
    await likesRepository.findOneByOrFail({ id })
  } catch (err) {
    res.status(400).send({ error: err })
    res.end()
  }
  res.send(await likesRepository.delete(id))
})