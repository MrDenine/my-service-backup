const db = require("../dbconnection");

var GetDataUser = {
  getcheckEmail: function (email, callback) {
    return db.query(
      `SELECT id FROM db_project."users" WHERE email = '${email}' AND active = 1 AND is_verified = 1`,
      callback
    );
  },
  insertOTP: function (user_id, data, otp, callback) {
    let datetime = data.datetime;
    return db.query(
      `UPDATE db_project."users"
      SET otp = '${otp}', update_at = '${datetime}'
      WHERE id = '${user_id}'`,
      callback
    );
  },
  getDataOTP: function (user_id, otp, callback) {
    return db.query(
      `SELECT update_at + (interval '5 minute') AS datetimeotp FROM db_project."users" 
      WHERE id = '${user_id}' AND otp = '${otp}'`,
      callback
    );
  },
  setActiveAc: function (user_id, data, callback) {
    let datetime = data.datetime;
    return db.query(
      `UPDATE db_project."users"
      SET active = 1 , otp = null, update_at = '${datetime}', is_verified = 1
      WHERE id = '${user_id}'`,
      callback
    );
  },
};
module.exports = GetDataUser;
