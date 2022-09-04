var express = require('express');
var router = express.Router();
const AuthController = require('../controller/auth.controller');
var JWTIntercepter = require('../middleware/jwt.intercepter');

/* GET users listing. */
router.get('/', JWTIntercepter.authenticateJWT, function(req, res, next) {
    /*  #swagger.tags = ['Users'] */
  res.send('respond with a resource');
});

router.get('/reSentMail', JWTIntercepter.authenticateJWT, function(req, res, next) {
  AuthController.reSentMail(req, res);
  /*  #swagger.tags = ['Users']
  } */
});


module.exports = router;
