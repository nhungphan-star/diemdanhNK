document.addEventListener("DOMContentLoaded", function () {
    fetch("https://qr-attendance-backend-90tx.onrender.com")
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById("attendance-list");
            tableBody.innerHTML = "";

            data.forEach(entry => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${entry.hoten}</td>
                    <td>${entry.ngay}</td>
                    <td class="${entry.trangthai === 'Đúng giờ' ? 'green' : (entry.trangthai === 'Đi trễ' ? 'red' : 'gray')}">
                        ${entry.trangthai}
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error("Lỗi tải dữ liệu:", error));
});
