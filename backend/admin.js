const express = require("express");
const router = express.Router();
const connection = require("../db"); // Import file kết nối DB

// API cập nhật năm học mới
router.post("/capnhat-namhoc", (req, res) => {
  connection.query(
    "UPDATE hocsinh SET lop = CONCAT(SUBSTRING(lop, 1, 2) + 1, SUBSTRING(lop, 3)), nam_hoc = nam_hoc + 1 WHERE CAST(SUBSTRING(lop, 1, 2) AS UNSIGNED) < 12",
    (err, result) => {
      if (err) {
        console.error("❌ Lỗi cập nhật năm học:", err);
        return res.status(500).json({ error: "Lỗi cập nhật năm học" });
      }
      res.json({ message: "Cập nhật năm học mới thành công!" });
    }
  );
});

module.exports = router;
