const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const utmSource = urlParams.get('utm_source')


// const forwardForms = document.querySelectorAll('[forward="true"]');

document.addEventListener("DOMContentLoaded", function () {
  const anForms = document.querySelectorAll("[an='true']");

  anForms.forEach(function (form) {
    console.log("Send this to Action network :" + form.getAttribute("id"));


    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const endpoint = form.getAttribute("endpoint");
      const first = form.querySelector('[name="first"]');
      const last = form.querySelector('[name="last"]');
      const email = form.querySelector('[name="email_address"]');
      const phone = form.querySelector('[name="phone_number"]');
      const postalCode = form.querySelector('[name="postal_code"]');
      const address = form.querySelector('[name="address"]');
      const region = form.querySelector('[name="region"]');
      const country = form.querySelector('[name="country"]');
      const url = endpoint;
      const headers = {
        "Content-Type": "application/json;charset=UTF-8"
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
              number: phone ? phone.value : '',
            },
          ],
          postal_addresses: [
            {
              postal_code: postalCode ? postalCode.value : '',
              address_lines: address ? [address.value] : [''],
              region: region ? region.value : '',
              country: country ? country.value : 'SE',
            },
          ],
        },
        "action_network:referrer_data": {
          source: utmSource ? utmSource.toString() : ""
        }
      };

      fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data)
      })
        .then((response) => {
          if (response.ok) {
            console.log("done");
            form.submit();
          } else {
            console.log("fail");
          }
          console.log("always");
        })
        .catch((error) => {
          console.log(error);
        });
    });
  });
});
