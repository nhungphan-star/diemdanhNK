const axios = require("axios");

const loginData = {
  email: "truongquynhanha324@gmail.com",  // 🔹 Thay bằng email thật
  password: "13082008",            // 🔹 Thay bằng mật khẩu thật
};

axios.post("http://localhost:5002/api/dang-nhap", loginData)
  .then(response => {
    if (response.data.token) {
      const token = response.data.token;
      console.log("✅ Token mới:", token);

      // 📌 Hiển thị lệnh để lưu token vào localStorage
      console.log(`👉 Copy & dán lệnh này vào Console trình duyệt để lưu token:`);
      console.log(`localStorage.setItem("token", "${token}");`);

      // 📌 Kiểm tra token hợp lệ
      console.log("\n🔹 Để kiểm tra token đã lưu, chạy lệnh sau trong Console trình duyệt:");
      console.log(`localStorage.getItem("token");`);
    } else {
      console.log("❌ Lỗi:", response.data.error);
    }
  })
  .catch(error => {
    console.error("❌ Lỗi khi lấy token:", error.response ? error.response.data : error.message);
  });
