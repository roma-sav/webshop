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
let cart = [];
productsGrid.onclick = function(event) {
    if (event.target.classList.contains("add-to-cart-btn")) {
        const card = event.target.closest(".product-card");
        const title = card.querySelector(".product-title").innerText;
        const price = parseFloat(card.querySelector(".product-price").innerText);
        const productToCart = { title, price };
        cart.push(productToCart);
        updateCartUI();
    }
};
function updateCartUI() {
    cartCountElement.innerText = cart.length;
    const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
    cartTotalElement.innerText = totalPrice.toFixed(2);
}