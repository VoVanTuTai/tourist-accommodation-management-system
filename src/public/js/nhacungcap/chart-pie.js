// Room Pie Chart
const DATA_COUNT = 5
const NUMBER_CFG = { count: DATA_COUNT, min: 0, max: 100 }

const data = {
    labels: ["Còn trống", "Đã đặt", "Bảo trì"],
    // labels: ["Phòng trống", "Đã đặt", "Bảo trì", "Green", "Blue"],
    datasets: [
        {
            backgroundColor: ["#37a2eb", "#ff6384", "#4cc0c0"],
            // backgroundColor: ["#37a2eb", "#ff6384", "#ff9e40", "#4cc0c0", "#ffcd56"],
            data: [12, 19, 3],
        },
    ],
}

var ctx = document.getElementById("myRoomPieChart").getContext("2d")
const config = {
    type: "pie",
    data: data,
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: "Chart.js Pie Chart",
            },
        },
    },
}
var myChart = new Chart(ctx, config)


// Booking Pie Chart
const dataBooking = {
    labels: ["Chưa thanh toán", "Đã thanh toán", "Đã hủy"],
    datasets: [
        {
            backgroundColor: ["#ff6384", "#4bc0c0", "#ff9e40"],
            data: [7, 15, 5],
        },
    ],
}

var ctxBooking = document.getElementById("myBookingPieChart").getContext("2d")
const configBooking = {
    type: "pie",
    data: dataBooking,
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: "Chart.js Pie Chart",
            },
        },
    },
}
var myBookingChart = new Chart(ctxBooking, configBooking);