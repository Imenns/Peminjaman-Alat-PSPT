document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-peminjaman");
  const statusText = document.getElementById("status");
  const kategoriSelect = document.getElementById("kategori");
  const alatSelect = document.getElementById("alat");

  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwV_RXvzvt9hg-MGgTlTh0t3nC7tmIThavMwrMDH6JbulpE05SmUkfYcJ6IdSP5a-7YCw/exec";

  const dataAlat = {
    Kamera: ["Kamera DSLR", "Kamera Mirrorless", "Kamera Video"],
    Microphone: ["Mic Wireless", "Mic Kabel", "Clip On"],
    "Peralatan Lainnya": ["Tripod", "Lighting", "Mixer Audio"]
  };

  kategoriSelect.addEventListener("change", () => {
    const kategori = kategoriSelect.value;
    alatSelect.innerHTML = '<option value="">Pilih alat</option>';
    alatSelect.disabled = true;

    if (dataAlat[kategori]) {
      dataAlat[kategori].forEach(alat => {
        const opt = document.createElement("option");
        opt.value = alat;
        opt.textContent = alat;
        alatSelect.appendChild(opt);
      });
      alatSelect.disabled = false;
    }
  });

  form.addEventListener("submit", e => {
    e.preventDefault();
    statusText.textContent = "Mengirim data...";

    fetch(SCRIPT_URL, {
      method: "POST",
      body: new FormData(form)
    })
    .then(res => res.text())
    .then(() => {
      statusText.textContent = "Peminjaman berhasil dikirim";
      form.reset();
      alatSelect.disabled = true;
    })
    .catch(() => {
      statusText.textContent = "Gagal mengirim data";
      statusText.style.color = "#DC2626";
    });
  });
});
