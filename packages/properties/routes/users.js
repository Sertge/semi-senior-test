var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send([{user: {
    name: 'username',
    email: 'user@mail.com'
  }}]);
});

module.exports = router;
