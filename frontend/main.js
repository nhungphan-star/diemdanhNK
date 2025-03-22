document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");

    // Nếu đã đăng nhập, chuyển hướng sang trang quét QR
    if (token && window.location.pathname.includes("login.html")) {
        window.location.href = "scan.html";
    }

    // Xử lý đăng nhập
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const errorMessage = document.getElementById("errorMessage");

            try {
                const response = await fetch("https://qr-attendance-backend-90tx.onrender.com", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();
                if (!response.ok) {
                    errorMessage.textContent = data.error || "Sai tài khoản hoặc mật khẩu!";
                    errorMessage.classList.remove("hidden");
                } else {
                    localStorage.setItem("token", data.token);
                    alert("Đăng nhập thành công!");
                    window.location.href = "scan.html"; // Chuyển hướng đến trang quét QR
                }
            } catch (error) {
                errorMessage.textContent = "⚠ Lỗi kết nối đến server!";
                errorMessage.classList.remove("hidden");
            }
        });
    }

    // Xử lý đăng ký
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const name = document.getElementById("name").value;
            const email = document.getElementById("regEmail").value;
            const password = document.getElementById("regPassword").value;
            const confirmPassword = document.getElementById("confirmPassword").value;
            const grade = document.getElementById("grade").value;
            const classSelected = document.getElementById("class").value;

            if (password !== confirmPassword) {
                alert("Mật khẩu xác nhận không khớp!");
                return;
            }

            try {
                const response = await fetch("https://qr-attendance-backend-witc.onrender.com/api/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ hoten: name, email, password, khoi: grade, lop: classSelected })
                });

                const data = await response.json();
                if (response.ok) {
                    alert("Đăng ký thành công!");
                    window.location.href = "login.html";
                } else {
                    alert(data.error || "Đăng ký thất bại!");
                }
            } catch (error) {
                alert("⚠ Lỗi kết nối đến server!");
            }
        });
    }

    // Xử lý quét mã QR
    const qrScanner = document.getElementById("qr-reader");
    if (qrScanner) {
        function onScanSuccess(decodedText) {
            console.log(`Mã QR quét được: ${decodedText}`);
            document.getElementById("result").innerText = `Mã QR: ${decodedText}`;
            sendAttendance(decodedText);
        }

        function sendAttendance(qr_code) {
            fetch("https://qr-attendance-backend-witc.onrender.com/api/diemdanh", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                body: JSON.stringify({ qr_code })
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert(`❌ ${data.error}`);
                } else {
                    alert(`✅ ${data.message} - Trạng thái: ${data.trangthai}`);
                }
            })
            .catch(error => console.error("Lỗi khi gửi dữ liệu:", error));
        }

        let html5QrcodeScanner = new Html5QrcodeScanner("qr-reader", {
            fps: 10,
            qrbox: { width: 250, height: 250 }
        });
        
        html5QrcodeScanner.render(onScanSuccess);
    }

    // Xử lý đăng xuất
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            localStorage.removeItem("token");
            alert("Bạn đã đăng xuất!");
            window.location.href = "login.html";
        });
    }
});
