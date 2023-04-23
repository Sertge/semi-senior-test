import * as express from 'express'
const router = express.Router()
import { Request, Response, NextFunction } from 'express'
import datasource from '../config/db/postgres';
import { Property } from '../domain/properties';

/* GET Properties listing. */
router.get('/', async function(req: Request, res: Response, next: NextFunction) {
  const propertiesRepository = datasource.getRepository(Property)
  const [foundProperties, count] = await propertiesRepository.findAndCountBy(req.query)
  res.send({ data: foundProperties, count })
})

/* GET Properties item. */
router.get('/{id}', async function(req: Request, res: Response, next: NextFunction) {
  const propertiesRepository = datasource.getRepository(Property)
  const foundProperty = propertiesRepository.findOneByOrFail(req.query)
  res.send(foundProperty)
})

/* POST Properties item. */
router.post('/create-property', async function(req: Request, res: Response) {
  const propertiesRepository = datasource.getRepository(Property)
  const { address, city, price, description, year } = req.body
  const saveOperationResult = await propertiesRepository.save({ address, city, price, description, year })
  res.send(saveOperationResult)
})

/* DELETE Properties item. */
router.delete('/delete-property', async function(req: Request, res: Response) {
  const propertiesRepository = datasource.getRepository(Property)
  const { id } = req.body
  if (!id) {
    res.status(400).send({ error: 'Invalid id number'})
  }
  try {
    await propertiesRepository.findOneByOrFail({ id })
  } catch(err){
    res.status(400).send({error: err})
    res.end()
  }
  res.send(await propertiesRepository.delete(id))
})

module.exports = router
