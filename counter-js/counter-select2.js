// Counter module
const ageraCounter = (function () {

    let counterNames = {
        test01: 123,
    };
    const apiUrl = "https://utils-api.vercel.app/api/count/"

    function calcPercent(current, target) {
        if (current >= target) { return 100; }
        return Math.round((current / target) * 100);
    }

    function calcTarget(a, b) {
        return a * b
    }

    async function fetchCounter(name) {
        if (counterNames.hasOwnProperty(name)) {
            return counterNames[name]
        } else {
            console.log("fetching...")
            const url = new URL(name, apiUrl)

            try {
                const response = await fetch(url);
                if (!response.ok) { console.log(await response.json()); console.log(response.statusText) }
                const data = response.json()
                if (Number.isInteger(data.count)) {
                    counterNames[name] = data.count;
                    return data.count;
                } else {
                    console.log("Count not Int")
                    return 0
                }

            } catch (e) {
                console.log("Catch error: ", e)
            }

        }
    }

    function updateCounterValue(element, counterName, value) {
        element.textContent = value;
        console.log("New counter value: ", value)
    }

    function updateLimiterWidth(element, counterName, value) {
        element.style.width = calcPercent(value, targetValue) + '%';
        console.log('Limiter percent', element.style.width);
    }

    function updateTargetValue(element, counterName) {
        const newTargetValue = (counterNames[counterName] * 1.7)
        element.textContent = newTargetValue
        console.log("uodatetarget: ", newTargetValue)
    }

    async function processCounterElement(element) {
        const counterName = element.getAttribute('data-countername');
        const targetValue = 999;


        // Update all the values:
        const currentValueElements = element.querySelectorAll(
            '.counter-current-value'
        );

        for (let currentValueElement of currentValueElements) {
            if (counterNames.hasOwnProperty(counterName)) {
                // Update the counter value from the cached value
                currentValueElement.textContent = counterNames[counterName];
            } else {
                console.log('name not in list - currentvalueelement, getting it...');
                const currentValue = await fetchCounter(counterName);
                counterNames[counterName] = currentValue;
                updateCounterValue(currentValueElement, counterName, currentValue);
            }

            // Find all counterbar-limiter
            const limiters = element.querySelectorAll('.counterbar-limiter');
            for (let limiter of limiters) {
                updateLimiterWidth(limiter, counterName, counterNames[counterName]);
            }
        }

        // Find all counter-target-value
        const targetValuesElement = element.querySelectorAll('.counter-target-value');
        for (let targetValueElement of targetValuesElement) {
            if (!counterNames.hasOwnProperty(counterName)) {
                await fetchCounter(counterName)
            }
            updateTargetValue(targetValueElement, counterName)


            // Find all counterbar-limiter
            let limiters = element.querySelectorAll(".counterbar-limiter");
            for (let limiter of limiters) {
                if (counterNames.hasOwnProperty(counterName)) {
                    updateLimiterWidth(limiter, counterName, counterNames[counterName])
                } else {
                    console.log("Name not in list, limit. Getting it...")
                    const currentValue = await fetchCounter(counterName);
                    updateLimiterWidth(limiter, counterName, counterNames[counterName])
                }
            }
        }

        return {
            processCounterElement,
        };
    }) ();

    // Usage
    document.addEventListener('DOMContentLoaded', function () {
        const counterElements = document.querySelectorAll('[data-countername]');
        for (let element of counterElements) {
            ageraCounter.processCounterElement(element);
        }
    });
