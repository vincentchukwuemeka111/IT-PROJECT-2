// ELEMENTS
const sidebarLinks = document.querySelectorAll(".admin-link");
const sections = document.querySelectorAll(".admin-section");
const mainTitle = document.getElementById("main-title");

const productGrid = document.getElementById("admin-product-grid");
const postForm = document.getElementById("post-product-form");
const resultDiv = document.getElementById("post-result");
const statProducts = document.getElementById("stat-products");

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

// POST PRODUCT
postForm.addEventListener("submit", e => {
  e.preventDefault();

  const product = {
    name: product-name.value,
    price: Number(product-price.value),
    age: product-age.value,
    image: product-image.value
  };

  products.push(product);
  renderProduct(product);
  statProducts.innerText = products.length;

  resultDiv.innerText = "Product posted successfully ✅";
  postForm.reset();
});
