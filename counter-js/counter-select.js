// Create an object to store the data-countername values

const apiUrl = "https://utils-api.vercel.app/api/count/"

function calcPercent(current, target) {
    if (current >= target) { return 100; }
    return Math.round((current / target) * 100);
}
let counterNames = {
    "test03": 123,
};
function getCountOld(name) {
    if (counterNames.hasOwnProperty(name)) {
        currentValueElement.textContent = counterNames[name]
        return counterNames[name]
    } else {
        console.log("fetching")
        const url = new URL(name, apiUrl)
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    console.log(response.json())
                    console.log(response.statusText)
                }
                return response.json()
            })
            .then(data => {
                if (Number.isInteger(data.count)) {
                    counterNames[name] = data.count;
                    return data.count
                } else {
                    console.log("Count not Int")
                    return 0
                }
            }).catch(e => {
                console.log("Error ", e)
            })
    }
}

async function getCount(name) {
    if (counterNames.hasOwnProperty(name)) {
        currentValueElement.textContent = counterNames[name];
        return counterNames[name];
    } else {
        console.log('fetching');
        const url = new URL(name, apiUrl);
        try {
            const response = await fetch(url);
            if (!response.ok) {
                console.log(await response.json());
                console.log(response.statusText);
            }
            const data = await response.json();
            if (Number.isInteger(data.count)) {
                counterNames[name] = data.count;
                return data.count;
            } else {
                console.log('Count not Int');
                return 0;
            }
        } catch (e) {
            console.log('Error ', e);
        }
    }
}

(async () => {
    // Find and select all elements with the attribute data-countername
    let counterElements = document.querySelectorAll("[data-countername]");
    // Loop through the elements
    for (let element of counterElements) {

        let counterName = element.getAttribute("data-countername");

        let targetValue = 999;
        const localString = "sv-SE";
        const hiddenStyle = `display: inline-block; transition: opacity 0.5s ease-in-out; opacity: 0`;

        console.log(counterNames)

        // Find all elements with the class-name counter-current-value within the element
        let currentValueElements = element.querySelectorAll(".counter-current-value");

        // Loop through the current values
        for (let currentValueElement of currentValueElements) {

            // Check if the countername exists
            if (counterNames.hasOwnProperty(counterName)) {
                currentValueElement.textContent = counterNames[counterName]
            } else {
                console.log('name not in list - currentvalueelement, getting it...');
                const currentValue = await getCount(counterName);
                // Do stuff after the fetch is done loading
                console.log('Current value: ', currentValue);
                counterNames[counterName] = currentValue;
                currentValueElement.textContent = counterNames[counterName];

                // Find all counterbar-limiter
                let limiters = element.querySelectorAll('.counterbar-limiter');
                for (let limiter of limiters) {
                    // Set the width of the limiter based on the current value
                    limiter.style.width = calcPercent(currentValue, targetValue) + '%';
                    console.log('Limiter percent', limiter.style.width);
                }
            }

        }

        // Find all counter-target-value
        let targetValuesElements = element.querySelectorAll(".counter-target-value");
        for (let targetValueElement of targetValuesElements) {

            console.log("", targetValueElement.textContent);

        }

        // Find all counterbar-limiter
        let limiters = element.querySelectorAll(".counterbar-limiter");
        for (let limiter of limiters) {

            // Check if the countername exists
            if (counterNames.hasOwnProperty(counterName)) {
                console.log("Limiter, name in list")
                limiter.style.width = calcPercent(counterNames[counterName], targetValue) + "%";
                console.log("Limiter percent", limiter.style.width);
            } else {
                // Add it to the object with value 0
                console.log('name not in list - Limiter, getting it...');
                const currentValue = await getCount(counterName);
                // Do stuff after the fetch is done loading
                console.log('Current value: ', currentValue);
                counterNames[counterName] = currentValue;
                // Find all counterbar-limiter
                let limiters = element.querySelectorAll('.counterbar-limiter');
                for (let limiter of limiters) {
                    // Set the width of the limiter based on the current value
                    limiter.style.width = calcPercent(currentValue, targetValue) + '%';
                    console.log('Limiter percent', limiter.style.width);
                }
            }

        }
        if (element.tagName === 'FORM') {
            // It is a form element
            console.log('Found a form element:', element);

            // Perform further operations specific to form elements
            // ...
        } else {
            // It is not a form element
            console.log('Not a form element:', element);
        }
    }

})();
