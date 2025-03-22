const API_BASE_URL = "https://qr-attendance-backend-90tx.onrender.com"; // ✅ Biến chung cho API URL

document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();
    
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch( "https://qr-attendance-backend-90tx.onrender.com/api/login", { // ✅ Đúng API endpoint
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (response.ok) {
            alert("✅ Đăng nhập thành công!");
            localStorage.setItem("token", data.token);
            window.location.href = "dashboard.html"; // ✅ Điều hướng đến trang chính
        } else {
            alert("❌ Đăng nhập thất bại: " + (data.message || "Vui lòng thử lại."));
        }
    } catch (error) {
        alert("⚠ Lỗi kết nối đến server!");
    }
});

document.getElementById("registerForm").addEventListener("submit", async function (event) {
    event.preventDefault();
    
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;

    try {
        const response = await fetch( "https://qr-attendance-backend-90tx.onrender.com/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (response.ok) {
            alert("✅ Đăng ký thành công! Hãy đăng nhập.");
            window.location.href = "index.html"; // ✅ Quay về trang đăng nhập
        } else {
            alert("❌ Đăng ký thất bại: " + (data.message || "Vui lòng thử lại."));
        }
    } catch (error) {
        alert("⚠ Lỗi kết nối đến server!");
    }
});
