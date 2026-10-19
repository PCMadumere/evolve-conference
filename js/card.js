"use strict";

/*
 * SHE BLOSSOMS '26 — EVOLVE ATTENDEE CARD
 *
 * Uses the original artwork supplied:
 *   /images/evolve-card-bg.jpg
 *   /images/evolve-card-ring.png
 *
 * Features:
 *   - Upload attendee photo
 *   - Drag photo to reposition
 *   - Zoom photo
 *   - Enter attendee name
 *   - Download card as PNG
 *   - Share card where supported
 *   - Reset card
 *
 * The background artwork is used as supplied.
 * The circular frame is the original ring PNG.
 */

(() => {
    const WIDTH = 1080;
    const HEIGHT = 1350;

    const ASSETS = {
    background: "/images/evolve-card-bg.jpg",
    ring: "/images/evolve-card-ring.png"
};

    /*
     * CARD LAYOUT
     *
     * These coordinates refer to the 1080 × 1350 canvas.
     * Adjust them only if you need to fine-tune photo placement.
     */

    const PHOTO = {
        x: 539.5,
        y: 529.5,
        radius: 244
    };

    const RING = {
        x: 278,
        y: 268,
        width: 524,
        height: 523
    };

    /*
     * The background already contains the white vertical "I".
     * Only the attendee's name is drawn here.
     */

    const NAME = {
        x: 318,
        baseline: 913,
        maxWidth: 680,
        maxSize: 42,
        minSize: 20
    };

    /* =========================================================
       ELEMENTS
    ========================================================= */

    const canvas = document.getElementById("cardCanvas");

    if (!canvas) {
        console.error("Card canvas not found: #cardCanvas");
        return;
    }

    const ctx = canvas.getContext("2d");

    if (!ctx) {
        console.error("Unable to initialise the card canvas.");
        return;
    }

    const nameInput = document.getElementById("attendeeName");
    const photoInput = document.getElementById("photoUpload");
    const uploadBox = document.getElementById("photoUploadBox");
    const zoomInput = document.getElementById("photoZoom");
    const zoomValue = document.getElementById("zoomValue");

    const downloadButton = document.getElementById("downloadCard");
    const shareButton = document.getElementById("shareCard");
    const resetButton = document.getElementById("resetCard");

    const message = document.getElementById("creatorMessage");
    const hint = document.getElementById("canvasHint");

    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    canvas.style.touchAction = "none";

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    /* =========================================================
       STATE
    ========================================================= */

    const state = {
        background: null,
        ring: null,
        photo: null,
        zoom: 1,
        offsetX: 0,
        offsetY: 0
    };

    let drag = null;

    /* =========================================================
       MESSAGES
    ========================================================= */

    function showMessage(text, error = false) {
        if (!message) return;

        message.textContent = text;
        message.style.color = error ? "#B4235A" : "#771C51";
    }

    /* =========================================================
       NAME HELPERS
    ========================================================= */

    function getName() {
        return nameInput
            ? nameInput.value.trim()
            : "";
    }

    function safeName(name) {
        return (
            name
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "")
            || "attendee"
        );
    }

    function getFileName() {
        return `evolve-card-${safeName(getName())}.png`;
    }

    /* =========================================================
       IMAGE LOADER
    ========================================================= */

    function loadImage(src) {
        return new Promise((resolve, reject) => {
            const image = new Image();

            image.decoding = "async";

            image.onload = () => {
                resolve(image);
            };

            image.onerror = () => {
                reject(
                    new Error(
                        `Could not load card artwork: ${src}`
                    )
                );
            };

            image.src = src;
        });
    }

    /* =========================================================
       PHOTO SCALING
    ========================================================= */

    function photoBaseScale() {
        if (!state.photo) return 1;

        const diameter = PHOTO.radius * 2;

        return Math.max(
            diameter / state.photo.naturalWidth,
            diameter / state.photo.naturalHeight
        );
    }

    function clampPhotoOffset() {
        if (!state.photo) return;

        const scale = photoBaseScale() * state.zoom;

        const maxX = Math.max(
            0,
            (
                state.photo.naturalWidth * scale
                - PHOTO.radius * 2
            ) / 2
        );

        const maxY = Math.max(
            0,
            (
                state.photo.naturalHeight * scale
                - PHOTO.radius * 2
            ) / 2
        );

        state.offsetX = Math.max(
            -maxX,
            Math.min(maxX, state.offsetX)
        );

        state.offsetY = Math.max(
            -maxY,
            Math.min(maxY, state.offsetY)
        );
    }

    /* =========================================================
       DRAW ATTENDEE NAME
    ========================================================= */

    function drawName() {
        const name = getName();

        if (!name) return;

        let size = NAME.maxSize;

        ctx.save();

        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
        ctx.fillStyle = "#FFFFFF";

        ctx.shadowColor = "rgba(0, 0, 0, 0.12)";
        ctx.shadowBlur = 1;

        ctx.font =
            `800 ${size}px Montserrat, Arial, sans-serif`;

        /*
         * Reduce the font size for longer names.
         */

        while (
            size > NAME.minSize
            && ctx.measureText(name).width > NAME.maxWidth
        ) {
            size--;

            ctx.font =
                `800 ${size}px Montserrat, Arial, sans-serif`;
        }

        /*
         * If the name is still too long, truncate it safely.
         */

        let text = name;

        if (ctx.measureText(text).width > NAME.maxWidth) {
            while (
                text.length > 1
                && ctx.measureText(`${text}…`).width
                    > NAME.maxWidth
            ) {
                text = text.slice(0, -1);
            }

            text = `${text.trimEnd()}…`;
        }

        ctx.fillText(
            text,
            NAME.x,
            NAME.baseline
        );

        ctx.restore();
    }

    /* =========================================================
       DRAW CARD
    ========================================================= */

    function draw() {
        if (!state.background || !state.ring) return;

        ctx.clearRect(
            0,
            0,
            WIDTH,
            HEIGHT
        );

        /*
         * LAYER 1:
         * Draw the exact supplied background.
         *
         * The logo, event title, date, venue and other artwork
         * remain part of the original image.
         */

        ctx.drawImage(
            state.background,
            0,
            0,
            WIDTH,
            HEIGHT
        );

        /*
         * LAYER 2:
         * Draw the attendee photo inside the circular opening.
         */

        if (state.photo) {
            const scale =
                photoBaseScale() * state.zoom;

            const width =
                state.photo.naturalWidth * scale;

            const height =
                state.photo.naturalHeight * scale;

            ctx.save();

            ctx.beginPath();

            ctx.arc(
                PHOTO.x,
                PHOTO.y,
                PHOTO.radius,
                0,
                Math.PI * 2
            );

            ctx.clip();

            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";

            ctx.drawImage(
                state.photo,

                PHOTO.x
                    - width / 2
                    + state.offsetX,

                PHOTO.y
                    - height / 2
                    + state.offsetY,

                width,
                height
            );

            ctx.restore();
        }

        /*
         * LAYER 3:
         * Overlay the original multicoloured ring PNG.
         *
         * This preserves the supplied ring design rather than
         * recreating it with CSS or canvas shapes.
         */

        ctx.drawImage(
            state.ring,
            RING.x,
            RING.y,
            RING.width,
            RING.height
        );

        /*
         * LAYER 4:
         * Draw the attendee name.
         */

        drawName();

        /*
         * Hide the photo hint after a photo is uploaded.
         */

        if (hint) {
            hint.classList.toggle(
                "hidden",
                Boolean(state.photo)
            );
        }
    }

    /* =========================================================
       UPLOAD BOX
    ========================================================= */

    function updateUploadBox(uploaded) {
        if (!uploadBox) return;

        if (uploaded) {
            uploadBox.innerHTML = `
                <span class="upload-plus">✓</span>
                <strong>Photo uploaded</strong>
                <small>Click to choose another</small>
            `;
        } else {
            uploadBox.innerHTML = `
                <span class="upload-plus">+</span>
                <strong>Upload your photo</strong>
                <small>JPG, PNG or WEBP</small>
            `;
        }
    }

    /* =========================================================
       CANVAS COORDINATES
    ========================================================= */

    function canvasPoint(event) {
        const rect = canvas.getBoundingClientRect();

        return {
            x:
                (event.clientX - rect.left)
                * (WIDTH / rect.width),

            y:
                (event.clientY - rect.top)
                * (HEIGHT / rect.height)
        };
    }

    /* =========================================================
       VALIDATION
    ========================================================= */

    function validate() {
        if (!getName()) {
            showMessage(
                "Please enter your name first.",
                true
            );

            nameInput?.focus();

            return false;
        }

        if (!state.photo) {
            showMessage(
                "Please upload your photo first.",
                true
            );

            return false;
        }

        return true;
    }

    /* =========================================================
       CREATE PNG
    ========================================================= */

    function canvasBlob() {
        return new Promise((resolve, reject) => {
            canvas.toBlob(
                blob => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(
                            new Error(
                                "Could not create the card image."
                            )
                        );
                    }
                },
                "image/png"
            );
        });
    }

    /* =========================================================
       DOWNLOAD CARD
    ========================================================= */

    async function downloadCard() {
        const blob = await canvasBlob();

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;
        link.download = getFileName();

        document.body.appendChild(link);

        link.click();

        link.remove();

        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 1000);

        showMessage(
            "Your card has been downloaded."
        );
    }

    /* =========================================================
       SHARE CARD
    ========================================================= */

    async function shareCard() {
        const blob = await canvasBlob();

        const file = new File(
            [blob],
            getFileName(),
            {
                type: "image/png"
            }
        );

        /*
         * Use the browser's native sharing menu when supported.
         */

        if (
            navigator.share
            && navigator.canShare
            && navigator.canShare({
                files: [file]
            })
        ) {
            try {
                await navigator.share({
                    files: [file],
                    title: "My She Blossoms '26 Evolve Card"
                });

                showMessage(
                    "Your card has been shared."
                );

                return;

            } catch (error) {
                if (
                    error
                    && error.name === "AbortError"
                ) {
                    return;
                }

                console.warn(
                    "Native sharing failed.",
                    error
                );
            }
        }

        /*
         * If sharing is unsupported, download the PNG instead.
         */

        await downloadCard();

        showMessage(
            "Sharing is not supported here. Your card was downloaded instead."
        );
    }

    /* =========================================================
       PHOTO UPLOAD
    ========================================================= */

    photoInput?.addEventListener(
        "change",
        async event => {
            const file =
                event.target.files
                && event.target.files[0];

            if (!file) return;

            if (!file.type.startsWith("image/")) {
                showMessage(
                    "Please choose a JPG, PNG or WEBP image.",
                    true
                );

                photoInput.value = "";

                return;
            }

            let objectUrl = null;

            try {
                objectUrl = URL.createObjectURL(file);

                const photo = await loadImage(objectUrl);

                state.photo = photo;

                state.zoom = Math.max(
                    1,
                    Number(zoomInput?.value || 100) / 100
                );

                state.offsetX = 0;
                state.offsetY = 0;

                clampPhotoOffset();

                updateUploadBox(true);

                draw();

                showMessage(
                    "Photo added. Drag it inside the circle to reposition it."
                );

            } catch (error) {
                showMessage(
                    error.message || "Unable to load your photo.",
                    true
                );

            } finally {
                if (objectUrl) {
                    URL.revokeObjectURL(objectUrl);
                }
            }
        }
    );

    /* =========================================================
       NAME INPUT
    ========================================================= */

    nameInput?.addEventListener(
        "input",
        () => {
            draw();
        }
    );

    /* =========================================================
       PHOTO ZOOM
    ========================================================= */

    zoomInput?.addEventListener(
        "input",
        () => {
            /*
             * 100% means the photo covers the entire circle.
             * Zooming below 100% is not allowed.
             */

            const value = Math.max(
                100,
                Number(zoomInput.value) || 100
            );

            zoomInput.value = String(value);

            state.zoom = value / 100;

            if (zoomValue) {
                zoomValue.textContent = `${value}%`;
            }

            clampPhotoOffset();

            draw();
        }
    );

    /* =========================================================
       DRAG PHOTO
    ========================================================= */

    canvas.addEventListener(
        "pointerdown",
        event => {
            if (!state.photo) return;

            const point = canvasPoint(event);

            const distance = Math.hypot(
                point.x - PHOTO.x,
                point.y - PHOTO.y
            );

            /*
             * Start dragging only inside the photo circle.
             */

            if (distance > PHOTO.radius + 20) {
                return;
            }

            drag = {
                pointerId: event.pointerId,
                x: point.x,
                y: point.y,
                offsetX: state.offsetX,
                offsetY: state.offsetY
            };

            canvas.setPointerCapture(
                event.pointerId
            );

            canvas.classList.add("dragging");
        }
    );

    canvas.addEventListener(
        "pointermove",
        event => {
            if (
                !drag
                || event.pointerId !== drag.pointerId
            ) {
                return;
            }

            const point = canvasPoint(event);

            state.offsetX =
                drag.offsetX
                + point.x
                - drag.x;

            state.offsetY =
                drag.offsetY
                + point.y
                - drag.y;

            clampPhotoOffset();

            draw();
        }
    );

    function stopDragging(event) {
        if (!drag) return;

        if (
            event
            && event.pointerId !== drag.pointerId
        ) {
            return;
        }

        drag = null;

        canvas.classList.remove("dragging");
    }

    canvas.addEventListener(
        "pointerup",
        stopDragging
    );

    canvas.addEventListener(
        "pointercancel",
        stopDragging
    );

    /* =========================================================
       DOWNLOAD BUTTON
    ========================================================= */

    downloadButton?.addEventListener(
        "click",
        async () => {
            if (!validate()) return;

            try {
                await downloadCard();

            } catch (error) {
                showMessage(
                    error.message || "Unable to download the card.",
                    true
                );
            }
        }
    );

    /* =========================================================
       SHARE BUTTON
    ========================================================= */

    shareButton?.addEventListener(
        "click",
        async () => {
            if (!validate()) return;

            try {
                await shareCard();

            } catch (error) {
                showMessage(
                    error.message || "Unable to share the card.",
                    true
                );
            }
        }
    );

    /* =========================================================
       RESET BUTTON
    ========================================================= */

    resetButton?.addEventListener(
        "click",
        () => {
            state.photo = null;
            state.zoom = 1;
            state.offsetX = 0;
            state.offsetY = 0;

            if (nameInput) {
                nameInput.value = "";
            }

            if (photoInput) {
                photoInput.value = "";
            }

            if (zoomInput) {
                zoomInput.value = "100";
            }

            if (zoomValue) {
                zoomValue.textContent = "100%";
            }

            updateUploadBox(false);

            draw();

            showMessage(
                "Your card has been reset."
            );
        }
    );

    /* =========================================================
       LOAD ORIGINAL ARTWORK
    ========================================================= */

    Promise.all([
        loadImage(ASSETS.background),
        loadImage(ASSETS.ring),

        document.fonts
            ? document.fonts
                .load('800 42px "Montserrat"')
                .catch(() => [])
            : Promise.resolve([])
    ])
        .then(([background, ring]) => {
            state.background = background;
            state.ring = ring;

            draw();
        })
        .catch(error => {
            console.error(error);

            showMessage(
                "The card artwork could not load. Check that evolve-card-bg.jpg and evolve-card-ring.png are in the assets folder.",
                true
            );
        });

})();