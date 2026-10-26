/* ==========================================================================
   Food Delivery System - Dynamic JavaScript Application
   ========================================================================== */

// --- 1. Food Data Source (Using Real Local JPG Images) ---
let foodItems = [
    {
        id: 1,
        name: "Supreme Veggie Pizza",
        category: "veg",
        cuisine: "Italian",
        price: 299,
        rating: 4.8,
        prepTime: "25-30 min",
        image: "images/pizza.jpg",
        description: "Hand-tossed crust topped with rich mozzarella, bell peppers, olives, sweet corn, and fresh basil.",
        ingredients: ["Mozzarella", "Bell Peppers", "Sweet Corn", "Black Olives", "Tomato Sauce"]
    },
    {
        id: 2,
        name: "Classic Chicken Burger",
        category: "nonveg",
        cuisine: "American",
        price: 220,
        rating: 4.6,
        prepTime: "20-25 min",
        image: "images/burger.jpg",
        description: "Juicy grilled chicken patty topped with melted cheddar, crisp lettuce, tomatoes, and spicy mayo in a brioche bun.",
        ingredients: ["Grilled Chicken", "Cheddar Cheese", "Lettuce", "Tomatoes", "Spicy Mayo"]
    },
    {
        id: 3,
        name: "Paneer Butter Masala",
        category: "veg",
        cuisine: "Indian",
        price: 260,
        rating: 4.9,
        prepTime: "25-35 min",
        image: "images/paneer.jpg",
        description: "Cubes of fresh cottage cheese cooked in a rich, creamy, tomato-butter gravy seasoned with aromatic Indian spices.",
        ingredients: ["Paneer", "Butter", "Tomato Gravy", "Kasuri Methi", "Fresh Cream"]
    },
    {
        id: 4,
        name: "Chicken Biryani Special",
        category: "nonveg",
        cuisine: "Indian",
        price: 349,
        rating: 4.9,
        prepTime: "30-40 min",
        image: "images/biryani.jpg",
        description: "Fragrant basmati rice slow-cooked dum-style with marinated tender chicken pieces, saffron, and fresh mint.",
        ingredients: ["Basmati Rice", "Chicken", "Saffron", "Mint", "Whole Spices"]
    },
    {
        id: 5,
        name: "Fresh Garden Bowl",
        category: "veg",
        cuisine: "American",
        price: 180,
        rating: 4.5,
        prepTime: "15-20 min",
        image: "images/salad.jpg",
        description: "A nutrient-rich bowl with crisp greens, cherry tomatoes, cucumbers, avocado, roasted chickpeas, and lemon vinaigrette.",
        ingredients: ["Kale", "Cherry Tomatoes", "Avocado", "Chickpeas", "Lemon Dressing"]
    },
    {
        id: 6,
        name: "Japanese Salmon Sushi Roll",
        category: "nonveg",
        cuisine: "Asian",
        price: 420,
        rating: 4.7,
        prepTime: "25-30 min",
        image: "images/sushi.jpg",
        description: "Fresh Atlantic salmon, cucumber, and avocado rolled in vinegared rice and seaweed, served with pickled ginger.",
        ingredients: ["Atlantic Salmon", "Nori", "Sushi Rice", "Avocado", "Wasabi"]
    },
    {
        id: 7,
        name: "Creamy Alfredo Pasta",
        category: "veg",
        cuisine: "Italian",
        price: 275,
        rating: 4.6,
        prepTime: "20-25 min",
        image: "images/pasta.jpg",
        description: "Penne pasta tossed in garlic parmesan cream sauce garnished with fresh parsley and roasted garlic bread.",
        ingredients: ["Penne Pasta", "Parmesan", "Heavy Cream", "Garlic", "Parsley"]
    },
    {
        id: 8,
        name: "Mexican Loaded Tacos",
        category: "nonveg",
        cuisine: "American",
        price: 240,
        rating: 4.8,
        prepTime: "15-20 min",
        image: "images/tacos.jpg",
        description: "Crispy taco shells loaded with seasoned minced beef, pico de gallo, sour cream, guacamole, and jalapeños.",
        ingredients: ["Taco Shells", "Minced Meat", "Guacamole", "Pico de Gallo", "Jalapeños"]
    }
];

