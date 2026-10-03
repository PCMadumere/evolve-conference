/* =========================================================
   SHE BLOSSOMS REGISTRATION
   GOOGLE FORMS + EMAILJS
========================================================= */


/* =========================================================
   GOOGLE FORM
========================================================= */

const GOOGLE_FORM_URL =
    "https://docs.google.com/forms/d/e/1FAIpQLSdzzNdflrISzCkDZo5wIcj5fHE142Ah7UkimIvXhA-XGbzRgg/formResponse";


/* =========================================================
   GOOGLE FORM ENTRY IDs
========================================================= */

const GOOGLE_FIELDS = {

    name: "entry.6185216",

    email: "entry.1943039311",

    phone: "entry.2008373921",

    address: "entry.491841401",

    occupation: "entry.451425346",

    firstTime: "entry.802888224",

    message: "entry.969123203"

};


/* =========================================================
   EMAILJS
========================================================= */

const EMAILJS_SERVICE_ID =
    "service_o9kv3ir";

const EMAILJS_TEMPLATE_ID =
    "template_82ewad3";


/* =========================================================
   GET WEBSITE FORM
========================================================= */

const form =
    document.getElementById("register-form");


if (!form) {

    console.error(
        "ERROR: #register-form was not found."
    );

} else {


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const status =
        form.querySelector(".form__status");

    const submitButton =
        form.querySelector(
            'button[type="submit"]'
        );


    const nameInput =
        document.getElementById("f-name");

    const emailInput =
        document.getElementById("f-email");

    const phoneInput =
        document.getElementById("f-phone");

    const addressInput =
        document.getElementById("f-address");

    const occupationInput =
        document.getElementById("f-occupation");

    const messageInput =
        document.getElementById("f-message");


    /* =====================================================
       STATUS
    ===================================================== */

    function showStatus(message, type) {

        if (!status) {
            return;
        }

        status.textContent =
            message;

        status.classList.remove(
            "success",
            "error",
            "loading"
        );

        if (type) {

            status.classList.add(
                type
            );

        }

    }


    /* =====================================================
       EMAIL VALIDATION
    ===================================================== */

    function isValidEmail(email) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            email
        );

    }


    /* =====================================================
       GET FIRST-TIME ANSWER
       
       Google Forms expects:
       Yes
       No
    ===================================================== */

    function getFirstTimeAnswer() {

        const selected =
            form.querySelector(
                'input[name="first_time"]:checked'
            );

        if (!selected) {

            return "";

        }

        const value =
            selected.value.trim().toLowerCase();


        if (value === "yes") {

            return "Yes";

        }


        if (value === "no") {

            return "No";

        }


        return selected.value.trim();

    }


    /* =====================================================
       SEND TO GOOGLE FORMS
       
       Uses a hidden iframe so the user:
       
       - stays on the website
       - does not see Google Forms
       - does not open a new tab
       
       No fetch().
       No page redirect.
    ===================================================== */

    function submitToGoogleForms(data) {

        return new Promise(function (resolve, reject) {

            try {

                console.log(
                    "Submitting to Google Forms:"
                );


                console.table({

                    name:
                        data.name,

                    email:
                        data.email,

                    phone:
                        data.phone,

                    address:
                        data.address,

                    occupation:
                        data.occupation,

                    firstTime:
                        data.firstTime,

                    message:
                        data.message

                });


                /* -----------------------------------------
                   CREATE HIDDEN IFRAME
                ----------------------------------------- */

                const iframe =
                    document.createElement(
                        "iframe"
                    );


                const iframeName =
                    "google-form-" +
                    Date.now();


                iframe.name =
                    iframeName;


                iframe.style.display =
                    "none";


                iframe.setAttribute(
                    "aria-hidden",
                    "true"
                );


                document.body.appendChild(
                    iframe
                );


                /* -----------------------------------------
                   CREATE TEMPORARY FORM
                ----------------------------------------- */

                const googleForm =
                    document.createElement(
                        "form"
                    );


                googleForm.method =
                    "POST";


                googleForm.action =
                    GOOGLE_FORM_URL;


                googleForm.target =
                    iframeName;


                googleForm.style.display =
                    "none";


                /* -----------------------------------------
                   ADD FIELD FUNCTION
                ----------------------------------------- */

                function addField(
                    name,
                    value
                ) {

                    const input =
                        document.createElement(
                            "input"
                        );


                    input.type =
                        "hidden";


                    input.name =
                        name;


                    input.value =
                        value ?? "";


                    googleForm.appendChild(
                        input
                    );

                }


                /* -----------------------------------------
                   ADD GOOGLE FORM FIELDS
                ----------------------------------------- */

                addField(
                    GOOGLE_FIELDS.name,
                    data.name
                );


                addField(
                    GOOGLE_FIELDS.email,
                    data.email
                );


                addField(
                    GOOGLE_FIELDS.phone,
                    data.phone
                );


                addField(
                    GOOGLE_FIELDS.address,
                    data.address
                );


                addField(
                    GOOGLE_FIELDS.occupation,
                    data.occupation
                );


                addField(
                    GOOGLE_FIELDS.firstTime,
                    data.firstTime
                );


                addField(
                    GOOGLE_FIELDS.message,
                    data.message
                );


                /* -----------------------------------------
                   ADD FORM TO DOCUMENT
                ----------------------------------------- */

                document.body.appendChild(
                    googleForm
                );


                /* -----------------------------------------
                   SUBMIT SILENTLY
                ----------------------------------------- */

                googleForm.submit();


                console.log(
                    "Google Forms POST sent."
                );


                /* -----------------------------------------
                   CLEAN UP
                ----------------------------------------- */

                setTimeout(
                    function () {

                        googleForm.remove();

                        iframe.remove();

                        resolve(true);

                    },
                    1500
                );


            } catch (error) {

                console.error(
                    "Google Forms submission error:",
                    error
                );


                reject(error);

            }

        });

    }


    /* =====================================================
       EMAILJS CONFIRMATION
    ===================================================== */

    async function sendConfirmationEmail(
        data
    ) {

        /* -----------------------------------------
           CHECK EMAILJS
        ----------------------------------------- */

        if (
            typeof emailjs === "undefined"
        ) {

            console.warn(
                "EmailJS is not loaded."
            );

            return false;

        }


        try {

            /* -----------------------------------------
               SEND EMAIL
            ----------------------------------------- */

            await emailjs.send(

                EMAILJS_SERVICE_ID,

                EMAILJS_TEMPLATE_ID,

                {

                    name:
                        data.name,

                    email:
                        data.email,

                    number:
                        data.phone,

                    address:
                        data.address,

                    occupation:
                        data.occupation,

                    first_time:
                        data.firstTime,

                    message:
                        data.message

                }

            );


            console.log(
                "EmailJS confirmation sent."
            );


            return true;


        } catch (error) {

            console.error(
                "EmailJS error:",
                error
            );


            return false;

        }

    }


    /* =====================================================
       FORM SUBMISSION
    ===================================================== */

    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            /* -----------------------------------------
               GET VALUES
            ----------------------------------------- */

            const name =
                nameInput
                    ? nameInput.value.trim()
                    : "";


            const email =
                emailInput
                    ? emailInput.value.trim()
                    : "";


            const phone =
                phoneInput
                    ? phoneInput.value.trim()
                    : "";


            const address =
                addressInput
                    ? addressInput.value.trim()
                    : "";


            const occupation =
                occupationInput
                    ? occupationInput.value.trim()
                    : "";


            const firstTime =
                getFirstTimeAnswer();


            const message =
                messageInput
                    ? messageInput.value.trim()
                    : "";


            /* =================================================
               VALIDATION
            ================================================= */

            if (!name) {

                showStatus(
                    "Please enter your full name.",
                    "error"
                );


                if (nameInput) {
                    nameInput.focus();
                }


                return;

            }


            if (!email) {

                showStatus(
                    "Please enter your email address.",
                    "error"
                );


                if (emailInput) {
                    emailInput.focus();
                }


                return;

            }


            if (!isValidEmail(email)) {

                showStatus(
                    "Please enter a valid email address.",
                    "error"
                );


                if (emailInput) {
                    emailInput.focus();
                }


                return;

            }


            if (!phone) {

                showStatus(
                    "Please enter your phone number.",
                    "error"
                );


                if (phoneInput) {
                    phoneInput.focus();
                }


                return;

            }


            if (!address) {

                showStatus(
                    "Please enter your city or address.",
                    "error"
                );


                if (addressInput) {
                    addressInput.focus();
                }


                return;

            }


            if (!occupation) {

                showStatus(
                    "Please enter your occupation.",
                    "error"
                );


                if (occupationInput) {
                    occupationInput.focus();
                }


                return;

            }


            if (!firstTime) {

                showStatus(
                    "Please tell us if this is your first She Blossoms conference.",
                    "error"
                );


                return;

            }


            /* =================================================
               PREPARE DATA
            ================================================= */

            const data = {

                name:
                    name,

                email:
                    email,

                phone:
                    phone,

                address:
                    address,

                occupation:
                    occupation,

                firstTime:
                    firstTime,

                message:
                    message

            };


            /* =================================================
               DEBUG
            ================================================= */

            console.log(
                "FINAL REGISTRATION DATA:"
            );


            console.table(
                data
            );


            /* =================================================
               BUTTON
            ================================================= */

            const originalText =
                submitButton.textContent;


            submitButton.disabled =
                true;


            submitButton.textContent =
                "Submitting...";


            showStatus(
                "Submitting your registration...",
                "loading"
            );


            try {


                /* =============================================
                   GOOGLE FORMS
                ============================================= */

                await submitToGoogleForms(
                    data
                );


                /* =============================================
                   EMAILJS
                ============================================= */

                await sendConfirmationEmail(
                    data
                );


                /* =============================================
                   SUCCESS STATUS
                ============================================= */

                showStatus(
                    "Registration successful! Thank you for registering for She Blossoms.",
                    "success"
                );


                /* =============================================
                   SUCCESS BUTTON
                ============================================= */

                submitButton.textContent =
                    "Registration successful ✓";


                /* =============================================
                   RESET FORM
                ============================================= */

                form.reset();


                /* =============================================
                   RETURN BUTTON TO ORIGINAL TEXT
                ============================================= */

                setTimeout(
                    function () {

                        submitButton.textContent =
                            originalText;


                        showStatus(
                            "",
                            ""
                        );


                    },
                    2500
                );


            } catch (error) {

                console.error(
                    "Registration error:",
                    error
                );


                showStatus(
                    "Something went wrong. Please try again.",
                    "error"
                );


                /* -----------------------------------------
                   RETURN BUTTON
                ----------------------------------------- */

                submitButton.textContent =
                    originalText;

            }


            /* =================================================
               RE-ENABLE BUTTON
            ================================================= */

            submitButton.disabled =
                false;

        }
    );

}