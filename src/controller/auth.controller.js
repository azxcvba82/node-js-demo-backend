
const AuthModel = require('../model/auth.model');
const CommonModel = require('../model/common.model');
const CommonUtil = require('../util/common.util');
const JWTUtil = require('../util/jwt.util');
var jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail')
const axios = require('axios');
const {OAuth2Client} = require('google-auth-library');
var google = require('googleapis').google;

class AuthController {

  static loginPost(req, res) {
    const email = req.body.email; 
    AuthModel.findUser(email).then((result) => {
      const obj = Array.from(result);
      if(obj.length === 0) {
        res.status(404).send('email not found');
      } else if(obj[0].fPassword !== req.body.password) {
        res.status(401).send('Password not valid');
      } else {
        const jwtPayload = {
          email: obj[0].fEmail,
          role: obj[0].fEmailVerify === 'N' ? 'unVerifiedUser':'user'
        };
        const date = new Date()
        date.setTime(date.getTime() + (6 * 60 * 60 * 1000))
        res.send({email: obj[0].fEmail, 
                  token: jwt.sign(jwtPayload, JWTUtil.getJWTDefaultSecret(), JWTUtil.getJWTOptionsLogin()), 
                  expiresAt: date.toUTCString(),
                  emailVerify:obj[0].fEmailVerify === 'N' ? false:true});
      }
    }).catch((err) => { return res.send(err); });
  }

  static signupPost(req, res) {
    const email = req.body.email; 
    const password = req.body.password; 
    AuthModel.findUser(email).then((result) => {
  
    const obj = Array.from(result);
    if(obj.length === 0) {
      AuthModel.createUser(email,password).then((result) => {
      }).catch((err) => { return res.send(err); });
    }

    this.sendMail(email, res);

    }).catch((err) => { return res.send(err); });
  }

  static sendMail(email, res) {
    const jwtPayload = {
      email: email
    };
  
    const smtpKey = "SMTPConfig";
    CommonModel.getSysConfig(smtpKey).then((result) => {
      const obj = Array.from(result);
    
      sgMail.setApiKey(JSON.parse(obj[0].fValue)["apiKey"]);
      const token = jwt.sign(jwtPayload, JWTUtil.getJWTDefaultSecret(), JWTUtil.getJWTOptionsSignup());
      const msg = {
        to: email,
        from: JSON.parse(obj[0].fValue)["from"],
        subject: 'Email verification',
        text: 'https://node-js-demo.azxcvba99.net/verify?token='+token
      }
      sgMail
        .send(msg)
        .then(() => {
          res.send('Email sent');
          console.log('Email sent');
        })
        .catch((error) => {
          res.status(400).send(error);
        })
    
    }).catch((err) => { return res.send(err); });
  }

  static verifyPost(req, res) {
    const token = req.body.token; 
    jwt.verify( token, JWTUtil.getJWTDefaultSecret(), (err, decoded) => {
      if (err) {
          res.status(400).send(err.message);
      } else {
        AuthModel.verifyEmail(decoded.email).then((result) => {
          console.log( `OK: decoded.email=[${decoded.email}]` );
          res.send(decoded.email);
        }).catch((err) => { return res.send(err); });
      }
    });
  }

  static reSentMail(req, res) {
    const email = req.user.email; 
    this.sendMail(email, res);
  }

  static ssoConfigGet(req, res) {
    const ssoKey = "SSOConfig";
    CommonModel.getSysConfig(ssoKey).then((result) => {
      const obj = Array.from(result);
    
      const redirectUri = "http://localhost/"
      const googleParams = new URL("https://accounts.google.com/o/oauth2/auth?");
    
      googleParams.searchParams.append("state", CommonUtil.base64Encode("google"));
      googleParams.searchParams.append("response_type", "token id_token");
      googleParams.searchParams.append("nonce", new Date().toUTCString())
      googleParams.searchParams.append("response_mode", "fragment")
      googleParams.searchParams.append("prompt", "select_account")
      googleParams.searchParams.append("scope", "openid email profile")
      googleParams.searchParams.append("client_id", JSON.parse(obj[0].fValue)["google"])
      googleParams.searchParams.append("redirect_uri", redirectUri)
    
      const facebookParams = new URL("https://www.facebook.com/v4.0/dialog/oauth?");
      facebookParams.searchParams.append("state", CommonUtil.base64Encode("facebook"));
      facebookParams.searchParams.append("client_id", JSON.parse(obj[0].fValue)["facebook"]);
      facebookParams.searchParams.append("response_type", "token");
      facebookParams.searchParams.append("auth_type", "rerequest");
      facebookParams.searchParams.append("scope", ['email', 'user_friends'].join(','));
      facebookParams.searchParams.append("display", "popup");
      facebookParams.searchParams.append("redirect_uri", redirectUri);

      res.send({google:googleParams,facebook:facebookParams});
    
    }).catch((err) => { return res.send(err); });
  }

  static ssoLoginPost(req, res) {
    const platform = CommonUtil.base64Decode(req.body.state);
    const id_token = req.body.id_token;
    const access_token = req.body.access_token;
    if(platform === 'google'){
      this.googleSSO(id_token, access_token, res);
    }else if(platform === 'facebook'){
      this.facebookSSO(access_token,res);
    }
  }

  static googleSSO(id_token, access_token, res) {
    let email = "";
    let userName = "";

    const ssoKey = "SSOConfig";
    CommonModel.getSysConfig(ssoKey).then((result) => {
      const obj = Array.from(result);
      const CLIENT_ID = JSON.parse(obj[0].fValue)["google"];

      const client = new OAuth2Client(CLIENT_ID);
      client.verifyIdToken({
        idToken: id_token,
        audience: CLIENT_ID,
      }).then(result => {
        email = result.payload.email;
        if(result.payload.email_verified === false){
          res.status(400).send('mail not verified');
        }

        var OAuth2 = google.auth.OAuth2;
        var oauth2Client = new OAuth2();
        oauth2Client.setCredentials({access_token: access_token});

        var oauth2 = google.oauth2({
          auth: oauth2Client,
          version: 'v2'
        });
        oauth2.userinfo.get(
          function(err, result) {
            if (err) {
              res.status(400).send(error);
            } else {
              userName = result.data.name;
              AuthModel.findUser(email).then((result) => {

                const obj = Array.from(result);
                if(obj.length === 0) {
                    AuthModel.createUserSSO(email,userName).then((result) => {
                }).catch((err) => { return res.send(err); });
                }
                res.send(userName+' '+email);

              }).catch((err) => { return res.send(err); });

            }
        });

      })
      .catch(error => {
        res.status(400).send(error.toString());
      });
    }).catch((err) => { return res.send(err); });

  }

  static facebookSSO(access_token, res) {
    axios
    .get('https://graph.facebook.com/me',{params: {
      fields: ['id', 'email', 'first_name', 'last_name'].join(','),
      access_token: access_token,
    }})
    .then(result => {
      
      const email = result.data.email;
      const userName = result.data.last_name+result.data.first_name;
      AuthModel.findUser(email).then((result) => {
  
        const obj = Array.from(result);
        if(obj.length === 0) {
            AuthModel.createUserSSO(email,userName).then((result) => {
        }).catch((err) => { return res.send(err); });
        }
        res.send(userName+' '+email);
  
      }).catch((err) => { return res.send(err); });
  
    })
    .catch(error => {
      res.status(400).send(error.toString());
    });
  }

}

module.exports = AuthController;


