import * as express from 'express'
const router = express.Router()
import { Request, Response, NextFunction } from 'express'
import datasource from '../config/db/postgres';
import { Property } from '../domain/properties';
import { Status } from '../domain/status';
import { Between, FindOperator, FindOptionsWhere, LessThan, MoreThan } from 'typeorm';

function getNumberRangeWhere (numberFrom:string, numberTo: string): FindOperator<number> | undefined {
  const parsedNumberFrom = !!numberFrom ? parseInt(numberFrom) : undefined
  const parsedNumberTo = !!numberTo ? parseInt(numberTo) : undefined
  if (!parsedNumberFrom && !parsedNumberTo) return undefined
  if (parsedNumberFrom && !parsedNumberTo) return MoreThan(parsedNumberFrom)
  if (!parsedNumberFrom && parsedNumberTo) return LessThan(parsedNumberTo)
  if (parsedNumberFrom && parsedNumberTo) return Between(parsedNumberFrom, parsedNumberTo)
}
/* GET Properties listing. */
router.get('/', async function (req: Request, res: Response, next: NextFunction) {
  const { id, status, yearFrom, yearTo, city, priceFrom, priceTo } = req.query
  if (typeof status == 'string' && !['pre_sale', 'for_sale', 'sold'].includes(status)) {
    res.status(200).send([])
    return
  }

  try {
    const foundStatus = await datasource.getRepository(Status).findOneByOrFail({ name: status as string })
    const whereClause: FindOptionsWhere<Property> = {
      id : !!id ? parseInt(id as string) : undefined,
      status : {id: foundStatus.id},
      year: !!yearFrom || !!yearTo ? getNumberRangeWhere(yearFrom as string, yearTo as string) : undefined,
      price: !!priceFrom || !!priceTo ? getNumberRangeWhere(priceFrom as string, priceTo as string) : undefined, 
      city: !!city ? city as string : undefined,
    }
    const [foundProperties, count] = await datasource
      .createQueryRunner().manager
      .find(Property, {where: whereClause})
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
