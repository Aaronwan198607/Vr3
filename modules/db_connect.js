const mysql = require("mysql2");

//建立連線池
const pool = mysql.createPool({
  host: "localhost", //主機位置
  user: "root", //資料庫帳號
  password: "", //資料庫密碼
  database: "studioa", //資料庫名稱
  waitForConnections: true, // 無可用連線時是否等待pool連線釋放(預設為true)
  connectionLimit: 5, // 連線池可建立的總連線數上限(預設最多為5個連線數)
  queueLimit: 0, //有無限定排隊人數，0是指沒有限制
});

module.exports = pool.promise();
