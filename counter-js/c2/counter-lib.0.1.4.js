// Counter module:
function ageraCounter() {
    const apiUrl = "https://utils-api.vercel.app/api/count/"
    const hideStyle = `display: inline-block; transition: opacity 0.5s ease-in-out; opacity: 0`;


    function calcPercent(current, target) {
        if (current >= target) { return 100; }
        return Math.round((current / target) * 100);
    }

    function setTarget(current, target) {
        function roundTarget() {
            const rounding = [250, 500, 1000, 2500];
            let newTarget = Math.ceil((current * 1.05) / rounding[0]) * rounding[0];
            for (let factor of rounding) {
                if (current > factor) {
                    newTarget = Math.ceil(newTarget / factor) * factor;
                }
            }
            return newTarget;
        };
        if ((current * 1.05) > target) {
            return roundTarget();
        } else {
            return target;
        }
    }

    async function fetchCounter(name) {
        console.log("fetching...")
        const url = new URL(name, apiUrl)

        try {
            const response = await fetch(url);
            if (!response.ok) {
                console.log(await response.json());
                console.log(response.statusText)
            }
            const data = await response.json();
            if (Number.isInteger(data.count)) {
                return data.count;
            } else {
                console.log("Count not Int")
                console.log(data)
                return 0
            }

        } catch (e) {
            console.log("Catch error: ", e)
        }
    }

    function updateCounterValue(element, value) {
        element.textContent = value;
        console.log("New counter value: ", value)
    }

    function updateLimiterWidth(element, value, target) {
        element.style.width = calcPercent(value, target) + '%';
        console.log('updated Limiter percent', element.style.width);
    }

    function updateTargetValue(element, target) {
        element.textContent = target
        console.log("updated target value: ", target)
    }

    async function processCounterElement(element) {
        element.style.cssText = hideStyle;
        const counterName = element.getAttribute('data-countername');
        const userTargetValue = element.getAttribute("data-countertarget") || 0;
        const currentValue = await fetchCounter(counterName);
        const targetValue = setTarget(currentValue, userTargetValue);


        // Update all the Current values:
        const currentValueElements = element.querySelectorAll(
            '.counter-current-value'
        );
        for (let currentValueElement of currentValueElements) {
            updateCounterValue(currentValueElement, currentValue);
        }

        // Update all targets:
        const targetValuesElement = element.querySelectorAll('.counter-target-value');
        for (let targetValueElement of targetValuesElement) {
            updateTargetValue(targetValueElement, targetValue)
        }

        // Update all counterbar-limiter
        let limiters = element.querySelectorAll(".counterbar-limiter");
        for (let limiter of limiters) {
            updateLimiterWidth(limiter, currentValue, targetValue)
        }
    }
    return {
        processCounterElement,
    };
}

// Usage
document.addEventListener('DOMContentLoaded', function () {
    const counterElements = document.querySelectorAll('[data-countername]');
    const counter = ageraCounter();
    for (let element of counterElements) {
        counter.processCounterElement(element);
    }
});