import parsePhoneNumberFromString from 'libphonenumber-js';


function formatPhone(phoneNumber) {
    const parsedNumber = parsePhoneNumberFromString(phoneNumber, 'SE');
    if (parsedNumber) {
        if (!parsedNumber.country) {
            return '+46' + parsedNumber.nationalNumber;
        }
        return parsedNumber.format('E.164');
    }
    return phoneNumber;
}

const result = document.querySelector('#result');
const phoneInput = document.querySelector('#phone');
const button = document.querySelector('#submit');

button.addEventListener("click", function () {
    result.innerHTML = formatPhone(phoneInput.value);
});