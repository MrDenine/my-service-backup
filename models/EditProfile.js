const db = require("../dbconnection");

var EditProfile = {
  updateProfile: function (data, callback) {
    let user_id = data.user_id;
    let firstname = data.firstname;
    let lastname = data.lastname;
    let datetime = data.datetime;
    return db.query(
      `UPDATE db_project."users"
      SET firstname = '${firstname}', lastname = '${lastname}', update_at = '${datetime}'
      WHERE id = ${user_id} AND active = 1 AND is_verified = 1`,
      callback
    );
  },

  updateImage: function (image_profile, user_id, callback) {
    return db.query(
      `UPDATE db_project."users"
      SET image_profile = '${image_profile}'
      WHERE id = ${user_id} AND active = 1 AND is_verified = 1`,
      callback
    );
  },
};
module.exports = EditProfile;
