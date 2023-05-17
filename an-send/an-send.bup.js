// an-send.0.1.2
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const utmSource = urlParams.get("utm_source");

const anForms = document.querySelectorAll("[data-an='true']");


async function postData(url, headers, body, form, event) {
  fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body)
  })
    .then(response => response.json())
    .then(data => {
      // Handle the response data
      
      console.log(data);
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
  
  form.addEventListener("submit", function (event) {
    if (form.getAttribute("data-an-preventdefault") === "true") {
      console.log("Preventing default...")
      event.preventDefault();
    }
    const url = form.getAttribute("data-an-url");
    const first = form.querySelector('[name="first"]');
    const last = form.querySelector('[name="last"]');
    const email = form.querySelector('[name="email_address"]');
    const phone = form.querySelector('[name="phone_number"]');
    const postalCode = form.querySelector('[name="postal_code"]');
    const address = form.querySelector('[name="address"]');
    const region = form.querySelector('[name="region"]');
    const country = form.querySelector('[name="country"]');
    const headers = {
      "Content-Type": "application/json"
    };

    const data = {
      person: {
        given_name: first.value,
        family_name: last.value,
        email_addresses: [
          {
            address: email.value
          }
        ],
        phone_numbers: [
          {
            number: phone ? phone.value : ""
          }
        ],
        postal_addresses: [
          {
            postal_code: postalCode ? postalCode.value : "",
            address_lines: address ? [address.value] : [""],
            region: region ? region.value : "",
            country: country ? country.value : "SE"
          }
        ]
      },
      "action_network:referrer_data": {
        source: utmSource ? utmSource.toString() : ""
      }
    };

    //const postDone = await submitForm(url, headers, data, form, event);
    const postDone = postData(url, headers, data, form, event);

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
