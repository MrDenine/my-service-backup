const express = require("express");
const multer = require("multer");
const router = express.Router();
const fs = require("fs");
const tesseract = require("tesseract.js");
const DetectedImage = require("../models/DetectedImage");

var DIR = `././uploads/detectedImage`;

//รับข้อมูลสถิติการตรวจจับ
router.get("/getAmountRider/:user_id?", async function (req, res, next) {
  let user_id = req.params.user_id;

  //ผู้ใช้คน ๆ นั้น
  let countMeRidertoday = 0; //จำนวนรถที่ผู้ใช้แต่ละอัปมารายวัน
  let countMeRidertomonth = 0; //จำนวนรถที่ผู้ใช้แต่ละอัปมารายเดือน
  let countMeRidertotal = 0; //จำนวนรถที่ผู้ใช้แต่ละอัปมาทั้งหมด
  //ผู้ใช้ทั้งหมด
  let countAllRidertoday = 0; //จำนวนรถที่ผู้ใช้ทั้งหมดอัปมารายวัน
  let countAllRidertomonth = 0; //จำนวนรถที่ผู้ใช้ทั้งหมดอัปมารายเดือน
  let countAllRidertotal = 0; //จำนวนรถที่ผู้ใช้ทั้งหมดอัปมาทั้งหมด

  let data = await getAmountRider();
  let today = new Date();

  if (data.length > 0) {
    for (let index = 0; index < data.length; index++) {
      let datetimeDB = new Date(data[index]["detection_at"]);

      if (data[index]["request_user"] == user_id) {
        //ผู้ใช้คนนั้น ๆ
        if (today.toDateString() == datetimeDB.toDateString()) {
          countMeRidertoday += 1;
        }
        if (today.getMonth() == datetimeDB.getMonth()) {
          countMeRidertomonth += 1;
        }
        countMeRidertotal += 1;
      }
      //ผู้ใช้ทั้งหมด
      if (today.toDateString() == datetimeDB.toDateString()) {
        countAllRidertoday += 1;
      }
      if (today.getMonth() == datetimeDB.getMonth()) {
        countAllRidertomonth += 1;
      }
      countAllRidertotal += 1;
    }

    res.json({
      status: "Succeed",
      data: {
        countMeRider: {
          today: countMeRidertoday,
          tomonth: countMeRidertomonth,
          total: countMeRidertotal,
        },
        countAllRider: {
          today: countAllRidertoday,
          tomonth: countAllRidertomonth,
          total: countAllRidertotal,
        },
      },
    });
  } else
    res.json({
      status: "Succeed",
      data: {
        countMeRider: {
          today: countMeRidertoday,
          tomonth: countMeRidertomonth,
          total: countMeRidertotal,
        },
        countAllRider: {
          today: countAllRidertoday,
          tomonth: countAllRidertomonth,
          total: countAllRidertotal,
        },
      },
    });
});

//รับข้อมูลรูปภาพที่ถูกตรวจจับ
router.get("/getDataDetectedImage/:user_id?", async function (req, res, next) {
  let user_id = req.params.user_id;
  let getdata = await getDataDetectedImage(user_id);
  if (getdata != false) {
    res.json({ status: "Succeed", data: getdata });
  } else res.json({ status: "Failed", data: "Error" });
});

//อัปโหลดข้อมูลรูปภาพที่ถูกตรวจจับ
router.post("/uploadImage", async function (req, res, next) {
  let storageUploadFile = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, DIR);
    },
    filename: function (req, file, cb) {
      const fileName = file.originalname;
      cb(null, fileName);
    },
  });

  let UploadFile = multer({ storage: storageUploadFile }).array("file", 2);

  UploadFile(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }

    console.log(req.files.length);
    console.log(req.body);

    if (req.files.length > 0) {
      try {
        let pathLicense = DIR + "/" + req.files[1].originalname;
        let textLicense;

        //OCR
        let text = await tesseract.recognize(pathLicense, "tha");
        if (text.data.confidence > 70) {
          textLicense = text.data.text.replace(
            /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/\n]/gi,
            ""
          );
        } else {
          textLicense = "";
        }
        //console.log(textLicense);

        //นำข้อมูลไปเก็บยังฐานข้อมูล
        let insertData = await insertDataDetectedImg(
          req.body,
          textLicense,
          req.files[0].originalname
        );
        //console.log(insertData);
        if (insertData) {
          res.json({ status: "Succeed", data: "Insert Succeed" });
        } else {
          res.json({ status: "Failed", data: "Insert Failed" });
        }
        //fs.unlinkSync(pathLicense);
      } catch (error) {
        console.log(error);
        res.json({ status: "Failed", data: error });
      }
    } else {
      res.json({ status: "Failed", data: "undefined file" });
    }
  });
});

async function insertDataDetectedImg(data, text_license, filename) {
  return new Promise((resolve, reject) => {
    try {
      DetectedImage.insertDataDetectedImg(
        data,
        text_license,
        filename,
        (err, rows) => {
          if (err) {
            console.log(err);
            resolve(false);
          } else {
            resolve(true);
          }
        }
      );
    } catch (err) {
      console.log(err);
      resolve(false);
    }
  });
}

async function getAmountRider() {
  return new Promise((resolve, reject) => {
    try {
      DetectedImage.getAmountRider((err, rows) => {
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

async function getDataDetectedImage(user_id) {
  return new Promise((resolve, reject) => {
    try {
      DetectedImage.getDataDetectedImage(user_id, (err, rows) => {
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

module.exports = router;
