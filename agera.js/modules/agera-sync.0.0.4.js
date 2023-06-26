// agera-sync.0.0.4.js 23-06-26 12:30
// Data attributes: data-crm, data-redirect-utm, data-counter-update,
// data-action-id, data-sign-method

function ageraSync(form) {
    const params = {
        thisUrl: new URL(window.location.href),
        wfSiteId: document.querySelector("html").dataset.wfSite,
        wfUrl: new URL(
            document.querySelector("html").dataset.wfSite,
            "https://webflow.com/api/v1/form/"
        ),
        counterUrl: "https://utils-api-git-experimental-vrejf.vercel.app/api/counter/",
        niceUtms: Array.from(
            new URLSearchParams(window.location.search),
            ([key, value]) => `${key}: ${value}`
        ),
        redirect: form.getAttribute("redirect") || false,
        endpoint: form.getAttribute("action")
            ? new URL(form.getAttribute("action")).toString()
            : null,
        addUtm: Boolean(form.dataset.redirectUtm) || true,
        utmSource:
            new URLSearchParams(window.location.search).get("utm_source") ||
            new URLSearchParams(window.location.search).get("source"),
        submitButton: form.querySelector('input[type="submit"]') || undefined,
    };
    params.submitText = (params.submitButton && params.submitButton.value) || "";

    function remapFormData(form, keyMapping) {
        var remappedFormData = new FormData();

        for (var [key, value] of new FormData(form)) {
            if (keyMapping.hasOwnProperty(key)) {
                remappedFormData.append(keyMapping[key], value);
            } else {
                remappedFormData.append(key, value);
            }
        }
        return remappedFormData;
    }

    const prepData = {
        baseData: {
            url: params.endpoint,
            method: "POST",
            headers: { "Content-Type": "application/json" },
        },

        webFlow(form) {
            const formData = new FormData(form);
            formData.append("UTM", params.niceUtms);
            const uriBody = new URLSearchParams({
                name: form.getAttribute("name"),
                source: window.location.href,
            });

            for (const pair of formData.entries()) {
                const fieldName = `fields[${pair[0]}]`;
                uriBody.append(fieldName, pair[1]);
            }
            return {
                ...prepData.baseData,
                url: params.wfUrl.href,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: uriBody.toString(),
            };
        },
        mailChimp(form) {
            console.log("preppar data för mailchimp");
            const keyMapping = {
                given_name: "FNAME",
                family_name: "LNAME",
                email: "EMAIL",
                tel: "PHONE",
                street_adress: "ADDRESS",
                postal_code: "POSTALCODE",
                adress_level2: "REGION",
                country: "COUNTRY",
            };
            const formData = remapFormData(form, keyMapping);
            // const formData = new FormData(form);
            const uriBody = new URLSearchParams(formData);
            uriBody.append("UTM", params.niceUtms);
            return {
                ...prepData.baseData,
                url: params.endpoint.replace("post?", "post-json?") + "&c=?",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                dataType: "jsonp",
                body: uriBody.toString(),
            };
        },
        zapier(form) {
            return {
                ...prepData.baseData,
                body: JSON.stringify({
                    [form.getAttribute("name")]: Object.fromEntries(new FormData(form)),
                    source: params.thisUrl.hostname + params.thisUrl.pathname,
                    time: new Date().toISOString(),
                    UTM: params.niceUtms,
                }),
            };
        },

        /// AMNESTY
        amnesty(form) {
            return {
                ...prepData.baseData,
                url: "https://utils-api-git-experimental-vrejf.vercel.app/api/amnesty/",
                body: JSON.stringify({
                    ...Object.fromEntries(new FormData(form)),
                    source: params.thisUrl.hostname + params.thisUrl.pathname,
                    time: new Date().toISOString(),
                    UTM: params.niceUtms,
                    action_id: form.dataset.actionId || "9999",
                    sign_method: form.dataset.signMethod || "agera-default",
                }),
            };
        },
        counter(counterName) {
            return {
                ...prepData.baseData,
                url: new URL(counterName, params.counterUrl.toString()),
                body: JSON.stringify({
                    name: "default",
                    site: params.wfSiteId,
                }),
            };
        },
        actionNetwork(form) {
            const formData = new FormData(form);
            return {
                ...prepData.baseData,
                body: JSON.stringify({
                    person: {
                        given_name: formData.get("given-name"),
                        family_name: formData.get("family-name"),
                        email_addresses: [{ address: formData.get("email") }],
                        phone_numbers: [{ number: formData.get("tel") || "" }],
                        postal_addresses: [
                            {
                                postal_code: formData.get("postal-code") || "",
                                address_lines: formData.get("street-address") || "",
                                region: formData.get("adress-level2") || "",
                                country: formData.get("country") || "",
                            },
                        ],
                    },
                    add_tags: [formData.getAll("tags") || ""],
                    "action_network:referrer_data": {
                        source: params.utmSource ? params.utmSource.toString() : "",
                        website: params.thisUrl.hostname + params.thisUrl.pathname,
                    },
                }),
            };
        },
    };

    function formStatus(form, ok) {
        const parent = form.parentNode;
        const doneElement = parent.querySelector(".w-form-done");
        const failElement = parent.querySelector(".w-form-fail");

        if (ok) {
            doneElement.style.display = "block"; // Show the success element
            failElement.style.display = "none"; // Hide the failure element
        } else {
            doneElement.style.display = "none";
            failElement.style.display = "block";
            params.submitButton.value = params.submitText;
        }
    }

    function redirect() {
        if (params.redirect) {
            console.log("Redirecting...");
            if (params.addUtm) {
                const redirectUrl = new URL(params.redirect, params.thisUrl);
                const utmParams = new URLSearchParams(window.location.search);

                redirectUrl.searchParams.forEach((value, param) => {
                    if (!utmParams.has(param)) {
                        utmParams.set(param, value);
                    }
                });

                const updatedRedirectUrl =
                    redirectUrl.origin +
                    redirectUrl.pathname +
                    (utmParams.toString() ? "?" + utmParams.toString() : "");

                window.location.href = updatedRedirectUrl;
            } else {
                window.location.href = params.redirect;
            }
        } else {
            console.log("No redirect defined");
        }
    }

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
    }

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
                        formStatus(form, false);
                        throw new Error("Response error");
                    }
                    return response.json();
                }
                if (request.dataType === "jsonp") {
                    return await ajaxCall(request);
                }
            });

            const responses = await Promise.all(promises);

            // All responses are OK
            formStatus(form, true);
            redirect();
        } catch (error) {
            formStatus(form, false);
            console.error("An error occurred:", error);
        }
    }

    async function handleForm(form) {
        const crm = form.dataset.crm.toLowerCase();

        form.addEventListener("submit", async function (event) {
            event.preventDefault();
            event.stopPropagation();
            params.submitButton.value = params.submitButton.dataset.wait || "Sending...";

            // list with all request DATA:
            let requestList = [];

            const crms = {
                webflow: "webFlow",
                actionnetwork: "actionNetwork",
                mailchimp: "mailChimp",
                zapier: "zapier",
                amnesty: "amnesty",
            };

            const counterUpdateName = form.dataset.counterUpdate;

            if (crms.hasOwnProperty(crm)) {
                const method = crms[crm];
                requestList.push(prepData[method](form));
            } else {
                console.log("no crm defined");
                requestList.push(prepData.webFlow(form));
            }
            if (counterUpdateName && counterUpdateName !== "default") {
                requestList.push(prepData.counter(counterUpdateName));
            }
            if (requestList.length > 0) {
                await handleFetchRequests(requestList, form);
            }
        });
    }
    return {
        handleForm,
    };
}

// Usage
document.addEventListener("DOMContentLoaded", function () {
    const crmForms = document.querySelectorAll("[data-crm]");
    for (let form of crmForms) {
        const submitter = ageraSync(form);
        submitter.handleForm(form);
    }
});
