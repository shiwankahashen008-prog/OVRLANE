
// OVRLANE - PRODUCT DETAILS
const products = [
  {
    id: 1,
    name: "Shadow Graphic Tee",
    category: "printed",
    price: 4500,
    tag: "BEST SELLER",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=700"
  },
  {
    id: 2,
    name: "Urban Oversized Tee",
    category: "oversized",
    price: 5200,
    tag: "NEW DROP",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=700"
  },
  {
    id: 3,
    name: "Street Culture Tee",
    category: "printed",
    price: 4800,
    tag: "LIMITED",
    image: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=700"
  },
  {
    id: 4,
    name: "Classic Essential Tee",
    category: "basic",
    price: 3500,
    tag: "ESSENTIAL",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=700"
  },
  {
    id: 5,
    name: "Dark Mode Oversized",
    category: "oversized",
    price: 5500,
    tag: "TRENDING",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=700"
  },
  {
    id: 6,
    name: "Original Print Tee",
    category: "printed",
    price: 4600,
    tag: "NEW",
    image: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=700"
  }
];

let selectedCategory = "all";
let cart = JSON.parse(localStorage.getItem("ovrlane-cart")) || [];

const money = amount => "Rs. " + amount.toLocaleString("en-LK");

// SHOW PRODUCTS
function renderProducts() {
  const search = document.getElementById("search").value.toLowerCase();

  const filtered = products.filter(product => {
    const matchesCategory =
      selectedCategory === "all" ||
      product.category === selectedCategory;

    const matchesSearch = product.name.toLowerCase().includes(search);

    return matchesCategory && matchesSearch;
  });

  const container = document.getElementById("products");

  if (filtered.length === 0) {
    container.innerHTML = '<p class="empty-cart">No products found.</p>';
    return;
  }

  container.innerHTML = filtered.map(product => `
    <article class="product-card">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <span class="product-tag">${product.tag}</span>
        <button class="add-button" onclick="addToCart(${product.id})">
          ADD TO BAG +
        </button>
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${money(product.price)}</p>
        <small>${product.category.toUpperCase()} FIT</small>
        <div style="margin-top:10px">
          <select id="size-${product.id}" aria-label="Select size">
            <option value="S">SIZE: S</option>
            <option value="M" selected>SIZE: M</option>
            <option value="L">SIZE: L</option>
            <option value="XL">SIZE: XL</option>
          </select>
        </div>
      </div>
    </article>
  `).join("");
}

// CATEGORY FILTER
function setCategory(category, button) {
  selectedCategory = category;

  document.querySelectorAll(".filter").forEach(item => {
    item.classList.remove("active");
  });

  button.classList.add("active");
  renderProducts();
}

// ADD PRODUCT TO CART
function addToCart(id) {
  const product = products.find(item => item.id === id);
  const size = document.getElementById(`size-${id}`).value;

  const existing = cart.find(item =>
    item.id === id && item.size === size
  );

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: size,
      quantity: 1
    });
  }

  saveCart();
  showToast(product.name + " added to bag!");
}

// SAVE CART
function saveCart() {
  localStorage.setItem("ovrlane-cart", JSON.stringify(cart));
  updateCart();
}

// UPDATE CART
function updateCart() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) =>
    sum + item.price * item.quantity, 0
  );

  document.getElementById("cart-count").textContent = count;
  document.getElementById("cart-total").textContent = money(total);

  const container = document.getElementById("cart-items");

  if (cart.length === 0) {
    container.innerHTML = '<p class="empty-cart">Your bag is empty.</p>';
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>${money(item.price)} · Size ${item.size}</p>
        <div class="quantity">
          <button onclick="changeQuantity(${item.id}, '${item.size}', -1)">−</button>
          <span>${item.quantity}</span>
          <button onclick="changeQuantity(${item.id}, '${item.size}', 1)">+</button>
        </div>
      </div>
      <button class="remove-item" onclick="removeItem(${item.id}, '${item.size}')">
        REMOVE
      </button>
    </div>
  `).join("");
}

// CHANGE QUANTITY
function changeQuantity(id, size, amount) {
  const item = cart.find(product =>
    product.id === id && product.size === size
  );

  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter(product =>
      !(product.id === id && product.size === size)
    );
  }

  saveCart();
}

// REMOVE ITEM
function removeItem(id, size) {
  cart = cart.filter(item =>
    !(item.id === id && item.size === size)
  );

  saveCart();
  showToast("Product removed.");
}

// OPEN / CLOSE CART
function toggleCart() {
  document.getElementById("cart-panel").classList.toggle("open");
  document.getElementById("cart-overlay").classList.toggle("show");
}

// WHATSAPP CHECKOUT
function checkout() {
  if (cart.length === 0) {
    showToast("Your bag is empty!");
    return;
  }

  // CHANGE THIS TO YOUR WHATSAPP NUMBER
  // Sri Lanka example: 94771234567
  const phone = "94770000000";

  const total = cart.reduce((sum, item) =>
    sum + item.price * item.quantity, 0
  );

  let message = "Hello OVRLANE! I want to place an order:%0A%0A";

  cart.forEach(item => {
    message += `• ${item.name} | Size: ${item.size} | Qty: ${item.quantity} | ${money(item.price * item.quantity)}%0A`;
  });

  message += `%0ATotal: ${money(total)}`;
  message += "%0A%0APlease confirm my order.";

  window.open(
    `https://wa.me/${94788348784}?text=${94788348784}`,
    "_blank"
  );
}

// CONTACT WHATSAPP
function contactWhatsApp() {
  const phone = "94770000000";
  window.open(
    `https://wa.me/${phone}?text=Hello%20OVRLANE!%20I%20need%20more%20information.`,
    "_blank"
  );
}

// TOAST MESSAGE
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

// START WEBSITE
renderProducts();
updateCart();
