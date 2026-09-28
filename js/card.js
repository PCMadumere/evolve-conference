"use strict";

/* ============================================================
   SHE BLOSSOMS '26 — CARD GENERATOR
============================================================ */

/* ============================================================
   CONFERENCE
============================================================ */

const CONFERENCE = {
    name: "She Blossoms '26",
    organisation: "WORDFEAST GOSPEL NETWORK, AWKA",
    date: "Friday 23 & Saturday 24 October 2026",
    venue: "Alexander David's Event Place, Agu-Awka"
};

/* ============================================================
   COLOURS (same blue + pink direction as the shop)
============================================================ */

const COLORS = {
    navy: "#071941",
    blue: "#123B82",
    blueLight: "#2467BD",
    pink: "#EC4899",
    pinkLight: "#FFB6DF",
    white: "#FFFFFF"
};

/* ============================================================
   CANVAS
============================================================ */

const CANVAS_SIZE = 1080;

const PHOTO = {
    centerX: CANVAS_SIZE / 2,
    centerY: 425,
    radius: 148,
    hitRadius: 175,
    maxOffset: 145
};

const canvas = document.getElementById("cardCanvas");
const ctx = canvas.getContext("2d", { alpha: false, desynchronized: false });

canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = "high";

/* ============================================================
   ELEMENTS
============================================================ */

const attendeeName = document.getElementById("attendeeName");
const photoUpload = document.getElementById("photoUpload");
const photoUploadBox = document.getElementById("photoUploadBox");
const photoZoom = document.getElementById("photoZoom");
const zoomValue = document.getElementById("zoomValue");
const downloadButton = document.getElementById("downloadCard");
const shareButton = document.getElementById("shareCard");
const resetButton = document.getElementById("resetCard");
const message = document.getElementById("creatorMessage");
const canvasHint = document.getElementById("canvasHint");
const year = document.getElementById("year");
const menuButton = document.getElementById("cardMenuButton");
const cardNav = document.getElementById("cardNav");

/* ============================================================
   STATE
============================================================ */

let userPhoto = null;
let photoScale = 1;
let photoOffsetX = 0;
let photoOffsetY = 0;

let dragging = false;
let dragStartX = 0;
let dragStartY = 0;
let startingOffsetX = 0;
let startingOffsetY = 0;

/* Share file cache.
   The PNG is built ahead of time so navigator.share() runs
   immediately on tap, inside the user-activation window. */

let shareFile = null;
let shareFileVersion = -1;
let cardVersion = 0;
let shareBuildTimer = null;

/* ============================================================
   YEAR
============================================================ */

if (year) {
    year.textContent = new Date().getFullYear();
}

/* ============================================================
   MESSAGE
============================================================ */

function showMessage(text, error = false) {
    if (!message) return;

    message.textContent = text;
    message.style.color = error ? COLORS.pink : COLORS.blue;
}

/* ============================================================
   HELPERS
============================================================ */

function getAttendeeName() {
    return attendeeName ? attendeeName.value.trim() : "";
}

function cleanFileName(name) {
    return name
        .trim()
        .replace(/[^a-zA-Z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .toLowerCase();
}

function getCardFileName() {
    const safeName = cleanFileName(getAttendeeName()) || "attendee";
    return `she-blossoms-26-${safeName}.png`;
}

function validateCard() {
    if (!getAttendeeName()) {
        showMessage("Please enter your name first.", true);
        attendeeName?.focus();
        return false;
    }

    if (!userPhoto) {
        showMessage("Please upload your photo first.", true);
        return false;
    }

    return true;
}

/* ============================================================
   LOAD IMAGE
============================================================ */

function loadImage(file) {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject(new Error("No image selected."));
            return;
        }

        if (!file.type.startsWith("image/")) {
            reject(new Error("Please select an image file."));
            return;
        }

        const reader = new FileReader();

        reader.onload = (event) => {
            const image = new Image();
            image.onload = () => resolve(image);
            image.onerror = () => reject(new Error("Unable to load this image."));
            image.src = event.target.result;
        };

        reader.onerror = () => reject(new Error("Unable to read the image."));
        reader.readAsDataURL(file);
    });
}

