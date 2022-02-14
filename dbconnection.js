const { Client  } = require("pg"); //postgresSql

const db = new Client({ //Database จริง
  host: "ec2-34-203-182-172.compute-1.amazonaws.com",
  database: "dc27g5poueu9a1",
  user: "ulqywgttpyykaq",
  port: 5432,
  password: "74970c0b04e7cf39c93e8ef13a1962064aac6e92dbcb9289bc6fe58f71f1ac7b",
  ssl: { rejectUnauthorized: false }
});

// const db = new DB({ //สำหรับ Localhost
//   host: "localhost",
//   user: "postgres",
//   port: 5432,
//   password: "Junior084444",
//   database: "",
// });

db.connect();
module.exports = db;
