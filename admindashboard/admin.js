// ELEMENTS
const sidebarLinks = document.querySelectorAll(".admin-link");
const sections = document.querySelectorAll(".admin-section");
const mainTitle = document.getElementById("main-title");

const productGrid = document.getElementById("admin-product-grid");
const postForm = document.getElementById("post-product-form");
const resultDiv = document.getElementById("post-result");
const statProducts = document.getElementById("stat-products");



//post item or bike 
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("post-product-form");
  const resultEl = document.getElementById("post-result");

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // prevent page reload
     //post product section 
    // Get values from form
    const name = document.getElementById("product-name").value;
    const price = parseFloat(document.getElementById("product-price").value);
    const stock = parseInt(document.getElementById("product-age").value);
    const image = document.getElementById("product-image").value;

    // Get admin token from localStorage if your API requires authentication
    const admin = JSON.parse(localStorage.getItem("admin"));
    // const token = admin?.token;

    try {
      const response = await fetch("http://localhost:5000/bikes/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ name, price, stock, image })
      });

      const data = await response.json();

      if (!response.ok) {
        resultEl.textContent = data.message || "Failed to post product";
        resultEl.style.color = "red";
        return;
      }

      // Success
      resultEl.textContent = `Product "${data.name}" posted successfully!`;
      resultEl.style.color = "green";

      // Reset form
      form.reset();

    } catch (err) {
      console.error(err);
      resultEl.textContent = "Server error. Try again later.";
      resultEl.style.color = "red";
    }
  });
});



// DATA (TEMP)
let products = [];

// HIDE ALL SECTIONS
function hideAll() {
  sections.forEach(section => section.classList.add("hidden"));
}

// SIDEBAR NAV
sidebarLinks.forEach(link => {
  link.addEventListener("click", () => {
    const sectionId = link.dataset.section;
    if (!sectionId) return;

    hideAll();
    document.getElementById(sectionId).classList.remove("hidden");
    mainTitle.innerText = link.innerText;
  });
});

// RENDER PRODUCT
function renderProduct(product) {
  const div = document.createElement("div");
  div.innerHTML = `
    <img src="${product.image}" style="width:100%;height:150px;object-fit:cover;border-radius:8px">
    <h4 style="color:orange">${product.name}</h4>
    <p>₦${product.price.toLocaleString()}</p>
    <p>Age: ${product.age}</p>
  `;
  productGrid.appendChild(div);
}


//logoout function 
const logoutBtn = document.querySelector(".admin-link-logout");

logoutBtn.addEventListener("click", () => {

  alert("logged out successfully")
  // remove admin login info
  localStorage.removeItem("admin");

  // optional: clear everything
  localStorage.clear();

  // redirect to login page
  window.location.href = "/forms/sign-in.html";
});


//display name 
document.addEventListener("DOMContentLoaded", () => {
  const admin = JSON.parse(localStorage.getItem("admin"));

  if (!admin) {
    console.log("No admin found in storage");
    return;
  }

  document.getElementById("admin-name").textContent =
    `${admin.name}` ;

  document.getElementById("admin-role").textContent = 
  `${admin.role}` ;

});



//display bikes 
const adminProductGrid = document.getElementById("admin-product-grid");


//fetch from api
async function fetchAllProducts() {
  try {
    const response = await fetch("http://localhost:5000/bikes/getallbikes");
    if (!response.ok) throw new Error("Failed to fetch products");

    const data = await response.json();
    const products = data.bikes; // 👈 important

    renderAdminProducts(products);
  } catch (err) {
    console.error(err);
    adminProductGrid.innerHTML = "<p>Failed to load products</p>";
  }
}

//dispalay bikes
function renderAdminProducts(products) {
  adminProductGrid.innerHTML = "";

  if (!products || products.length === 0) {
    adminProductGrid.innerHTML = "<p>No products found</p>";
    return;
  }

  products.forEach(product => {
    const div = document.createElement("div");
    div.className = "admin-product-card";

    div.innerHTML = `
      <img src="${product.image}" alt="${product.name}" width="120" />
      <h4>${product.name}</h4>
      <p>₦${product.price.toLocaleString()}</p>
      <p>Stock: ${product.stock}</p>
    `;

    adminProductGrid.appendChild(div);
  });
}
//      <button data-id="${product._id}" class="delete-btn">Delete</button> up for delete


//calling the function 
document.addEventListener("DOMContentLoaded", () => {
  fetchAllProducts();
});



//to display all users 
const usersTable = document.getElementById("admin-users-table");

// Fetch users from backend
async function fetchUsers() {
  try {
    const response = await fetch("http://localhost:5000/users/getallusers");

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    const data = await response.json();
    const users = data.users || data;

    renderUsers(users);
  } catch (error) {
    console.error(error);
    usersTable.innerHTML += `<p style="color:red;">Failed to load users</p>`;
  }
}

// Render users to DOM
function renderUsers(users) {
  // Remove old rows (keep header)
  usersTable.querySelectorAll(".user-row").forEach(row => row.remove());

  users.forEach(user => {
    const row = document.createElement("div");
    row.classList.add("user-row");

    row.innerHTML = `
      <span>${user.name}</span>
      <span>${user.email}</span>
      <span class="user-role ${user.role === "admin" ? "role-admin" : "role-user"}">
        ${user.role}
      </span>
      <div class="user-actions">
      </div>
    `;
     //   <button class="delete-btn" data-id="${user._id}">Delete</button>

    usersTable.appendChild(row);
  });
}

// Call when admin page loads
fetchUsers();
