import * as express from 'express'
const router = express.Router()
import { Request, Response, NextFunction } from 'express'
import datasource from '../config/db/postgres';
import { Property } from '../domain/properties';

/* GET Properties listing. */
router.get('/', async function (req: Request, res: Response, next: NextFunction) {
  const propertiesRepository = datasource.getRepository(Property)
  const { id, status } = req.query
  if (typeof status == 'string' && !['pre_sale', 'for_sale', 'sold'].includes(status)) {
    res.status(200).send([])
    return
  }
  try {
    const [foundProperties, count] = await propertiesRepository.findAndCountBy({ id: parseInt(id as string), status: { label: status as string } })
    res.send({ data: foundProperties, count })
  } catch (err) {
    res.status(500).send({ error: err })
  }
})

/* GET Properties item. */
router.get('/{id}', async function (req: Request, res: Response, next: NextFunction) {
  const propertiesRepository = datasource.getRepository(Property)
  try {
    const foundProperty = await propertiesRepository.findOneByOrFail(req.query)
    res.send(foundProperty)
  } catch (err) {
    res.status(500).send({ error: err })
  }
})

/* POST Properties item. */
router.post('/create-property', async function (req: Request, res: Response) {
  const propertiesRepository = datasource.getRepository(Property)
  const { address, city, price, description, year } = req.body
  try {
    const saveOperationResult = await propertiesRepository.save({ address, city, price, description, year })
    res.send(saveOperationResult)
  } catch (err) {
    res.status(500).send({ error: err })
  }
})

/* DELETE Properties item. */
router.delete('/delete-property', async function (req: Request, res: Response) {
  const propertiesRepository = datasource.getRepository(Property)
  const { id } = req.body
  if (!id) {
    res.status(400).send({ error: 'Invalid id number' })
  }
  try {
    await propertiesRepository.findOneByOrFail({ id })
  } catch (err) {
    res.status(400).send({ error: err })
    res.end()
  }
  res.send(await propertiesRepository.delete(id))
})

module.exports = router
