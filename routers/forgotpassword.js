const express = require("express");
const router = express.Router();
var nodemailer = require("nodemailer");
const Register = require("../models/Register");
const ForgotPW = require("../models/Forgotpassword");
const bcrypt = require("bcrypt");

router.post("/PostReqOTP", async function (req, res, next) {
  var email = req.body.email;
  let checkEmail = await getcheckEmail(email); //เช็คอีเมล
  if (checkEmail[0].count > 0 && checkEmail != false) {
    var otp = Math.floor(100000 + Math.random() * 900000);

    var transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      // secure: false,
      // requireTLS: true,
      auth: {
        user: "test084444@gmail.com",
        pass: "juniortestgmail123456",
      },
    });

    var mailOptions = {
      from: "test084444@gmail.com",
      to: email,
      subject: "รหัส OTP สำหรับสร้างรหัสผ่านใหม่",
      text: otp.toString(),
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        res.json({ status: "Failed", data: "Error" });
      } else {
        console.log("Email sent: " + info.response);
        res.json({ status: "Succeed", data: otp.toString() });
      }
    });
  } else {
    res.json({ status: "Failed", data: "Invalid email" });
  }
});

router.post("/PostCreatePW", async function (req, res, next) {
  var new_password = req.body.new_password;

  let new_hashPW = await bcrypt.hash(new_password, 10);
  let result = await updatePassword(new_hashPW, req.body); //อัปเดตรหัสผ่าน
  if (result) {
    res.json({ status: "Succeed", data: "Succeed" });
  } else {
    res.json({ status: "Failed", data: "Error Update password fail" });
  }
});

async function getcheckEmail(email) {
  return new Promise((resolve, reject) => {
    try {
      Register.getcheckEmail(email, (err, rows) => {
        if (rows != null) {
          resolve(rows.rows);
        } else {
          resolve(false);
        }
      });
    } catch (err) {
      console.log(err);
      resolve(false);
    }
  });
}

async function updatePassword(new_hashPW, data) {
  return new Promise((resolve, reject) => {
    try {
      ForgotPW.updatePassword(new_hashPW, data, (err, rows) => {
        if (err) {
          console.log(err);
          resolve(false);
        } else {
          resolve(true);
        }
      });
    } catch (err) {
      console.log(err);
      resolve(false);
    }
  });
}
module.exports = router;
