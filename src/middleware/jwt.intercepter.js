var jwt = require('jsonwebtoken');
const JWTUtil = require('../util/jwt.util');
const AuthModel = require('../model/auth.model');

class JWTIntercepter {

    static authenticateJWT(req, res, next) {
        const authHeader = req.headers.authorization;

        if (authHeader) {
            const token = authHeader.split(' ')[1];
      
            jwt.verify(token, JWTUtil.getJWTDefaultSecret(), (err, user) => {
                if (err) {
                    return res.sendStatus(403);
                }
      
                req.user = user;
                console.log(req.route.path)

                if(user.role === 'unVerifiedUser'){
                    if(req.route.path === '/reSentMail'){
                        next();
                    }else{
                        return res.sendStatus(403);
                    }
                } else{
                    const email = req.user.email; 
                    AuthModel.updateSessionTime(email).then((result) => {
                    });
                    next();
                }
            });
        } else {
            res.sendStatus(401);
        }
      }
      
}

module.exports = JWTIntercepter;