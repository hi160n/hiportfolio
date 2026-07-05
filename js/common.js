// ===== テキスト正規化（ひらがな→カタカナ・全角→半角） =====
function normalizeText(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .replace(/[ぁ-ん]/g, s => String.fromCharCode(s.charCodeAt(0) + 0x60)) // ひら→カタカナ
    .normalize("NFKC");
}

// ===== カートバッジ更新 =====
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.length;
  const badge = document.getElementById("cart-count");
  if (!badge) return;
  badge.textContent = count;
  badge.style.display = count > 0 ? "block" : "none";
}

// ===== 商品カード生成（検索用） =====
function renderProducts(keyword = "") {
  const list = document.getElementById("product-list");
  if (!list) return; // このページに存在しない場合はスキップ

  const normalizedKeyword = normalizeText(keyword);
  const isSearch = normalizedKeyword.length > 0;

  const html = products
    .filter(p => {
      if (!isSearch) return true;
      return normalizeText(p.name + " " + p.description).includes(normalizedKeyword);
    })
    .map(p => {
      const stockHTML = p.stock > 0
        ? `<div class="stock-label in-stock">在庫あり</div>`
        : `<div class="stock-label sold-out">売り切れ</div>`;

      return `
        <a href="detail.html?id=${p.id}"
           class="product-card ${isSearch ? "search-result" : ""} ${p.stock === 0 ? "soldout" : ""}">
          <img src="${p.images[0]}" alt="${p.name}">
          <div class="product-name">${p.name}</div>
          <div class="price">¥${p.price.toLocaleString()}</div>
          ${stockHTML}
        </a>`;
    })
    .join("");

  list.innerHTML = html;
}

// ===== おすすめ商品生成（除外IDを指定可能） =====
function renderRecommend(excludeId = null) {
  const recommendList = document.getElementById("recommend-list");
  if (!recommendList) return;

  const html = products
    .filter(p => excludeId === null || p.id !== excludeId) // 現在の商品を除外
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map(p => `
      <a href="detail.html?id=${p.id}" class="product-card">
        <img src="${p.images[0]}" alt="${p.name}">
        <div class="product-name">${p.name}</div>
        <div class="price">¥${p.price.toLocaleString()}</div>
      </a>`)
    .join("");

  recommendList.innerHTML = html;
}

// ===== 検索イベント =====
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();

  const searchInput = document.getElementById("search");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      renderProducts(searchInput.value.trim());
    });
  }
});
