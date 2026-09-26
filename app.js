const productsContainer = document.getElementById("products-grid");
const searchInput = document.querySelector('input[type="search"]');
const searchForm = document.querySelector('form[role="search"]');

// Конфігурація Supabase
const SUPABASE_URL = "https://rrwcedsdzskoxibopejs.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_W98julWWq_Bwi7fWc6PDCA_nCEKJ3ht";

// Якщо ваша таблиця в Supabase називається "Skin&Care", замініть 'products' нижче на 'Skin&Care'
const TABLE_NAME = "products"; 

let products = [];
let cart = getJsonCookie("cart") || [];

// Робота з Cookies
function getJsonCookie(cookieName) {
  const allCookies = document.cookie.split('; ');
  const targetCookie = allCookies.find(row => row.startsWith(cookieName + '='));
  if (targetCookie) {
    const encodedData = targetCookie.split('=')[1];
    return JSON.parse(decodeURIComponent(encodedData));
  }
  return null;
}

function saveJsonCookie(cookieName, data, seconds) {
  const jsonString = JSON.stringify(data);
  const safeString = encodeURIComponent(jsonString);
  document.cookie = `${cookieName}=${safeString}; max-age=${seconds}; path=/`;
}

// Завантаження товарів (з можливістю фільтрації за категорією)
async function fetchData(category = null) {
  let url = `${SUPABASE_URL}/rest/v1/${TABLE_NAME}?select=*`;
  if (category) {
    url += `&category=eq.${category}`;
  }

  try {
    const response = await fetch(url, {
      headers: {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      }
    });

    if (!response.ok) {
      throw new Error(`Помилка запиту: ${response.status}`);
    }

    const data = await response.json();
    products = data;
    displayProducts(products);
  } catch (err) {
    console.error("Не вдалося завантажити товари:", err);
  }
}

// Додавання товарів у кошик
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  const cartProduct = cart.find(p => p.id === productId);
  if (cartProduct) {
  cart.push(product);
  cartProduct.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveJsonCookie("cart", cart, 3600 * 24 * 7);
  alert(`Товар "${product.name}" додано в кошик!`);
  console.log("Поточний кошик:", cart); 
}

// Генерація Картки Товару
function createProductCard(product) {
  return `
    <div class="card shadow-sm" style="width: 18rem;">
      <img src="${product.image_url}" class="card-img-top p-3" alt="${product.name}" style="height: 220px; object-fit: contain;">
      <div class="card-body d-flex flex-column justify-content-between">
        <div>
          <h5 class="card-title fs-6">${product.name}</h5>
          <p class="card-text text-muted small mb-2">${product.brand}</p>
        </div>
        <div>
          <p class="fw-bold fs-5 text-primary mb-2">${product.price} грн</p>
          <button onclick="addToCart(${product.id})" type="button" class="btn btn-outline-success w-100 font-weight-bold">
            В кошик
          </button>
        </div>
      </div>
    </div>
  `;
}

// Відображення списку товарів
function displayProducts(items) {
  if (!productsContainer) return;
  
  if (items.length === 0) {
    productsContainer.innerHTML = `<p class="text-center text-muted">Товари не знайдені.</p>`;
    return;
  }

  productsContainer.innerHTML = items.map(product => createProductCard(product)).join('');
}

// Перемикання категорій при натисканні на меню
function setupCategoryFilters() {
  const navLinks = document.querySelectorAll('.nav-link, .dropdown-item');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const text = e.target.textContent.trim().toLowerCase();
      
      if (text === 'головна') {
        fetchData(); // завантажує всі товари
      } else if (text === 'face-care') {
        fetchData('face-care');
      } else if (text === 'makeup') {
        fetchData('makeup');
      } else if (text === 'hair-care') {
        fetchData('hair-care');
      } else if (text === 'body-care') {
        fetchData('body-care');
      }
    });
  });
}

// Ініціалізація при завантаженні сторінки
document.addEventListener("DOMContentLoaded", () => {
  fetchData();
  setupCategoryFilters();

  // Пошук
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = searchInput.value.toLowerCase().trim();
      const filtered = products.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.brand.toLowerCase().includes(query)
      );
      displayProducts(filtered);
    });
  }
});