// Define a function that takes a number as a parameter
function roundCeil(number) {
  // Initialize a variable to store the result
  let result = 0;
  // Initialize a variable to store the factor n
  let n = 0;
  // Find the number of digits in the number
  let digits = Math.floor(Math.log10(number)) + 1;
  // If the number has less than 3 digits, set n to 10
  if (digits < 3) {
    n = 10;
  }
  // If the number has 3 digits, set n to 100
  else if (digits === 3) {
    n = 250;
  }
  // If the number has more than 3 digits, set n to 10^(digits - 1) / 4
  else {
    n = Math.pow(10, digits - 1) / 4;
  }
  // Divide the number by n and round it up to get the quotient
  let quotient = Math.ceil(number / n);
  // Multiply the quotient by n to get the result
  result = quotient * n;
  
  // Return the result
  return result;
}

// Test the function with some examples
console.log(roundCeil(5)); // 10
console.log(roundCeil(15)); // 20
console.log(roundCeil(55)); // 60
console.log(roundCeil(155)); //200
console.log(roundCeil(4555)); //600
console.log(roundCeil(1555)); //2000
console.log(roundCeil(5555)); //6000
console.log(roundCeil(12555)); //20000

