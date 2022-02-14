const express = require("express");
const router = express.Router();
var nodemailer = require("nodemailer");
const OTPmodels = require("../models/OTP");

router.post("/PostReqOTP", async function (req, res, next) {
  var email = req.body.email;
  var type = req.body.type;
  var user_id;

  if (type == 1) {
    user_id = req.body.user_id;
  } else {
    let checkEmail = await getcheckEmail(email);
    if (checkEmail == "") {
      user_id = 0;
    } else {
      user_id = checkEmail[0].id;
    }
  }

  if (user_id != 0) {
    var otp = Math.floor(100000 + Math.random() * 900000).toString();

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
      text: otp,
    };

    let statusOTP = await insertOTP(user_id, req.body, otp);
    if (statusOTP) {
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          res.json({ status: "Failed", data: "Error" });
        } else {
          console.log("Email sent: " + info.response);
          res.json({ status: "Succeed", data: otp });
        }
      });
    } else {
      res.json({ status: "Failed", data: "Insert OTP Fail" });
    }
  } else {
    res.json({ status: "Failed", data: "Invalid email" });
  }
});

router.post("/PostCheckOTP", async function (req, res, next) {
  var email = req.body.email;
  var type = req.body.type;
  var user_id;

  if (type == 1) {
    user_id = req.body.user_id;
  } else {
    let checkEmail = await getcheckEmail(email);
    if (checkEmail == "") {
      user_id = 0;
    } else {
      user_id = checkEmail[0].id;
    }
  }

  var otp = req.body.otp;
  var datetime = new Date(req.body.datetime).getTime();
  if (otp == null || !otp) {
    res.json({ status: "Failed", data: "Empty OTP" });
  } else {
    let dataOTP = await getDataOTP(user_id, otp);
    if (dataOTP == "" || dataOTP == false) {
      res.json({ status: "Failed", data: "Invalid OTP" });
    } else {
      let datetimeDB = new Date(dataOTP[0].datetimeotp).getTime();
      if (datetimeDB >= datetime) {
        let statusSetAc = await setActiveAc(user_id, req.body);
        if (statusSetAc) {
          res.json({ status: "Succeed", data: "Succeed" });
        } else {
          res.json({ status: "Failed", data: "Set User Fail" });
        }
      } else {
        res.json({ status: "Failed", data: "Over time OTP" });
      }
    }
  }
});

async function getcheckEmail(email) {
  return new Promise((resolve, reject) => {
    try {
      OTPmodels.getcheckEmail(email, (err, rows) => {
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

async function insertOTP(user_id, data, otp) {
  return new Promise((resolve, reject) => {
    try {
      OTPmodels.insertOTP(user_id, data, otp, (err, rows) => {
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

async function getDataOTP(user_id, otp) {
  return new Promise((resolve, reject) => {
    try {
      OTPmodels.getDataOTP(user_id, otp, (err, rows) => {
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

async function setActiveAc(user_id, data) {
  return new Promise((resolve, reject) => {
    try {
      OTPmodels.setActiveAc(user_id, data, (err, rows) => {
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
