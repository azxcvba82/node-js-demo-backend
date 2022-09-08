const AuthModel = require('../model/auth.model');
const UserModel = require('../model/user.model');
const JWTUtil = require('../util/jwt.util');
var jwt = require('jsonwebtoken');
const axios = require('axios');


class UserProfileController {

  static resetPassword(req, res) {
    const email = req.user.email; 
    const oldPassword = req.body.oldPassword; 
    const newPassword = req.body.newPassword; 
    AuthModel.findUser(email).then((result) => {
      const obj = Array.from(result);
      if(obj.length === 0) {
        res.status(404).send('email not found');
      } else if(obj[0].fPassword !== oldPassword) {
        res.status(401).send('Password not valid');
      } else {
        UserModel.resetPassword(email,newPassword).then((result) => {
        const jwtPayload = {
          email: obj[0].fEmail,
          role: 'user'
        };
        const date = new Date();
        date.setTime(date.getTime() + (6 * 60 * 60 * 1000));
        res.send({email: obj[0].fEmail, 
                  token: jwt.sign(jwtPayload, JWTUtil.getJWTDefaultSecret(), JWTUtil.getJWTOptionsLogin()), 
                  expiresAt: date.toUTCString(),
                  emailVerify: true});
        }).catch((err) => { return res.send(err); });
      }
    }).catch((err) => { return res.send(err); });
  }

  static getUserProfile(req, res) {
    const email = req.user.email; 
    AuthModel.findUser(email).then((result) => {
      const obj = Array.from(result);
      if(obj.length === 0) {
        res.status(404).send('email not found');
      } 
        res.send({email: obj[0].fEmail, 
                  name: obj[0].fName });
      
    }).catch((err) => { return res.send(err); });
  }

  static changeName(req, res) {
    const email = req.user.email; 
    const name = req.body.name; 
    UserModel.updateName(email,name).then((result) => {
        res.send({email: email, name: name});
      
    }).catch((err) => { return res.send(err); });
  }

}

module.exports = UserProfileController;


