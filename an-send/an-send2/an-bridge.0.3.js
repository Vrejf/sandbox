//an-bridge.0.2.js
const queryString = window.location.search;
const thisUrl = new URL(window.location.href);
const urlParams = new URLSearchParams(queryString);
const utmSource = urlParams.get("utm_source") || urlParams.get("source");

const anForms = document.querySelectorAll("[data-an-bridge='true']");


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

anForms.forEach(function (form) {
    console.log("Form to AN: " + form.getAttribute("id"));
    const preventdef = form.getAttribute("data-an-preventdefault")
    console.log("Prevent default: ", preventdef)

    form.addEventListener("submit", async function (event) {
        if (form.getAttribute("data-an-preventdefault") === "true") {
            event.preventDefault();
        }
        const url = form.getAttribute("data-an-url");

        const formData = new FormData(form);
        const headers = {
            "Content-Type": "application/json"
        };

        const data = {
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
        };


        const postDone = await postData(url, headers, data, form, event);

        if (form.getAttribute("data-an-preventdefault") === "true") {
            console.log("Redirect ->", form.getAttribute("redirect"));
            window.location.href = form.getAttribute("redirect");
            return false;

        } else {
            console.log("AN ok, return...");
            return true;
            form.submit();
        }


    });
});
