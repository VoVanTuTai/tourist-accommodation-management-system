const tinhElm = document.getElementById("Tinh");
if (tinhElm) {
    document.getElementById("Tinh").addEventListener("change", function (e) {
        // Lưu trạng thái form đã được gửi
        e.preventDefault();
        console.log("Đã nhấn nút Đăng Ký nhà cung cấp");
        const xaElm = document.getElementById("Xa");
        const tinhVal = e.target.value;
        if (tinhVal === "") {
            xaElm.innerHTML = "";
            xaElm.disabled = true;
            return;
        }
        const url = `/api/xas/${tinhVal}`;
        fetch(url, { // Replace with your backend endpoint
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            console.log("Danh sách xã:", data);
            xaElm.disabled = false;
            xaElm.innerHTML = "";
            data.forEach((item) => {
                const option = document.createElement("option");
                option.value = item.MaXa;
                option.textContent = item.TenXa;
                xaElm.appendChild(option);
            });
        })
        .catch((error) => {
            console.error('Error:', error);
            // Handle errors during the fetch request
        });
    });
}

function sendFormData() {
    const formToSend = document.getElementById("partner-register-form");
    const formData = new FormData(formToSend);
    const payload = Object.fromEntries(formData);

    console.log("Đang gửi dữ liệu form:", payload);
    fetch('/nhacungcap/dangky', { // Replace with your backend endpoint
        method: 'POST',
        body: JSON.stringify(payload), 
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        console.log("Phản hồi từ server:", response);
    })
    .then(data => {
        console.log('Success:', data);
        // Handle success response from the server
    })
    .catch(error => {
        console.error('Error:', error);
        // Handle errors during the fetch request
    });
}