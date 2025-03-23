const API_BASE_URL = "https://qr-attendance-backend-90tx.onrender.com"; 

async function themHocSinh() {
    const res = await fetch(`${API_BASE_URL}/api/them-hoc-sinh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            ten: "Nguyen Van A",
            ma_hoc_sinh: "HS123",
            lop: "10A1"
        })
    });

    const data = await res.json();
    console.log(data);
}
