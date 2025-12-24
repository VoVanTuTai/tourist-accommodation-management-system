

// --- 1. Hàm hỗ trợ lấy giá trị từ URL ---
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// --- 2. Khởi tạo Slider & Khôi phục giá trị giá từ URL ---
const slider = document.getElementById("price-slider");
const minInput = document.getElementById("giaMin");
const maxInput = document.getElementById("giaMax");
const minLabel = document.getElementById("giaMinVal");
const maxLabel = document.getElementById("giaMaxVal");

// Lấy giá trị cũ hoặc dùng mặc định
const savedMin = parseInt(getQueryParam("giaMin")) || 0;
const savedMax = parseInt(getQueryParam("giaMax")) || 10000000;

if (slider) {
    noUiSlider.create(slider, {
        start: [savedMin, savedMax],
        connect: true,
        range: { min: 0, max: 10000000 },
        step: 50000,
        behaviour: "drag-tap",
        format: {
            to: value => Math.round(value),
            from: value => Number(value),
        },
    });

    slider.noUiSlider.on("update", values => {
        const [minVal, maxVal] = values.map(Number);
        minInput.value = minVal;
        maxInput.value = maxVal;
        minLabel.textContent = minVal.toLocaleString();
        maxLabel.textContent = maxVal.toLocaleString();
    });
}

// --- 3. Hàm Load Xã khi chọn Tỉnh (Có hỗ trợ chọn lại xã cũ) ---
async function loadXa(maTinh, selectedMaXa = null) {
    const xaSel = document.getElementById("xa");
    xaSel.innerHTML = '<option value="">-- Chọn xã / huyện --</option>';
    xaSel.disabled = true;

    if (!maTinh) return;

    try {
        const res = await fetch(`/api/xas/${maTinh}`);
        const xas = await res.json();
        xas.forEach(x => {
            const opt = document.createElement("option");
            opt.value = x.MaXa;
            opt.textContent = x.TenXa;
            if (x.MaXa == selectedMaXa) opt.selected = true;
            xaSel.appendChild(opt);
        });
        xaSel.disabled = false;
    } catch (e) { console.error("Lỗi load xã:", e); }
}

// --- 4. Load Loại phòng & Tỉnh và Khôi phục trạng thái ---
async function loadSelectData() {
    try {
        const [loaiPhongRes, tinhRes] = await Promise.all([
            fetch("/api/loaiphong"),
            fetch("/api/tinhs"),
        ]);
        const loaiPhongs = await loaiPhongRes.json();
        const tinhs = await tinhRes.json();

        // Lấy giá trị từ URL
        const savedMaLoai = getQueryParam("maLoai");
        const savedMaTinh = getQueryParam("maTinh");
        const savedMaXa = getQueryParam("maXa");
        const savedCheckin = getQueryParam("checkin");
        const savedCheckout = getQueryParam("checkout");

        // Khôi phục Loại phòng
        const loaiPhongSel = document.getElementById("loaiPhong");
        loaiPhongs.forEach(lp => {
            const opt = new Option(lp.TenLoai, lp.MaLoai);
            if (lp.MaLoai == savedMaLoai) opt.selected = true;
            loaiPhongSel.appendChild(opt);
        });

        // Khôi phục Tỉnh
        const tinhSel = document.getElementById("tinh");
        tinhs.forEach(t => {
            const opt = new Option(t.TenTinh, t.MaTinh);
            if (t.MaTinh == savedMaTinh) opt.selected = true;
            tinhSel.appendChild(opt);
        });

        // Khôi phục Xã (nếu có tỉnh)
        if (savedMaTinh) {
            await loadXa(savedMaTinh, savedMaXa);
        }

        // Khôi phục Ngày tháng
        if (savedCheckin) document.getElementsByName("checkin")[0].value = savedCheckin;
        if (savedCheckout) document.getElementsByName("checkout")[0].value = savedCheckout;

    } catch (e) { console.error("Lỗi load data:", e); }
}

// --- 5. Xử lý logic Check-in/out bằng jQuery ---
$(document).ready(function () {
    const $checkin = $('input[name="checkin"]');
    const $checkout = $('input[name="checkout"]');

    $checkin.on("change", function () {
        const val = this.value;
        if (val) {
            $checkout.attr("min", val);
            if ($checkout.val() && $checkout.val() < val) $checkout.val("");
        }
    });

    $checkout.on("change", function () {
        const val = this.value;
        if (val) {
            $checkin.attr("max", val);
            if ($checkin.val() && $checkin.val() > val) $checkin.val("");
        }
    });
});

// Sự kiện thay đổi tỉnh thủ công
document.getElementById("tinh").addEventListener("change", function () {
    loadXa(this.value);
});

// --- Khởi tạo khi trang tải xong ---
window.addEventListener("DOMContentLoaded", loadSelectData);