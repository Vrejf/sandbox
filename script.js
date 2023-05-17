// Activate Copy button for code blocks
hljs.addPlugin(
  new CopyButtonPlugin({
    callback: (text, el) => console.log("Copied to clipboard", text)
  })
);

// Copy cmponents buttons:
const buttons = document.querySelectorAll(".copy-component-button");
buttons.forEach((button) => {
  button.addEventListener("click", copyJSON);
});
// Copy components:
function copyJSON(event) {
  const button = event.target;
  const jsonData = button.dataset.json;
  const formattedData = jsonData.replace(/'/g, '"');
  // Parse the JSON data
  let data = JSON.stringify(formattedData);

  document.addEventListener(
    "copy",
    (event) => {
      console.log("Object copied");
      if (event.clipboardData) {
        event.clipboardData.setData("application/json", formattedData);
      } else if (window.clipboardData) {
        window.clipboardData.setData("application/json", formattedData);
      }
      event.preventDefault();
    },
    true
  );
  document.execCommand("copy");
}
const clipboardTextbox = document.querySelector(".clipboard-textbox");

// Get component from clipboard
clipboardTextbox.addEventListener("paste", (event) => {
  const clipboardData = event.clipboardData;
  const jsonData = clipboardData.getData("application/json");

  // Replace all double quotes with single quotes
  const formattedData = jsonData.replace(/"/g, "'");

  // Display clipboard data in the code block
  document.querySelector(".component-code-block").innerHTML = formattedData;
});