/* ============================================================
   BACKGROUND
============================================================ */

function fillRadialGlow(x, y, innerRadius, outerRadius, colour) {
    const glow = ctx.createRadialGradient(x, y, innerRadius, x, y, outerRadius);
    glow.addColorStop(0, colour);
    glow.addColorStop(1, "rgba(236,72,153,0)");

    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
}

function drawCardBackground() {
    const base = ctx.createLinearGradient(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    base.addColorStop(0, COLORS.navy);
    base.addColorStop(0.45, COLORS.blue);
    base.addColorStop(1, COLORS.blueLight);

    ctx.fillStyle = base;
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    fillRadialGlow(850, 110, 20, 500, "rgba(236,72,153,0.42)");
    fillRadialGlow(100, 930, 20, 430, "rgba(236,72,153,0.25)");

    const pinkLayer = ctx.createLinearGradient(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    pinkLayer.addColorStop(0, "rgba(236,72,153,0)");
    pinkLayer.addColorStop(0.55, "rgba(236,72,153,0)");
    pinkLayer.addColorStop(1, "rgba(236,72,153,0.18)");

    ctx.fillStyle = pinkLayer;
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
}

/* ============================================================
   BORDER
============================================================ */

function drawBorder() {
    const outer = 30;
    const inner = outer + 17;

    ctx.save();

    ctx.strokeStyle = "rgba(255,182,223,0.95)";
    ctx.lineWidth = 7;
    ctx.strokeRect(outer, outer, CANVAS_SIZE - outer * 2, CANVAS_SIZE - outer * 2);

    ctx.strokeStyle = "rgba(255,255,255,0.28)";
    ctx.lineWidth = 2;
    ctx.strokeRect(inner, inner, CANVAS_SIZE - inner * 2, CANVAS_SIZE - inner * 2);

    ctx.restore();
}

/* ============================================================
   HEADER
============================================================ */

function drawHeader() {
    const center = CANVAS_SIZE / 2;

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillStyle = "rgba(255,255,255,0.76)";
    ctx.font = '600 15px "DM Sans", sans-serif';
    ctx.fillText(CONFERENCE.organisation, center, 88);

    ctx.strokeStyle = COLORS.pinkLight;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(center - 30, 112);
    ctx.lineTo(center + 30, 112);
    ctx.stroke();

    ctx.fillStyle = COLORS.white;
    ctx.font = '600 66px "Playfair Display", Georgia, serif';
    ctx.fillText(CONFERENCE.name, center, 168);

    ctx.restore();
}

/* ============================================================
   PHOTO
============================================================ */

function strokeCircle(radius, colour, width) {
    ctx.beginPath();
    ctx.arc(PHOTO.centerX, PHOTO.centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = colour;
    ctx.lineWidth = width;
    ctx.stroke();
}

function drawPhotoPlaceholder() {
    const { centerX, centerY, radius } = PHOTO;

    ctx.save();

    strokeCircle(radius + 20, COLORS.pinkLight, 7);
    strokeCircle(radius + 9, "rgba(255,255,255,0.85)", 5);

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.10)";
    ctx.fill();

    ctx.fillStyle = "rgba(255,255,255,0.70)";
    ctx.font = '600 18px "DM Sans", sans-serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("YOUR PHOTO", centerX, centerY);

    ctx.restore();
}

function drawPhoto() {
    if (!userPhoto) {
        drawPhotoPlaceholder();
        return;
    }

    const { centerX, centerY, radius } = PHOTO;

    /* Shadow */
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.35)";
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 12;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 5, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0,0,0,0.15)";
    ctx.fill();
    ctx.restore();

    /* Clipped photo, cover-fit then user zoom and offset */
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.clip();

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const targetSize = radius * 2;
    const imageWidth = userPhoto.naturalWidth || userPhoto.width;
    const imageHeight = userPhoto.naturalHeight || userPhoto.height;

    const scale = Math.max(targetSize / imageWidth, targetSize / imageHeight) * photoScale;

    const drawWidth = imageWidth * scale;
    const drawHeight = imageHeight * scale;
    const drawX = centerX - drawWidth / 2 + photoOffsetX;
    const drawY = centerY - drawHeight / 2 + photoOffsetY;

    ctx.filter = "contrast(1.06) saturate(1.05)";
    ctx.drawImage(userPhoto, drawX, drawY, drawWidth, drawHeight);
    ctx.filter = "none";

    ctx.restore();

    /* Rings */
    ctx.save();
    strokeCircle(radius + 20, COLORS.pinkLight, 7);
    strokeCircle(radius + 9, "rgba(255,255,255,0.95)", 5);
    strokeCircle(radius - 2, "rgba(7,25,65,0.20)", 3);
    ctx.restore();
}

