

class CommonUtil {

  static getSQLConnectString() {
    return process.env.SQLCONNECTSTRING;
  }

  static base64Encode(string) {
    return Buffer.from(encodeURIComponent(string.trim())).toString('base64');
  }

  static base64Decode(data) {
    return Buffer.from(decodeURIComponent(data.trim()), 'base64').toString();;
  }

}

module.exports = CommonUtil;