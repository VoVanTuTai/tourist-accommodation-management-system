/**
 * TIMKIEM.JS
 * Chức năng: Load dữ liệu API, xử lý slider và giữ trạng thái form sau khi submit
 */

// --- 1. Hàm hỗ trợ lấy giá trị từ URL ---
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// --- 2. Khởi tạo noUiSlider và khôi phục giá trị giá ---
const slider = document.getElementById("price-slider");
const minInput = document.getElementById("giaMin");
const maxInput = document.getElementById("giaMax");
const minLabel = document.getElementById("giaMinVal");
const maxLabel = document.getElementById("giaMaxVal");

// Lấy giá trị từ URL hoặc dùng mặc định
const savedMin = parseInt(getQueryParam("giaMin")) || 0;
const savedMax = parseInt(getQueryParam("giaMax")) || 10000000;

noUiSlider.create(slider, {
    start: [savedMin, savedMax],
    connect: true,
    range: {
        min: 0,
        max: 10000000,
    },
    step: 50000,
    behaviour: "drag-tap",
    format: {
        to: value => Math.round(value),
        from: value => Number(value),
    },
});

slider.noUiSlider.on("update", (values) => {
    const [minVal, maxVal] = values.map(Number);
    minInput.value = minVal;
    maxInput.value = maxVal;
    minLabel.textContent = minVal.toLocaleString();
    maxLabel.textContent = maxVal.toLocaleString();
});

// --- 3. Hàm Load Xã/Huyện (Tách riêng để tái sử dụng) ---
async function loadXa(maTinh, selectedXa = null) {
    const xaSel = document.getElementById("xa");
    xaSel.innerHTML = '<option value="">-- Chọn xã / huyện --</option>';
    xaSel.disabled = true;

    if (!maTinh) return;

    try {
        const res = await fetch(`/api/xas/${maTinh}`);
        if (!res.ok) throw new Error("Không thể lấy dữ liệu xã");
        const xas = await res.json();

        xas.forEach(x => {
            const opt = new Option(x.TenXa, x.MaXa);
            if (x.MaXa == selectedXa) opt.selected = true;
            xaSel.appendChild(opt);
        });
        xaSel.disabled = false;
    } catch (error) {
        console.error("Lỗi load xã:", error);
    }
}

// --- 4. Load dữ liệu ban đầu (Loại phòng, Tỉnh, Ngày tháng) ---
async function loadInitialData() {
    try {
        // Lấy các giá trị hiện có trên URL
        const savedMaLoai = getQueryParam("maLoai");
        const savedMaTinh = getQueryParam("maTinh");
        const savedMaXa = getQueryParam("maXa");
        const savedCheckin = getQueryParam("checkin");
        const savedCheckout = getQueryParam("checkout");

        // Khôi phục ngày Check-in / Check-out
        if (savedCheckin) document.querySelector('input[name="checkin"]').value = savedCheckin;
        if (savedCheckout) document.querySelector('input[name="checkout"]').value = savedCheckout;

        // Gọi API load Loại phòng và Tỉnh đồng thời
        const [loaiPhongRes, tinhRes] = await Promise.all([
            fetch("/api/loaiphong"),
            fetch("/api/tinhs")
        ]);

        const loaiPhongs = await loaiPhongRes.json();
        const tinhs = await tinhRes.json();

        // Đổ dữ liệu Loại Phòng
        const loaiPhongSel = document.getElementById("loaiPhong");
        loaiPhongs.forEach(lp => {
            const opt = new Option(lp.TenLoai, lp.MaLoai);
            if (lp.MaLoai == savedMaLoai) opt.selected = true;
            loaiPhongSel.appendChild(opt);
        });

        // Đổ dữ liệu Tỉnh
        const tinhSel = document.getElementById("tinh");
        tinhs.forEach(t => {
            const opt = new Option(t.TenTinh, t.MaTinh);
            if (t.MaTinh == savedMaTinh) opt.selected = true;
            tinhSel.appendChild(opt);
        });

        // Nếu có Tỉnh cũ, tự động load Xã và chọn Xã cũ
        if (savedMaTinh) {
            await loadXa(savedMaTinh, savedMaXa);
        }

    } catch (error) {
        console.error("Lỗi khởi tạo dữ liệu:", error);
    }
}

// --- 5. Lắng nghe sự kiện thay đổi Tỉnh ---
document.getElementById("tinh").addEventListener("change", function () {
    loadXa(this.value);
});

// --- 6. Chạy khi trang đã load xong ---
document.addEventListener("DOMContentLoaded", loadInitialData);