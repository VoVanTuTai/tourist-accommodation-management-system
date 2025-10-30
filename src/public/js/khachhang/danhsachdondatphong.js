function viewDetails(orderId) {
    // Implement view details functionality
    console.log("Viewing details for order:", orderId)
}

function cancelBooking(orderId) {
    if (confirm(`Bạn có chắc chắn muốn hủy đơn ${orderId}?`)) {
        // Implement cancel booking functionality
        console.log("Cancelling booking:", orderId)
    }
}

function completeBooking(orderId) {
    if (confirm(`Xác nhận hoàn tất đơn ${orderId}?`)) {
        // Implement complete booking functionality
        console.log("Completing booking:", orderId)
    }
}
