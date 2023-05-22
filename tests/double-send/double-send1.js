

async function submitForm(form) {

    const formData = new FormData(form);
    const searchParams = new URLSearchParams();
    const url = new URL(document.querySelector("html").dataset.wfSite, 'https://webflow.com/api/v1/form/')

    searchParams.append('name', form.getAttribute("name"));
    searchParams.append('source', window.location.href);
    searchParams.append("test", false)
    searchParams.append("dolphin", false)

    for (const pair of formData.entries()) {
        const fieldName = `fields[${pair[0]}]`;
        searchParams.append(fieldName, pair[1]);
    }

    try {
        const response = await fetch(url, { //data-wf-site
            method: 'POST',
            body: searchParams.toString(),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        if (response.ok) {
            console.log('Form submitted successfully');
            formStatus(form, true)
            return true
            // Do something with the response, if needed
        } else {
            console.error('Form submission failed');
            console.log(await response.json())
            formStatus(form, alse)
            return false
        }
    } catch (error) {
        console.error('An error occurred while submitting the form:', error);
        formStatus(form, false)
        return false;

    }
}

async function delayOneSecond(time) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
}



function sendForm1(form) {
    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        event.stopPropagation()
        if (await submitForm(form)) {
            console.log("Success");
            form.reset();
            //console.log("Redirect ->", form.getAttribute("redirect"));
            //window.location.href = form.getAttribute("redirect");

        } else {
            console.log("Error");
        }
        console.log('Start delay');
        if (await delayOneSecond(2000)) {
            console.log('Delay done');
        }

    })
};

function formStatus(form, ok) {
    const parent = form.parentNode;
    const doneElement = parent.querySelector(".w-form-done");
    const failElement = parent.querySelector(".w-form-fail");
    console.log(doneElement);
    console.log(failElement);


    if (ok) {
        form.style.display = 'none'; // Hide the form
        doneElement.style.display = 'block'; // Show the success element
        failElement.style.display = 'none'; // Hide the failure element
        console.log("display done");
    } else {

        form.style.display = 'none'; // Hide the form
        doneElement.style.display = 'none';
        failElement.style.display = 'block';
        console.log("display fail");
    }

}

document.addEventListener('DOMContentLoaded', function () {
    const wfSite = document.querySelector("html").dataset.wfSite
    console.log(wfSite);
    const formElement = document.getElementById('email-form');
    sendForm1(formElement);
});


