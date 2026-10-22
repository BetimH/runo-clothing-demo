/*
  RUNO Clothing demo
  Before presenting to the seller:
  1. Replace placeholder products and images with approved, real product details.
  2. Set WHATSAPP_NUMBER to the seller's WhatsApp number in international format,
     digits only (e.g. Kosovo: 3834XXXXXXXX; do not include + or spaces).
  3. Confirm prices, sizes, delivery and return policy with the seller.
*/
const WHATSAPP_NUMBER = "3834XXXXXXXX"; // TODO: replace with the seller's real WhatsApp number

const products = [
  { id: 1, name: "Essential Oversized Tee", category: "tops", categoryLabel: "Bluza", price: 18, tag: "Bestseller", sizes: ["S", "M", "L", "XL"], color: "E zezë", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80", description: "Bluze minimaliste për kombinime të përditshme. Përshkrim demonstrativ — konfirmo materialin dhe prerjen." },
  { id: 2, name: "Everyday Zip Hoodie", category: "tops", categoryLabel: "Bluza", price: 32, tag: "New", sizes: ["S", "M", "L", "XL"], color: "Gri", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80", description: "Hoodie me zinxhir dhe pamje të pastër. Produkt demonstrativ." },
  { id: 3, name: "Utility Street Jacket", category: "outerwear", categoryLabel: "Xhaketa", price: 49, tag: "Limited", sizes: ["S", "M", "L", "XL"], color: "Ulliri", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80", description: "Xhaketë me stil urban për ditët më të freskëta. Produkt demonstrativ." },
  { id: 4, name: "Relaxed Fit Trousers", category: "bottoms", categoryLabel: "Pantallona", price: 35, tag: "", sizes: ["S", "M", "L", "XL"], color: "Bezhë", image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=80", description: "Pantallona me prerje të lirshme. Produkt demonstrativ." },
  { id: 5, name: "Daily Crew Sweatshirt", category: "tops", categoryLabel: "Bluza", price: 28, tag: "", sizes: ["S", "M", "L", "XL"], color: "Krem", image: "https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=900&q=80", description: "Sweatshirt i thjeshtë për përdorim të përditshëm. Produkt demonstrativ." },
  { id: 6, name: "Weekend Matching Set", category: "sets", categoryLabel: "Komplete", price: 55, tag: "Set", sizes: ["S", "M", "L", "XL"], color: "Gri e errët", image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=80", description: "Komplet demonstrativ me stil të koordinuar. Konfirmo përmbajtjen e kompletit." }
];

const cart = [];
const productGrid = document.getElementById("productGrid");
const productModal = new bootstrap.Modal(document.getElementById("productModal"));
const cartModal = new bootstrap.Modal(document.getElementById("cartModal"));
const toast = new bootstrap.Toast(document.getElementById("noticeToast"), { delay: 2300 });

function money(value) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(value);
}
function notify(message) {
  document.getElementById("noticeText").textContent = message;
  toast.show();
}
function renderProducts(category = "all") {
  const visible = products.filter(p => category === "all" || p.category === category);
  productGrid.innerHTML = visible.map(p => `
    <div class="col-6 col-lg-4">
      <article class="product-card">
        <div class="product-visual" data-view="${p.id}" role="button" tabindex="0" aria-label="Shiko ${p.name}">
          <img src="${p.image}" alt="${p.name}" loading="lazy">
          ${p.tag ? `<span class="product-tag">${p.tag}</span>` : ""}
          <button class="quick-add" data-add="${p.id}" aria-label="Shto ${p.name} në shportë"><i class="bi bi-plus-lg"></i></button>
        </div>
        <div class="product-meta">
          <p class="product-category">${p.categoryLabel}</p>
          <h3 class="product-name">${p.name}</h3>
          <span class="product-price">${money(p.price)}</span>
        </div>
      </article>
    </div>`).join("");
}
function openProduct(id) {
  const p = products.find(item => item.id === Number(id));
  if (!p) return;
  document.getElementById("productModalBody").innerHTML = `
    <img class="modal-product-image" src="${p.image}" alt="${p.name}">
    <div class="modal-product-copy">
      <p class="product-category">${p.categoryLabel} · DEMO</p>
      <h2 id="productModalTitle">${p.name}</h2>
      <div class="product-price mb-3">${money(p.price)}</div>
      <p>${p.description}</p>
      <label class="size-label d-block mb-2" for="selectedSize">Zgjidh madhësinë</label>
      <select class="form-select size-select mb-3" id="selectedSize">${p.sizes.map(s => `<option value="${s}">${s}</option>`).join("")}</select>
      <button class="btn btn-dark rounded-pill w-100" id="addSelected" data-id="${p.id}">Shto në shportë <i class="bi bi-plus-lg ms-2"></i></button>
    </div>`;
  productModal.show();
}
function addToCart(id, size = "M") {
  const p = products.find(item => item.id === Number(id));
  if (!p) return;
  const existing = cart.find(item => item.id === p.id && item.size === size);
  if (existing) existing.quantity += 1;
  else cart.push({ id: p.id, size, quantity: 1 });
  updateCart();
  notify(`${p.name} (${size}) u shtua në shportë.`);
}
function updateCart() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("cartCount").textContent = count;
  const cartItems = document.getElementById("cartItems");
  if (!cart.length) {
    cartItems.innerHTML = `<div class="empty-cart"><i class="bi bi-bag me-2"></i>Shporta është bosh. Zgjidh një produkt nga koleksioni.</div>`;
  } else {
    cartItems.innerHTML = cart.map((item, index) => {
      const p = products.find(product => product.id === item.id);
      return `<div class="cart-line">
        <img src="${p.image}" alt="">
        <div><h4>${p.name}</h4><p>Madhësia: ${item.size} · Sasia: ${item.quantity}</p><p><strong>${money(p.price * item.quantity)}</strong></p></div>
        <button class="remove-line" data-remove="${index}" type="button">Hiq</button>
      </div>`;
    }).join("");
  }
  const total = cart.reduce((sum, item) => sum + products.find(p => p.id === item.id).price * item.quantity, 0);
  document.getElementById("cartTotal").textContent = money(total);
}
productGrid.addEventListener("click", event => {
  const add = event.target.closest("[data-add]");
  if (add) { event.stopPropagation(); openProduct(add.dataset.add); return; }
  const view = event.target.closest("[data-view]");
  if (view) openProduct(view.dataset.view);
});
productGrid.addEventListener("keydown", event => {
  const view = event.target.closest("[data-view]");
  if (view && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); openProduct(view.dataset.view); }
});
document.getElementById("productModalBody").addEventListener("click", event => {
  const button = event.target.closest("#addSelected");
  if (!button) return;
  const size = document.getElementById("selectedSize").value;
  addToCart(button.dataset.id, size);
  productModal.hide();
});
document.getElementById("categoryFilter").addEventListener("change", event => renderProducts(event.target.value));
document.getElementById("openCart").addEventListener("click", () => { updateCart(); cartModal.show(); });
document.getElementById("cartItems").addEventListener("click", event => {
  const remove = event.target.closest("[data-remove]");
  if (!remove) return;
  cart.splice(Number(remove.dataset.remove), 1);
  updateCart();
});
document.getElementById("orderForm").addEventListener("submit", event => {
  event.preventDefault();
  if (!cart.length) { notify("Shto së paku një produkt para se të dërgosh porosinë."); return; }
  if (WHATSAPP_NUMBER.includes("X")) {
    notify("Demo: vendos numrin real të WhatsApp-it te script.js para porosive.");
    return;
  }
  const form = new FormData(event.currentTarget);
  const lines = cart.map(item => {
    const p = products.find(product => product.id === item.id);
    return `• ${p.name} | Madhësia: ${item.size} | Sasia: ${item.quantity} | ${money(p.price * item.quantity)}`;
  });
  const total = cart.reduce((sum, item) => sum + products.find(p => p.id === item.id).price * item.quantity, 0);
  const message = [
    "Përshëndetje RUNO Clothing! Dua të bëj këtë porosi:",
    "",
    ...lines,
    "",
    `Totali i përafërt: ${money(total)}`,
    "",
    `Emri: ${form.get("customerName")}`,
    `Telefoni: ${form.get("customerPhone")}`,
    `Qyteti: ${form.get("customerCity")}`,
    `Adresa: ${form.get("customerAddress")}`,
    `Shënime: ${form.get("orderNotes") || "Asnjë"}`,
    "",
    "Ju lutem konfirmoni disponueshmërinë, dërgesën dhe totalin final."
  ].join("\n");
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
});
document.getElementById("year").textContent = new Date().getFullYear();
renderProducts();
updateCart();