/* ============================================================
   NAME
============================================================ */

function drawName() {
    const center = CANVAS_SIZE / 2;
    const nameY = 648;
    const name = getAttendeeName() || "Your Name";

    let fontSize = 53;
    if (name.length > 25) fontSize = 45;
    if (name.length > 31) fontSize = 39;

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(0,0,0,0.28)";
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 2;
    ctx.fillStyle = COLORS.white;
    ctx.font = `600 ${fontSize}px "Playfair Display", Georgia, serif`;
    ctx.fillText(name, center, nameY);
    ctx.restore();

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = COLORS.pinkLight;
    ctx.font = '600 18px "DM Sans", sans-serif';
    ctx.fillText("I  W I L L  B E  T H E R E", center, nameY + 58);
    ctx.restore();
}

/* ============================================================
   DATE + VENUE
============================================================ */

function drawDetails() {
    const center = CANVAS_SIZE / 2;

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillStyle = "rgba(255,255,255,0.90)";
    ctx.font = '500 18px "DM Sans", sans-serif';
    ctx.fillText(CONFERENCE.date, center, 795);

    ctx.fillStyle = "rgba(255,255,255,0.70)";
    ctx.font = '400 16px "DM Sans", sans-serif';
    ctx.fillText(CONFERENCE.venue, center, 829);

    ctx.restore();
}

/* ============================================================
   FOOTER
============================================================ */

function drawCardFooter() {
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(255,182,223,0.78)";
    ctx.font = '600 11px "DM Sans", sans-serif';
    ctx.fillText(CONFERENCE.organisation, CANVAS_SIZE / 2, 1000);
    ctx.restore();
}

/* ============================================================
   SHARE FILE BUILD
============================================================ */

/* Debounced so dragging and typing don't re-encode the PNG on
   every event. Any change bumps cardVersion, which invalidates
   the cached file until the new one is ready. */
function scheduleShareFileBuild() {
    cardVersion++;
    clearTimeout(shareBuildTimer);

    if (!userPhoto || !getAttendeeName()) {
        shareFile = null;
        return;
    }

    const version = cardVersion;

    shareBuildTimer = setTimeout(() => {
        canvas.toBlob((blob) => {
            if (!blob || version !== cardVersion) return;

            shareFile = new File([blob], getCardFileName(), { type: "image/png" });
            shareFileVersion = version;
        }, "image/png");
    }, 300);
}

/* Synchronous fallback, used only if the user taps Share before
   the debounced build has finished. */
function createShareFileSync() {
    const dataUrl = canvas.toDataURL("image/png");
    const binary = atob(dataUrl.split(",")[1]);
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }

    return new File([bytes], getCardFileName(), { type: "image/png" });
}

function getCurrentShareFile() {
    if (shareFile && shareFileVersion === cardVersion) {
        return shareFile;
    }

    return createShareFileSync();
}

/* ============================================================
   SHARE PREVIEW FALLBACK
   For in-app browsers (WhatsApp, Instagram, Facebook) and
   desktop browsers that cannot share files.
============================================================ */

