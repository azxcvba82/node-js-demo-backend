var express = require('express');
var router = express.Router();
const AuthController = require('../controller/auth.controller');
const { validate, Joi } = require('express-validation')

/* GET home page. */
router.get('/', function(req, res, next) {
  /*  #swagger.tags = ['Auth'] */
  res.render('index', { title: 'Express' });
});

const loginValidation = {
  body: Joi.object({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/)
      .required(),
  }),
}

const jwtValidation = {
  body: Joi.object({
    token: Joi.string()
      .required()
  }),
}

const ssoValidation = {
  body: Joi.object({
    access_token: Joi.string()
      .required(),
    id_token: Joi.string(),
    state: Joi.string()
      .required(),
  }),
}

router.post('/login', validate(loginValidation, {}, {}), function(req, res, next) {
  AuthController.loginPost(req, res);
  /*  #swagger.tags = ['Auth']
      #swagger.parameters['body'] = {
          in: 'body',
          required: true,
          schema: {
              email: "user@abc.com",
              password: "1234"
          }
  } */
});

router.put('/signup', validate(loginValidation, {}, {}), function(req, res, next) {
  AuthController.signupPost(req, res);
  /*  #swagger.tags = ['Auth']
      #swagger.parameters['body'] = {
          in: 'body',
          required: true,
          schema: {
              email: "user@abc.com",
              password: "1234"
          }
  } */
});

router.post('/verify', validate(jwtValidation, {}, {}), function(req, res, next) {
  AuthController.verifyPost(req, res);
  /*  #swagger.tags = ['Auth']
      #swagger.parameters['body'] = {
          in: 'body',
          required: true,
          schema: {
              token: ""
          }
  } */
});

router.get('/getSSOConfig', function(req, res, next) {
  AuthController.ssoConfigGet(req, res);
  /*  #swagger.tags = ['Auth']
  */
});

router.post('/ssoLogin', validate(ssoValidation, {}, {}), function(req, res, next) {
  AuthController.ssoLoginPost(req, res);
  /*  #swagger.tags = ['Auth']
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
            id_token: "",
            access_token: "",
            state: ""
        }
      }
  */
});

module.exports = router;


