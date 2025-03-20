const mysql = require("mysql2");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "quanly_hocsinh",
  timezone: "+07:00"
});

connection.connect((err) => {
  if (err) {
    console.error("❌ Lỗi kết nối database:", err);
    return;
  }
  console.log("✅ Kết nối DB thành công!");
});

module.exports = connection;
