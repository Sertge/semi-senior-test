import * as express from 'express'
const router = express.Router()
import { Request, Response, NextFunction } from 'express'
import datasource from '../config/db/postgres'
import { Like } from '../domain/likes'

/* GET Liked properties. */
router.get('/property', async function (req: Request, res: Response) {
  const likesRepository = datasource.getRepository(Like)
  const id = req.query.id as string
  const [ foundUsers, count ] = await likesRepository.findAndCountBy({ id: parseInt(id) })
  res.send({ data: foundUsers, count })
})

router.get('/user', async function (req: Request, res: Response) {

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

module.exports = router