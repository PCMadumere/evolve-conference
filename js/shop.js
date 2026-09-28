/* =========================================================
   SHE BLOSSOMS SHOP
   SHOP JAVASCRIPT
========================================================= */


/* =========================================================
   SETTINGS
========================================================= */

const MERCHANDISE_WHATSAPP = "2348081816585";


/* =========================================================
   CART
========================================================= */

let cart = [];


/* =========================================================
   DOM ELEMENTS
========================================================= */

const cartCount = document.getElementById("shop-cart-count");

const cartList = document.getElementById("cart-list");

const cartEmpty = document.getElementById("cart-empty");

const cartTotal = document.getElementById("cart-total");

const cartItemLabel = document.getElementById("cart-item-label");

const orderButton = document.getElementById("whatsapp-order");

const cartButton = document.getElementById("nav-cart-button");

const mobileMenuButton =
    document.getElementById("mobile-menu-button");

const navigation =
    document.getElementById("shop-navigation");



/* =========================================================
   FORMAT MONEY
========================================================= */

function formatMoney(amount) {

    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0
    }).format(amount);

}



/* =========================================================
   ESCAPE HTML
   Helps prevent unwanted HTML from being inserted
   into the cart.
========================================================= */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}



/* =========================================================
   GET CART QUANTITY
========================================================= */

function getCartQuantity() {

    return cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

}



/* =========================================================
   GET CART TOTAL
========================================================= */

function getCartTotal() {

    return cart.reduce(
        (total, item) => {
            return total + (item.price * item.quantity);
        },
        0
    );

}



/* =========================================================
   UPDATE CART
========================================================= */

function updateCart() {

    const totalQuantity = getCartQuantity();

    const totalPrice = getCartTotal();


    /* ---------------------------------------------
       CART COUNT
    --------------------------------------------- */

    if (cartCount) {

        cartCount.textContent = totalQuantity;

    }


    /* ---------------------------------------------
       CART ITEM LABEL
    --------------------------------------------- */

    if (cartItemLabel) {

        cartItemLabel.textContent =
            `${totalQuantity} ${
                totalQuantity === 1
                    ? "item"
                    : "items"
            }`;

    }


    /* ---------------------------------------------
       CART TOTAL
    --------------------------------------------- */

    if (cartTotal) {

        cartTotal.textContent =
            formatMoney(totalPrice);

    }


    /* ---------------------------------------------
       EMPTY CART MESSAGE
    --------------------------------------------- */

    if (cartEmpty) {

        cartEmpty.style.display =
            cart.length === 0
                ? "block"
                : "none";

    }


    /* ---------------------------------------------
       RENDER ITEMS
    --------------------------------------------- */

    renderCart();

}



/* =========================================================
   RENDER CART
========================================================= */

function renderCart() {

    if (!cartList) {
        return;
    }


    cartList.innerHTML = "";


    cart.forEach((item, index) => {

        const li =
            document.createElement("li");


        li.className = "cart-line";


        li.innerHTML = `

            <div>

                <span class="cart-item-name">
                    ${escapeHTML(item.name)}
                </span>

                <span class="cart-item-meta">
                    Size: ${escapeHTML(item.size)}
                </span>


                <div class="cart-item-controls">

                    <button
                        type="button"
                        class="quantity-button"
                        data-action="decrease"
                        data-index="${index}"
                        aria-label="Decrease quantity"
                    >
                        −
                    </button>


                    <span class="quantity-value">
                        ${item.quantity}
                    </span>


                    <button
                        type="button"
                        class="quantity-button"
                        data-action="increase"
                        data-index="${index}"
                        aria-label="Increase quantity"
                    >
                        +
                    </button>


                    <button
                        type="button"
                        class="remove-item"
                        data-action="remove"
                        data-index="${index}"
                    >
                        Remove
                    </button>

                </div>

            </div>


            <strong>
                ${formatMoney(
                    item.price * item.quantity
                )}
            </strong>

        `;


        cartList.appendChild(li);

    });

}



