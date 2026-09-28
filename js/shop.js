/* =========================================================
   SHE BLOSSOMS SHOP
   MOBILE MENU + CART + WHATSAPP ORDER
========================================================= */

(() => {
    "use strict";


    /* =====================================================
       MOBILE MENU
       Uses:
       #drawer
       [data-close]
    ===================================================== */

    const drawer = document.getElementById("drawer");

    const openBtn = document.querySelector(
        ".header .menu-btn"
    );


    if (drawer && openBtn) {

        const closeBtn =
            drawer.querySelector("[data-close]");


        const open = () => {

            drawer.hidden = false;

            openBtn.setAttribute(
                "aria-expanded",
                "true"
            );

            openBtn.setAttribute(
                "aria-label",
                "Close menu"
            );

            document.body.style.overflow = "hidden";


            if (closeBtn) {

                closeBtn.focus();

            }

        };


        const close = () => {

            drawer.hidden = true;

            openBtn.setAttribute(
                "aria-expanded",
                "false"
            );

            openBtn.setAttribute(
                "aria-label",
                "Open menu"
            );

            document.body.style.overflow = "";


            openBtn.focus();

        };


        /* Open menu */

        openBtn.addEventListener(
            "click",
            open
        );


        /* Close menu */

        if (closeBtn) {

            closeBtn.addEventListener(
                "click",
                close
            );

        }


        /* Close when a navigation link is clicked */

        drawer.addEventListener(
            "click",
            (event) => {

                if (
                    event.target.closest("a")
                ) {

                    close();

                }

            }
        );


        /* Close when clicking the drawer background */

        drawer.addEventListener(
            "click",
            (event) => {

                if (
                    event.target === drawer
                ) {

                    close();

                }

            }
        );


        /* Close with Escape */

        document.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key === "Escape" &&
                    !drawer.hidden
                ) {

                    close();

                }

            }
        );


        /* Keep menu closed when page loads */

        drawer.hidden = true;

    }



    /* =====================================================
       CART
    ===================================================== */

    const cart = [];


    const cartList =
        document.getElementById(
            "cart-list"
        );


    const cartEmpty =
        document.getElementById(
            "cart-empty"
        );


    const cartTotal =
        document.getElementById(
            "cart-total"
        );


    const cartItemLabel =
        document.getElementById(
            "cart-item-label"
        );


    const navCartCount =
        document.getElementById(
            "shop-cart-count"
        );


    const navCartButton =
        document.getElementById(
            "nav-cart-button"
        );


    const orderSection =
        document.getElementById(
            "order"
        );



    /* =====================================================
       FORMAT NAIRA
    ===================================================== */

    const formatNaira = (amount) => {

        return (
            "₦" +
            Number(
                amount || 0
            ).toLocaleString("en-NG")
        );

    };



    /* =====================================================
       GET CART QUANTITY
    ===================================================== */

    const getCartQuantity = () => {

        return cart.reduce(
            (total, item) => {

                return (
                    total +
                    item.quantity
                );

            },
            0
        );

    };



    /* =====================================================
       GET CART TOTAL
    ===================================================== */

    const getCartTotal = () => {

        return cart.reduce(
            (total, item) => {

                return (
                    total +
                    (
                        item.price *
                        item.quantity
                    )
                );

            },
            0
        );

    };



    /* =====================================================
       UPDATE CART COUNT
    ===================================================== */

    const updateCartCount = () => {

        const quantity =
            getCartQuantity();


        if (navCartCount) {

            navCartCount.textContent =
                quantity;

        }

    };



    /* =====================================================
       RENDER CART
    ===================================================== */

    const renderCart = () => {

        if (!cartList) {

            return;

        }


        cartList.innerHTML = "";


        const quantity =
            getCartQuantity();


        const total =
            getCartTotal();



        /* Empty cart */

        if (cartEmpty) {

            cartEmpty.hidden =
                cart.length !== 0;

        }



        /* Cart item label */

        if (cartItemLabel) {

            cartItemLabel.textContent =
                quantity === 1
                    ? "1 item"
                    : `${quantity} items`;

        }



        /* Cart total */

        if (cartTotal) {

            cartTotal.textContent =
                formatNaira(total);

        }



        /* Render each item */

        cart.forEach(
            (item, index) => {

                const li =
                    document.createElement(
                        "li"
                    );


                li.className =
                    "cart-line";


                li.innerHTML = `

                    <div>

                        <span
                            class="cart-item-name">
                        </span>


                        <span
                            class="cart-item-meta">
                        </span>


                        <div
                            class="cart-item-controls">

                            <button
                                class="quantity-button"
                                type="button"
                                data-action="decrease"
                                data-index="${index}"
                                aria-label="Decrease quantity">

                                −

                            </button>


                            <span
                                class="quantity-value">

                                ${item.quantity}

                            </span>


                            <button
                                class="quantity-button"
                                type="button"
                                data-action="increase"
                                data-index="${index}"
                                aria-label="Increase quantity">

                                +

                            </button>


                            <button
                                class="remove-item"
                                type="button"
                                data-action="remove"
                                data-index="${index}">

                                Remove

                            </button>

                        </div>

                    </div>


                    <strong>

                        ${formatNaira(
                            item.price *
                            item.quantity
                        )}

                    </strong>

                `;



                const itemName =
                    li.querySelector(
                        ".cart-item-name"
                    );


                if (itemName) {

                    itemName.textContent =
                        item.name;

                }



                const itemMeta =
                    li.querySelector(
                        ".cart-item-meta"
                    );


                if (itemMeta) {

                    itemMeta.textContent =
                        `Size: ${item.size}`;

                }



                cartList.appendChild(li);

            }
        );


        updateCartCount();

    };



    /* =====================================================
       ADD PRODUCT TO CART
    ===================================================== */

    const addToCart = (button) => {

        const id =
            button.dataset.id;


        const name =
            button.dataset.name;


        const price =
            Number(
                button.dataset.price || 0
            );


        const card =
            button.closest(
                ".product-card"
            );


        const sizeSelect =
            card
                ? card.querySelector(
                    ".product-size"
                )
                : null;


        const size =
            sizeSelect
                ? sizeSelect.value
                : "One Size";



        if (
            !id ||
            !name ||
            !price
        ) {

            return;

        }



        const existing =
            cart.find(
                item =>
                    item.id === id &&
                    item.size === size
            );



        if (existing) {

            existing.quantity += 1;

        } else {

            cart.push({

                id: id,

                name: name,

                price: price,

                size: size,

                quantity: 1

            });

        }



        renderCart();



        /* Button feedback */

        const originalText =
            button.textContent.trim();


        button.textContent =
            "Added ✓";


        button.disabled =
            true;



        setTimeout(
            () => {

                button.textContent =
                    originalText;

                button.disabled =
                    false;

            },
            900
        );



        /* On mobile/tablet,
           scroll to order section */

        if (
            window.innerWidth < 960 &&
            orderSection
        ) {

            orderSection.scrollIntoView({

                behavior: "smooth",

                block: "start"

            });

        }

    };



    /* =====================================================
       ADD-TO-CART BUTTONS
    ===================================================== */

    document
        .querySelectorAll(
            ".add-to-cart"
        )
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        addToCart(
                            button
                        );

                    }
                );

            }
        );



    /* =====================================================
       CART CONTROLS
    ===================================================== */

    if (cartList) {

        cartList.addEventListener(
            "click",
            (event) => {

                const button =
                    event.target.closest(
                        "button[data-action]"
                    );


                if (!button) {

                    return;

                }



                const index =
                    Number(
                        button.dataset.index
                    );


                const action =
                    button.dataset.action;


                const item =
                    cart[index];


                if (!item) {

                    return;

                }



                /* Increase */

                if (
                    action === "increase"
                ) {

                    item.quantity += 1;

                }



                /* Decrease */

                if (
                    action === "decrease"
                ) {

                    item.quantity -= 1;


                    if (
                        item.quantity <= 0
                    ) {

                        cart.splice(
                            index,
                            1
                        );

                    }

                }



                /* Remove */

                if (
                    action === "remove"
                ) {

                    cart.splice(
                        index,
                        1
                    );

                }



                renderCart();

            }
        );

    }



    /* =====================================================
       NAV CART BUTTON
    ===================================================== */

    if (
        navCartButton &&
        orderSection
    ) {

        navCartButton.addEventListener(
            "click",
            () => {

                orderSection.scrollIntoView({

                    behavior: "smooth",

                    block: "start"

                });

            }
        );

    }



    /* =====================================================
       WHATSAPP ORDER
    =====================================================

       IMPORTANT:

       Replace the empty string below with
       the official She Blossoms WhatsApp
       number in international format.

       Example:

       const WHATSAPP_NUMBER =
           "2348012345678";

       Do NOT include:
       +
       spaces
       brackets
       the leading 0
    ===================================================== */

    const WHATSAPP_NUMBER = "";



    const whatsappButton =
        document.getElementById(
            "whatsapp-order"
        );


    const customerName =
        document.getElementById(
            "customer-name"
        );


    const customerPhone =
        document.getElementById(
            "customer-phone"
        );



    /* =====================================================
       SEND WHATSAPP ORDER
    ===================================================== */

    if (whatsappButton) {

        whatsappButton.addEventListener(
            "click",
            () => {


                /* Check cart */

                if (
                    cart.length === 0
                ) {

                    alert(
                        "Please add at least one product to your cart."
                    );

                    return;

                }



                /* Get customer name */

                const name =
                    customerName
                        ? customerName.value.trim()
                        : "";



                /* Get customer phone */

                const phone =
                    customerPhone
                        ? customerPhone.value.trim()
                        : "";



                /* Validate name */

                if (!name) {

                    alert(
                        "Please enter your full name."
                    );


                    if (customerName) {

                        customerName.focus();

                    }


                    return;

                }



                /* Validate phone */

                if (!phone) {

                    alert(
                        "Please enter your phone number."
                    );


                    if (customerPhone) {

                        customerPhone.focus();

                    }


                    return;

                }



                /* Check WhatsApp number */

                if (
                    !WHATSAPP_NUMBER
                ) {

                    alert(
                        "The WhatsApp number has not been added to the shop.js file yet."
                    );

                    return;

                }



                /* Get payment method */

                const payment =
                    document.querySelector(
                        'input[name="payment"]:checked'
                    );


                const paymentMethod =
                    payment
                        ? payment.value
                        : "Not specified";



                /* Build order lines */

                const lines =
                    cart.map(
                        (item, index) => {

                            return (
                                `${index + 1}. ` +
                                `${item.name} — ` +
                                `Size: ${item.size} — ` +
                                `Qty: ${item.quantity} — ` +
                                `${formatNaira(
                                    item.price *
                                    item.quantity
                                )}`
                            );

                        }
                    );



                /* Build WhatsApp message */

                const message = [

                    "Hello She Blossoms, I would like to place an order.",

                    "",

                    `Name: ${name}`,

                    `Phone: ${phone}`,

                    "",

                    "ORDER ITEMS:",

                    ...lines,

                    "",

                    `Total: ${formatNaira(
                        getCartTotal()
                    )}`,

                    `Payment Method: ${paymentMethod}`,

                    "",

                    "Please confirm availability and payment details."

                ].join("\n");



                /* Create WhatsApp URL */

                const whatsappUrl =
                    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                        message
                    )}`;



                /* Open WhatsApp */

                window.open(
                    whatsappUrl,
                    "_blank",
                    "noopener,noreferrer"
                );

            }
        );

    }



    /* =====================================================
       CURRENT YEAR
    ===================================================== */

    const currentYear =
        document.getElementById(
            "current-year"
        );


    if (currentYear) {

        currentYear.textContent =
            new Date().getFullYear();

    }



    /* =====================================================
       INITIAL CART RENDER
    ===================================================== */

    renderCart();


})();