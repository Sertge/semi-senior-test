var express = require('express');
var router = express.Router();

/* GET Properties listing. */
router.get('/', async function(req, res, next) {
  const { queryParams } = req.body
  res.send({properties: [{
    name: 'propName',
    address: 'propAddress'
  }]})
})