/* =========================================================
   ADD PRODUCT TO CART
========================================================= */

function addToCart(button) {

    if (!button) {
        return;
    }


    const id =
        button.dataset.id;

    const name =
        button.dataset.name;

    const price =
        Number(button.dataset.price);


    /* ---------------------------------------------
       VALIDATE PRODUCT DATA
    --------------------------------------------- */

    if (
        !id ||
        !name ||
        !Number.isFinite(price)
    ) {

        console.error(
            "Invalid product data:",
            button.dataset
        );

        return;

    }


    /* ---------------------------------------------
       FIND PRODUCT CARD
    --------------------------------------------- */

    const productCard =
        button.closest(".product-card");


    if (!productCard) {

        console.error(
            "Product card not found."
        );

        return;

    }


    /* ---------------------------------------------
       GET SIZE
    --------------------------------------------- */

    const sizeSelect =
        productCard.querySelector(
            ".product-size"
        );


    const size =
        sizeSelect
            ? sizeSelect.value
            : "One Size";


    /* ---------------------------------------------
       CHECK IF SAME PRODUCT + SIZE EXISTS
    --------------------------------------------- */

    const existingItem =
        cart.find(item =>
            item.id === id &&
            item.size === size
        );


    /* ---------------------------------------------
       INCREASE EXISTING ITEM
    --------------------------------------------- */

    if (existingItem) {

        existingItem.quantity += 1;

    }


    /* ---------------------------------------------
       ADD NEW ITEM
    --------------------------------------------- */

    else {

        cart.push({

            id: id,

            name: name,

            price: price,

            size: size,

            quantity: 1

        });

    }


    /* ---------------------------------------------
       UPDATE CART
    --------------------------------------------- */

    updateCart();


    /* ---------------------------------------------
       SCROLL TO ORDER
    --------------------------------------------- */

    const orderSection =
        document.getElementById("order");


    if (orderSection) {

        orderSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }


    /* ---------------------------------------------
       BUTTON FEEDBACK
    --------------------------------------------- */

    const originalText =
        button.textContent;


    button.textContent =
        "Added ✓";


    button.disabled = true;


    setTimeout(() => {

        button.textContent =
            originalText;

        button.disabled = false;

    }, 1000);

}



/* =========================================================
   CART ACTIONS
========================================================= */

function handleCartAction(action, index) {

    if (
        !Number.isInteger(index) ||
        !cart[index]
    ) {

        return;

    }


    const item = cart[index];


    /* ---------------------------------------------
       INCREASE
    --------------------------------------------- */

    if (action === "increase") {

        item.quantity += 1;

    }


    /* ---------------------------------------------
       DECREASE
    --------------------------------------------- */

    else if (action === "decrease") {

        item.quantity -= 1;


        if (item.quantity <= 0) {

            cart.splice(index, 1);

        }

    }


    /* ---------------------------------------------
       REMOVE
    --------------------------------------------- */

    else if (action === "remove") {

        cart.splice(index, 1);

    }


    /* ---------------------------------------------
       UPDATE
    --------------------------------------------- */

    updateCart();

}



/* =========================================================
   ADD TO CART BUTTONS
========================================================= */

const addToCartButtons =
    document.querySelectorAll(".add-to-cart");


addToCartButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            addToCart(button);

        }
    );

});



/* =========================================================
   CART LIST ACTIONS
========================================================= */

if (cartList) {

    cartList.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "button[data-action]"
                );


            if (!button) {
                return;
            }


            const action =
                button.dataset.action;


            const index =
                Number(button.dataset.index);


            handleCartAction(
                action,
                index
            );

        }
    );

}



/* =========================================================
   CART ICON
========================================================= */

