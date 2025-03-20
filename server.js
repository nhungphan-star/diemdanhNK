const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const moment = require("moment");
const requestIp = require("request-ip");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "4a12695e4f77c7fcf5a2916f25284106cd928bf1a7387abc917d6f5100133c1b";
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(requestIp.mw());



// Kết nối CSDL với Pool để tối ưu hiệu suất
const connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "quanly_hocsinh",
  timezone: "+07:00",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}).promise();

console.log("✅ Kết nối database thành công!");

// Middleware xác thực
function authMiddleware(roles = []) {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Không có token!" });

    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ error: "Không có quyền truy cập!" });
      }
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ error: "Token không hợp lệ!" });
    }
  };
}

// 📌 Đăng nhập giáo viên
app.post("/api/dang-nhap", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "Thiếu tài khoản hoặc mật khẩu!" });

  try {
    const [results] = await connection.query("SELECT * FROM giaovien WHERE username = ?", [username]);
    if (results.length === 0) return res.status(401).json({ error: "Sai tài khoản hoặc mật khẩu!" });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Sai tài khoản hoặc mật khẩu!" });

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, SECRET_KEY, { expiresIn: "24h" });
    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ error: "Lỗi truy vấn database!" });
  }
});
// 📌 Đăng ký học sinh
app.post("/api/dang-ky", async (req, res) => {
  const { name, email, password, class: lop, grade } = req.body;
  if (!name || !email || !password || !lop || !grade) {
    return res.status(400).json({ error: "Vui lòng nhập đầy đủ thông tin." });
  }

  try {
    const cleanEmail = email.toLowerCase().trim();

    // Kiểm tra email đã tồn tại chưa
    const [results] = await connection.query("SELECT id FROM hocsinh WHERE email = ?", [cleanEmail]);
    if (results.length > 0) return res.status(400).json({ error: "Email đã tồn tại!" });

    // Băm mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("🔹 Hashed Password:", hashedPassword);

    // Lưu vào database
    const sql = "INSERT INTO hocsinh (hoten, email, password, lop, khoi) VALUES (?, ?, ?, ?, ?)";
    const [insertResult] = await connection.query(sql, [name, cleanEmail, hashedPassword, lop, grade]);

    res.json({ success: true, studentId: insertResult.insertId });
  } catch (err) {
    console.error("🔥 Lỗi đăng ký:", err);
    res.status(500).json({ error: "Lỗi server, vui lòng thử lại!" });
  }
});


// 📌 Đăng nhập học sinh
app.post("/api/dang-nhap", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Vui lòng nhập email và mật khẩu!" });
  }

  const cleanEmail = email.toLowerCase().trim();
  console.log("🔍 Email nhập vào:", cleanEmail);

  connection.query("SELECT * FROM hocsinh WHERE email = ?", [cleanEmail], async (err, results) => {
    if (err) {
      console.error("❌ Lỗi kết nối CSDL:", err);
      return res.status(500).json({ error: "Lỗi kết nối CSDL!" });
    }

    if (results.length === 0) {
      console.log("❌ Email không tồn tại trong DB!");
      return res.status(401).json({ error: "Sai email hoặc mật khẩu!" });
    }

    const user = results[0];
    console.log("🔹 Mật khẩu nhập:", password);
    console.log("🔹 Mật khẩu trong DB:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔹 Kết quả so sánh mật khẩu:", isMatch);

    if (!isMatch) {
      console.log("❌ Mật khẩu không khớp!");
      return res.status(401).json({ error: "Sai email hoặc mật khẩu!" });
    }

    // ✅ Tạo token & trả về
    const token = jwt.sign({ id: user.id, email: user.email, role: "hocsinh" }, SECRET_KEY, { expiresIn: "24h" });

    console.log("✅ Đăng nhập thành công!");
    res.json({ token, role: "hocsinh" });

  });
});

