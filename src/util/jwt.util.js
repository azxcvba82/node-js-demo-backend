const JWTSECRET = 'nodeJS4fun#';

const jwtOptionsLogin = {
  algorithm: 'HS256',
  expiresIn: '6h',
};

const jwtOptionsSignup = {
  algorithm: 'HS256',
  expiresIn: '15m',
};

class JWTUtil {

  static getJWTDefaultSecret() {
    return JWTSECRET;
  }

  static getJWTOptionsLogin() {
    return jwtOptionsLogin;
  }

  static getJWTOptionsSignup() {
    return jwtOptionsSignup;
  }

}



module.exports = JWTUtil;