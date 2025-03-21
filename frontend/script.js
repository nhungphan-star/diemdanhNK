document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();
    
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const response = awaitconst = await fetch("https://qr-attendance-backend-witc.onrender.com/api/login", { 
        
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (response.ok) {
        alert("Đăng nhập thành công!");
        // Lưu token vào localStorage và chuyển hướng trang nếu cần
        localStorage.setItem("token", data.token);
        window.location.href = "dashboard.html"; // Chỉnh sửa nếu cần
    } else {
        alert("Đăng nhập thất bại: " + data.message);
    }
});

document.getElementById("registerForm").addEventListener("submit", async function (event) {
    event.preventDefault();
    
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;

    const response = await fetch("https://qr-attendance-backend-witc.onrender.com/api/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (response.ok) {
        alert("Đăng ký thành công! Hãy đăng nhập.");
        window.location.href = "index.html"; // Quay về trang đăng nhập
    } else {
        alert("Đăng ký thất bại: " + data.message);
    }
});
