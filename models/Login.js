const db = require("../dbconnection");

var Login = {

  checkPassword: function (email, callback) {
    //console.log(username);
    return db.query(
      `SELECT password FROM db_project."users" where email = '${email}' AND active = 1 AND is_verified = 1`,
      callback
    );
  },

  getIdUser: function (email, hashPW, callback) {
    return db.query(
      `SELECT id FROM db_project."users" 
      WHERE email = '${email}' AND password = '${hashPW}' AND active = 1 AND is_verified = 1`,
      callback
    );
  },
};
module.exports = Login;
