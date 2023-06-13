// Counter 0.1.6 230613 - 19-50
function ageraCounter() {
    const apiUrl = "https://utils-api-git-experimental-vrejf.vercel.app/api/counter/"

    function calcPercent(current, target) {
        if (current >= target) { return 100; }
        return Math.round((current / target) * 100);
    }

    function roundUp(number) {
        const breakPoints = {
            350: 50,
            500: 100,
            2_000: 250,
            5_000: 500,
            20_000: 2_500,
            50_000: 5_000,
            100_000: 10_000,
            200_000: 25_000,
            500_000: 50_000,
            1_000_000: 100_000,
        }
        const more = 250_000
        let keys = Object.keys(breakPoints);

        let key = keys.find(k => k >= number);

        let value = key ? breakPoints[key] : more;
        return Math.ceil((number * 1.05) / value) * value;

    }


    function setTarget(number, options) {
        if ((number * 1.05) < options.target || !options.autoTarget) {
            return options.target;
        }
        else {
            return roundUp(number);
        }
    }

    async function fetchCounter(name) {
        console.log("fetching...")
        const url = new URL(name, apiUrl)

        try {
            let data;
            const response = await fetch(url);
            if (!response.ok) {
                data = await response.json();
                console.log(data);
                console.log(response.statusText)
            }
            data = await response.json();
            if (Number.isInteger(data.count)) {
                return data.count;
            } else {
                console.log("Count not Int")
                console.log(data)
                return 0
            }

        } catch (e) {
            console.log("Catch error: ", e)
            return 0
        }
    }

    function updateCounterValue(element, value, options) {
        try {
            localeNotation = new Intl.NumberFormat(options.locale, options.compactDisplay).format(value);
            element.textContent = localeNotation;
        }
        catch {
            localeNotation = new Intl.NumberFormat(options.compactDisplay).format(value);
            element.textContent = localeNotation;
        }
    }

    function updateLimiterWidth(element, value, target) {
        element.style.width = calcPercent(value, target) + '%';
    }

    function updateTargetValue(element, target, options) {
        try {
            const localeNotation = new Intl.NumberFormat(options.locale, options.compactDisplay).format(target);
            element.textContent = localeNotation;
        } catch {
            options.compactDisplay.useGrouping = false;
            const localeNotation = new Intl.NumberFormat(undefined, options.compactDisplay).format(target);
            element.textContent = localeNotation;
        }
    }

    function showElement(element, current, options) {
        if (current >= options.hideBelow) {
            element.style.opacity = 1;
        }
    }

    async function processCounterElement(element) {

        const counterName = element.dataset.counterName || "default";
        const options = {
            target: element.dataset.counterTarget || 0,
            hideBelow: element.dataset.counterHideBelow || 0,
            autoTarget: element.dataset.counterAutoTarget || true,
            locale: element.dataset.counterLocale || document.documentElement.lang || "undefined",  //"sv-SE", 
            compact: element.dataset.counterCompact || false,
            compactDisplay: {
                notation: element.dataset.counterCompact === undefined ? "standard" : "compact",
            },
        }
        let currentValue;
        if (counterName.toLowerCase() === "default") {
            currentValue = 125;
        } else {
            currentValue = await fetchCounter(counterName);
        }

        // Current element is counter value:
        if (element.classList.contains('counter-current-value')) {
            updateCounterValue(element, currentValue, options);
            showElement(element, currentValue, options);
        } else {
            // Update all the CURRENT VALUES:
            const currentValueElements = element.querySelectorAll(
                '.counter-current-value'
            );
            for (let currentValueElement of currentValueElements) {
                updateCounterValue(currentValueElement, currentValue, options);
                showElement(currentValueElement, currentValue, options)
            }
        }


        // Update all TARGETS:
        const targetValue = setTarget(currentValue, options);
        const targetValuesElement = element.querySelectorAll('.counter-target-value');
        for (let targetValueElement of targetValuesElement) {
            updateTargetValue(targetValueElement, targetValue, options)
            showElement(targetValueElement, currentValue, options)
        }

        // Update all LIMITER
        let limiters = element.querySelectorAll(".counterbar-limiter");
        for (let limiter of limiters) {
            updateLimiterWidth(limiter, currentValue, targetValue)
        }

        showElement(element, currentValue, options)

    }
    return {
        processCounterElement,
    };
}


const hideCss = `
    .counter-target-value,
    .counter-current-value,
    .container_counter {
        opacity: 0;
        transition: opacity 1s;
    }
`;

const styleTag = document.createElement('style');
styleTag.textContent = hideCss;
document.head.appendChild(styleTag);

// Usage
document.addEventListener('DOMContentLoaded', function () {
    const counterElements = document.querySelectorAll('[data-counter-name]');
    const counter = ageraCounter();
    for (let element of counterElements) {
        counter.processCounterElement(element);
    }
});