function showSharePreview() {
    document.getElementById("sharePreviewOverlay")?.remove();

    const overlay = document.createElement("div");
    overlay.id = "sharePreviewOverlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Your card");

    overlay.style.cssText = [
        "position:fixed",
        "inset:0",
        "z-index:9999",
        "display:flex",
        "flex-direction:column",
        "align-items:center",
        "justify-content:center",
        "gap:16px",
        "padding:24px",
        "background:rgba(7,25,65,0.94)"
    ].join(";");

    const image = document.createElement("img");
    image.src = canvas.toDataURL("image/png");
    image.alt = "Your She Blossoms '26 card";
    image.style.cssText = "max-width:min(90vw,480px);max-height:70vh;border-radius:8px;";

    const hint = document.createElement("p");
    hint.textContent = "Press and hold the card to save or share it.";
    hint.style.cssText =
        "margin:0;color:#fff;text-align:center;font:500 15px 'DM Sans',sans-serif;";

    const close = document.createElement("button");
    close.type = "button";
    close.textContent = "Close";
    close.style.cssText =
        `padding:10px 28px;border:0;border-radius:999px;background:${COLORS.pink};` +
        "color:#fff;font:600 15px 'DM Sans',sans-serif;cursor:pointer;";

    const closeOverlay = () => {
        overlay.remove();
        document.removeEventListener("keydown", onKeydown);
        shareButton?.focus();
    };

    const onKeydown = (event) => {
        if (event.key === "Escape") closeOverlay();
    };

    close.addEventListener("click", closeOverlay);
    overlay.addEventListener("click", (event) => {
        if (event.target === overlay) closeOverlay();
    });
    document.addEventListener("keydown", onKeydown);

    overlay.append(image, hint, close);
    document.body.appendChild(overlay);
    close.focus();
}

/* ============================================================
   DRAW COMPLETE CARD
============================================================ */

function drawCard() {
    drawCardBackground();
    drawBorder();
    drawHeader();
    drawPhoto();
    drawName();
    drawDetails();
    drawCardFooter();

    canvasHint?.classList.toggle("hidden", Boolean(userPhoto));

    scheduleShareFileBuild();
}

/* ============================================================
   UPLOAD BOX STATES
============================================================ */

function setUploadBoxUploaded() {
    if (!photoUploadBox) return;

    photoUploadBox.innerHTML = `
        <span class="upload-plus">✓</span>
        <strong>Photo uploaded</strong>
        <small>Click to choose another</small>
    `;
}

function setUploadBoxEmpty() {
    if (!photoUploadBox) return;

    photoUploadBox.innerHTML = `
        <span class="upload-plus">+</span>
        <strong>Upload your photo</strong>
        <small>JPG, PNG or WEBP</small>
    `;
}

function resetPhotoTransform() {
    photoScale = 1;
    photoOffsetX = 0;
    photoOffsetY = 0;

    if (photoZoom) photoZoom.value = 100;
    if (zoomValue) zoomValue.textContent = "100%";
}

/* ============================================================
   PHOTO UPLOAD
============================================================ */

photoUpload?.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
        userPhoto = await loadImage(file);
        resetPhotoTransform();
        setUploadBoxUploaded();
        drawCard();
        showMessage("Photo added. You can drag it on the card.");
    } catch (error) {
        showMessage(error.message || "Unable to load your photo.", true);
    }
});

/* ============================================================
   NAME
============================================================ */

attendeeName?.addEventListener("input", drawCard);

/* ============================================================
   ZOOM
============================================================ */

photoZoom?.addEventListener("input", () => {
    const value = Number(photoZoom.value);

    photoScale = value / 100;
    if (zoomValue) zoomValue.textContent = `${value}%`;

    drawCard();
});

/* ============================================================
   DRAG
============================================================ */

