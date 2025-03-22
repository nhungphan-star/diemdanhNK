document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch("https://qr-attendance-backend-90tx.onrender.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    if (data.token) {
        localStorage.setItem("token", data.token);
        alert("Đăng nhập thành công!");
        window.location.href = "index.html"; // Điều hướng đến trang chính
    } else {
        alert("Lỗi: " + data.error);
    }
});
