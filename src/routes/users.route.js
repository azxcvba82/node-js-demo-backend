var express = require('express');
var router = express.Router();
const AuthController = require('../controller/auth.controller');
const UserProfileController = require('../controller/userprofile.controller');
const DashboardController = require('../controller/dashboard.controller');
var JWTIntercepter = require('../middleware/jwt.intercepter');
const { validate, Joi } = require('express-validation');

const resetValidation = {
  body: Joi.object({
    oldPassword: Joi.string()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/)
      .required(),
    newPassword: Joi.string()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/)
      .required(),
  }),
}

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

router.post('/resetPassword', validate(resetValidation, {}, {}), JWTIntercepter.authenticateJWT, function(req, res, next) {
  UserProfileController.resetPassword(req, res);
  /*  #swagger.tags = ['Users']
      #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
          oldPassword: "",
          newPassword: ""
      }
  } */
});

router.get('/getUserProfile', JWTIntercepter.authenticateJWT, function(req, res, next) {
  UserProfileController.getUserProfile(req, res);
  /*  #swagger.tags = ['Users']
  } */
});

router.post('/changeName', JWTIntercepter.authenticateJWT, function(req, res, next) {
  UserProfileController.changeName(req, res);
  /*  #swagger.tags = ['Users']
      #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
          name: ""
      }
  } */
});

router.get('/queryUsersStatus', JWTIntercepter.authenticateJWT, function(req, res, next) {
  DashboardController.queryUsersStatus(req, res);
  /*  #swagger.tags = ['Users']
  } */
});

router.get('/queryUsersHaveSignup', JWTIntercepter.authenticateJWT, function(req, res, next) {
  DashboardController.queryUsersHaveSignup(req, res);
  /*  #swagger.tags = ['Users']
  } */
});

router.get('/queryUsersHaveActiveSessionToday', JWTIntercepter.authenticateJWT, function(req, res, next) {
  DashboardController.queryUsersHaveActiveSessionToday(req, res);
  /*  #swagger.tags = ['Users']
  } */
});

router.get('/queryAverageActiveSessionInLast7Day', JWTIntercepter.authenticateJWT, function(req, res, next) {
  DashboardController.queryAverageActiveSessionInLast7Day(req, res);
  /*  #swagger.tags = ['Users']
  } */
});


module.exports = router;
