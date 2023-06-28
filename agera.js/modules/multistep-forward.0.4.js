// multistep-forward.0.4.js 23-06-28 14.00
// data attributes: data-crm, data-load-petition="true"
{
    function receive(form, entries) {
        // create hidden fields
        entries.forEach(([key, value]) => {
            const sanitizedValue = document.createTextNode(value).textContent;
            const addHtml = `<input type="hidden" id="${key}" name="${key}" value="${sanitizedValue}">`;
            form.insertAdjacentHTML("afterbegin", addHtml);
        });

        // Add UTM to multiple submits, for survey forms
        const utmParams = new URLSearchParams(window.location.search).toString();
        const submitElements = form.querySelectorAll("input[data-redirect]");

        submitElements.forEach((submitElement) => {
            const redirectUrl = submitElement.getAttribute("data-redirect");
            const updatedRedirectUrl =
                redirectUrl +
                (redirectUrl.includes("?") ? "&" : "?") +
                utmParams.toString();
            submitElement.setAttribute("data-redirect", updatedRedirectUrl);
        });
    }

    function send(form) {
        const urlParams = new URLSearchParams(window.location.search);

        const utmArray = [];
        urlParams.forEach((value, key) => {
            utmArray.push(`${key}: ${value}`);
        });

        localStorage.removeItem("multistepforward");
        const existingRedirectUrl = form.getAttribute("redirect");
        const updatedRedirectUrl =
            existingRedirectUrl +
            (existingRedirectUrl.includes("?") ? "&" : "?") +
            urlParams.toString();
        form.setAttribute("redirect", updatedRedirectUrl);
        form.setAttribute("data-redirect", updatedRedirectUrl);

        form.addEventListener("change", (e) => {
            saveInputs(form);
        });
        form.addEventListener("input", (e) => {
            saveInputs(form);
        });

        // Save inputs to localStorage
        function saveInputs(form) {
            let formData = new FormData(form);

            const utmString = utmArray.join(", ");
            formData.set("utm", utmString);

            localStorage.setItem(
                "multistepforward",
                JSON.stringify(Object.fromEntries(formData))
            );
        }
    }

    // when DOM is loaded:
    document.addEventListener("DOMContentLoaded", function () {
        // const forwardForms = document.querySelectorAll('[data-form-forward="true"]');
        const forwardForms = document.querySelectorAll("[data-crm]");
        const loadForms = document.querySelectorAll('[data-load-petition="true"]');

        // Forward and save to localStorage:
        if (forwardForms.length > 0) {
            forwardForms.forEach(function (form) {
                send(form);
            });
        }

        // Load from localStorage:
        if (loadForms.length > 0 && localStorage !== null) {
            loadForms.forEach(function (form) {
                const savedInputs = JSON.parse(localStorage.getItem("multistepforward"));

                receive(form, Object.entries(savedInputs));
            });
            localStorage.removeItem("multistepforward");
        }
    });
}