function getCanvasPoint(event) {
    const rect = canvas.getBoundingClientRect();

    return {
        x: (event.clientX - rect.left) * (canvas.width / rect.width),
        y: (event.clientY - rect.top) * (canvas.height / rect.height)
    };
}

function isPhotoArea(x, y) {
    return Math.hypot(x - PHOTO.centerX, y - PHOTO.centerY) <= PHOTO.hitRadius;
}

function clampOffset(value) {
    return Math.max(-PHOTO.maxOffset, Math.min(PHOTO.maxOffset, value));
}

function endDrag(event) {
    dragging = false;
    canvas.classList.remove("dragging");

    try {
        if (event) canvas.releasePointerCapture(event.pointerId);
    } catch (error) {
        /* Pointer was not captured. */
    }
}

canvas.addEventListener("pointerdown", (event) => {
    if (!userPhoto) return;

    const point = getCanvasPoint(event);
    if (!isPhotoArea(point.x, point.y)) return;

    dragging = true;
    canvas.classList.add("dragging");
    canvas.setPointerCapture(event.pointerId);

    dragStartX = point.x;
    dragStartY = point.y;
    startingOffsetX = photoOffsetX;
    startingOffsetY = photoOffsetY;
});

canvas.addEventListener("pointermove", (event) => {
    if (!dragging) return;

    const point = getCanvasPoint(event);

    photoOffsetX = clampOffset(startingOffsetX + (point.x - dragStartX));
    photoOffsetY = clampOffset(startingOffsetY + (point.y - dragStartY));

    drawCard();
});

canvas.addEventListener("pointerup", endDrag);
canvas.addEventListener("pointercancel", endDrag);

/* ============================================================
   DOWNLOAD
============================================================ */

function triggerDownload(blob) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = getCardFileName();

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);

    showMessage("Your card has been downloaded.");
}

downloadButton?.addEventListener("click", () => {
    if (!validateCard()) return;

    if (shareFile && shareFileVersion === cardVersion) {
        triggerDownload(shareFile);
        return;
    }

    canvas.toBlob((blob) => {
        if (!blob) {
            showMessage("Unable to create the card.", true);
            return;
        }

        triggerDownload(blob);
    }, "image/png");
});

/* ============================================================
   SHARE
   No await before navigator.share(): the call must stay inside
   the tap's user-activation window.
============================================================ */

shareButton?.addEventListener("click", () => {
    if (!validateCard()) return;

    let file;

    try {
        file = getCurrentShareFile();
    } catch (error) {
        console.error("Could not create card file:", error);
        showMessage("Unable to prepare the card for sharing.", true);
        return;
    }

    let canShareFiles = false;

    try {
        canShareFiles =
            typeof navigator.share === "function" &&
            typeof navigator.canShare === "function" &&
            navigator.canShare({ files: [file] });
    } catch (error) {
        console.warn("navigator.canShare failed:", error);
    }

    if (!canShareFiles) {
        showSharePreview();
        return;
    }

    /* Files only. Adding `text` makes some targets
       (WhatsApp/Instagram on iOS) drop the image. */
    navigator
        .share({ files: [file] })
        .then(() => showMessage("Card shared successfully."))
        .catch((error) => {
            if (error?.name === "AbortError") return;

            console.error("Native share failed:", error);
            showSharePreview();
        });
});

/* ============================================================
   RESET
============================================================ */

resetButton?.addEventListener("click", () => {
    userPhoto = null;

    if (attendeeName) attendeeName.value = "";
    if (photoUpload) photoUpload.value = "";

    resetPhotoTransform();
    setUploadBoxEmpty();
    drawCard();

    showMessage("Your card has been reset.");
});

/* ============================================================
   MOBILE NAVIGATION
============================================================ */

menuButton?.addEventListener("click", () => {
    if (!cardNav) return;

    const open = cardNav.classList.toggle("card-mobile-open");

    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});

/* ============================================================
   INITIAL DRAW
   Redraw once web fonts load so the first render doesn't use
   fallback fonts.
============================================================ */

drawCard();

document.fonts?.ready.then(drawCard);