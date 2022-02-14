const db = require("../dbconnection");

var ForgotPW = {
  updatePassword: function (new_hashPW, data, callback) {
    let datetime = data.datetime;
    let email = data.email;
    console.log(email);
    return db.query(
      `UPDATE db_project."users"
      SET password = '${new_hashPW}', update_at = '${datetime}'
      WHERE email = '${email}' AND active = 1 AND is_verified = 1`,
      callback
    );
  },
};
module.exports = ForgotPW;
