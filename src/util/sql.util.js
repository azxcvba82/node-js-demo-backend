const mysql = require('mysql');

class SQLUtil {

  static runSQLQuery(sqlConnectionString , sqlCommand , ...args) {
    return new Promise((resolve, reject) => {
      const connection = mysql.createConnection(sqlConnectionString);
          connection.query(sqlCommand, args, (error, result) => {
            if (error) {
              console.error('SQL error: ', error);
              reject(error);
            } else {
              resolve(result);
            }
            connection.end();
          });
      });
  }

  static runSQLExec(sqlConnectionString , sqlCommand , ...args) {
    return new Promise((resolve, reject) => {
      const connection = mysql.createConnection(sqlConnectionString);
          connection.query(sqlCommand, args, (error, result) => {
            if (error) {
              console.error('SQL error: ', error);
              reject(error);
            } else if (result.affectedRows === 1) {
              resolve(result.insertId);
            }
            connection.end();
          });
      });
  }

}

module.exports = SQLUtil;