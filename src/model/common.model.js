
const  SQLUtil = require('../util/sql.util');
const  CommonUtil = require('../util/common.util');

class CommonModel {

  static getSysConfig(key) {
    const queryString = `SELECT fValue FROM tSysConfig WHERE fKey = ? LIMIT 1  `;
    const result = SQLUtil.runSQLQuery(CommonUtil.getSQLConnectString(),queryString,key);
    return result;
  }

}

module.exports = CommonModel;
