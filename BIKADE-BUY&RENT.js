let cart = JSON.parse(localStorage.getItem("bikadeCart")) || [];
let total = 0;

// Make sure your cart icon exists in HTML with id="cart-icon"
const cartIcon = document.getElementById("cart-icon");
const cartDropdown = document.getElementById("cart-dropdown");
const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const closeCartBtn = document.getElementById("close-cart");
const payBtn = document.getElementById("pay-btn");

// Toggle cart dropdown on icon click
cartIcon.onclick = (e) => {
  cartDropdown.classList.toggle("active");
  e.stopPropagation(); // prevent window click from immediately closing it
};

// Close when clicking the X button
closeCartBtn.onclick = () => cartDropdown.classList.remove("active");

// Close when clicking outside the cart
window.addEventListener("click", function(e) {
  if (!cartDropdown.contains(e.target) && !cartIcon.contains(e.target)) {
    cartDropdown.classList.remove("active");
  }
});

// Add items to cart
document.querySelectorAll(".center-button").forEach(btn => {
  btn.onclick = function () {
    const text = this.previousElementSibling.innerText;
    const price = parseInt(text.replace(/[^\d]/g, ""));
    const name = this.parentElement.children[0].innerText;

    const item = cart.find(i => i.name === name);
    if (item) item.qty++;
    else cart.push({ name, price, qty: 1 });

    updateCart();
  };
});

// Update cart display
function updateCart() {
  cartItems.innerHTML = "";
  total = 0;
  let count = 0;

  cart.forEach(item => {
    total += item.price * item.qty;
    count += item.qty;
    cartItems.innerHTML += `<p>${item.name} x${item.qty} — ₦${item.price * item.qty}</p>`;
  });

  cartCount.innerText = count;
  cartTotal.innerText = "Total: ₦" + total.toLocaleString();
  localStorage.setItem("bikadeCart", JSON.stringify(cart));
}

// Payment button
payBtn.addEventListener("click", () => {
  const name = document.getElementById("account-name").value;
  const accNumber = document.getElementById("account-number").value;
  const password = document.getElementById("account-password").value;

  if (!name || !accNumber || !password) {
    alert("Please fill all payment fields!");
    return;
  }

  alert(`Payment info submitted:\nName: ${name}\nAccount: ${accNumber}\nTotal: ₦${total.toLocaleString()}`);

  cart = [];
  updateCart();
  cartDropdown.classList.remove("active");

  document.getElementById("account-name").value = "";
  document.getElementById("account-number").value = "";
  document.getElementById("account-password").value = "";
});

// Render initial cart
updateCart();

const clearCartBtn = document.getElementById("clear-cart");

clearCartBtn.addEventListener("click", () => {
  if(cart.length === 0) {
    alert("Cart is already empty!");
    return;
  }

  if(confirm("Are you sure you want to clear the cart?")) {
    cart = [];
    updateCart();
    alert("Cart cleared!");
  }
});



const products = [
  { name: "Bike 1", age: "Age 4-6", price: 30000, image: "./images/BIKADE home icon.png" },
  { name: "Bike 2", age: "Age 6-8", price: 40000, image: "./images/BIKADE home icon.png" },
  // Add more products dynamically from backend
];

const productGrid = document.getElementById("product-grid");
const productTemplate = document.getElementById("product-template").content;

products.forEach(product => {
  const clone = productTemplate.cloneNode(true);
  clone.querySelector(".product-img").src = product.image;
  clone.querySelector(".product-img").alt = product.name;
  clone.querySelector(".product-age").innerText = product.age;
  clone.querySelector(".product-price").innerText = `#${product.price.toLocaleString()}`;

  // Handle Add to Cart button
  clone.querySelector(".center-button").onclick = function () {
    const item = cart.find(i => i.name === product.name);
    if (item) item.qty++;
    else cart.push({ name: product.name, price: product.price, qty: 1 });
    updateCart();
  };

  productGrid.appendChild(clone);
});

//modal for info
const infoBtn = document.getElementById("info-btn");
const infoModal = document.getElementById("info-modal");
const closeInfoBtn = document.getElementById("close-info");

// Open modal
infoBtn.onclick = (e) => {
  infoModal.classList.add("active");
  e.stopPropagation(); // prevent window click from closing
};

// Close modal
closeInfoBtn.onclick = () => infoModal.classList.remove("active");

// Close when clicking outside modal
window.addEventListener("click", (e) => {
  if (infoModal.classList.contains("active") && !infoModal.querySelector(".info-content").contains(e.target) && e.target !== infoBtn) {
    infoModal.classList.remove("active");
  }
});



//for displaying all bought items 
// Elements
const allPurchasesSidebar = document.getElementById("all-purchases-sidebar");
const bigCartModal = document.getElementById("big-cart-modal");
const closeBigCartBtn = document.getElementById("close-big-cart");
const bigCartItems = document.getElementById("big-cart-items");
const bigCartTotal = document.getElementById("big-cart-total");
const bigCartClearBtn = document.getElementById("big-cart-clear");

// Example fetch function (replace URL with your backend endpoint)
async function fetchPurchases() {
  try {
    const response = await fetch("/api/purchases"); // your backend API endpoint
    if (!response.ok) throw new Error("Failed to fetch purchases");

    const purchases = await response.json(); // assume array of {name, price, qty}
    renderBigCart(purchases);
  } catch (err) {
    bigCartItems.innerHTML = `<p style="color:red;">${err.message}</p>`;
    bigCartTotal.innerText = "Total: ₦0";
  }
}

// Render purchases in the modal
function renderBigCart(purchases) {
  bigCartItems.innerHTML = "";
  let totalAmount = 0;

  if (!purchases.length) {
    bigCartItems.innerHTML = "<p>No purchases found.</p>";
    bigCartTotal.innerText = "Total: ₦0";
    return;
  }

  purchases.forEach(item => {
    totalAmount += item.price * item.qty;
    bigCartItems.innerHTML += `<p>${item.name} x${item.qty} — ₦${item.price * item.qty}</p>`;
  });

  bigCartTotal.innerText = "Total: ₦" + totalAmount.toLocaleString();
}

// Open modal from sidebar
allPurchasesSidebar.addEventListener("click", () => {
  bigCartModal.classList.add("active");
  fetchPurchases(); // fetch from backend each time
});

// Close modal
closeBigCartBtn.addEventListener("click", () => {
  bigCartModal.classList.remove("active");
});

// Optional: click outside modal to close
window.addEventListener("click", (e) => {
  if(bigCartModal.classList.contains("active") && !bigCartModal.contains(e.target) && e.target !== allPurchasesSidebar){
    bigCartModal.classList.remove("active");
  }
});

// Optional: clear purchases (can call backend API to delete)
bigCartClearBtn.addEventListener("click", async () => {
  if(confirm("Are you sure you want to clear all purchases?")){
    try {
      await fetch("/api/purchases/clear", { method: "POST" }); // backend endpoint to clear
      fetchPurchases(); // re-render empty modal
    } catch(err) {
      alert("Failed to clear purchases");
    }
  }
});



