// Create an object to store the data-countername values
let counterNames = {};

// Find and select all elements with the attribute data-countername
let elements = document.querySelectorAll("[data-countername]");

// Loop through the elements
for (let element of elements) {
    // Get the value of data-countername attribute
    let counterName = element.getAttribute("data-countername");

    // Check if the value exists as a key in the object
    if (counterNames.hasOwnProperty(counterName)) {
        // Increment the value by one
        counterNames[counterName]++;
    } else {
        // Add it to the object with value 0
        counterNames[counterName] = 0;
    }

    // Find all elements with the class-name counter-current-value within the element
    let currentValues = element.querySelectorAll(".counter-current-value");

    // Loop through the current values
    for (let currentValue of currentValues) {
        // Console.log the text content of counter-current-value
        console.log(currentValue.textContent);
    }

    // Find all elements with the class name counter-target-value within the element
    let targetValues = element.querySelectorAll(".counter-target-value");

    // Loop through the target values
    for (let targetValue of targetValues) {
        // Console.log the text content of counter-target-value
        console.log(targetValue.textContent);
    }

    // Find all elements with the class name counterbar_limiter within the element
    let limiters = element.querySelectorAll(".counterbar_limiter");

    // Loop through the limiters
    for (let limiter of limiters) {
        // Console.log the width of counterbar_limiter
        console.log(limiter.style.width);
    }
}
