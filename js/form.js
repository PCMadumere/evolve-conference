/* =========================================================
   SHE BLOSSOMS — EVOLVE
   REGISTRATION FORM
   GOOGLE SHEETS + EMAILJS
========================================================= */


/* =========================================================
   GOOGLE APPS SCRIPT URL
========================================================= */

const GOOGLE_APPS_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbyQbISeN4QYL4LQYPkxbAT0Fiw5OZpa3nrhdeCM-nn5-84DpRf-JWB3uAuBdx-h9B9tCA/exec";


/* =========================================================
   GET REGISTRATION FORM
========================================================= */

const registerForm =
    document.getElementById("register-form");


/* =========================================================
   START REGISTRATION SYSTEM
========================================================= */

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            /* =================================================
               SUBMIT BUTTON
            ================================================= */

            const button =
                registerForm.querySelector(
                    'button[type="submit"]'
                );


            if (!button) {

                console.error(
                    "Registration submit button was not found."
                );

                return;
            }


            /*
             * Prevent double submission.
             */

            if (button.disabled) {
                return;
            }


            /* =================================================
               FORM FIELDS
            ================================================= */

            const nameField =
                document.getElementById("f-name");

            const emailField =
                document.getElementById("f-email");

            const phoneField =
                document.getElementById("f-phone");

            const addressField =
                document.getElementById("f-address");

            const occupationField =
                document.getElementById("f-occupation");

            const messageField =
                document.getElementById("f-message");


            /* =================================================
               STATUS MESSAGE
            ================================================= */

            const status =
                registerForm.querySelector(
                    ".form__status"
                );


            /* =================================================
               FIRST TIME
            ================================================= */

            const firstTime =
                registerForm.querySelector(
                    'input[name="first_time"]:checked'
                );


            /* =================================================
               CHECK REQUIRED ELEMENTS
            ================================================= */

            if (
                !nameField ||
                !emailField ||
                !phoneField ||
                !addressField ||
                !occupationField ||
                !messageField
            ) {

                console.error(
                    "One or more registration fields are missing."
                );


                if (status) {

                    status.textContent =
                        "The registration form is not configured correctly.";

                    status.dataset.state =
                        "error";
                }

                return;
            }


            /* =================================================
               GET FORM VALUES
            ================================================= */

            const name =
                String(
                    nameField.value || ""
                ).trim();


            const email =
                String(
                    emailField.value || ""
                ).trim();


            /*
             * IMPORTANT
             *
             * This is the phone number.
             *
             * EmailJS uses:
             *
             * {{number}}
             */

            const number =
                String(
                    phoneField.value || ""
                ).trim();


            const address =
                String(
                    addressField.value || ""
                ).trim();


            const occupation =
                String(
                    occupationField.value || ""
                ).trim();


            const message =
                String(
                    messageField.value || ""
                ).trim();


            /* =================================================
               VALIDATE NAME
            ================================================= */

            if (!name) {

                if (status) {

                    status.textContent =
                        "Please enter your full name.";

                    status.dataset.state =
                        "error";
                }

                nameField.focus();

                return;
            }


            /* =================================================
               VALIDATE EMAIL
            ================================================= */

            if (!email) {

                if (status) {

                    status.textContent =
                        "Please enter your email address.";

                    status.dataset.state =
                        "error";
                }

                emailField.focus();

                return;
            }


            /* =================================================
               VALIDATE PHONE
            ================================================= */

            if (!number) {

                if (status) {

                    status.textContent =
                        "Please enter your phone number.";

                    status.dataset.state =
                        "error";
                }

                phoneField.focus();

                return;
            }


            /* =================================================
               VALIDATE FIRST TIME
            ================================================= */

            if (!firstTime) {

                if (status) {

                    status.textContent =
                        "Please select Yes or No for the first conference question.";

                    status.dataset.state =
                        "error";
                }

                return;
            }


            /* =================================================
               VALIDATE EMAIL FORMAT
            ================================================= */

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (!emailPattern.test(email)) {

                if (status) {

                    status.textContent =
                        "Please enter a valid email address.";

                    status.dataset.state =
                        "error";
                }

                emailField.focus();

                return;
            }


            /* =================================================
               DATA TO GOOGLE APPS SCRIPT
            ================================================= */

            const params = {

                name: name,

                email: email,

                /*
                 * Main phone value
                 */
                phone: number,

                /*
                 * Extra phone aliases
                 */
                number: number,

                phone_number: number,

                telephone: number,

                address: address,

                occupation: occupation,

                first_time: firstTime.value,

                message: message

            };


            /* =================================================
               DEBUG
            ================================================= */

            console.log(
                "========== REGISTRATION =========="
            );

            console.log(
                "Name:",
                name
            );

            console.log(
                "Email:",
                email
            );

            console.log(
                "Phone:",
                number
            );

            console.log(
                "Address:",
                address
            );

            console.log(
                "Occupation:",
                occupation
            );

            console.log(
                "First Time:",
                firstTime.value
            );

            console.log(
                "Message:",
                message
            );

            console.log(
                "Google payload:",
                params
            );

            console.log(
                "=================================="
            );


            /* =================================================
               SAVE ORIGINAL BUTTON TEXT
            ================================================= */

            button.dataset.originalText =
                button.textContent;


            /* =================================================
               DISABLE BUTTON
            ================================================= */

            button.disabled =
                true;


            button.textContent =
                "Registering...";


            /* =================================================
               STATUS
            ================================================= */

            if (status) {

                status.textContent =
                    "Submitting your registration...";

                status.dataset.state =
                    "loading";
            }


            /* =================================================
               SEND TO GOOGLE APPS SCRIPT
            ================================================= */

            try {

                console.log(
                    "Sending registration to Google Sheets..."
                );


                const googleResponse =
                    await fetch(
                        GOOGLE_APPS_SCRIPT_URL,
                        {
                            method: "POST",

                            /*
                             * IMPORTANT:
                             *
                             * Do NOT add:
                             *
                             * headers: {
                             *     "Content-Type":
                             *         "application/json"
                             * }
                             *
                             * because that can trigger a
                             * CORS preflight with Apps Script.
                             */

                            body:
                                JSON.stringify(params)
                        }
                    );


                /* =================================================
                   READ GOOGLE RESPONSE
                ================================================= */

                const responseText =
                    await googleResponse.text();


                console.log(
                    "Google Apps Script response:",
                    responseText
                );


                /* =================================================
                   PARSE RESPONSE
                ================================================= */

                let result;


                try {

                    result =
                        JSON.parse(
                            responseText
                        );

                } catch (parseError) {

                    console.error(
                        "Google response could not be parsed:",
                        responseText
                    );

                    throw new Error(
                        "Google Sheets returned an invalid response."
                    );
                }


                /* =================================================
                   DUPLICATE EMAIL
                ================================================= */

                if (result.duplicate) {

                    if (status) {

                        status.textContent =
                            "This email address has already been registered.";

                        status.dataset.state =
                            "error";
                    }


                    alert(
                        "This email address has already been registered."
                    );


                    /*
                     * IMPORTANT:
                     *
                     * Restore the button before returning.
                     */

                    button.disabled =
                        false;


                    button.textContent =
                        button.dataset.originalText ||
                        "Reserve my seat";


                    return;
                }


                /* =================================================
                   GOOGLE FAILURE
                ================================================= */

                if (!result.success) {

                    const errorMessage =
                        result.message ||
                        "Registration could not be completed.";


                    console.error(
                        "Google Apps Script error:",
                        errorMessage
                    );


                    if (status) {

                        status.textContent =
                            errorMessage;

                        status.dataset.state =
                            "error";
                    }


                    alert(
                        "Registration could not be completed.\n\n" +
                        errorMessage
                    );


                    /*
                     * IMPORTANT:
                     *
                     * Restore button.
                     */

                    button.disabled =
                        false;


                    button.textContent =
                        button.dataset.originalText ||
                        "Reserve my seat";


                    return;
                }


                /* =================================================
                   GET REGISTRATION NUMBER
                ================================================= */

                const registrationNumber =
                    String(
                        result.registrationNumber ||
                        ""
                    ).trim();


                console.log(
                    "Registration Number:",
                    registrationNumber
                );


                /* =================================================
                   MAKE SURE REGISTRATION NUMBER EXISTS
                ================================================= */

                if (!registrationNumber) {

                    console.error(
                        "Google Apps Script did not return a registration number.",
                        result
                    );


                    if (status) {

                        status.textContent =
                            "Registration was received, but no registration number was returned.";

                        status.dataset.state =
                            "error";
                    }


                    alert(
                        "Your registration was received, but the registration number was not returned.\n\n" +
                        "Please contact the conference team."
                    );


                    /*
                     * Restore button.
                     */

                    button.disabled =
                        false;


                    button.textContent =
                        button.dataset.originalText ||
                        "Reserve my seat";


                    return;
                }


                /* =================================================
                   GOOGLE SHEETS SUCCESS
                ================================================= */

                console.log(
                    "Google Sheets registration successful."
                );


                if (status) {

                    status.textContent =
                        "Registration submitted successfully!";

                    status.dataset.state =
                        "success";
                }


                /* =================================================
                   EMAILJS DATA
                =================================================

                   THIS MUST MATCH YOUR EMAILJS TEMPLATE:

                   {{name}}
                   {{registration_number}}
                   {{email}}
                   {{number}}
                   {{address}}
                   {{occupation}}
                   {{gender}}
                   {{first_time}}
                   {{message}}

                ================================================= */

                const emailData = {

                    /*
                     * {{name}}
                     */
                    name: name,


                    /*
                     * {{email}}
                     */
                    email: email,


                    /*
                     * {{number}}
                     *
                     * This is the important correction.
                     */
                    number: number,


                    /*
                     * Extra aliases.
                     * They do not hurt anything.
                     */
                    phone: number,

                    phone_number: number,

                    telephone: number,


                    /*
                     * {{address}}
                     */
                    address: address,


                    /*
                     * {{occupation}}
                     */
                    occupation: occupation,


                    /*
                     * {{first_time}}
                     */
                    first_time: firstTime.value,


                    /*
                     * {{message}}
                     */
                    message: message,


                    /*
                     * {{registration_number}}
                     */
                    registration_number:
                        registrationNumber

                };


                console.log(
                    "EmailJS data:",
                    emailData
                );


                /* =================================================
                   SEND EMAILJS
                ================================================= */

                if (
                    typeof emailjs !== "undefined" &&
                    typeof emailjs.send === "function"
                ) {

                    console.log(
                        "Sending confirmation through EmailJS..."
                    );


                    /*
                     * Send EmailJS in the background.
                     *
                     * We do NOT make the visitor wait for it.
                     */

                    emailjs.send(
                        "service_o9kv3ir",
                        "template_82ewad3",
                        emailData
                    )
                    .then(
                        function (emailResult) {

                            console.log(
                                "EmailJS SUCCESS:",
                                emailResult
                            );

                        }
                    )
                    .catch(
                        function (emailError) {

                            console.error(
                                "EmailJS FAILED:",
                                emailError
                            );

                        }
                    );

                } else {

                    console.error(
                        "EmailJS is not loaded."
                    );
                }


                /* =================================================
                   SHOW SUCCESS MESSAGE
                ================================================= */

                alert(
                    "Registration submitted successfully!\n\n" +
                    "Registration Number: " +
                    registrationNumber
                );


                /* =================================================
                   RESET FORM
                ================================================= */

                registerForm.reset();


                /* =================================================
                   RESTORE BUTTON
                ================================================= */

                button.disabled =
                    false;


                button.textContent =
                    button.dataset.originalText ||
                    "Reserve my seat";


            } catch (error) {

                /* =================================================
                   REGISTRATION ERROR
                ================================================= */

                console.error(
                    "REGISTRATION ERROR:",
                    error
                );


                if (status) {

                    status.textContent =
                        "Something went wrong. Please try again.";

                    status.dataset.state =
                        "error";
                }


                alert(
                    "Something went wrong while submitting your registration.\n\n" +
                    "Please check your internet connection and try again."
                );


                /* =================================================
                   ALWAYS RESTORE BUTTON
                ================================================= */

                button.disabled =
                    false;


                button.textContent =
                    button.dataset.originalText ||
                    "Reserve my seat";

            }

        }
    );

}