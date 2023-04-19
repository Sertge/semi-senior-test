import * as express from 'express'
var router = express.Router();
import { Request, Response, NextFunction } from 'express'
import datasource from '../config/db/postgres';
import { Property } from '../domain/property';

/* GET Properties listing. */
router.get('/', async function(req: Request, res: Response, next: NextFunction) {
  const propertiesRepository = datasource.getRepository(Property)
  const [foundProperties, count] = await propertiesRepository.findAndCountBy(req.query)
  res.send({ data: foundProperties, count })
})

router.post('/create-property', async function(req: Request, res: Response) {
  const propertiesRepository = datasource.getRepository(Property)
  const { body } = req
  const saveOperationResult = await propertiesRepository.save(body)
  res.send(saveOperationResult)
})

router.delete('/delete-property', async function(req: Request, res: Response) {
  const propertiesRepository = datasource.getRepository(Property)
  const { id } = req.body
  if (!id) {
    res.status(400).send({ error: "Invalid id number"})
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
