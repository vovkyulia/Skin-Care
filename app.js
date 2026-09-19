const productsContainer = document.getElementById("products-grid");
const searchInput = document.querySelector('input[type="search"]');
const searchBtn = document.querySelector('form[role="search"] button');
const cartIcon = document.querySelector(".cart-icon");
const sortFilter = document.getElementById("sortFilter");


const SUPABASE_URL = "https://wqikgflqrybcdhurlzgw.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_BqR-FYHBUnjniMlBh8LVog_UsgLZMl3";

let products = [];
let cart = [];


async function fetchData() {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
        headers: {
            "apikey": SUPABASE_ANON_KEY,
            "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        }
    });
    const data = await response.json();
    console.log(data);
    // renderProducts(data);
    products = data;
    displayProducts(products);
}

function createProductCard(product) {
   return `
   <div class="card" style="width: 18rem;">
  <img src="${product.image }" class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title">${product.title}</h5>
    <p class="card-text">${product.price}</p>
    <button type="button" class="btn btn-warning"">
    <i class="bi bi-cart-plus"></i>
    В кошик</button>
  </div>
</div>
`
}

function displayProducts(products) {
     productsContainer.innerHTML = "";
     products.forEach(product => {
         productsContainer.innerHTML += createProductCard(product);
     });
}

document.addEventListener("DOMContentLoaded", () => {
    fetchData();
});
