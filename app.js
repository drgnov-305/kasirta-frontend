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
  {
    id: 1,
    name: "Nasi Goreng",
    emoji: "🍳",
    image: "assets/nasigoreng.png",
    category: "Makanan",
    price: 15000
  },
  {
    id: 2,
    name: "Nasi Ayam Geprek",
    emoji: "🍗",
    image: "assets/ayam.png",
    category: "Makanan",
    price: 18000
  },
  {
    id: 3,
    name: "Mie Goreng Jawa",
    emoji: "🍜",
    image: "assets/mie.png",
    category: "Makanan",
    price: 13000
  },
  {
    id: 4,
    name: "Soto Ayam",
    emoji: "🥣",
    image: "",
    category: "Makanan",
    price: 14000
  },
  {
    id: 5,
    name: "Es Teh Manis",
    emoji: "🧋",
    image: "assets/esteh.png",
    category: "Minuman",
    price: 5000
  },
  {
    id: 6,
    name: "Es Jeruk",
    emoji: "🍊",
    image: "assets/jusjeruk.png",
    category: "Minuman",
    price: 6000
  },
  {
    id: 7,
    name: "Jus Alpukat",
    emoji: "🥑",
    image: "",
    category: "Minuman",
    price: 10000
  },
  {
    id: 8,
    name: "Pisang Goreng",
    emoji: "🍌",
    image: "assets/pisang.png",
    category: "Snack",
    price: 8000
  },
  {
    id: 9,
    name: "Cireng Goreng",
    emoji: "🧆",
    image: "assets/cireng.png",
    category: "Snack",
    price: 7000
  },
  {
    id: 10,
    name: "Keripik Tempe",
    emoji: "🥜",
    image: "",
    category: "Snack",
    price: 5000
  },
];

