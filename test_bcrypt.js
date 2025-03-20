const bcrypt = require("bcrypt");

// Thay thế bằng mật khẩu thực tế bạn đã nhập khi đăng ký
const plainPassword = "13082008";

// Thay thế bằng mật khẩu đã lưu trong database (lấy từ MySQL)
const hashedPasswordFromDB = "$2b$10$VuPb645a.hJnOAKRIMfs8uAc8bfGxdswVjiTu2fBZVFUg3NmEiDJO";

async function checkPassword() {
  const isMatch = await bcrypt.compare(plainPassword, hashedPasswordFromDB);
  console.log("🔹 Mật khẩu khớp?", isMatch);
}

checkPassword();
