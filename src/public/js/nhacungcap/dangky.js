// document.getElementById("btn-register-partner").addEventListener("click", function (e) {
//     // Lưu trạng thái form đã được gửi
//     e.preventDefault();
//     console.log("Đã nhấn nút Đăng Ký nhà cung cấp");
//     sendFormData();
// });

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