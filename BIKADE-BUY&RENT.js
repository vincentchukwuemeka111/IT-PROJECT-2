// 1️⃣ Load cart from localStorage or initialize
let cart = JSON.parse(localStorage.getItem("bikes")) || [] ;
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



// 2️⃣Update cart display
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
  localStorage.setItem("bikes", JSON.stringify(cart));
}

// Render initial cart
// updateCart();

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



// 3️⃣ Grab the grid & template elements
const productGrid = document.getElementById("product-grid");
const productTemplate = document.getElementById("product-template").content;

// 4️⃣ Render products
function renderProducts(products) {
  productGrid.innerHTML = "";
  products.forEach(product => {
    const clone = productTemplate.cloneNode(true);
    clone.querySelector(".product-img").src = product.image || "./images/BIKADE home icon.png";
    clone.querySelector(".product-img").alt = product.name;
    clone.querySelector(".product-name").innerText = product.name;
    clone.querySelector(".product-price").innerText = `₦${product.price.toLocaleString()}`;
    clone.querySelector(".product-stock").innerText =
      product.stock > 0 ? `In stock: ${product.stock}` : "Out of stock";

    const btn = clone.querySelector(".center-button");
    if (product.stock <= 0) {
      btn.disabled = true;
      btn.textContent = "Unavailable";
    }

    btn.onclick = () => {
      const item = cart.find(i => i.id === product._id);
      if (item) item.qty++;
      else cart.push({ id: product._id, name: product.name, price: product.price, qty: 1 });
      updateCart();
      console.log(`${product.name} added to cart`);
    };

    productGrid.appendChild(clone);
  });
}

// 5️⃣ Fetch products
async function fetchProducts() {
  try {
    const response = await fetch("http://localhost:5000/bikes/getallbikes");
    if (!response.ok) throw new Error("Failed to fetch products");
    const data = await response.json();

    // If your backend returns { bikes: [...] }
    const products = data.bikes || data;
    renderProducts(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    productGrid.innerHTML = "<p>Failed to load products. Try again later.</p>";
  }
}

// 6️⃣ Call fetchProducts when page loads
fetchProducts();




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




// Elements
const allPurchasesSidebar = document.getElementById("all-purchases-sidebar");
const bigCartModal = document.getElementById("big-cart-modal");
const closeBigCartBtn = document.getElementById("close-big-cart");
const bigCartItems = document.getElementById("big-cart-items");
const bigCartTotal = document.getElementById("big-cart-total");
const bigCartClearBtn = document.getElementById("big-cart-clear");

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
  if(confirm("hello?")){
    try {
      await fetch("/api/purchases/clear", { method: "POST" }); // backend endpoint to clear
      fetchPurchases(); // re-render empty modal
    } catch(err) {
      alert("pay attention to the reminder");
    }
  }
});







//for user login and storing data in local storage 
document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    window.location.href = "/forms/sign-in.html";
    return;
  }

  document.getElementById("user-name").textContent =
    `Welcome ${user.name}`;
});


updateCart();





//log out
const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", (e) => {
  e.preventDefault(); // stop page reload

  // clear EVERYTHING from localStorage
  localStorage.clear();

  alert("You have been logged out.");

  // redirect user
  window.location.href = "/forms/sign-in.html"; 
});








// for payment of items 
payBtn.addEventListener("click", async () => {
  const accNumber = document.getElementById("account-number").value;
  const password = document.getElementById("account-password").value;

  // 1️⃣ Validate inputs
  if (!accNumber || !password) {
    alert("Please fill all payment fields!");
    return;
  }

  if (cart.length === 0) {
    alert("Cart is empty");
    return;
  }

  // 2️⃣ Show basic payment info (like your first snippet)
  alert(`Payment info submitted:\nAccount: ${accNumber}\nTotal: ₦${total.toLocaleString()}`);

  // 3️⃣ Get logged-in user
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    alert("You must be logged in");
    return;
  }

  try {
    // 4️⃣ Pay for each item in cart
    for (const item of cart) {
      // Send **one request per cart item** with quantity handled
      const response = await fetch("http://localhost:5000/payment/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          bikeId: item.id,
          accountNumber: accNumber,
          accountPassword: password,
          quantity: item.qty // pass the quantity to backend
        })
      });

      let data;
      try {
        data = await response.json();
      } catch {
        alert("Server returned  ");
        return;
      }

      if (!response.ok) {
        alert(data.message || "Payment failed");
        return; // stop on first failed item
      }
    }

    // 5️⃣ Clear cart & update UI (from your first snippet)
    cart = [];
    updateCart();
    cartDropdown.classList.remove("active");

    document.getElementById("account-number").value = "";
    document.getElementById("account-password").value = "";

    alert("Payment successful!"); // final success message

  } catch (err) {
    console.error(err);
    alert("Payment succesful."); // fallback
  }
});



//to display bal
async function loadBalance() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return;

  try {
    const res = await fetch(`http://localhost:5000/admin/${user._id}`);
    const data = await res.json();

    if (!res.ok) {
      console.error(data.message);
      return;
    }

    document.getElementById("balance").textContent =
      `bal: ₦${data.account.balance.toLocaleString()}`;

  } catch (err) {
    console.error("Failed to load balance", err);
  }
}

window.addEventListener("DOMContentLoaded", loadBalance);

