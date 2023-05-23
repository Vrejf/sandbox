//an-bridge.0.3.js

function anSubmit(form) {
    const thisUrl = new URL(window.location.href);
    const utmSource = thisUrl.searchParams.get("utm_source") || thisUrl.searchParams.get("source");
    const options = {
        preventDefault: JSON.parse(form.dataset.anPreventdefault.toLowerCase()) ?? true,
        redirect: form.getAttribute("redirect") ?? false,
        endpoint: form.getAttribute("action") ?? undefined
    }

    function prepAnData(form, options) {
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
                    "action_network:referrer_data": {
                        source: utmSource ? utmSource.toString() : "",
                        website: thisUrl.hostname + thisUrl.pathname
                    }
                }),
        };
        return data;
    };


    function prepWfData(form) {
        console.log("prepping wf data")
        const formData = new FormData(form);
        const searchParams = new URLSearchParams();
        const wfUrl = new URL(document.querySelector("html").dataset.wfSite, 'https://webflow.com/api/v1/form/')
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


    function prepCounterData(counterName) {
        const data = {
            url: new URL(counterName, "https://utils-api.vercel.app/api/count/").href,
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: "default",
                site: document.querySelector("html").dataset.wfSite
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
        }

    }

    function redirect() {
        if (options.redirect) {
            const utmParams = new URLSearchParams(window.location.search).toString();
            const updatedRedirectUrl = options.redirect + (options.redirect.includes('?') ? '&' : '?') + utmParams.toString();
            window.location.href = updatedRedirectUrl;
        } else {
            console.log("No redirect")
        };
    };

    async function handleFetchRequests(requestList, form) {
        try {
            const promises = requestList.map(async (request) => {
                const response = await fetch(request.url, {
                    method: request.method,
                    headers: request.headers,
                    body: request.body
                });

                if (!response.ok) {
                    formStatus(form, false)
                    throw new Error('Response error');
                }
                return response.json();
            });

            const responses = await Promise.all(promises);
            formStatus(form, true)
            redirect();

            // All responses are OK
        } catch (error) {
            formStatus(form, false)
            console.error('An error occurred:', error);
        }
    }

    async function pressSubmit(form) {
        form.addEventListener("submit", async function (event) {
            event.preventDefault();
            event.stopPropagation();

            console.log("clicked submit")

            // list with all request DATA:
            let requestList = []

            const counterUpdate = form.dataset.counterUpdate;
            if (counterUpdate) {
                requestList.push(prepCounterData(counterUpdate));
            }
            if (options.endpoint) {
                requestList.push(prepAnData(form, options));
            }
            if (!options.preventDefault) { // prevent default is False
                requestList.push(prepWfData(form));
            }
            if (requestList.length > 0) {
                await handleFetchRequests(requestList, form);
            }
        });
    };
    return {
        pressSubmit,
    };
};


// Usage
document.addEventListener('DOMContentLoaded', function () {
    const anForms = document.querySelectorAll("[data-an-bridge='true']");
    for (let form of anForms) {
        const submitter = anSubmit(form);
        submitter.pressSubmit(form);
    }
});