if (cartButton) {

    cartButton.addEventListener(
        "click",
        () => {

            const orderSection =
                document.getElementById("order");


            if (orderSection) {

                orderSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        }
    );

}



/* =========================================================
   WHATSAPP ORDER
========================================================= */

if (orderButton) {

    orderButton.addEventListener(
        "click",
        () => {

            /* -----------------------------------------
               CHECK CART
            ----------------------------------------- */

            if (cart.length === 0) {

                alert(
                    "Please add at least one product to your cart."
                );

                return;

            }


            /* -----------------------------------------
               CUSTOMER NAME
            ----------------------------------------- */

            const nameInput =
                document.getElementById(
                    "customer-name"
                );


            const customerName =
                nameInput
                    ? nameInput.value.trim()
                    : "";


            /* -----------------------------------------
               CUSTOMER PHONE
            ----------------------------------------- */

            const phoneInput =
                document.getElementById(
                    "customer-phone"
                );


            const customerPhone =
                phoneInput
                    ? phoneInput.value.trim()
                    : "";


            /* -----------------------------------------
               VALIDATE NAME
            ----------------------------------------- */

            if (!customerName) {

                alert(
                    "Please enter your full name."
                );

                if (nameInput) {
                    nameInput.focus();
                }

                return;

            }


            /* -----------------------------------------
               VALIDATE PHONE
            ----------------------------------------- */

            if (!customerPhone) {

                alert(
                    "Please enter your phone number."
                );

                if (phoneInput) {
                    phoneInput.focus();
                }

                return;

            }


            /* -----------------------------------------
               PAYMENT METHOD
            ----------------------------------------- */

            const paymentInput =
                document.querySelector(
                    'input[name="payment"]:checked'
                );


            const paymentMethod =
                paymentInput
                    ? paymentInput.value
                    : "Bank Transfer";


            /* -----------------------------------------
               TOTAL
            ----------------------------------------- */

            const total =
                getCartTotal();


            /* -----------------------------------------
               BUILD ORDER ITEMS
            ----------------------------------------- */

            const orderItems =
                cart.map(
                    (item, index) => {

                        const itemTotal =
                            item.price *
                            item.quantity;


                        return `
${index + 1}. ${item.name}
Size: ${item.size}
Quantity: ${item.quantity}
Price: ${formatMoney(itemTotal)}
                        `.trim();

                    }
                ).join("\n\n");


            /* -----------------------------------------
               WHATSAPP MESSAGE
            ----------------------------------------- */

            const message = `
Hello She Blossoms,

I would like to place a merchandise order.

CUSTOMER DETAILS
Name: ${customerName}
Phone: ${customerPhone}

ORDER DETAILS

${orderItems}

TOTAL: ${formatMoney(total)}

Payment Method: ${paymentMethod}

Please let me know the next steps for payment and delivery.

Thank you.
            `.trim();


            /* -----------------------------------------
               WHATSAPP URL
            ----------------------------------------- */

            const whatsappURL =
                `https://wa.me/${MERCHANDISE_WHATSAPP}?text=${encodeURIComponent(
                    message
                )}`;


            /* -----------------------------------------
               OPEN WHATSAPP
            ----------------------------------------- */

            window.open(
                whatsappURL,
                "_blank",
                "noopener,noreferrer"
            );

        }
    );

}



/* =========================================================
   MOBILE MENU
========================================================= */

if (
    mobileMenuButton &&
    navigation
) {

    mobileMenuButton.addEventListener(
        "click",
        () => {

            const isOpen =
                navigation.classList.toggle(
                    "is-open"
                );


            mobileMenuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

        }
    );


    /* ---------------------------------------------
       CLOSE MENU AFTER CLICKING A LINK
    --------------------------------------------- */

    const navigationLinks =
        navigation.querySelectorAll("a");


    navigationLinks.forEach(link => {

        link.addEventListener(
            "click",
            () => {

                navigation.classList.remove(
                    "is-open"
                );


                mobileMenuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }
        );

    });

}



/* =========================================================
   CURRENT YEAR
========================================================= */

const currentYear =
    document.getElementById(
        "current-year"
    );


if (currentYear) {

    currentYear.textContent =
        new Date().getFullYear();

}



/* =========================================================
   INITIALISE CART
========================================================= */

updateCart();