// --- 2. State Management ---
let shoppingCart = [];
let currentCategoryFilter = "all";
let currentCuisineFilter = "all";
let currentSortOption = "default";
let currentSearchQuery = "";

// --- 3. DOM Content Loaded Initialization ---
document.addEventListener("DOMContentLoaded", async () => {
    renderFoodMenu();
    setupFilterListeners();
    setupSearchListeners();
    setupFormValidation();
    updateCartUI();
    await loadMenuFromApi();
});

async function loadMenuFromApi() {
    try {
        const response = await fetch("/api/menu");
        if (!response.ok) throw new Error("Menu API is unavailable");
        const menu = await response.json();
        if (Array.isArray(menu) && menu.length) {
            foodItems = menu;
            renderFoodMenu();
        }
    } catch (error) {
        console.info("Using the bundled menu. Start the backend to load the API menu.");
    }
}

// --- 4. Render Food Cards in Menu ---
function renderFoodMenu() {
    const foodContainer = document.getElementById("foodContainer");
    if (!foodContainer) return;

    // Filter Items
    let filtered = foodItems.filter(item => {
        const matchesCategory = (currentCategoryFilter === "all" || item.category === currentCategoryFilter);
        const matchesCuisine = (currentCuisineFilter === "all" || item.cuisine === currentCuisineFilter);
        const matchesSearch = item.name.toLowerCase().includes(currentSearchQuery.toLowerCase()) || 
                              item.description.toLowerCase().includes(currentSearchQuery.toLowerCase()) ||
                              item.cuisine.toLowerCase().includes(currentSearchQuery.toLowerCase());
        return matchesCategory && matchesCuisine && matchesSearch;
    });

    // Sort Items
    if (currentSortOption === "low-high") {
        filtered.sort((a, b) => a.price - b.price);
    } else if (currentSortOption === "high-low") {
        filtered.sort((a, b) => b.price - a.price);
    } else if (currentSortOption === "rating") {
        filtered.sort((a, b) => b.rating - a.rating);
    }

    foodContainer.innerHTML = "";

    if (filtered.length === 0) {
        foodContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-search display-1 text-muted"></i>
                <h4 class="mt-3 text-muted">No food items found matching your filters</h4>
                <button class="btn btn-outline-primary mt-2" onclick="resetFilters()">Reset Filters</button>
            </div>
        `;
        return;
    }

    filtered.forEach(item => {
        const col = document.createElement("div");
        col.className = "col-lg-4 col-md-6 mb-4 food-item-wrapper";
        
        col.innerHTML = `
            <div class="card custom-card food-card">
                <div class="card-img-container">
                    <img src="${item.image}" alt="${item.name}" loading="lazy">
                    <div class="badge-top-left">
                        <span class="food-type-icon ${item.category}" title="${item.category === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}"></span>
                    </div>
                    <div class="badge-top-right">
                        <span class="badge bg-dark bg-opacity-75"><i class="bi bi-star-fill text-warning"></i> ${item.rating}</span>
                    </div>
                </div>

                <div class="card-body">
                    <div>
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <span class="badge bg-light text-dark border">${item.cuisine}</span>
                            <small class="text-muted"><i class="bi bi-clock"></i> ${item.prepTime}</small>
                        </div>
                        <h5 class="card-title mt-1 mb-2 fw-bold">${item.name}</h5>
                        <p class="card-text text-muted small mb-3 text-truncate-2">${item.description}</p>
                    </div>

                    <div class="d-flex align-items-center justify-content-between pt-2 border-top">
                        <div class="food-price">₹${item.price}</div>
                        <div class="btn-group gap-2">
                            <button class="btn btn-sm btn-outline-secondary btn-view-details" onclick="openFoodModal(${item.id})">
                                Details
                            </button>
                            <button class="btn btn-sm btn-add-cart" onclick="addToCart(${item.id})">
                                <i class="bi bi-plus-lg"></i> Add
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        foodContainer.appendChild(col);
    });
}

