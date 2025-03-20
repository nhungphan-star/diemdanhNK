const jwt = require("jsonwebtoken");

const SECRET_KEY = "4a12695e4f77c7fcf5a2916f25284106cd928bf1a7387abc917d6f5100133c1b"; // Đổi thành SECRET_KEY trong server.js

const token = jwt.sign(
  { id: 123, email: "test@example.com", role: "hocsinh" }, // Dữ liệu trong token
  SECRET_KEY,
  { expiresIn: "24h" } // Thời gian hết hạn
);

console.log("🔑 Token mới:", token);
