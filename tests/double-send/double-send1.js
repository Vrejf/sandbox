function sendForm1(form) {
    form.addEventListener('submit', function (event) {
        form.preventDefault();
        // console log all form values:
        const formData = new FormData(form);
        const data = {};
        for (let [key, value] of formData) {
            data[key] = value;
            console.log(key, value);
            // console.log(data);
            // console.log(formData);
        }

    })
};





document.addEventListener('DOMContentLoaded', function () {
    const formElement = document.getElementById('email-form');
    sendForm1(formElement);
});