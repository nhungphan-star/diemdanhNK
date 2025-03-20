const bcrypt = require("bcryptjs");
const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "quanly_hocsinh",
});

connection.connect(async (err) => {
  if (err) {
    console.error("❌ Lỗi kết nối database:", err);
    return;
  }

  const username = "admin";
  const plainPassword = "123456";
  const hashedPassword = await bcrypt.hash(plainPassword, 10);
  
  connection.query(
    "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
    [username, hashedPassword, "admin"],
    (err, result) => {
      if (err) {
        console.error("❌ Lỗi tạo tài khoản admin:", err);
      } else {
        console.log("✅ Admin đã được tạo thành công!");
      }
      connection.end();
    }
  );
});
