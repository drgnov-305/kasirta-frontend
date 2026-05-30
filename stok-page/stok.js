/* ─────────────────────────────
   STOK.JS
───────────────────────────── */

function getProduk() {
  return JSON.parse(localStorage.getItem('dataProduk') || '[]');
}

function saveProduk(data) {
  localStorage.setItem('dataProduk', JSON.stringify(data));
}

function getStatus(stok) {
  if (stok === 0) return { label: 'Habis', class: 'status-habis' };
  if (stok <= 5)  return { label: 'Menipis', class: 'status-menipis' };
  return { label: 'Aman', class: 'status-aman' };
}

function updateStatCards() {
  const data = getProduk();
  const aman    = data.filter(p => p.stok > 5).length;
  const menipis = data.filter(p => p.stok > 0 && p.stok <= 5).length;
  const habis   = data.filter(p => p.stok === 0).length;
  const kategori = [...new Set(data.map(p => p.kategori))].length;

  document.getElementById('statTotalProduk').textContent = data.length;
  document.getElementById('statKategori').textContent = `${kategori} kategori`;
  document.getElementById('statAman').textContent = aman;
  document.getElementById('statMenipis').textContent = menipis;
  document.getElementById('statHabis').textContent = habis;
}

function renderTabel() {
  const data = getProduk();
  const tbody = document.getElementById('stokTableBody');

  if (data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="empty-stok">Belum ada data produk.</td></tr>`;
    return;
  }

  tbody.innerHTML = data.map((p, i) => {
    const s = getStatus(p.stok);
    return `
      <tr>
        <td class="td-nama">${p.nama}</td>
        <td class="td-kategori">${p.kategori || '—'}</td>
        <td class="td-stok"><strong>${p.stok}</strong></td>
        <td><span class="stok-status ${s.class}">${s.label}</span></td>
        <td>
          <div class="aksi-btns">
            <button class="btn-edit" onclick="editProduk(${i})">Edit</button>
            <button class="btn-restock" onclick="restockProduk(${i})">Restock</button>
            <button class="btn-hapus" onclick="hapusProduk(${i})">Hapus</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  updateStatCards();
}

function editProduk(i) {
  const data = getProduk();
  const p = data[i];
  const nama = prompt('Nama produk:', p.nama);
  if (nama === null) return;
  const stok = parseInt(prompt('Stok:', p.stok));
  if (isNaN(stok)) return;
  const kategori = prompt('Kategori:', p.kategori);
  if (kategori === null) return;

  data[i] = { ...p, nama, stok, kategori };
  saveProduk(data);
  renderTabel();
  showToast('Produk berhasil diperbarui!');
}

function restockProduk(i) {
  const data = getProduk();
  const jumlah = parseInt(prompt(`Tambah berapa stok untuk "${data[i].nama}"?`, '10'));
  if (isNaN(jumlah) || jumlah <= 0) return;
  data[i].stok += jumlah;
  saveProduk(data);
  renderTabel();
  showToast(`Stok ${data[i].nama} berhasil ditambah ${jumlah}!`);
}

function hapusProduk(i) {
  const data = getProduk();
  if (!confirm(`Hapus "${data[i].nama}"?`)) return;
  data.splice(i, 1);
  saveProduk(data);
  renderTabel();
  showToast('Produk berhasil dihapus.');
}

function importCSV() {
  showToast('🚧 Fitur ini akan segera hadir!');
}

/* function importCSV() {
  // Buat konten template CSV
  const header = 'nama_produk,kategori,stok,stok_minimum';
  const contoh1 = 'Nasi Goreng,Makanan,50,5';
  const contoh2 = 'Es Teh Manis,Minuman,30,5';
  const contoh3 = 'Keripik Tempe,Snack,20,5';

  const csvContent = [header, contoh1, contoh2, contoh3].join('\n');

  // Buat file dan trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'template_produk_kasirta.csv';
  link.click();

  URL.revokeObjectURL(url);
  showToast('Template CSV berhasil diunduh!');
}
*/ // Dit, ini hanya contoh template CSV. Ko coba aja dulu, nanti kalau sudah mantap sisa di aktifin aja :)

function simpanPerubahan() {
  showToast('Perubahan berhasil disimpan!');
}

// Init
renderTabel();
updateStatCards();

// nanti tambahkan modal atau form khusus untuk tambah produk baru. untuk saat ini masih edit,restock,dan hapus