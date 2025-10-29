// --- Load loại phòng & tỉnh ---
async function loadSelectData() {
    const [loaiPhongRes, tinhRes] = await Promise.all([
        fetch("/api/loaiphong"),
        fetch("/api/tinhs"),
    ])
    const loaiPhongs = await loaiPhongRes.json()
    const tinhs = await tinhRes.json()

    const loaiPhongSel = document.getElementById("loaiPhong")
    loaiPhongs.forEach(lp => {
        const opt = document.createElement("option")
        opt.value = lp.MaLoai
        opt.textContent = lp.TenLoai
        loaiPhongSel.appendChild(opt)
    })

    const tinhSel = document.getElementById("tinh")
    tinhs.forEach(t => {
        const opt = document.createElement("option")
        opt.value = t.MaTinh
        opt.textContent = t.TenTinh
        tinhSel.appendChild(opt)
    })
}

// --- Load xã khi chọn tỉnh ---
document.getElementById("tinh").addEventListener("change", async function () {
    const maTinh = this.value
    const xaSel = document.getElementById("xa")
    xaSel.innerHTML = '<option value="">-- Chọn xã / huyện --</option>'
    xaSel.disabled = true

    if (!maTinh) return

    const res = await fetch(`/api/xas/${maTinh}`)
    const xas = await res.json()
    xas.forEach(x => {
        const opt = document.createElement("option")
        opt.value = x.MaXa
        opt.textContent = x.TenXa
        xaSel.appendChild(opt)
    })
    xaSel.disabled = false
})

// --- Tạo thanh kéo noUiSlider ---
const slider = document.getElementById("price-slider")
const minInput = document.getElementById("giaMin")
const maxInput = document.getElementById("giaMax")
const minLabel = document.getElementById("giaMinVal")
const maxLabel = document.getElementById("giaMaxVal")

noUiSlider.create(slider, {
    start: [500000, 2000000],
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
})

slider.noUiSlider.on("update", values => {
    const [minVal, maxVal] = values.map(Number)
    minInput.value = minVal
    maxInput.value = maxVal
    minLabel.textContent = minVal.toLocaleString()
    maxLabel.textContent = maxVal.toLocaleString()
})

// --- Khởi tạo ---
loadSelectData()
