const bcrypt = require("bcryptjs");

const passwordNhapVao = "123098"; // Thử nhập mật khẩu của bạn
const hashedPassword = "$2b$10$T2/sM7qqthZPozh28BBvTOYiUuNoG.FecTh49b71HVDZdiYtiypy6"; // Mật khẩu hash từ DB

bcrypt.compare(passwordNhapVao, hashedPassword, (err, isMatch) => {
    if (err) {
        console.error("❌ Lỗi khi kiểm tra mật khẩu:", err);
        return;
    }
    if (isMatch) {
        console.log("🎉 Mật khẩu hợp lệ! Có thể đăng nhập.");
    } else {
        console.log("❌ Mật khẩu không đúng!");
    }
});
