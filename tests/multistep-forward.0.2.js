// multistep-forward.0.2.js
const forwardForms = document.querySelectorAll('[forward="true"]');
const loadForms = document.querySelectorAll('[load="true"]');

// Forward and save to localStorage:
if (forwardForms.length > 0) {
    forwardForms.forEach(function (form) {
        console.log("Forward this form:" + form.getAttribute("id"));
        send(form)
    });
};

// Load from localStorage:
if (loadForms.length > 0 && localStorage !== null) {
    loadForms.forEach(function (form) {
        console.log("Load data for this form: " + form.getAttribute("id"));
        receive(form, Object.entries(localStorage));
    })
    localStorage.clear();
};

function receive(form, keys) {
    // create hidden fields
    keys.forEach(([key, value]) => {

        // console.log(`key: ${key}, value: ${value}`);
        const sanitizedValue = document.createTextNode(value).textContent;
        const addHtml = `<input type="hidden" id="${key}" name="${key}" value="${sanitizedValue}">`;
        form.insertAdjacentHTML("afterbegin", addHtml);

    });

    // Update urls
    const utmParams = new URLSearchParams(window.location.search).toString();
    const existingRedirectUrl = form.getAttribute('redirect');
    if (existingRedirectUrl) {
        const updatedRedirectUrl = existingRedirectUrl + (existingRedirectUrl.includes('?') ? '&' : '?') + utmParams.toString();
        form.setAttribute('redirect', updatedRedirectUrl);
        form.setAttribute('data-redirect', updatedRedirectUrl);
    };

    // Forward UTM to multiple submits
    const submitElements = form.querySelectorAll('input[data-redirect]');

    submitElements.forEach((submitElement) => {
        const redirectUrl = submitElement.getAttribute('data-redirect');
        const updatedRedirectUrl = redirectUrl + (redirectUrl.includes('?') ? '&' : '?') + utmParams.toString();
        submitElement.setAttribute('data-redirect', updatedRedirectUrl);
    });

};

function send(form) {

    localStorage.clear();
    const utmParams = new URLSearchParams(window.location.search);
    const existingRedirectUrl = form.getAttribute('redirect');
    const updatedRedirectUrl = existingRedirectUrl + (existingRedirectUrl.includes('?') ? '&' : '?') + utmParams.toString();
    form.setAttribute('redirect', updatedRedirectUrl);
    form.setAttribute('data-redirect', updatedRedirectUrl);

    form.addEventListener("change", e => { saveInputs() });
    form.addEventListener("input", e => { saveInputs() })

    // creates a hidden input with the utm tags
    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.name = 'utm';
    hiddenInput.value = utmParams.toString() || 'null';
    form.appendChild(hiddenInput);

    // Save inputs to localStorage
    function saveInputs() {
        const inputs = form.querySelectorAll('form input, form select, form textarea');
        localStorage.setItem("utm", utmParams.toString());
        inputs.forEach(input => {
            if (input.type !== "submit" && input.name) {
                let value = "";
                if (input.type === "checkbox" || input.type === "radio") {
                    if (input.checked) {
                        value = input.value;
                    } else {
                        if (input.type === "checkbox") {
                            value = "false";
                        }
                    }
                } else {
                    value = input.value;
                }

                if (localStorage.getItem(input.name) !== value && value !== "") {
                    localStorage.setItem(input.name, value);

                }

            }
        });

    };
};
