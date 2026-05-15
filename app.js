/* ═══════════════════════════════════════════════════
   KASIRTE' — app.js
   Struktur:
   1. Data Menu
   2. State / Variabel Global
   3. Fungsi: Jam & Tanggal
   4. Fungsi: ID Transaksi
   5. Fungsi: Render Menu
   6. Fungsi: Filter & Search
   7. Fungsi: Keranjang (Cart)
   8. Fungsi: Modal
   9. Fungsi: Navigasi Sidebar
   10. Fungsi: Toast Notifikasi
   11. Fungsi: Format Rupiah
   12. Inisialisasi (Init)
═══════════════════════════════════════════════════ */

/* ─────────────────────────────
   1. DATA MENU
───────────────────────────── */
const menuData = [
  { id: 1,  name: "Nasi Goreng",      emoji: "🍳", category: "Makanan",  price: 15000 },
  { id: 2,  name: "Nasi Ayam Geprek", emoji: "🍗", category: "Makanan",  price: 18000 },
  { id: 3,  name: "Mie Goreng Jawa",  emoji: "🍜", category: "Makanan",  price: 13000 },
  { id: 4,  name: "Soto Ayam",        emoji: "🥣", category: "Makanan",  price: 14000 },
  { id: 5,  name: "Es Teh Manis",     emoji: "🧋", category: "Minuman",  price: 5000  },
  { id: 6,  name: "Es Jeruk",         emoji: "🍊", category: "Minuman",  price: 6000  },
  { id: 7,  name: "Jus Alpukat",      emoji: "🥑", category: "Minuman",  price: 10000 },
  { id: 8,  name: "Pisang Goreng",    emoji: "🍌", category: "Snack",    price: 8000  },
  { id: 9,  name: "Cireng Goreng",    emoji: "🧆", category: "Snack",    price: 7000  },
  { id: 10, name: "Keripik Tempe",    emoji: "🥜", category: "Snack",    price: 5000  },
];

/* ─────────────────────────────
   2. STATE / VARIABEL GLOBAL
───────────────────────────── */
let cart          = [];       // isi keranjang belanja
let currentFilter = "Semua"; // filter kategori aktif
let searchQuery   = "";       // kata kunci pencarian

/* ─────────────────────────────
   3. JAM & TANGGAL REAL-TIME
───────────────────────────── */
function updateClock() {
  const now    = new Date();
  const days   = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
  const months = ["Januari","Februari","Maret","April","Mei","Juni",
                  "Juli","Agustus","September","Oktober","November","Desember"];

  const tanggal = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
  const jam     = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false });

  document.getElementById('topbar-date').textContent = tanggal;
  document.getElementById('topbar-time').textContent = jam;
}

/* ─────────────────────────────
   4. GENERATE ID TRANSAKSI
───────────────────────────── */
function genTrxId() {
  const now  = new Date();
  const mmdd = String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0');
  const rnd  = String(Math.floor(Math.random() * 999)).padStart(3, '0');
  return `#TRX-${rnd}-${now.getFullYear()}-${mmdd}`;
}

/* ─────────────────────────────
   5. RENDER MENU KE GRID
───────────────────────────── */
function renderMenu() {
  const grid = document.getElementById('menuGrid');

  // Filter berdasarkan kategori & pencarian
  const filtered = menuData.filter(item => {
    const cocokKategori = currentFilter === "Semua" || item.category === currentFilter;
    const cocokSearch   = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return cocokKategori && cocokSearch;
  });

  // Tampilkan pesan jika tidak ada hasil
  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align:center; color: var(--text-muted); padding: 40px 0;">
        <i class="fas fa-search" style="font-size:28px; margin-bottom:10px; display:block;"></i>
        Menu tidak ditemukan
      </div>`;
    return;
  }

  // Render kartu menu
  grid.innerHTML = filtered.map(item => `
    <div class="menu-card" onclick="addToCart(${item.id})">
      <div class="food-emoji">${item.emoji}</div>
      <div class="name">${item.name}</div>
      <div class="price">${formatRupiah(item.price)}</div>
      <div class="add-btn"><i class="fas fa-plus"></i></div>
    </div>
  `).join('');
}

/* ─────────────────────────────
   6. FILTER & SEARCH
───────────────────────────── */

// Klik tab kategori
function setFilter(kategori, elButton) {
  currentFilter = kategori;

  // Reset semua tab, aktifkan yang diklik
  document.querySelectorAll('.filter-tab').forEach(tab => tab.classList.remove('active'));
  elButton.classList.add('active');

  renderMenu();
}

// Ketik di search bar
function filterMenu() {
  searchQuery = document.getElementById('searchInput').value;
  renderMenu();
}

/* ─────────────────────────────
   7. KERANJANG (CART)
───────────────────────────── */

// Tambah item ke keranjang
function addToCart(id) {
  const menu     = menuData.find(item => item.id === id);
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.qty++; // sudah ada → tambah qty
  } else {
    cart.push({ ...menu, qty: 1 }); // belum ada → masukkan baru
  }

  renderCart();
  showToast(`${menu.emoji} ${menu.name} ditambahkan`);
}

// Ubah jumlah item (delta: +1 atau -1)
function changeQty(id, delta) {
  const index = cart.findIndex(item => item.id === id);
  if (index === -1) return;

  cart[index].qty += delta;

  // Hapus dari keranjang jika qty = 0
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }

  renderCart();
}

// Kosongkan seluruh keranjang
function clearCart() {
  if (cart.length === 0) return;
  cart = [];
  renderCart();
  showToast("Keranjang dikosongkan");
}

// Render ulang tampilan keranjang
function renderCart() {
  const container = document.getElementById('cartItems');
  const btnBayar  = document.getElementById('btnBayar');

  if (cart.length === 0) {
    // Tampilkan state kosong
    container.innerHTML = `
      <div class="cart-empty">
        <div class="bag-icon"><i class="fas fa-shopping-bag"></i></div>
        <p>Pilih menu untuk<br>mulai transaksi</p>
      </div>`;
    btnBayar.disabled = true;

  } else {
    // Render daftar item
    container.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="item-emoji">${item.emoji}</div>
        <div class="item-info">
          <div class="item-name">${item.name}</div>
          <div class="item-price">${formatRupiah(item.price * item.qty)}</div>
        </div>
        <div class="qty-ctrl">
          <button class="qty-btn minus" onclick="changeQty(${item.id}, -1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
        </div>
      </div>
    `).join('');
    btnBayar.disabled = false;
  }

  // Hitung & tampilkan subtotal, diskon, total
  updateCartSummary();
}

