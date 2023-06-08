
function increment(button) {

}


document.addEventListener('DOMContentLoaded', function () {
    const handRaisersButtons = document.querySelectorAll("[data-handraiser='true']");
    for (let button of handRaisersButtons) {
        button.addEventListener("click", function () {
            increment(button);
        }
        )
    }
});



// <script>
document.addEventListener('DOMContentLoaded', function () {
    //    const anForms = document.querySelectorAll("[data-an-bridge='true']");
    const cform = document.getElementById('counter-form');
    const submitter = anSubmit(cform);
    document.getElementById('counterup').addEventListener('click', function () {

        submitter.pressSubmit(cform);
    });
});

// </script>



{/* <script defer src="https://cdn.jsdelivr.net/npm/@finsweet/attributes-inputactive@1/inputactive.js"></script>
<script src="https://cdn.jsdelivr.net/gh/ageraplattformen/js-modules@main/counter/counter-lib.0.1.4.js"></script>
<script src="https://ezh3zc-5000.csb.app/an-send/an-send2/an-bridge.0.5.js"></script> */}