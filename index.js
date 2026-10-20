
/* Closing the top-nav header */
let navHead = document.getElementById("navHead");
let navHeadClose = document.getElementById("navHeadClose");

navHeadClose.addEventListener("click", function () {
    navHead.style.display = "none";
});


/* Opening and closing the hamburger menu */
let hamMenu = document.getElementById("hamMenu");
let sideNav = document.getElementById("sideNav");
let sideNavClose = document.getElementById("sideNavClose");

hamMenu.addEventListener("click", function () {
    sideNav.style.right = "0";
});

sideNavClose.addEventListener("click", function () {
    sideNav.style.right = "-70%";
});


/* HERO SLIDER */
const slide1 = document.getElementById("slide-1");
const slide2 = document.getElementById("slide-2");
const slide3 = document.getElementById("slide-3");

const prev = document.getElementById("prev");
const next = document.getElementById("next");

const bar1 = document.querySelector(".slideBar1");
const bar2 = document.querySelector(".slideBar2");
const bar3 = document.querySelector(".slideBar3");

const slides = [slide1, slide2, slide3];
const bars = [bar1, bar2, bar3];

let currentSlide = 1;
let slideTimer;


/* Show the selected slide */
function showSlide(slideNumber) {
    slides.forEach(function (slide) {
        slide.classList.remove("active");
    });

    bars.forEach(function (bar) {
        bar.classList.remove("active");
    });

    slides[slideNumber - 1].classList.add("active");
    bars[slideNumber - 1].classList.add("active");

    currentSlide = slideNumber;
}


/* Automatically change slides every 7 seconds */
function startSlider() {
    clearInterval(slideTimer);

    slideTimer = setInterval(function () {
        let nextSlide = currentSlide + 1;

        if (nextSlide > 3) {
            nextSlide = 1;
        }

        showSlide(nextSlide);
    }, 7000);
}


/* Next button */
next.addEventListener("click", function () {
    let nextSlide = currentSlide + 1;

    if (nextSlide > 3) {
        nextSlide = 1;
    }

    showSlide(nextSlide);
    startSlider();
});


/* Previous button */
prev.addEventListener("click", function () {
    let previousSlide = currentSlide - 1;

    if (previousSlide < 1) {
        previousSlide = 3;
    }

    showSlide(previousSlide);
    startSlider();
});


/* Slide indicator buttons */
bars.forEach(function (bar, index) {
    bar.addEventListener("click", function () {
        showSlide(index + 1);
        startSlider();
    });
});


/* Initialize the slider */
showSlide(currentSlide);
startSlider();


/* PRODUCT IMAGE HOVER */
const productImages = document.querySelectorAll(".productImage");

productImages.forEach(function (productImage) {
    const addToCartButton = productImage.querySelector(".btn-addToCart");

    productImage.addEventListener("mouseenter", function () {
        if (window.innerWidth > 1024) {
            addToCartButton.style.bottom = "5%";
        }
    });

    productImage.addEventListener("mouseleave", function () {
        if (window.innerWidth > 1024) {
            addToCartButton.style.bottom = "-20%";
        }
    });
});


/* CART COUNT */
let cartCounts = document.querySelectorAll(".cartCount");

let count = 0;

// addToCartButtons.forEach(function (button) {
//     button.addEventListener("click", function () {
//         count++;
//         cartCounts.forEach(function (cartCount) {
//             cartCount.textContent = count;
//         });
//     });
// });


/* =========================
   CART ELEMENTS
========================= */

let btnCart = document.querySelector(".btnCart");
let cartDrawer = document.querySelector(".cartDrawer");
let cartOverlay = document.querySelector(".cartOverlay");
let closeCart = document.querySelector(".closeCart");

let cartItemsContainer = document.querySelector(".cartItems");
let cartTotal = document.querySelector(".cartTotal");


/* =========================
   LOAD SAVED CART
========================= */

let cart = JSON.parse(localStorage.getItem("cart")) || [];


/* =========================
   OPEN CART DRAWER
========================= */

btnCart.addEventListener("click", function () {
    cartDrawer.classList.remove("translate-x-full");

    cartOverlay.classList.remove(
        "opacity-0",
        "pointer-events-none"
    );

    cartOverlay.classList.add(
        "opacity-100",
        "pointer-events-auto"
    );
});


/* =========================
   CLOSE CART DRAWER
========================= */

function hideCart() {
    cartDrawer.classList.add("translate-x-full");

    cartOverlay.classList.remove(
        "opacity-100",
        "pointer-events-auto"
    );

    cartOverlay.classList.add(
        "opacity-0",
        "pointer-events-none"
    );
}

