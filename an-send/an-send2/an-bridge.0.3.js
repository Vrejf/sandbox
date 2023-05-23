//an-bridge.0.3.js

function anSubmit(form) {
    console.log("AN Submit function");
    const thisUrl = new URL(window.location.href);
    const utmSource = thisUrl.searchParams.get("utm_source") || thisUrl.searchParams.get("source");

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
        searchParams.append('name', form.getAttribute("name"));
        searchParams.append('source', window.location.href);
        searchParams.append("test", false)
        searchParams.append("dolphin", false)

        const data = {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body:
                JSON.stringify({
                }),

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
            //form.style.display = 'none'; // Hide the form
            doneElement.style.display = 'block'; // Show the success element
            failElement.style.display = 'none'; // Hide the failure element
            console.log("display done");
        } else {

            //form.style.display = 'none'; // Hide the form
            doneElement.style.display = 'none';
            failElement.style.display = 'block';
            console.log("display fail");
        }

    }

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

            // All responses are OK
        } catch (error) {
            formStatus(form, false)
            console.error('An error occurred:', error);
        }
    }

    async function pressSubmit(form) {
        console.log("Update counter: ", form.dataset.counterUpdate)
        const options = {
            preventDefault: form.getAttribute("data-an-preventdefault") || true,
            redirect: form.getAttribute("redirect") || undefined,
            endpoint: form.getAttribute("action") || undefined
        }
        console.log("options: ", options)
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
    const submitter = anSubmit();
    for (let form of anForms) {
        console.log("AN form: ", form.getAttribute("name"))
        submitter.pressSubmit(form);
    }
});