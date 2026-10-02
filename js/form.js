/* =========================================================
   SHE BLOSSOMS REGISTRATION FORM

   WEBSITE FORM
        ↓
   GOOGLE FORM
        ↓
   GOOGLE SHEET

   EMAILJS
        ↓
   REGISTRATION CONFIRMATION EMAIL

   Registration number is NOT used.
========================================================= */


/* =========================================================
   GOOGLE FORM RESPONSE URL
========================================================= */

const GOOGLE_FORM_URL =
    "https://docs.google.com/forms/d/e/1FAIpQLSdzzNdflrISzCkDZo5wIcj5fHE142Ah7UkimIvXhA-XGbzRgg/formResponse";


/* =========================================================
   EMAILJS SETTINGS
========================================================= */

const EMAILJS_SERVICE_ID =
    "service_o9kv3ir";

const EMAILJS_TEMPLATE_ID =
    "template_82ewad3";


/* =========================================================
   GET REGISTRATION FORM
========================================================= */

const form =
    document.getElementById("register-form");


/* =========================================================
   STOP IF FORM DOES NOT EXIST
========================================================= */

if (!form) {

    console.error(
        "Registration form #register-form was not found."
    );

} else {


    /* =====================================================
       GET FORM ELEMENTS
    ===================================================== */

    const status =
        form.querySelector(".form__status");

    const submitButton =
        form.querySelector('button[type="submit"]');


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

    const genderInput =
        document.getElementById("f-gender");

    const messageInput =
        document.getElementById("f-message");


    /* =====================================================
       EMAIL VALIDATION
    ===================================================== */

    function isValidEmail(email) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    }


    /* =====================================================
       SHOW STATUS MESSAGE
    ===================================================== */

    function showStatus(message, type = "") {

        if (!status) {
            return;
        }


        status.textContent = message;


        status.classList.remove(
            "success",
            "error",
            "loading"
        );


        if (type) {

            status.classList.add(type);

        }

    }


    /* =====================================================
       CLEAR STATUS
    ===================================================== */

    function clearStatus() {

        if (!status) {
            return;
        }


        status.textContent = "";


        status.classList.remove(
            "success",
            "error",
            "loading"
        );

    }


    /* =====================================================
       GET FIRST-TIME VALUE
    ===================================================== */

    function getFirstTimerValue() {

        const selected =
            form.querySelector(
                'input[name="first_time"]:checked'
            );


        if (!selected) {

            return "";

        }


        return selected.value;

    }


    /* =====================================================
       GET GENDER VALUE
    ===================================================== */

    function getGenderValue() {

        if (!genderInput) {

            return "";

        }


        return genderInput.value.trim();

    }


    /* =====================================================
       SUBMIT TO GOOGLE FORM
    ===================================================== */

    async function submitToGoogleForm(data) {


        const googleFormData =
            new FormData();


        /* -----------------------------------------------
           FULL NAME
        ------------------------------------------------ */

        googleFormData.append(
            "entry.6185216",
            data.name
        );


        /* -----------------------------------------------
           PHONE
        ------------------------------------------------ */

        googleFormData.append(
            "entry.1943039311",
            data.phone
        );


        /* -----------------------------------------------
           ADDRESS
        ------------------------------------------------ */

        googleFormData.append(
            "entry.491841401",
            data.address
        );


        /* -----------------------------------------------
           EMAIL
        ------------------------------------------------ */

        googleFormData.append(
            "entry.760245842",
            data.email
        );


        /* -----------------------------------------------
           OCCUPATION
        ------------------------------------------------ */

        googleFormData.append(
            "entry.451425346",
            data.occupation
        );


        /* -----------------------------------------------
           GENDER
        ------------------------------------------------ */

        googleFormData.append(
            "entry.1911301693",
            data.gender
        );


        /* -----------------------------------------------
           FIRST TIME ATTENDEE
        ------------------------------------------------ */

        googleFormData.append(
            "entry.802888224",
            data.first_time
        );


        /* -----------------------------------------------
           SEND TO GOOGLE FORMS
        ------------------------------------------------ */

        await fetch(
            GOOGLE_FORM_URL,
            {
                method: "POST",

                mode: "no-cors",

                body: googleFormData
            }
        );


        return true;

    }


    /* =====================================================
       SEND CONFIRMATION EMAIL WITH EMAILJS
    ===================================================== */

    async function sendConfirmationEmail(data) {


        /* -----------------------------------------------
           CHECK EMAILJS
        ------------------------------------------------ */

        if (
            typeof emailjs === "undefined"
        ) {

            console.warn(
                "EmailJS is not loaded. Confirmation email skipped."
            );

            return false;

        }


        try {


            /* -------------------------------------------
               SEND EMAIL
            ------------------------------------------- */

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

                    gender:
                        data.gender,

                    first_time:
                        data.first_time,

                    message:
                        data.message

                }

            );


            return true;


        } catch (error) {


            console.error(
                "EmailJS confirmation failed:",
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


            /* -------------------------------------------
               STOP NORMAL FORM SUBMISSION
            ------------------------------------------- */

            event.preventDefault();


            /* -------------------------------------------
               CLEAR OLD STATUS
            ------------------------------------------- */

            clearStatus();


            /* -------------------------------------------
               GET FORM VALUES
            ------------------------------------------- */

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


            const gender =
                getGenderValue();


            const firstTime =
                getFirstTimerValue();


            const message =
                messageInput
                    ? messageInput.value.trim()
                    : "";


            /* ===========================================
               VALIDATE NAME
            =========================================== */

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


            /* ===========================================
               VALIDATE EMAIL
            =========================================== */

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


            /* ===========================================
               VALIDATE EMAIL FORMAT
            =========================================== */

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


            /* ===========================================
               VALIDATE PHONE
            =========================================== */

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


            /* ===========================================
               VALIDATE GENDER
            =========================================== */

            if (!gender) {

                showStatus(
                    "Please select your gender.",
                    "error"
                );


                if (genderInput) {

                    genderInput.focus();

                }


                return;

            }


            /* ===========================================
               VALIDATE FIRST-TIME QUESTION
            =========================================== */

            if (!firstTime) {

                showStatus(
                    "Please tell us if this is your first She Blossoms conference.",
                    "error"
                );


                return;

            }


            /* ===========================================
               PREPARE DATA
            =========================================== */

            const formData = {

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

                gender:
                    gender,

                first_time:
                    firstTime,

                message:
                    message

            };


            /* ===========================================
               DISABLE SUBMIT BUTTON
            =========================================== */

            if (submitButton) {

                submitButton.disabled = true;


                submitButton.dataset.originalText =
                    submitButton.textContent;


                submitButton.textContent =
                    "Submitting...";

            }


            /* ===========================================
               SHOW LOADING MESSAGE
            =========================================== */

            showStatus(
                "Submitting your registration...",
                "loading"
            );


            try {


                /* =======================================
                   STEP 1
                   SEND TO GOOGLE FORM
                ======================================= */

                await submitToGoogleForm(
                    formData
                );


                /* =======================================
                   STEP 2
                   SEND CONFIRMATION EMAIL
                ======================================= */

                await sendConfirmationEmail(
                    formData
                );


                /* =======================================
                   SUCCESS MESSAGE
                ======================================= */

                showStatus(
                    "Registration successful! Thank you for registering for She Blossoms.",
                    "success"
                );


                /* =======================================
                   SUCCESS ALERT
                ======================================= */

                alert(
                    "Registration successful!\n\n" +
                    "Thank you for registering for She Blossoms."
                );


                /* =======================================
                   RESET FORM
                ======================================= */

                form.reset();


            } catch (error) {


                /* =======================================
                   ERROR
                ======================================= */

                console.error(
                    "Registration error:",
                    error
                );


                showStatus(
                    "Something went wrong while submitting your registration. Please try again.",
                    "error"
                );


            } finally {


                /* =======================================
                   ENABLE BUTTON
                ======================================= */

                if (submitButton) {

                    submitButton.disabled =
                        false;


                    submitButton.textContent =
                        submitButton.dataset.originalText ||
                        "Reserve my seat";

                }

            }

        }
    );

}