//an-bridge.0.3.js
async function postData(url, headers, body, form, event) {
    await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body)
    })
        .then(response => response.json())
        .then(data => {
            console.log("statuscode: ", data.status)
        })
        .catch(error => {
            console.error(error);
        });
}

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
        console.log("prepAnData: ", data)
        console.log("andata name: ", data.body.person.given_name)
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
        console.log("prepCounterData: ", data)
        return data;
    };

    async function fetcher(request) {
        console.log("fetching...")
        try {
            const response = await fetch(
                request.url, {
                method: request.method,
                headers: request.headers,
                body: request.body
            })
        }
        catch (error) {
            console.error(error);
        }
    };
    function showMessage(status, form) {
        const parent = form.parent // change this
        const ok = parent.select ok // change this
        const fail = parent.select fail // change
        if (!status){
            fail.block // change
            ok.hide
        } else {
            ok.block
            fail.hidee
        }
    };


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
            console.log("requestList: ", requestList)
            // fetch all request
            // update counter
            //  Post to webflow CSV
            //  if post to action network succeded whow success message, else fail
            if (requestList.length > 0){
                // fetches = send all requests...
                // if (fetches) {
                    show success
                    if (redirect) {
                        redirect to page
                    }
                } else {
                    show fail
                }
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