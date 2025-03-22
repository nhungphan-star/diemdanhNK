document.getElementById("registerForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;  // Sửa ID thành chữ thường
    const lop = document.getElementById("class").value;
    const grade = document.getElementById("grade").value;

    const response = await fetch("https://qr-attendance-backend-90tx.onrender.com/api/register", {  // Thêm /api/register
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hoten: name, email, lop, khoi: grade })  // Đổi key JSON đúng với backend
    });

    const data = await response.json();
    if (response.ok) {
        alert("Đăng ký thành công!");
        window.location.href = "login.html";
    } else {
        alert("Lỗi: " + (data.message || "Đăng ký thất bại!"));
    }
});
