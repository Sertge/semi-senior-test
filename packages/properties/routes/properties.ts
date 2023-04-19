var express = require('express');
var router = express.Router();
import { Request, Response, NextFunction } from 'express'
import datasource from '../config/db/postgres';
import { Property } from '../domain/property';

/* GET Properties listing. */
router.get('/', async function(req: Request, res: Response, next: NextFunction) {
  const { queryParams } = req.body
  const propertiesRepository = datasource.getRepository(Property)
  const [foundProperties, count] = await propertiesRepository.findAndCountBy(queryParams)
  res.send({ data: foundProperties, count })
})

module.exports = router
