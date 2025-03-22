document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const email = document.getElementById("username").value; // Nếu backend yêu cầu email, đổi username thành email
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("https://qr-attendance-backend-90tx.onrender.com/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("token", data.token);
            alert("Đăng nhập thành công!");
            window.location.href = "index.html"; // Điều hướng đến trang chính
        } else {
            alert("Lỗi: " + (data.error || "Đăng nhập thất bại!"));
        }
    } catch (error) {
        console.error("Lỗi kết nối đến server:", error);
        alert("Không thể kết nối đến server. Vui lòng thử lại!");
    }
});
