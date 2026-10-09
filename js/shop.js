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
       Persists across refreshes for up to 1 hour of inactivity.
    ===================================================== */

    const CART_STORAGE_KEY = "sheBlossomsCart";

    const CART_ACTIVITY_KEY =
        "sheBlossomsCartLastActivity";

    const CART_IDLE_LIMIT =
        60 * 60 * 1000; // 1 hour


    /* =====================================================
       RESTORE SAVED CART
    ===================================================== */

    const getSavedCart = () => {

        try {

            const savedCart =
                localStorage.getItem(
                    CART_STORAGE_KEY
                );


            const lastActivity =
                Number(
                    localStorage.getItem(
                        CART_ACTIVITY_KEY
                    ) || 0
                );


            /* Nothing saved */

            if (
                !savedCart ||
                !lastActivity
            ) {

                return [];

            }


            /* Clear cart after 1 hour of inactivity */

            if (
                Date.now() - lastActivity >=
                CART_IDLE_LIMIT
            ) {

                localStorage.removeItem(
                    CART_STORAGE_KEY
                );

                localStorage.removeItem(
                    CART_ACTIVITY_KEY
                );

                return [];

            }


            const parsed =
                JSON.parse(savedCart);


            return Array.isArray(parsed)

                ? parsed

                    .filter(
                        (item) =>
                            item &&
                            item.id &&
                            item.name &&
                            Number(item.price) > 0 &&
                            Number(item.quantity) > 0
                    )

                    .map(
                        (item) => ({
                            id: String(item.id),

                            name: String(item.name),

                            price: Number(item.price),

                            size: item.size
                                ? String(item.size)
                                : "One Size",

                            quantity:
                                Math.max(
                                    1,
                                    Number(
                                        item.quantity
                                    )
                                )
                        })
                    )

                : [];

        } catch (error) {

            console.error(
                "Unable to restore cart:",
                error
            );


            localStorage.removeItem(
                CART_STORAGE_KEY
            );

            localStorage.removeItem(
                CART_ACTIVITY_KEY
            );


            return [];

        }

    };


    /* =====================================================
       CURRENT CART
    ===================================================== */

    const cart =
        getSavedCart();


    /* =====================================================
       SAVE CART
       Saving also resets the 1-hour inactivity timer.
    ===================================================== */

    const saveCart = () => {

        try {

            /* If cart is empty, remove saved cart */

            if (
                cart.length === 0
            ) {

                localStorage.removeItem(
                    CART_STORAGE_KEY
                );

                localStorage.removeItem(
                    CART_ACTIVITY_KEY
                );

                return;

            }


            localStorage.setItem(
                CART_STORAGE_KEY,
                JSON.stringify(cart)
            );


            localStorage.setItem(
                CART_ACTIVITY_KEY,
                String(Date.now())
            );

        } catch (error) {

            console.error(
                "Unable to save cart:",
                error
            );

        }

    };


    /* =====================================================
       PAGE VISIT COUNTS AS ACTIVITY
    ===================================================== */

    if (
        cart.length > 0
    ) {

        saveCart();

    }



    /* =====================================================
       CART ELEMENTS
    ===================================================== */

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

    const formatNaira = (
        amount
    ) => {

        return (
            "₦" +
            Number(
                amount || 0
            ).toLocaleString(
                "en-NG"
            )
        );

    };



    /* =====================================================
       GET CART QUANTITY
    ===================================================== */

    const getCartQuantity = () => {

        return cart.reduce(
            (
                total,
                item
            ) => {

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
            (
                total,
                item
            ) => {

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


        if (
            navCartCount
        ) {

            navCartCount.textContent =
                quantity;

        }

    };



    /* =====================================================
       RENDER CART
    ===================================================== */

    const renderCart = () => {

        if (
            !cartList
        ) {

            updateCartCount();

            return;

        }


        cartList.innerHTML =
            "";


        const quantity =
            getCartQuantity();


        const total =
            getCartTotal();



        /* =================================================
           EMPTY CART
        ================================================= */

        if (
            cartEmpty
        ) {

            cartEmpty.hidden =
                cart.length !== 0;

        }



        /* =================================================
           CART ITEM LABEL
        ================================================= */

        if (
            cartItemLabel
        ) {

            cartItemLabel.textContent =
                quantity === 1
                    ? "1 item"
                    : `${quantity} items`;

        }



        /* =================================================
           CART TOTAL
        ================================================= */

        if (
            cartTotal
        ) {

            cartTotal.textContent =
                formatNaira(
                    total
                );

        }



        /* =================================================
           RENDER EACH CART ITEM
        ================================================= */

        cart.forEach(
            (
                item,
                index
            ) => {

                const li =
                    document.createElement(
                        "li"
                    );


                li.className =
                    "cart-line";


                li.innerHTML = `

                    <div class="cart-line-info">

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
                                aria-label="Decrease quantity"
                            >
                                −
                            </button>

                            <span
                                class="cart-quantity">
                                ${item.quantity}
                            </span>

                            <button
                                class="quantity-button"
                                type="button"
                                data-action="increase"
                                data-index="${index}"
                                aria-label="Increase quantity"
                            >
                                +
                            </button>

                            <button
                                class="remove-item"
                                type="button"
                                data-action="remove"
                                data-index="${index}"
                            >
                                Remove
                            </button>

                        </div>

                    </div>

                    <strong
                        class="cart-item-price">
                    </strong>

                `;


                const nameElement =
                    li.querySelector(
                        ".cart-item-name"
                    );


                const metaElement =
                    li.querySelector(
                        ".cart-item-meta"
                    );


                const priceElement =
                    li.querySelector(
                        ".cart-item-price"
                    );


                if (
                    nameElement
                ) {

                    nameElement.textContent =
                        item.name;

                }


                if (
                    metaElement
                ) {

                    metaElement.textContent =
                        `Size: ${item.size}`;

                }


                if (
                    priceElement
                ) {

                    priceElement.textContent =
                        formatNaira(
                            item.price *
                            item.quantity
                        );

                }


                cartList.appendChild(
                    li
                );

            }
        );


        updateCartCount();

    };



    /* =====================================================
       ADD ITEM TO CART
    ===================================================== */

    const addToCart = (
        button
    ) => {

        if (
            !button
        ) {

            return;

        }


        const id =
            button.dataset.id;


        const name =
            button.dataset.name;


        const price =
            Number(
                button.dataset.price
            );


        const size =
            button.dataset.size ||
            "One Size";


        if (
            !id ||
            !name ||
            !price
        ) {

            console.error(
                "Invalid product data:",
                button.dataset
            );

            return;

        }


        /* Check if item already exists */

        const existingItem =
            cart.find(
                (item) =>
                    item.id === id &&
                    item.size === size
            );


        if (
            existingItem
        ) {

            existingItem.quantity +=
                1;

        } else {

            cart.push({

                id: id,

                name: name,

                price: price,

                size: size,

                quantity: 1

            });

        }


        /* Save cart */

        saveCart();


        /* Update cart */

        renderCart();


        /* Button feedback */

        const originalText =
            button.textContent;


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
            (
                button
            ) => {

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

    if (
        cartList
    ) {

        cartList.addEventListener(
            "click",
            (
                event
            ) => {

                const button =
                    event.target.closest(
                        "button[data-action]"
                    );


                if (
                    !button
                ) {

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


                if (
                    !item
                ) {

                    return;

                }



                /* =================================================
                   INCREASE
                ================================================= */

                if (
                    action === "increase"
                ) {

                    item.quantity +=
                        1;

                }



                /* =================================================
                   DECREASE
                ================================================= */

                if (
                    action === "decrease"
                ) {

                    item.quantity -=
                        1;


                    if (
                        item.quantity <= 0
                    ) {

                        cart.splice(
                            index,
                            1
                        );

                    }

                }



                /* =================================================
                   REMOVE
                ================================================= */

                if (
                    action === "remove"
                ) {

                    cart.splice(
                        index,
                        1
                    );

                }


                /* Save changes */

                saveCart();


                /* Re-render */

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
       CART ACTIVITY
       User activity keeps the cart alive for another hour.
    ===================================================== */

    let activityTimer =
        null;


    const refreshCartActivity =
        () => {

            if (
                cart.length === 0
            ) {

                return;

            }


            try {

                localStorage.setItem(
                    CART_ACTIVITY_KEY,
                    String(
                        Date.now()
                    )
                );

            } catch (
                error
            ) {

                console.error(
                    "Unable to refresh cart activity:",
                    error
                );

            }

        };


    /* =====================================================
       REGISTER USER ACTIVITY
       We don't write to localStorage on every mouse move.
    ===================================================== */

    const registerActivity =
        () => {

            if (
                cart.length === 0 ||
                activityTimer
            ) {

                return;

            }


            activityTimer =
                setTimeout(
                    () => {

                        refreshCartActivity();

                        activityTimer =
                            null;

                    },
                    30000
                );

        };


    [
        "click",
        "keydown",
        "scroll",
        "touchstart",
        "mousemove"
    ].forEach(
        (
            eventName
        ) => {

            document.addEventListener(
                eventName,
                registerActivity,
                {
                    passive: true
                }
            );

        }
    );



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

    const WHATSAPP_NUMBER =
        "2348061714658";



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

    if (
        whatsappButton
    ) {

        whatsappButton.addEventListener(
            "click",
            () => {


                /* =================================================
                   CHECK CART
                ================================================= */

                if (
                    cart.length === 0
                ) {

                    alert(
                        "Please add at least one product to your cart."
                    );

                    return;

                }



                /* =================================================
                   GET CUSTOMER NAME
                ================================================= */

                const name =
                    customerName
                        ? customerName.value.trim()
                        : "";



                /* =================================================
                   GET CUSTOMER PHONE
                ================================================= */

                const phone =
                    customerPhone
                        ? customerPhone.value.trim()
                        : "";



                /* =================================================
                   VALIDATE NAME
                ================================================= */

                if (
                    !name
                ) {

                    alert(
                        "Please enter your full name."
                    );


                    if (
                        customerName
                    ) {

                        customerName.focus();

                    }


                    return;

                }



                /* =================================================
                   VALIDATE PHONE
                ================================================= */

                if (
                    !phone
                ) {

                    alert(
                        "Please enter your phone number."
                    );


                    if (
                        customerPhone
                    ) {

                        customerPhone.focus();

                    }


                    return;

                }



                /* =================================================
                   CHECK WHATSAPP NUMBER
                ================================================= */

                if (
                    !WHATSAPP_NUMBER
                ) {

                    alert(
                        "The WhatsApp number has not been added to the shop.js file yet."
                    );

                    return;

                }



                /* =================================================
                   GET PAYMENT METHOD
                ================================================= */

                const payment =
                    document.querySelector(
                        'input[name="payment"]:checked'
                    );


                const paymentMethod =
                    payment
                        ? payment.value
                        : "Not specified";



                /* =================================================
                   BUILD ORDER LINES
                ================================================= */

                const lines =
                    cart.map(
                        (
                            item,
                            index
                        ) => {

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



                /* =================================================
                   BUILD WHATSAPP MESSAGE
                ================================================= */

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

                ].join(
                    "\n"
                );



                /* =================================================
                   CREATE WHATSAPP URL
                ================================================= */

                const whatsappUrl =
                    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                        message
                    )}`;



                /* =================================================
                   OPEN WHATSAPP
                ================================================= */

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


    if (
        currentYear
    ) {

        currentYear.textContent =
            new Date().getFullYear();

    }



    /* =====================================================
       INITIAL CART RENDER
    ===================================================== */

    renderCart();


})();