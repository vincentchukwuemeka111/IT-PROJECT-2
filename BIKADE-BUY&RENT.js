  const sidebarLinks = document.querySelectorAll(".sidebar-link");
  const childrenSection = document.querySelector(".cont-3");
  const teensSection = document.querySelector(".cont-4");
  const adultSection = document.querySelector(".cont-5");
  const ebikeSection = document.querySelector(".cont-6");

  // Children
  sidebarLinks[1].addEventListener("click", function (e) {
    childrenSection.scrollIntoView({ behavior: "smooth" });
  });

  // Teens
  sidebarLinks[2].addEventListener("click", function (e) {
    teensSection.scrollIntoView({ behavior: "smooth" });
  });

  // Adult
  sidebarLinks[3].addEventListener("click", function (e) {
    adultSection.scrollIntoView({ behavior: "smooth" });
  });

  // E-Bicycle
  sidebarLinks[4].addEventListener("click", function (e) {
    ebikeSection.scrollIntoView({ behavior: "smooth" });
  });


  let cart = [];
let total = 0;

const cartIcon = document.getElementById("cart-icon");
const cartDropdown = document.getElementById("cart-dropdown");
const cartCount = document.getElementById("cart-count");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const payBtn = document.getElementById("pay-btn");
const confirmPaymentBtn = document.getElementById("confirm-payment");

// Toggle cart
cartIcon.addEventListener("click", () => {
  cartDropdown.classList.toggle("active");
});

// Add to cart
document.querySelectorAll(".center-button").forEach(button => {
  button.addEventListener("click", function () {
    const parent = this.closest(".text-sec");
    const details = parent.querySelectorAll("p");

    const type = details[0].innerText;
    const priceText = details[details.length - 1].innerText;
    const price = parseInt(priceText.replace(/[^\d]/g, ""));

    const existingItem = cart.find(item => item.type === type && item.price === price);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({ type, price, quantity: 1 });
    }

    updateCart();
  });
});

function updateCart() {
  cartItemsContainer.innerHTML = "";
  total = 0;
  let count = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    count += item.quantity;

    cartItemsContainer.innerHTML += `
      <div>
        <p>${item.type}</p>
        <p>Qty: ${item.quantity}</p>
        <p>₦${itemTotal.toLocaleString()}</p>
        <hr>
      </div>
    `;
  });

  cartCount.innerText = count;
  cartTotal.innerText = "Total: ₦" + total.toLocaleString();
}

// Open Opay
payBtn.addEventListener("click", () => {
  navigator.clipboard.writeText("8111822874");
  alert("Account number copied. Complete payment in your Opay app.");
  window.open("https://opayweb.com/", "_blank");
});

// EmailJS integration
confirmPaymentBtn.addEventListener("click", () => {

  let orderDetails = cart.map(item =>
    `${item.type} - Qty: ${item.quantity} - ₦${item.price * item.quantity}`
  ).join("\n");

  emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
    message: orderDetails,
    total: total
  }).then(() => {
    alert("Order details sent successfully!");
  }).catch(err => {
    alert("Error sending email.");
  });

});

