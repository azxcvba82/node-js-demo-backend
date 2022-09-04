
const  SQLUtil = require('../util/sql.util');
const  CommonUtil = require('../util/common.util');

class AuthModel {

   static findUser(email) {
    const queryString = `SELECT fEmail, fPassword, fEmailVerify  FROM tNodeJSDemoMember WHERE fEmail = ? LIMIT 1 `;
    const result = SQLUtil.runSQLQuery(CommonUtil.getSQLConnectString(),queryString,email);
    return result;
  }

   static createUser(email,password) {
    const SQLString = `INSERT INTO tNodeJSDemoMember (fEmail,fPassword, fEmailVerify,fPrivilege,fName,fCreateTime,fLoginCount) VALUES (?,?,'N',0,'',?,0) `;
    const result = SQLUtil.runSQLExec(CommonUtil.getSQLConnectString(),SQLString,email,password,new Date().toISOString().substring(0,19).replace('T',' '));
    return result;
  }

   static createUserSSO(email,name) {
    const SQLString = `INSERT INTO tNodeJSDemoMember (fEmail,fPassword, fEmailVerify,fPrivilege,fName,fCreateTime,fLoginCount) VALUES (?,?,'N',0,?,?,0) `;
    const result = SQLUtil.runSQLExec(CommonUtil.getSQLConnectString(),SQLString,email,'',name,new Date().toISOString().substring(0,19).replace('T',' '));
    return result;
  }

   static verifyEmail(email) {
    const SQLString = `UPDATE tNodeJSDemoMember SET fEmailVerify = 'Y' WHERE fEmail = ? `;
    const result = SQLUtil.runSQLExec(CommonUtil.getSQLConnectString(),SQLString,email);
    return result;
  }

}

module.exports = AuthModel;
