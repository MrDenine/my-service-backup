const db = require("../dbconnection");

var ChangePW = {

  checkPassword: function (user_id, callback) {
    //console.log(username);
    return db.query(
      `SELECT password FROM db_project."users" where id = '${user_id}' AND active = 1 AND is_verified = 1`,
      callback
    );
  },

  updatePassword: function (user_id, new_hashPW, data, callback) {
    let datetime = data.datetime;
    return db.query(
      `UPDATE db_project."users"
      SET password = '${new_hashPW}', update_at = '${datetime}'
      WHERE id = ${user_id} AND active = 1 AND is_verified = 1`,
      callback
    );
  },
};
module.exports = ChangePW;
