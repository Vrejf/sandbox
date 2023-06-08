// agera-sync.0.0.1.js
// Data attributes: data-crm, data-redirect-utm, data-counter-update
function ageraSync(form) {
    const constants = {
        thisUrl: new URL(window.location.href),
        wfFormUrl: "https://webflow.com/api/v1/form/",
        counterUrl: "https://utils-api.vercel.app/api/count/",
        wfSiteId: document.querySelector("html").dataset.wfSite
    }
    const utmSource = constants.thisUrl.searchParams.get("utm_source") || constants.thisUrl.searchParams.get("source");
    const submitButton = form.querySelector('input[type="submit"]') || undefined;
    const submitText = (submitButton && submitButton.value) || "";

    const options = {
        redirect: form.getAttribute("redirect") || false,
        endpoint: form.getAttribute("action") || undefined,
        addUtm: Boolean(form.dataset.redirectUtm) || true
    }

    function prepAnData(form) {
        const formData = new FormData(form);

        const data = {
            url: options.endpoint,
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body:
                JSON.stringify({
                    person: {
                        given_name: formData.get("first"),
                        family_name: formData.get("last"),
                        email_addresses: [
                            {
                                address: formData.get("email_address")
                            }
                        ],
                        phone_numbers: [
                            {
                                number: formData.get("phone_number") || ""

                            }
                        ],
                        postal_addresses: [
                            {
                                postal_code: formData.get("postal_code") || "",
                                address_lines: formData.get("address") || "",
                                region: formData.get("region") || "",
                                country: formData.get("country") || ""
                            }
                        ]
                    },
                    "add_tags": [
                        formData.getAll("tags") || ""
                    ],
                    "action_network:referrer_data": {
                        source: utmSource ? utmSource.toString() : "",
                        website: constants.thisUrl.hostname + constants.thisUrl.pathname
                    }
                }),
        };
        return data;
    };


    function prepWfData(form) {
        const formData = new FormData(form);
        const searchParams = new URLSearchParams();
        const wfUrl = new URL(constants.wfSiteId, constants.wfFormUrl)
        searchParams.append('name', form.getAttribute("name"));
        searchParams.append('source', window.location.href);
        searchParams.append("test", false)
        searchParams.append("dolphin", false)

        for (const pair of formData.entries()) {
            const fieldName = `fields[${pair[0]}]`;
            searchParams.append(fieldName, pair[1]);
        }

        const data = {
            url: wfUrl.href,
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: searchParams.toString(),
        };
        return data;
    }

    function prepMailChimpData(form) {
        const formData = new FormData(form);
        const uriEncodedBody = new URLSearchParams(formData);
        const data = {
            url: options.endpoint.replace('post?', 'post-json?') + '&c=?',
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            dataType: "jsonp",
            //body: JSON.stringify(Object.fromEntries(formData)),
            body: uriEncodedBody.toString()
        };
        return data;
    }

    function prepZapierData(form) {
        const formData = new FormData(form);
        const data = {
            url: new URL(options.endpoint).toString(),
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                [form.getAttribute("name")]: Object.fromEntries(formData),
                "source": constants.thisUrl.toString(),
                "time": new Date().toISOString(),
            })
        };
        return data;
    }


    function prepCounterData(counterName) {
        const data = {
            url: new URL(counterName, constants.counterUrl).toString(),
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: "default",
                site: constants.wfSiteId
            })
        }
        return data;
    };

    function formStatus(form, ok) {
        const parent = form.parentNode;
        const doneElement = parent.querySelector(".w-form-done");
        const failElement = parent.querySelector(".w-form-fail");

        if (ok) {
            doneElement.style.display = 'block'; // Show the success element
            failElement.style.display = 'none'; // Hide the failure element
        } else {
            doneElement.style.display = 'none';
            failElement.style.display = 'block';
            submitButton.value = submitText;
        }

    }

    function redirect() {
        if (options.redirect) {
            console.log("Redirecting...")
            if (options.addUtm) {

                const redirectUrl = new URL(options.redirect, constants.thisUrl);
                const utmParams = new URLSearchParams(window.location.search);

                redirectUrl.searchParams.forEach((value, param) => {
                    if (!utmParams.has(param)) {
                        utmParams.set(param, value);
                    }
                });

                const updatedRedirectUrl = redirectUrl.origin + redirectUrl.pathname + (utmParams.toString() ? '?' + utmParams.toString() : '');

                window.location.href = updatedRedirectUrl;
            } else {
                window.location.href = options.redirect;
            }
        } else {
            console.log("No redirect defined")
        };
    };
    async function ajaxCall(request) {
        try {
            const result = await $.ajax({
                url: request.url,
                type: request.method,
                headers: request.headers,
                data: request.body,
                dataType: request.dataType,
            });

            return result;
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    };
    async function handleFetchRequests(requestList, form) {
        try {
            const promises = requestList.map(async (request) => {
                if (!request.dataType) {
                    const response = await fetch(request.url, {
                        method: request.method,
                        headers: request.headers,
                        body: request.body,
                    });

                    if (!response.ok) {
                        formStatus(form, false)
                        throw new Error('Response error');
                    }
                    return response.json();
                }
                if (request.dataType === "jsonp") {
                    return await ajaxCall(request)
                }
            });

            const responses = await Promise.all(promises);

            // All responses are OK
            formStatus(form, true)
            redirect();

        } catch (error) {
            formStatus(form, false)
            console.error('An error occurred:', error);
        }
    }


    async function handleForm(form) {
        const crm = form.dataset.crm.toLowerCase();

        form.addEventListener("submit", async function (event) {
            event.preventDefault();
            event.stopPropagation();
            submitButton.value = submitButton.dataset.wait || "Sending...";

            // list with all request DATA:
            let requestList = []

            const counterUpdate = form.dataset.counterUpdate;

            if (crm === "webflow" && options.endpoint) {
                requestList.push(prepWfData(form));
            }
            if (crm === "actionnetwork" && options.endpoint) {
                requestList.push(prepAnData(form));
            }
            if (crm === "mailchimp" && options.endpoint) {
                requestList.push(prepMailChimpData(form));
            }
            if (crm === "zapier" && options.endpoint) {
                requestList.push(prepZapierData(form));
            }
            if (counterUpdate && counterUpdate !== "default") {
                requestList.push(prepCounterData(counterUpdate));
            }
            if (requestList.length > 0) {
                await handleFetchRequests(requestList, form);
            }
            if (crm === "") {
                console.log("no crm defined")
            }
        });
    };
    return {
        handleForm,
    };
};


// Usage
document.addEventListener('DOMContentLoaded', function () {
    const crmForms = document.querySelectorAll("[data-crm]");
    for (let form of crmForms) {
        const submitter = ageraSync(form);
        submitter.handleForm(form);
    }
});