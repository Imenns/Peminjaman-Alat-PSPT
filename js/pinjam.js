document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-peminjaman");
  const statusText = document.getElementById("status");
  const alatContainer = document.getElementById("alat-container");
  const tambahBtn = document.getElementById("tambah-alat");

  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwV_RXvzvt9hg-MGgTlTh0t3nC7tmIThavMwrMDH6JbulpE05SmUkfYcJ6IdSP5a-7YCw/exec";

  const dataAlat = {
    Kamera: ["Kamera Foto", "Kamera Mirolles", "Kamera Video", "Baterai Kamera", "Charger Kamera", "Memori Kamera", "Tas Kamera"],
    Microphone: ["Clip On Catefo", "Clip On Taff Studio", "Mic Boom"],
    lighting: ["Lighting 100W", "Lighting Besar", "Lighting Stand/Tripod Lighting"],
    "Peralatan Lainnya": ["Tripod Kamera", "Tripod Hp", "Stabilizer Kamera", "Stabilizer Hp", "Baterai Fujitsu", "Baterai Enelope", "Clapper", "Lainnya"]
  };

  function setupDropdown(alatItem) {
    const kategoriSelect = alatItem.querySelector(".kategori");
    const alatSelect = alatItem.querySelector(".alat");

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
  }

  setupDropdown(document.querySelector(".alat-item"));

  tambahBtn.addEventListener("click", () => {
    const clone = document.querySelector(".alat-item").cloneNode(true);

    clone.querySelector(".kategori").value = "";
    clone.querySelector(".alat").innerHTML = '<option value="">Pilih alat</option>';
    clone.querySelector(".alat").disabled = true;

    setupDropdown(clone);
    alatContainer.appendChild(clone);
  });

  form.addEventListener("submit", e => {
    e.preventDefault();
    statusText.textContent = "Mengirim data...";

    const formData = new FormData(form);
    const kategoriList = formData.getAll("kategori[]");
    const alatList = formData.getAll("alat[]");

    const baseData = {
      nama: formData.get("nama"),
      tanggal_pinjam: formData.get("tanggal_pinjam"),
      tanggal_kembali: formData.get("tanggal_kembali")
    };

    let promises = [];

    kategoriList.forEach((kategori, index) => {
      const data = new FormData();
      data.append("nama", baseData.nama);
      data.append("kategori", kategori);
      data.append("alat", alatList[index]);
      data.append("tanggal_pinjam", baseData.tanggal_pinjam);
      data.append("tanggal_kembali", baseData.tanggal_kembali);

      promises.push(
        fetch(SCRIPT_URL, {
          method: "POST",
          body: data
        })
      );
    });

    Promise.all(promises)
      .then(() => {
        statusText.textContent = "Semua alat berhasil diajukan";
        form.reset();
        alatContainer.innerHTML = "";
        tambahBtn.click();
      })
      .catch(() => {
        statusText.textContent = "Gagal mengirim data";
        statusText.style.color = "#DC2626";
      });
  });
});
