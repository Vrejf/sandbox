// agera-sync.0.0.2.js 23-06-10 18.44
// Data attributes: data-crm, data-redirect-utm, data-counter-update
function ageraSync(form) {
    const constants = {
        thisUrl: new URL(window.location.href),
        wfFormUrl: "https://webflow.com/api/v1/form/",
        counterUrl: "https://utils-api.vercel.app/api/count/",
        wfSiteId: document.querySelector("html").dataset.wfSite,
        //niceUtms: [],
        niceUtms: Array.from(new URLSearchParams(window.location.search), ([key, value]) => `${key}: ${value}`)

    }
    const utmSource = constants.thisUrl.searchParams.get("utm_source") || constants.thisUrl.searchParams.get("source");
    const submitButton = form.querySelector('input[type="submit"]') || undefined;
    const submitText = (submitButton && submitButton.value) || "";

    // const urlParams = new URLSearchParams(window.location.search);
    // urlParams.forEach((value, key) => {
    //     constants.niceUtms.push(`${key}: ${value}`);
    // });
    console.log("niceutms: ", constants.niceUtms)

    const options = {
        redirect: form.getAttribute("redirect") || false,
        endpoint: form.getAttribute("action") || undefined,
        addUtm: Boolean(form.dataset.redirectUtm) || true
    }
    function prepData(form) {
        const formData = new FormData(form);
        function an() {
            console.log("preppar data")
            return "hejs"
        }
    }
    function prepAnData(form) {
        const formData = new FormData(form);
        const test = prepData.an();
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
        formData.append("UTM", constants.niceUtms)
        const wfUrl = new URL(constants.wfSiteId, constants.wfFormUrl)
        const uriBody = new URLSearchParams();
        uriBody.append('name', form.getAttribute("name"));
        uriBody.append('source', window.location.href);
        uriBody.append("test", false)
        uriBody.append("dolphin", false)

        for (const pair of formData.entries()) {
            const fieldName = `fields[${pair[0]}]`;
            uriBody.append(fieldName, pair[1]);
        }

        const data = {
            url: wfUrl.href,
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: uriBody.toString(),
        };
        return data;
    }

    function prepMailChimpData(form) {
        const formData = new FormData(form);
        const uriBody = new URLSearchParams(formData);
        uriBody.append("UTM", constants.niceUtms);
        const data = {
            url: options.endpoint.replace('post?', 'post-json?') + '&c=?',
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            dataType: "jsonp",
            body: uriBody.toString()
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
                "UTM": constants.niceUtms,
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

            if (crm === "webflow") {
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