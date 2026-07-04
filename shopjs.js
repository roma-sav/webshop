const productsGrid = document.getElementById("productsGrid");
let allProducts = [];
async function loadProducts() {
    try {
        let response = await fetch("https://fakestoreapi.com/products");  
        if (!response.ok) {
            throw new Error("Не удалось загрузить товары");
        }
        allProducts = await response.json();
        displayProducts(allProducts);
    } catch (error) {
        productsGrid.innerHTML = `<p class="error-msg">${error.message}</p>`;
    }
}
function displayProducts(productsList) {
    productsGrid.innerHTML = "";
    if (productsList.length === 0) {
        productsGrid.innerHTML = "<p>Товары не найдены</p>";
        return;
    }
    productsList.forEach(product => {
        const card = document.createElement("div");
        card.classList.add("product-card");
        card.innerHTML = `
            <img class="product-img" src="${product.image}" alt="${product.title}">
            <div>
                <h3 class="product-title" title="${product.title}">${product.title}</h3>
                <div class="product-price">${product.price}$</div>
            </div>
            <button class="add-to-cart-btn">В корзину</button>
        `;
        productsGrid.appendChild(card);
    });
}
loadProducts();
const shopSearch = document.getElementById("shopSearch");
const filterButtons = document.querySelectorAll(".filter-btn");
let currentCategory = "all";
let searchQuery = "";
function filterAndDisplay() {
    let filtered = allProducts.filter(product => {
        const matchCategory = currentCategory === "all" || product.category === currentCategory;
        const matchSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCategory && matchSearch;
    });
    displayProducts(filtered);
}
shopSearch.oninput = function(event) {
    searchQuery = event.target.value;
    filterAndDisplay();
};
filterButtons.forEach(button => {
    button.onclick = function(event) {
        document.querySelector(".filter-btn.active").classList.remove("active");
        event.target.classList.add("active");
        currentCategory = event.target.dataset.category;
        filterAndDisplay();
    };
});
const cartCountElement = document.getElementById("cartCount");
const cartTotalElement = document.getElementById("cartTotal");
const cartClearBtn = document.getElementById("cartClearBtn");
let cart = JSON.parse(localStorage.getItem("myCart")) || [];
productsGrid.onclick = function(event) {
    if (event.target.classList.contains("add-to-cart-btn")) {
        const card = event.target.closest(".product-card");
        const title = card.querySelector(".product-title").innerText;
        const price = parseFloat(card.querySelector(".product-price").innerText);
        const productToCart = { title, price };
        cart.push(productToCart);
        showToast(`🛒 ${productToCart.title} добавлено в корзину`);
        updateCartUI();
    }
};
function updateCartUI() {
    cartCountElement.innerText = cart.length;
    const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
    cartTotalElement.innerText = totalPrice.toFixed(2);
    localStorage.setItem("myCart", JSON.stringify(cart));
}
cartClearBtn.onclick = function() {
    cart = [];
    updateCartUI();
}
function showToast(message) {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    
    toast.className = "toast";
    toast.innerText = message;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}
updateCartUI();