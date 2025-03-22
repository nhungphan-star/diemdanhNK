const express = require("express");
const http = require("http");

const app = express();
const PORT = 5002;

// Middleware (đảm bảo có dòng này để parse JSON request)
app.use(express.json());

// Route thử nghiệm
app.get("/", (req, res) => {
    res.send("Server đang chạy!");
});

// Route thêm học sinh
app.post("/api/them-hoc-sinh", (req, res) => {
    const { ten, ma_hoc_sinh, lop } = req.body;
    
    if (!ten || !ma_hoc_sinh || !lop) {
        return res.status(400).json({ message: "Thiếu thông tin học sinh!" });
    }
    
    // Giả lập lưu vào DB (nếu có)
    res.json({ message: "Thêm học sinh thành công!", hoc_sinh: { ten, ma_hoc_sinh, lop } });
});

// Tạo server HTTP từ Express
const server = http.createServer(app);

// Lắng nghe trên cổng
server.listen(PORT, () => {
    console.log(`🚀 Server đang chạy trên http://localhost:${PORT}`);
});