/* ─────────────────────────────
   2. STATE / VARIABEL GLOBAL
───────────────────────────── */
let cart          = [];
let currentFilter = "Semua";
let searchQuery   = "";

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

  const filtered = menuData.filter(item => {
    const cocokKategori = currentFilter === "Semua" || item.category === currentFilter;
    const cocokSearch   = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return cocokKategori && cocokSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align:center; color: var(--text-muted); padding: 40px 0;">
        <i class="fas fa-search" style="font-size:28px; margin-bottom:10px; display:block;"></i>
        Menu tidak ditemukan
      </div>`;
    return;
  }

  grid.innerHTML = filtered.map(item => {
    const cartItem = cart.find(c => c.id === item.id);
    const qty      = cartItem ? cartItem.qty : 0;

    const bottomControl = qty > 0
      ? `<div class="menu-card-qty-badge">${qty}</div>`
      : `<button class="menu-card-add-btn" onclick="event.stopPropagation(); addToCart(${item.id})">
           <i class="fas fa-plus"></i>
         </button>`;

    return `
      <div class="menu-card ${qty > 0 ? 'in-cart' : ''}" onclick="addToCart(${item.id})">

        <!-- Foto makanan -->
        <div class="menu-card-img-wrap">
          <img
            src="${item.image}"
            alt="${item.name}"
            class="menu-card-img"
            onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
          />
          <div class="menu-card-img-fallback" style="display:none;">${item.emoji}</div>
        </div>

        <!-- Info nama & harga -->
        <div class="menu-card-info">
          <div class="name">${item.name}</div>
          <div class="price">${formatRupiah(item.price)}</div>
        </div>

        <!-- Kontrol bawah -->
        ${bottomControl}

      </div>
    `;
  }).join('');
}

/* ─────────────────────────────
   6. FILTER & SEARCH
───────────────────────────── */
function setFilter(kategori, elButton) {
  currentFilter = kategori;
  document.querySelectorAll('.filter-tab').forEach(tab => tab.classList.remove('active'));
  elButton.classList.add('active');
  renderMenu();
}

function filterMenu() {
  searchQuery = document.getElementById('searchInput').value;
  renderMenu();
}

/* ─────────────────────────────
   7. KERANJANG (CART)
───────────────────────────── */
function addToCart(id) {
  const menu     = menuData.find(item => item.id === id);
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...menu, qty: 1 });
  }

  renderMenu();   // re-render supaya badge qty terupdate
  renderCart();
  showToast(`${menu.emoji} ${menu.name} ditambahkan`);
}

function changeQty(id, delta) {
  const index = cart.findIndex(item => item.id === id);
  if (index === -1) return;

  cart[index].qty += delta;

  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }

  renderMenu();   // update badge di grid
  renderCart();
}

function clearCart() {
  if (cart.length === 0) return;
  cart = [];
  renderMenu();
  renderCart();
  showToast("Keranjang dikosongkan");
}

function renderCart() {
  const container = document.getElementById('cartItems');
  const btnBayar  = document.getElementById('btnBayar');

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <div class="bag-icon"><i class="fas fa-shopping-bag"></i></div>
        <p>Pilih menu untuk<br>mulai transaksi</p>
      </div>`;
    btnBayar.disabled = true;
  } else {
    container.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="item-img-wrap">
          <img
            src="${item.image}"
            alt="${item.name}"
            class="item-img"
            onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
          />
          <div class="item-img-fallback" style="display:none;">${item.emoji}</div>
        </div>
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

  updateCartSummary();
}

function updateCartSummary() {
  const subtotal = cart.reduce((total, item) => total + item.price * item.qty, 0);
  const diskon   = 0;
  const total    = subtotal - diskon;

  document.getElementById('subtotalVal').textContent   = formatRupiah(subtotal);
  document.getElementById('diskonVal').textContent     = `-${formatRupiah(diskon)}`;
  document.getElementById('totalVal').textContent      = formatRupiah(total);
  document.getElementById('modalAmount').textContent   = formatRupiah(total);
  document.getElementById('successAmount').textContent = formatRupiah(total);
}

/* ─────────────────────────────
   8. MODAL
───────────────────────────── */
function openConfirmModal() {
  document.getElementById('uangBayarInput').value = '';
  document.getElementById('kembalianVal').textContent = 'Rp 0';
  document.getElementById('kembalianVal').classList.remove('kurang');
  document.getElementById('btnProses').disabled = true;

  const total = cart.reduce((s, item) => s + item.price * item.qty, 0);
  document.getElementById('modalAmount').textContent = formatRupiah(total);

  document.getElementById('confirmModal').classList.add('active');
  setTimeout(() => document.getElementById('uangBayarInput').focus(), 200);
}

function hitungKembalian() {
  const total     = cart.reduce((s, item) => s + item.price * item.qty, 0);
  const uangBayar = parseInt(document.getElementById('uangBayarInput').value) || 0;
  const kembalian = uangBayar - total;

  const elKembalian = document.getElementById('kembalianVal');
  const btnProses   = document.getElementById('btnProses');

  if (uangBayar === 0) {
    elKembalian.textContent = 'Rp 0';
    elKembalian.classList.remove('kurang');
    btnProses.disabled = true;
  } else if (kembalian < 0) {
    elKembalian.textContent = `Kurang ${formatRupiah(Math.abs(kembalian))}`;
    elKembalian.classList.add('kurang');
    btnProses.disabled = true;
  } else {
    elKembalian.textContent = formatRupiah(kembalian);
    elKembalian.classList.remove('kurang');
    btnProses.disabled = false;
  }
}

function closeConfirmModal() {
  document.getElementById('confirmModal').classList.remove('active');
}

function confirmPayment() {
  const total     = cart.reduce((s, item) => s + item.price * item.qty, 0);
  const uangBayar = parseInt(document.getElementById('uangBayarInput').value) || 0;
  const kembalian = uangBayar - total;
  const trxId     = document.getElementById('trxId').textContent;

  document.getElementById('successAmount').textContent    = formatRupiah(total);
  document.getElementById('successKembalian').textContent = formatRupiah(kembalian);
  document.getElementById('successTrxId').textContent     = trxId;

  closeConfirmModal();
  setTimeout(() => {
    document.getElementById('successModal').classList.add('active');
  }, 200);
}

function newTransaction() {
  document.getElementById('successModal').classList.remove('active');
  cart = [];
  renderMenu();
  renderCart();
  const newId = genTrxId();
  document.getElementById('trxId').textContent = newId;
  showToast("Siap transaksi baru! 🎉");
}

/* ─────────────────────────────
   9. NAVIGASI SIDEBAR
───────────────────────────── */
function showPage(page, elLink) {
  document.querySelectorAll('.sidebar-nav a').forEach(a => a.classList.remove('active'));
  elLink.classList.add('active');

  if (page !== 'kasir') {
    showToast(`Halaman "${page}" belum tersedia di demo ini`);
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
  updateClock();
  setInterval(updateClock, 1000);
  document.getElementById('trxId').textContent = genTrxId();
  renderMenu();
  renderCart();
}

document.addEventListener('DOMContentLoaded', init);