// --- 5. Filter & Search Listeners ---
function setupFilterListeners() {
    const categoryBtns = document.querySelectorAll(".btn-filter-category");
    categoryBtns.forEach(btn => {
        btn.addEventListener("click", function() {
            categoryBtns.forEach(b => b.classList.remove("active"));
            this.classList.add("active");
            currentCategoryFilter = this.dataset.category;
            renderFoodMenu();
        });
    });

    const cuisineSelect = document.getElementById("cuisineFilterSelect");
    if (cuisineSelect) {
        cuisineSelect.addEventListener("change", function() {
            currentCuisineFilter = this.value;
            renderFoodMenu();
        });
    }

    const sortSelect = document.getElementById("priceSortSelect");
    if (sortSelect) {
        sortSelect.addEventListener("change", function() {
            currentSortOption = this.value;
            renderFoodMenu();
        });
    }
}

function setupSearchListeners() {
    const navSearchInput = document.getElementById("navSearchInput");
    const heroSearchInput = document.getElementById("heroSearchInput");

    const handleSearchInput = (e) => {
        currentSearchQuery = e.target.value;
        if (navSearchInput && navSearchInput !== e.target) navSearchInput.value = currentSearchQuery;
        if (heroSearchInput && heroSearchInput !== e.target) heroSearchInput.value = currentSearchQuery;
        renderFoodMenu();
    };

    if (navSearchInput) navSearchInput.addEventListener("input", handleSearchInput);
    if (heroSearchInput) heroSearchInput.addEventListener("input", handleSearchInput);
}

function resetFilters() {
    currentCategoryFilter = "all";
    currentCuisineFilter = "all";
    currentSortOption = "default";
    currentSearchQuery = "";

    const categoryBtns = document.querySelectorAll(".btn-filter-category");
    categoryBtns.forEach(b => {
        b.classList.toggle("active", b.dataset.category === "all");
    });

    const cuisineSelect = document.getElementById("cuisineFilterSelect");
    if (cuisineSelect) cuisineSelect.value = "all";

    const sortSelect = document.getElementById("priceSortSelect");
    if (sortSelect) sortSelect.value = "default";

    const navSearchInput = document.getElementById("navSearchInput");
    if (navSearchInput) navSearchInput.value = "";

    const heroSearchInput = document.getElementById("heroSearchInput");
    if (heroSearchInput) heroSearchInput.value = "";

    renderFoodMenu();
}

// --- 6. Food Modal Handler ---
function openFoodModal(itemId) {
    const item = foodItems.find(f => f.id === itemId);
    if (!item) return;

    document.getElementById("modalFoodTitle").textContent = item.name;
    document.getElementById("modalFoodImage").src = item.image;
    document.getElementById("modalFoodImage").alt = item.name;
    document.getElementById("modalFoodPrice").textContent = `₹${item.price}`;
    document.getElementById("modalFoodCuisine").textContent = item.cuisine;
    document.getElementById("modalFoodRating").textContent = item.rating;
    document.getElementById("modalFoodPrep").textContent = item.prepTime;
    document.getElementById("modalFoodDescription").textContent = item.description;

    const modalBadge = document.getElementById("modalFoodCategoryBadge");
    if (modalBadge) {
        modalBadge.className = `food-type-icon ${item.category}`;
    }

    const ingredientsContainer = document.getElementById("modalFoodIngredients");
    if (ingredientsContainer) {
        ingredientsContainer.innerHTML = item.ingredients
            .map(ing => `<span class="badge bg-light text-dark border me-1 mb-1">${ing}</span>`)
            .join("");
    }

    const modalAddBtn = document.getElementById("modalAddToCartBtn");
    if (modalAddBtn) {
        modalAddBtn.onclick = function() {
            addToCart(item.id);
            const foodModal = bootstrap.Modal.getInstance(document.getElementById("foodModal"));
            if (foodModal) foodModal.hide();
        };
    }

    const modalElement = new bootstrap.Modal(document.getElementById("foodModal"));
    modalElement.show();
}

// --- 7. Shopping Cart Logic ---
function addToCart(itemId) {
    const item = foodItems.find(f => f.id === itemId);
    if (!item) return;

    const existingCartIndex = shoppingCart.findIndex(cartItem => cartItem.id === itemId);

    if (existingCartIndex > -1) {
        shoppingCart[existingCartIndex].quantity += 1;
    } else {
        shoppingCart.push({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: 1
        });
    }

    updateCartUI();
    triggerCartBadgeAnimation();

    showNotificationToast(`Added "${item.name}" to cart! 🍔`);
}

