const mysql = require("mysql2");
const bcrypt = require("bcryptjs");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    database: "quanly_hocsinh",
});

connection.connect((err) => {
    if (err) {
        console.error("❌ Lỗi kết nối database:", err);
        return;
    }
    console.log("✅ Kết nối DB thành công!");

    // Mật khẩu cần cập nhật
    const newPassword = "123098"; 

    // Hash mật khẩu trước khi lưu vào database
    bcrypt.hash(newPassword, 10, (err, hash) => {
        if (err) {
            console.error("❌ Lỗi khi hash mật khẩu:", err);
            return;
        }
        console.log("🔑 Mật khẩu hash mới:", hash);

        // Cập nhật mật khẩu trong database
        connection.query(
            "UPDATE giaovien SET password = ? WHERE username = 'admin'",
            [hash],
            (err, result) => {
                if (err) {
                    console.error("❌ Lỗi khi cập nhật mật khẩu:", err);
                } else {
                    console.log("✅ Cập nhật mật khẩu thành công!");
                }
                connection.end(); // Đóng kết nối sau khi cập nhật xong
            }
        );
    });
});
