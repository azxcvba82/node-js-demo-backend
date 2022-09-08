const UserModel = require('../model/user.model');


class DashboardController {

  static queryUsersStatus(req, res) {
    UserModel.queryUsersStatus().then((result) => {
        res.send(result);
      
    }).catch((err) => { return res.send(err); });
  }

  static queryUsersHaveSignup(req, res) {
    UserModel.queryUsersHaveSignup().then((result) => {
        res.send(result);
      
    }).catch((err) => { return res.send(err); });
  }

  static queryUsersHaveActiveSessionToday(req, res) {
    UserModel.queryUsersHaveActiveSessionToday().then((result) => {
        res.send(result);
      
    }).catch((err) => { return res.send(err); });
  }

  static queryAverageActiveSessionInLast7Day(req, res) {
    UserModel.queryAverageActiveSessionInLast7Day().then((result) => {
        res.send(result);
      
    }).catch((err) => { return res.send(err); });
  }

}

module.exports = DashboardController;


