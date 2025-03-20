const jwt = require("jsonwebtoken");
const fs = require("fs");

const SECRET_KEY = "4a12695e4f77c7fcf5a2916f25284106cd928bf1a7387abc917d6f5100133c1b"; 

// Dữ liệu mã hóa trong token
const payload = {
  id: 13,
  email: "leezieng138@gmail.com",
  role: "hocsinh"
};

// Tạo token
const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });

console.log("✅ Token mới:", token);

// Ghi token ra file để dễ copy
fs.writeFileSync("token.txt", `localStorage.setItem("token", "${token}");`);

console.log("⚠️ Mở file token.txt, copy lệnh trong đó, dán vào Console trình duyệt để lưu token!");
