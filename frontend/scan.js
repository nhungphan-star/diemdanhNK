document.addEventListener("DOMContentLoaded", function () {
    function onScanSuccess(decodedText) {
        console.log(`Mã QR quét được: ${decodedText}`);
        document.getElementById("result").innerText = `Mã QR: ${decodedText}`;
        sendAttendance(decodedText);
    }

    function sendAttendance(qr_code) {
        fetch("https://qr-attendance-backend-90tx.onrender.com",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token") // Lấy token từ localStorage
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
});
