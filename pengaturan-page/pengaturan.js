/* ─────────────────────────────
   PENGATURAN.JS
───────────────────────────── */

function showPanel(id, el) {
  document.querySelectorAll('.panel-section').forEach(p => p.style.display = 'none');
  document.querySelectorAll('.pnav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('panel-' + id).style.display = 'block';
  el.classList.add('active');
}

function toggleSwitch(id) {
  const el = document.getElementById(id);
  el.classList.toggle('on');
  el.classList.toggle('off');
}

function verifikasiWA() {
  const nomor = document.getElementById('set-wa').value.trim();
  if (!nomor) {
    showToast('Masukkan nomor WA terlebih dahulu!');
    return;
  }
  showToast('Kode verifikasi dikirim ke ' + nomor);
}

function simpanPengaturan() {
  const data = {
    namaToko    : document.getElementById('set-nama').value,
    tipeUsaha   : document.getElementById('set-tipe').value,
    alamat      : document.getElementById('set-alamat').value,
    telepon     : document.getElementById('set-telp').value,
    footerStruk : document.getElementById('set-footer').value,
    mataUang    : document.getElementById('set-matauang').value,
    nomorWA     : document.getElementById('set-wa').value,
  };
  localStorage.setItem('pengaturanToko', JSON.stringify(data));
  showToast('Pengaturan berhasil disimpan!');
}

function loadPengaturan() {
  const data = JSON.parse(localStorage.getItem('pengaturanToko') || '{}');
  if (data.namaToko)    document.getElementById('set-nama').value    = data.namaToko;
  if (data.tipeUsaha)   document.getElementById('set-tipe').value    = data.tipeUsaha;
  if (data.alamat)      document.getElementById('set-alamat').value  = data.alamat;
  if (data.telepon)     document.getElementById('set-telp').value    = data.telepon;
  if (data.footerStruk) document.getElementById('set-footer').value  = data.footerStruk;
  if (data.nomorWA)     document.getElementById('set-wa').value      = data.nomorWA;
}

// Init
loadPengaturan();

