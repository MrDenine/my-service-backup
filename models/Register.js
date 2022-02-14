const db = require("../dbconnection");

var Register = {
  getcheckEmail: function (email, callback) {
    return db.query(
      `SELECT COUNT("id") FROM db_project."users" WHERE email = '${email}' AND active = 1 AND is_verified = 1`,
      callback
    );
  },
  postdataUser: function (data, password, callback) {
    let email = data.email;
    let firstname = data.firstname;
    let lastname = data.lastname;
    let datetime = data.datetime;
    return db.query(
      `INSERT INTO db_project."users"(
        email, firstname, lastname, password, role, active, create_at, update_at, is_verified)
        VALUES ('${email}', '${firstname}', '${lastname}', '${password}', 1, 1, '${datetime}', '${datetime}', 0)
        RETURNING id AS user_id`,
      callback
    );
  },
};
module.exports = Register;
