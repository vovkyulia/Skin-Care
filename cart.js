const cartContainer = document.getElementById("cartItems");

function getJsonCookie(cookieName) {
  const allCookies = document.cookie.split('; ');
  const targetCookie = allCookies.find(row => row.startsWith(cookieName + '='));
  if (targetCookie) {
    const encodedData = targetCookie.split('=')[1];
    return JSON.parse(decodeURIComponent(encodedData));
  }
  return null;
}

let cart = getJsonCookie("cart") || [];

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  const cartProduct = cart.find(p => p.id === productId);
  if (cartProduct) {
  cart.push(product);
  cartProduct.quantity += 1;
  } else {
    cart.push({title: product.name, price: product.price, image: product.image_url, quantity: 1 });
  }
  saveJsonCookie("cart", cart, 3600 * 24 * 7);
  alert(`Товар "${product.name}" додано в кошик!`);
  console.log("Поточний кошик:", cart); 
}

function cteateCartItemElement(item) {
    return `
        <div class="cart-item" d-flex align-items-center mb-3 border rounded">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image" style="width: 100px; height: 100px; object-fit: cover;">
            <div class="cart-item-details">
                <h5>${item.name}</h5>
                <p>Ціна: $${item.price}</p>
                <p>Кількість: ${item.quantity}</p>
            </div>
        </div>
    `;
}
function displayCartItems() {
    cartContainer.innerHTML = "";
    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Ваш кошик порожній.</p>";
        return;
    }
    cart.forEach(item => {
      cartContainer.innerHTML += createCartItemElement(item);
    });

    document.addEventListener("DOMContentLoaded", () => {
        displayCartItems();
    });