// 設定開發環境，使用專案的.env。
// if(process.argv[2] && process.argv[2]==='production'){
//     require('dotenv').config({
//       path: './production.env'
//     });
//   } else {
//     require('dotenv').config({
//       path: './dev.env'
//     });
//   }

//-----------------------------------------------------------
// 1-1. 引入 express ，是 Node.js 底下的一個前端 + 後端的框架。
const express = require("express");

const moment = require("moment-timezone");
//有時區的功能，但檔案較大，如果沒有要用轉換時區，可以用dayjs就好

// 使用 Multer 處理檔案上傳，建立上傳檔案的模組
// const upload = require("./modules/upload-img");

// 連線資料庫
const db = require("./modules/db_connect");

//-----------------------------------------------------------
// 1-2. 建立 web server 物件 (網站伺服器)
const app = express();

// 將 body-parser 設定成頂層 middleware，放在所有路由之前。
// body-parser 是Express 經常使用的中介軟體，用於解析請求的資料(body)
// 若用戶送進來的資料是urlencoded，才會進來做解析。
app.use(express.urlencoded({ extended: false }));

// 若用戶送進來的資料是json，才會進來做解析。
app.use(express.json());
// set 是設定，use 是接收 http 所有的方法。所以所有方法都會先進入這個頂層 middleware。

//-----------------------------------------------------------
// 1-3. 放後端路由 routes
// 路由是指，當用戶來拜訪時要符合http的方法跟對的路徑，才可以拿到資料。若有相同的路徑，前面會蓋掉後面的。
app.get("/", (req, res) => {
  res.send("會員您好");
});

// 取得 queryString 資料 (取得網址後帶的參數)
// req.query  # 接收 query string 參數
// 例如 http://localhost:3002/try-qs?a=1&b=3 => { "a" : "1", "b" : "3" }
app.get("/try-qs", (req, res) => {
  res.json(req.query);
});

// 取得POST資料(接收表單資料)
// 接收方法是post，路由是try-post
// 路徑用陣列寫，代表只要進到其中一個路徑就可以拿到資料
// 將 body-parser 設定成頂層 middleware，放在所有路由之前。
app.post(["/try-post", "/try-post1"], (req, res) => {
  res.json({
    query: req.query, // req.query  # 接收 query string 參數
    body: req.body, //req.body   # 接收表單的參數
  });
});

// 可以用相同的路徑接收不同的方法
// get是呈現表單
app.get("/try-post-form", (req, res) => {
  res.render("try-post-form");
}); //若用ejs樣板也要叫try-post-form

// post接收表單傳過來的資料
app.post("/try-post-form", (req, res) => {
  res.render("try-post-form", req.body);
});

// Multer 處理檔案上傳，single()是指單一檔案上傳，()裡面寫前端上傳欄位所叫的名稱
// app.post("/try-upload", upload.single("avatar"), (req, res) => {
//   res.set("Access-Control-Allow-Origin", "http://localhost:3000");
//   // console.log('req.file:', req.file); // 後端查看裡面的屬性，顯示在terminal
//   res.json(req.file);
// }); // upload.single('avatar')的資料內容會放在req.file裡面

//一個欄位多個檔案：用 upload.array('photos', 5)，第一個參數是欄位的名稱，第二個參數是最多能上傳的檔案數量。上傳的檔案資料會放在 req.files 裡面，一般欄位會放在 req.body 裡面。
//檔案會一個一個進入upload-imgs模組做篩選
// app.post("/try-uploads", upload.array("photos", 5), (req, res) => {
//   res.json({
//     body: req.body,
//     files: req.files,
//   });
// });

app.get("/vr-album", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM vr_album LIMIT 10");
  res.json(rows);
});

app.use("/db-vr-album", require("./routes/vr-album"));

app.use("/product", require("./routes/product"));

//專案內建立靜態內容的資料夾 public，將其當成document.root。
//此處放不會被server修改的檔案，例如.html、.css、icon檔等。
app.use(express.static("public"));
// app.use(express.static('node_modules/bootstrap/dist'));

// 自訂404頁面 *** 此段放在所有路由設定的後面 ***
app.use((req, res) => {
  // res.type('text/plain'); 沒有寫就是用html格式
  res.status(404).send(`<h1>抱歉！找不到頁面</h1>
  <p>404 QQ</p>`);
});

//-----------------------------------------------------------
// 1-4. Server 偵聽
//有設定就用設定檔，沒有就用3000。
const port = process.env.PORT || 3005;
app.listen(port, () => {
  console.log(`伺服器啟動: ${port}`);
});
