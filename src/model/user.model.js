const  SQLUtil = require('../util/sql.util');
const  CommonUtil = require('../util/common.util');

class UserModel {

   static resetPassword(email,password) {
    const SQLString = `UPDATE tNodeJSDemoMember SET fPassword = ? WHERE fEmail = ? `;
    const result = SQLUtil.runSQLExec(CommonUtil.getSQLConnectString(),SQLString,password,email);
    return result;
  }

  static updateName(email,name) {
    const SQLString = `UPDATE tNodeJSDemoMember SET fName = ? WHERE fEmail = ? `;
    const result = SQLUtil.runSQLExec(CommonUtil.getSQLConnectString(),SQLString,name,email);
    return result;
  }

  static queryUsersStatus() {
    const SQLString = `SELECT fEmail, fEmailVerify, fName, fCreateTime, fLastLoginTime, fSessionTime, fLoginCount FROM tNodeJSDemoMember `;
    const result = SQLUtil.runSQLQuery(CommonUtil.getSQLConnectString(),SQLString);
    return result;
  }

  static queryUsersHaveSignup() {
    const SQLString = `SELECT COUNT(*) AS result FROM tNodeJSDemoMember WHERE fLastLoginTime IS NOT NULL `;
    const result = SQLUtil.runSQLQuery(CommonUtil.getSQLConnectString(),SQLString);
    return result;
  }

  static queryUsersHaveActiveSessionToday() {
    const date = new Date()
    date.setTime(date.getTime() - (24 * 60 * 60 * 1000))
    const SQLString = `SELECT COUNT(*) AS result FROM tNodeJSDemoMember WHERE fSessionTime >= ? `;
    const result = SQLUtil.runSQLQuery(CommonUtil.getSQLConnectString(),SQLString,date.toISOString().substring(0,19).replace('T',' '));
    return result;
  }

  static queryAverageActiveSessionInLast7Day() {
    const date = new Date()
    date.setTime(date.getTime() - (168 * 60 * 60 * 1000))
    const SQLString = `SELECT AVG(X.CNT) AS result FROM (
                        SELECT COUNT(*) AS CNT FROM tNodeJSDemoMember WHERE fSessionTime >= ?
                        GROUP BY CAST(fSessionTime AS DATE)
                        ) X `;
    const result = SQLUtil.runSQLQuery(CommonUtil.getSQLConnectString(),SQLString,date.toISOString().substring(0,19).replace('T',' '));
    return result;
  }

}

module.exports = UserModel;