function changeQuantity(itemId, change) {
    const index = shoppingCart.findIndex(item => item.id === itemId);
    if (index === -1) return;

    shoppingCart[index].quantity += change;

    if (shoppingCart[index].quantity <= 0) {
        shoppingCart.splice(index, 1);
    }

    updateCartUI();
}

function removeFromCart(itemId) {
    shoppingCart = shoppingCart.filter(item => item.id !== itemId);
    updateCartUI();
}

function clearCart() {
    shoppingCart = [];
    updateCartUI();
}

function updateCartUI() {
    const cartItemsContainer = document.getElementById("cartItemsContainer");
    const cartBadge = document.getElementById("cartBadge");
    const cartCountSummary = document.getElementById("cartCountSummary");
    const cartSubtotalElem = document.getElementById("cartSubtotal");
    const cartDeliveryElem = document.getElementById("cartDeliveryFee");
    const cartDiscountElem = document.getElementById("cartDiscount");
    const cartTaxElem = document.getElementById("cartTax");
    const cartTotalElem = document.getElementById("cartTotal");
    const emptyState = document.getElementById("emptyCartState");
    const cartContent = document.getElementById("cartContentContainer");

    const totalItemCount = shoppingCart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = shoppingCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (cartBadge) cartBadge.textContent = totalItemCount;
    if (cartCountSummary) cartCountSummary.textContent = `${totalItemCount} items`;

    if (totalItemCount === 0) {
        if (emptyState) emptyState.classList.remove("d-none");
        if (cartContent) cartContent.classList.add("d-none");
        return;
    }

    if (emptyState) emptyState.classList.add("d-none");
    if (cartContent) cartContent.classList.remove("d-none");

    const deliveryFee = subtotal > 500 ? 0 : 40;
    const discount = subtotal > 400 ? 50 : 0;
    const tax = Math.round(subtotal * 0.05); // 5% GST
    const grandTotal = Math.max(0, subtotal + deliveryFee - discount + tax);

    if (cartSubtotalElem) cartSubtotalElem.textContent = `₹${subtotal}`;
    if (cartDeliveryElem) cartDeliveryElem.textContent = deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`;
    if (cartDiscountElem) cartDiscountElem.textContent = `-₹${discount}`;
    if (cartTaxElem) cartTaxElem.textContent = `₹${tax}`;
    if (cartTotalElem) cartTotalElem.textContent = `₹${grandTotal}`;

    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = shoppingCart.map(item => `
            <div class="cart-item-row">
                <div class="d-flex align-items-center gap-3">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                    <div>
                        <h6 class="mb-0 fw-bold">${item.name}</h6>
                        <small class="text-muted">₹${item.price} x ${item.quantity}</small>
                    </div>
                </div>

                <div class="d-flex align-items-center gap-3">
                    <div class="quantity-control">
                        <button class="btn-qty" onclick="changeQuantity(${item.id}, -1)">-</button>
                        <span class="fw-bold px-1">${item.quantity}</span>
                        <button class="btn-qty" onclick="changeQuantity(${item.id}, 1)">+</button>
                    </div>
                    <span class="fw-bold text-primary">₹${item.price * item.quantity}</span>
                    <button class="btn btn-sm btn-link text-danger p-0" onclick="removeFromCart(${item.id})" title="Remove item">
                        <i class="bi bi-trash fs-5"></i>
                    </button>
                </div>
            </div>
        `).join("");
    }
}

function triggerCartBadgeAnimation() {
    const cartBadge = document.getElementById("cartBadge");
    if (!cartBadge) return;
    cartBadge.classList.add("pulse");
    setTimeout(() => {
        cartBadge.classList.remove("pulse");
    }, 400);
}

async function handleCheckout() {
    if (shoppingCart.length === 0) {
        alert("Your cart is empty! Please add items to order.");
        return;
    }

    let order;
    try {
        const response = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ items: shoppingCart.map(({ id, quantity }) => ({ id, quantity })) }) });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Could not place your order.");
        order = result;
    } catch (error) {
        showNotificationToast(error.message || "Could not connect to the ordering service.");
        return;
    }

    document.getElementById("checkoutOrderId").textContent = order.orderId;
    document.getElementById("checkoutAmount").textContent = `₹${order.total}`;

    const checkoutModal = new bootstrap.Modal(document.getElementById("checkoutModal"));
    checkoutModal.show();

    shoppingCart = [];
    updateCartUI();
}

// --- 8. Contact Form Validation (Exercises 1 - 5) ---
function setupFormValidation() {
    const contactForm = document.getElementById("contactForm");
    if (!contactForm) return;

    const nameInput = document.getElementById("nameInput");
    const emailInput = document.getElementById("emailInput");
    const mobileInput = document.getElementById("mobileInput");
    const passwordInput = document.getElementById("passwordInput");

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const mobileRegex = /^[6-9]\d{9}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const validateField = (inputElement, condition) => {
        if (condition) {
            inputElement.classList.remove("is-invalid-custom");
            inputElement.classList.add("is-valid-custom");
            return true;
        } else {
            inputElement.classList.remove("is-valid-custom");
            inputElement.classList.add("is-invalid-custom");
            return false;
        }
    };

    if (nameInput) {
        nameInput.addEventListener("input", () => {
            validateField(nameInput, nameInput.value.trim().length >= 2);
        });
    }

    if (emailInput) {
        emailInput.addEventListener("input", () => {
            validateField(emailInput, emailRegex.test(emailInput.value.trim()));
        });
    }

    if (mobileInput) {
        mobileInput.addEventListener("input", () => {
            validateField(mobileInput, mobileRegex.test(mobileInput.value.trim()));
        });
    }

    if (passwordInput) {
        passwordInput.addEventListener("input", () => {
            validateField(passwordInput, passwordRegex.test(passwordInput.value));
        });
    }

    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const isNameValid = nameInput ? validateField(nameInput, nameInput.value.trim().length >= 2) : true;
        const isEmailValid = emailInput ? validateField(emailInput, emailRegex.test(emailInput.value.trim())) : true;
        const isMobileValid = mobileInput ? validateField(mobileInput, mobileRegex.test(mobileInput.value.trim())) : true;
        const isPasswordValid = passwordInput ? validateField(passwordInput, passwordRegex.test(passwordInput.value)) : true;

        if (isNameValid && isEmailValid && isMobileValid && isPasswordValid) {
            try {
                const response = await fetch("/api/contacts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: nameInput.value, email: emailInput.value, mobile: mobileInput.value, message: document.getElementById("messageInput")?.value || "" }) });
                const result = await response.json();
                if (!response.ok) throw new Error(result.message || "Could not send your message.");
            } catch (error) {
                showNotificationToast(error.message || "Could not connect to the contact service.");
                return;
            }
            const successAlert = document.getElementById("formSuccessAlert");
            if (successAlert) {
                successAlert.classList.remove("d-none");
                setTimeout(() => successAlert.classList.add("d-none"), 5000);
            }
            contactForm.reset();
            [nameInput, emailInput, mobileInput, passwordInput].forEach(input => {
                if (input) {
                    input.classList.remove("is-valid-custom", "is-invalid-custom");
                }
            });
        } else {
            contactForm.scrollIntoView({ behavior: "smooth" });
        }
    });
}

// --- 9. Toast Notification Helper ---
function showNotificationToast(message) {
    let toastContainer = document.getElementById("toastContainer");
    if (!toastContainer) {
        toastContainer = document.createElement("div");
        toastContainer.id = "toastContainer";
        toastContainer.className = "toast-container position-fixed bottom-0 end-0 p-3";
        toastContainer.style.zIndex = "1090";
        document.body.appendChild(toastContainer);
    }

    const toastId = `toast-${Date.now()}`;
    const toastHTML = `
        <div id="${toastId}" class="toast align-items-center text-white bg-dark border-0 shadow-lg" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body d-flex align-items-center gap-2">
                    <i class="bi bi-check-circle-fill text-warning fs-5"></i>
                    <span>${message}</span>
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `;

    toastContainer.insertAdjacentHTML("beforeend", toastHTML);
    const toastElem = document.getElementById(toastId);
    const bsToast = new bootstrap.Toast(toastElem, { delay: 2500 });
    bsToast.show();

    toastElem.addEventListener("hidden.bs.toast", () => {
        toastElem.remove();
    });
}