// 📌 API điểm danh (chỉ quét mã QR cố định)
app.post("/api/diem-danh", authMiddleware(["hocsinh"]), async (req, res) => {
  console.log("Token nhận được:", req.headers.authorization);
  const { qr_code } = req.body;
  const id_hocsinh = req.user.id;
 

  // Kiểm tra mã QR hợp lệ
  if (qr_code !== "diemdanh_toantruong") {
    return res.status(400).json({ error: "❌ Mã QR không hợp lệ!" });
  }

  const ngay = moment().format("YYYY-MM-DD");
  const gioHT = moment().hour() * 60 + moment().minute(); // Lấy số phút từ 00:00
  const ip = req.clientIp;

  try {
    // Lấy thông tin học sinh
    const [studentResults] = await connection.query("SELECT khoi FROM hocsinh WHERE id = ?", [id_hocsinh]);
    if (studentResults.length === 0) return res.status(404).json({ error: "❌ Không tìm thấy học sinh!" });

    const khoi = studentResults[0].khoi;
    let trangthai = "Đúng giờ"; // Mặc định là đúng giờ

    // Xác định khung giờ điểm danh theo khối
    let gioBatDau, gioKetThuc;
    if (khoi === "10") {
      gioBatDau = 660; // 11:00
      gioKetThuc = 750; // 12:30
    } else if (khoi === "11" || khoi === "12") {
      gioBatDau = 300; // 5:00
      gioKetThuc = 405; // 6:45
    } else {
      return res.status(400).json({ error: "❌ Khối không hợp lệ!" });
    }

    // Kiểm tra khung giờ điểm danh
    if (gioHT < gioBatDau) {
      return res.status(400).json({ error: "❌ Chưa đến giờ điểm danh!" });
    }
    if (gioHT > gioKetThuc) {
      trangthai = "Đi trễ"; // Sau giờ kết thúc là trễ
    }

    // Kiểm tra học sinh đã điểm danh chưa
    const [attendanceResults] = await connection.query("SELECT * FROM diemdanh WHERE id_hocsinh = ? AND ngay = ?", [id_hocsinh, ngay]);
    if (attendanceResults.length > 0) {
      return res.status(400).json({ error: "❌ Hôm nay đã điểm danh rồi!" });
    }

    // Ghi nhận điểm danh
    await connection.query("INSERT INTO diemdanh (id_hocsinh, ngay, trangthai, ip) VALUES (?, ?, ?, ?)", [id_hocsinh, ngay, trangthai, ip]);

    res.json({ message: "✅ Điểm danh thành công!", trangthai });
  } catch (err) {
    res.status(500).json({ error: "⚠ Lỗi truy vấn database!" });
  }
});


// 📌 API lấy danh sách điểm danh
app.get("/api/danhsach-diemdanh", async (req, res) => {
  try {
    const [results] = await connection.query(`
      SELECT hocsinh.hoten, diemdanh.ngay, diemdanh.trangthai 
      FROM diemdanh 
      JOIN hocsinh ON diemdanh.id_hocsinh = hocsinh.id
      ORDER BY diemdanh.ngay DESC
    `);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Lỗi truy vấn CSDL!" });
  }
});

// 📌 API lấy danh sách học sinh
app.get("/api/danh-sach-hoc-sinh", authMiddleware(["admin", "giaovien"]), async (req, res) => {
  try {
    const [results] = await connection.query("SELECT id, hoten, lop, khoi FROM hocsinh");
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Lỗi truy vấn database!" });
  }
});

// 📌 API lấy lịch sử điểm danh (giáo viên và admin đều xem được)
app.get("/api/lich-su-diem-danh", authMiddleware(["admin", "giaovien"]), async (req, res) => {
  try {
    const [results] = await connection.query("SELECT * FROM diemdanh");
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Lỗi truy vấn database!" });
  }
});
app.get("/", (req, res) => {
  res.send("Server is running!");
});
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
});     