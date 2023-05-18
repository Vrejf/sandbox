function makeCounterBar(options) {
    const {
        // set defaults
        counterName = "",
        targetNumber = 100,
        defaultNumber = 42,
        hideBelow = 0.0,
        formSelector = "#formID",
        wrapperSelector = ".counter_wrapper",
        limiterSelector = ".counterbar_limiter",
        numberSelector = ".counter_number",
        localString = "sv-SE",
        apiUrl = "https://utils-api.vercel.app/api/count/",
    } = options;

    const formElement = document.querySelector(formSelector);
    const wrapper = document.querySelector(wrapperSelector);
    const numberElements = document.querySelectorAll(numberSelector);
    const barLimiter = document.querySelector(limiterSelector);
    const counterText = numberElements[0].textContent.match(/ [^\d]+/)[0];
    let addOne;
    let apiResult;
    const style = `display: inline-block; transition: opacity 0.5s ease-in-out; opacity: 0`;


    function calcPercent(i) {
        if (i >= targetNumber) { return 100; }
        return Math.round((i / targetNumber) * 100);
    }

    function updateCounter(c) {
        apiResult = parseInt(c);
        barLimiter.style.width = calcPercent(apiResult) + "%";

        // Create the spans and append them to the counter
        const digits = apiResult.toLocaleString(localString).split('');
        numberElements.forEach(element => {
            element.innerHTML = "";
            for (let i = 0; i < digits.length; i++) {
                const span = document.createElement('span');
                span.textContent = digits[i];
                span.style.cssText = style;
                span.style.opacity = 1;
                element.appendChild(span);
            }
            element.innerHTML += counterText;
        });

        if (apiResult > (targetNumber * hideBelow)) {
            console.log("more then " + (targetNumber * hideBelow) + " - show counter");
            wrapper.classList.add("show");
        }
    }

    function fadeIncrement() {
        const newDigits = addOne.toLocaleString(localString).split('');
        numberElements.forEach(element => {
            // Check if the are more digits
            const numSpans = element.children.length;
            const diff = newDigits.length - numSpans;
            if (diff > 0) {
                for (let i = 0; i < diff; i++) {
                    const span = document.createElement('span');
                    span.style.cssText = style;
                    element.appendChild(span);
                    setTimeout(() => { span.style.opacity = 1; }, 10);
                }
            }

            // Fade in the changed digit
            for (let i = 0; i < newDigits.length; i++) {
                const oldDigit = element.children[i].textContent;
                const newDigit = newDigits[i];

                if (oldDigit !== newDigit) {
                    const span = document.createElement('span');
                    span.textContent = newDigit;
                    span.style.cssText = style;
                    element.replaceChild(span, element.children[i]);
                    setTimeout(() => { span.style.opacity = 1; }, 10);
                }
            }
        });
    }

    formElement.addEventListener('submit', function (event) {
        addOne = apiResult + 1;
        fadeIncrement();
    });

    fetch(apiUrl + counterName)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not: ok');
            }
            return response.json();
        })
        .then(data => {
            if (Number.isInteger(data.count)) {
                result = data.count;
            } else {
                throw new Error('Value is not an integer');
            }
            updateCounter(result);
        })
        .catch(error => {
            console.error('There was a problem fetching the data:', error);
            console.log('Using default number:', defaultNumber);
            updateCounter(defaultNumber);
        });
}

