const jwt = require("jsonwebtoken");

// 🔹 Nhập token cần kiểm tra
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMsImVtYWlsIjoibGVlemllbmcxMzhAZ21haWwuY29tIiwicm9sZSI6ImhvY3NpbmgiLCJpYXQiOjE3NDIzMDI4MzUsImV4cCI6MTc0MjM4OTIzNX0.I5q9JjzsEcju29lZvYCksa8wB1SMrZx04cntBV_ggvQ";  // Thay bằng token thật

// 🔹 Nhập SECRET_KEY đã dùng khi tạo token
const SECRET_KEY = "4a12695e4f77c7fcf5a2916f25284106cd928bf1a7387abc917d6f5100133c1b";  // Thay bằng key thật

try {
  // 🛠️ Kiểm tra token
  const decoded = jwt.verify(token, SECRET_KEY);
  console.log("✅ Token hợp lệ:", decoded);
} catch (error) {
  console.error("❌ Token không hợp lệ:", error.message);
}