// Update ringkasan harga di bawah keranjang
function updateCartSummary() {
  const subtotal = cart.reduce((total, item) => total + item.price * item.qty, 0);
  const diskon   = 0; // bisa diubah sesuai logika diskon
  const total    = subtotal - diskon;

  document.getElementById('subtotalVal').textContent  = formatRupiah(subtotal);
  document.getElementById('diskonVal').textContent    = `-${formatRupiah(diskon)}`;
  document.getElementById('totalVal').textContent     = formatRupiah(total);
  document.getElementById('modalAmount').textContent  = formatRupiah(total);
  document.getElementById('successAmount').textContent = formatRupiah(total);
}

/* ─────────────────────────────
   8. MODAL
───────────────────────────── */

// Buka modal konfirmasi bayar
function openConfirmModal() {
  document.getElementById('confirmModal').classList.add('active');
}

// Tutup modal konfirmasi
function closeConfirmModal() {
  document.getElementById('confirmModal').classList.remove('active');
}

// Konfirmasi pembayaran → tampilkan sukses
function confirmPayment() {
  closeConfirmModal();
  setTimeout(() => {
    document.getElementById('successModal').classList.add('active');
  }, 200);
}

// Mulai transaksi baru setelah sukses
function newTransaction() {
  document.getElementById('successModal').classList.remove('active');
  cart = [];
  renderCart();
  document.getElementById('trxId').textContent = genTrxId();
  showToast("Siap transaksi baru! 🎉");
}

/* ─────────────────────────────
   9. NAVIGASI SIDEBAR
───────────────────────────── */
function showPage(page, elLink) {
  // Update class active di sidebar
  document.querySelectorAll('.sidebar-nav a').forEach(a => a.classList.remove('active'));
  elLink.classList.add('active');

  // Placeholder — tambahkan logika multi-halaman di sini
  if (page !== 'kasir') {
    showToast(`Halaman "${page}" belum tersedia`);
  }
}

/* ─────────────────────────────
   10. NOTIFIKASI WA
───────────────────────────── */
function notifWA() {
  showToast("📱 Notifikasi WhatsApp dikirim ke pemilik!");
}

/* ─────────────────────────────
   11. TOAST NOTIFIKASI
───────────────────────────── */
function showToast(pesan) {
  const toast = document.getElementById('toast');
  toast.textContent = pesan;
  toast.classList.add('show');

  // Auto hilang setelah 2.5 detik
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 2500);
}

/* ─────────────────────────────
   12. FORMAT RUPIAH
───────────────────────────── */
function formatRupiah(angka) {
  return 'Rp ' + angka.toLocaleString('id-ID');
}

/* ─────────────────────────────
   13. INISIALISASI
───────────────────────────── */
function init() {
  // Set jam & tanggal real-time
  updateClock();
  setInterval(updateClock, 1000);

  // Set ID transaksi awal
  document.getElementById('trxId').textContent = genTrxId();

  // Render menu pertama kali
  renderMenu();

  // Render keranjang kosong
  renderCart();
}

// Jalankan saat halaman siap
document.addEventListener('DOMContentLoaded', init);