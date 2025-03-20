document.getElementById("registerForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const lop = document.getElementById("class").value;
    const grade = document.getElementById("grade").value;

    const response = await fetch("http://localhost:5002/dangky", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, class: lop, grade })
    });

    const data = await response.json();
    if (data.success) {
        alert("Đăng ký thành công!");
        window.location.href = "login.html";
    } else {
        alert("Lỗi: " + data.message);
    }
});
