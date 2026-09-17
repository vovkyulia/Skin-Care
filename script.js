const productsContainer = document.getElementById("products-grid");
const searchInput = document.querySelector('input[type="search"]');
const searchBtn = document.querySelector('form[role="search"] button');
const cartIcon = document.querySelector(".cart-icon");
const sortFilter = document.getElementById("sortFilter");

const products = [
  {
    id: 1,
    name: "Зволожувальний крем",
    category: "care", 
    price: 450,
    image: "img/cream.jpg",
    isTop: true 
  },
  {
    id: 2,
    name: "Шампунь з кератином",
    category: "shampyn", 
    price: 320,
    image: "img/shampoo.jpg",
    isTop: false
  }
];