closeCart.addEventListener("click", hideCart);

cartOverlay.addEventListener("click", hideCart);

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        hideCart();
    }
});


/* =========================
   ADD PRODUCTS TO CART
========================= */

let addToCartButtons = document.querySelectorAll(".btn-addToCart");

addToCartButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        // Find the product containing this button
        let product = button.closest(".product-card");

        if (!product) {
            console.error(
                "Add class 'product-card' to the product's outer div."
            );
            return;
        }

        // Get product information
        let id = product.dataset.productId;

        let image = product.querySelector("img").getAttribute("src");

        let name = product.querySelector("h1").textContent.trim();

        let priceText = product.querySelector(
            ".flex.justify-between p"
        ).textContent;

        let price = Number(priceText.replace(/[^\d.]/g, ""));

        // Check if the product already exists in the cart
        let existingProduct = cart.find(function (item) {
            return item.id === id;
        });

        if (existingProduct) {

            // Increase existing product quantity
            existingProduct.quantity++;

        } else {

            // Add a new product
            cart.push({
                id: id,
                image: image,
                name: name,
                price: price,
                quantity: 1
            });

        }

        saveCart();
        displayCart();

        let title = product.querySelector("h1").textContent.trim();
        alert(title + " added successfully!");

    });

});


/* =========================
   SAVE CART
========================= */

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}


/* =========================
   DISPLAY CART PRODUCTS
========================= */

function displayCart() {

    cartItemsContainer.innerHTML = "";

    let total = 0;
    let totalQuantity = 0;

    cart.forEach(function (item) {

        let subtotal = item.price * item.quantity;

        total += subtotal;
        totalQuantity += item.quantity;

        cartItemsContainer.innerHTML += `
            <div class="flex items-start gap-4 border-b pb-4">

                <img
                    src="${item.image}"
                    alt="${item.name}"
                    class="w-20 h-24 object-cover"
                >

                <div class="flex-1">

                    <h3 class="font-semibold">
                        ${item.name}
                    </h3>

                    <p class="text-sm mt-1">
                        ₹${item.price.toLocaleString("en-IN")}
                    </p>

                    <!-- Quantity controls -->
                    <div class="flex items-center gap-3 mt-3">

                        <button
                            class="decreaseQty border px-3 py-1 hover:bg-zinc-100"
                            data-id="${item.id}"
                            aria-label="Decrease ${item.name} quantity"
                        >
                            −
                        </button>

                        <span>${item.quantity}</span>

                        <button
                            class="increaseQty border px-3 py-1 hover:bg-zinc-100"
                            data-id="${item.id}"
                            aria-label="Increase ${item.name} quantity"
                        >
                            +
                        </button>

                    </div>

                    <p class="text-sm font-medium mt-2">
                        Subtotal: ₹${subtotal.toLocaleString("en-IN")}
                    </p>

                </div>

                <button
                    class="deleteItem text-sm underline text-red-600"
                    data-id="${item.id}"
                    aria-label="Remove ${item.name} from cart"
                >
                    Delete
                </button>

            </div>
        `;

    });

    // Update all cart count displays
    cartCounts.forEach(function (element) {
        element.textContent = totalQuantity;

        if (totalQuantity === 0) {
            element.classList.add("hidden");
        } else {
            element.classList.remove("hidden");
        }
    });

    // Update total price
    cartTotal.textContent = total.toLocaleString("en-IN");

}
    



/* =========================
   QUANTITY AND DELETE ACTIONS
========================= */

// One click listener handles all dynamically created buttons
cartItemsContainer.addEventListener("click", function (event) {

    let id = event.target.dataset.id;

    if (!id) {
        return;
    }

    // Increase quantity
    if (event.target.classList.contains("increaseQty")) {

        let item = cart.find(function (product) {
            return product.id === id;
        });

        if (item) {
            item.quantity++;
        }

    }

    // Decrease quantity
    else if (event.target.classList.contains("decreaseQty")) {

        let item = cart.find(function (product) {
            return product.id === id;
        });

        if (item) {

            item.quantity--;

            // Remove item when quantity reaches zero
            if (item.quantity === 0) {

                cart = cart.filter(function (product) {
                    return product.id !== id;
                });

            }

        }

    }

    // Delete item completely
    else if (event.target.classList.contains("deleteItem")) {

        cart = cart.filter(function (product) {
            return product.id !== id;
        });

    } else {
        return;
    }

    saveCart();
    displayCart();

});


/* =========================
   INITIAL CART DISPLAY
========================= */

displayCart();
