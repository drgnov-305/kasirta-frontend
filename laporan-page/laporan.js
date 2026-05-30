/* ─────────────────────────────
   LAPORAN.JS
───────────────────────────── */

function getTransaksi() {
  return JSON.parse(localStorage.getItem('riwayatTransaksi') || '[]');
}

function updateStats() {
  const data = getTransaksi();
  const total = data.reduce((s, t) => s + t.total, 0);
  const count = data.length;
  const avg = count > 0 ? Math.round(total / count) : 0;

  const menuCount = {};
  data.forEach(t => {
    t.items.forEach(item => {
      menuCount[item.name] = (menuCount[item.name] || 0) + item.qty;
    });
  });
  const topEntry = Object.entries(menuCount).sort((a, b) => b[1] - a[1])[0];

  document.getElementById('totalPendapatan').textContent = formatRupiah(total);
  document.getElementById('hintPendapatan').textContent = `+${count} transaksi baru`;
  document.getElementById('totalTrx').textContent = count;
  document.getElementById('avgTrx').textContent = formatRupiah(avg);
  document.getElementById('topMenu').textContent = topEntry ? topEntry[0] : '—';
  document.getElementById('topMenuCount').textContent = topEntry ? `${topEntry[1]} terjual` : '0 terjual';
}

function updateBarChart() {
  const days = ['sen', 'sel', 'rab', 'kam', 'jum', 'sab', 'min'];
  days.forEach(d => {
    document.getElementById('bar-' + d).style.width = '0%';
    document.getElementById('val-' + d).textContent = 'Rp 0';
  });
}

function updateHistori() {
  const data = getTransaksi();
  const el = document.getElementById('historiTrx');

  if (data.length === 0) {
    el.innerHTML = '<div class="empty-histori">Belum ada transaksi hari ini.</div>';
    return;
  }

  el.innerHTML = [...data].reverse().map(t => `
    <div class="histori-row">
      <div>
        <div class="histori-trxid">${t.id}</div>
        <div class="histori-items">${t.items.map(i => `${i.name} ×${i.qty}`).join(', ')}</div>
      </div>
      <div class="histori-meta">
        <div class="histori-time">${t.waktu} · ${t.metode}</div>
        <div class="histori-total">${formatRupiah(t.total)}</div>
      </div>
    </div>
  `).join('');
}

function eksporPDF() {
  window.print();
}

function kirimWA() {
  const data = getTransaksi();
  const total = data.reduce((s, t) => s + t.total, 0);
  const pesan = `*Laporan KasirTa' - Kantin UC Makassar*\nTotal Transaksi: ${data.length}\nTotal Pendapatan: ${formatRupiah(total)}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(pesan)}`, '_blank');
}

// Init
updateStats();
updateBarChart();
updateHistori();


// untuk reset histori harian masih bersifat localStorage, jadi se perlu logika untuk membersihkan data lama saat hari berganti