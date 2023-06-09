{
    // Run before DOM load:
    const hideCss = `
    .too-big {
        display: none;
        transition: opacity 0.7s;
    }
    .copy-popup {
        opacity: 0;
    }
    .component-code-block {
        text-wrap: wrap;
    }
`;

    const styleTag = document.createElement("style");
    styleTag.textContent = hideCss;
    document.head.appendChild(styleTag);
}
let formattedData = "";

function copyComponentButtons() {
    const copyComponentButtons = document.querySelectorAll('[data-copy="json"]');
    copyComponentButtons.forEach((button) => {
        const formattedData = button.dataset.json.replace(/'/g, '"'); // replace single quotes with double quotes
        button.addEventListener("click", function () {
            console.log("clicked normal button");
            copyComponentHandler(formattedData);
        });
    });
}

function copyComponentHandler(component, toCms) {
    console.log("Clicked");

    function handleCopy(event) {
        const clipboardData = event.clipboardData || window.clipboardData; // browser compability
        const dataType = toCms ? "text/plain" : "application/json"; // cms or not
        clipboardData.setData(dataType, component);

        console.log("Object copied");
        console.log(dataType, ": ", component.toString().slice(1, 100));
        event.preventDefault();

        // Remove the event listener after the copy  is complete
        document.removeEventListener("copy", handleCopy, true);
    }

    document.addEventListener("copy", handleCopy, true);
    document.execCommand("copy");
    showCopyPopup();

    setTimeout(() => {}, 100);
}

function showCopyPopup() {
    const copyPopup = document.querySelector(".copy-popup");
    copyPopup.style.opacity = 1;
    // timout 200 ms then hide the popup

    setTimeout(() => {
        copyPopup.style.opacity = 0;
    }, "2000");
}

//TODO change to attribute

function clickDivCopy() {
    const clickableDivs = document.querySelectorAll(".click-copy");

    clickableDivs.forEach((div) => {
        div.addEventListener("click", function () {
            console.log("leyts copy...");
            // const data = div.innerHTML;
            const data = div.textContent;
            navigator.clipboard.writeText(data).then(
                () => {
                    /* clipboard successfully set */
                    showCopyPopup();
                },
                () => {
                    console.log("copy fail");
                    /* clipboard write failed */
                }
            );
        });
    });
}

// copy code block:
function addClickListenerToCodebox(element, text) {
    element.style.cursor = "pointer";

    element.addEventListener("click", function () {
        if (element.classList.contains("component-code-block")) {
            text = formattedData;
        }
        navigator.clipboard
            .writeText(text)
            .then(function () {
                console.log("Text copied to clipboard:", text.slice(0, 100), "...");
                showCopyPopup();
            })
            .catch(function (error) {
                console.error("Failed to copy text:", error);
            });
    });
}
hljs.addPlugin({
    "after:highlightElement": function ({ el, result, text }) {
        addClickListenerToCodebox(el, text);
    },
});

// copy CMS snippet:
const cmsButtons = document.querySelectorAll("[data-copy='cms-snippet']");
cmsButtons.forEach((button) => {
    const cmsSnippet = JSON.parse(
        button.parentElement.querySelector(".code-snippet").textContent
    );
    button.addEventListener("click", function () {
        console.log("Clicked CMS snippet button");
        copyComponentHandler(JSON.stringify(cmsSnippet));
    });
});

function createComponent() {
    console.log("create component");
    const clipboardTextbox = document.querySelector(".clipboard-textbox");

    const copyButtonButton = document.querySelector('[data-copy="pasted"]');
    const copyToCmsButton = document.querySelector('[data-copy="pasted-to-cms"]');
    copyButtonButton.style.display = "none";
    copyToCmsButton.style.display = "none";
    const tooBigText = document.querySelector(".too-big");
    const pastedChars = document.querySelector(".pasted-chars");
    pastedChars.innerText = "";
    const buttonTemplate = {
        start: `{"type":"@webflow/XscpData","payload":{"nodes":[{"_id":"161b77c0-10f8-5ac2-dc05-71c6cf50fdfa","type":"Link","tag":"a","classes":["9107e8fa-66f8-1dab-b2fe-6302ef5bd3eb"],"children":["161b77c0-10f8-5ac2-dc05-71c6cf50fdfb"],"data":{"search":{"exclude":true},"xattr":[{"name":"data-copy","value":"json"},{"name":"data-json","value":"`,
        end: `"}],"block":"","displayName":"","devlink":{"runtimeProps":{},"slot":""},"attr":{"id":""},"visibility":{"conditions":[]},"button":true,"link":{"mode":"external","url":"#"}}},{"_id":"161b77c0-10f8-5ac2-dc05-71c6cf50fdfb","text":true,"v":"Copy component"}],"styles":[{"_id":"9107e8fa-66f8-1dab-b2fe-6302ef5bd3eb","fake":false,"type":"class","name":"copy-component-button","namespace":"","comb":"","styleLess":"","variants":{},"children":[],"createdBy":"64392523fff632c4f7f0c7bf","selector":null}],"assets":[],"ix1":[],"ix2":{"interactions":[],"events":[],"actionLists":[]}},"meta":{"unlinkedSymbolCount":0,"droppedLinks":0,"dynBindRemovedCount":0,"dynListBindRemovedCount":0,"paginationRemovedCount":0}}`,
    };
    // Get component from clipboard
    clipboardTextbox.addEventListener("paste", (event) => {
        tooBigText.style.display = "none";
        const clipboardData = event.clipboardData;
        const jsonData = clipboardData.getData("application/json");

        // Replace all double quotes with single quotes
        formattedData = jsonData.replace(/"/g, "'");
        // remove svg
        const regex = /<svg\b[^>]*>(.*?)<\/svg>/g;
        formattedData = formattedData.replace(regex, "");

        // Display clipboard data in the code block
        document.querySelector(".component-code-block").innerHTML = formattedData;
        pastedChars.innerText = jsonData.length + " characters";

        copyToCmsButton.addEventListener("click", function () {
            copyComponentHandler(jsonData, true);
        });
        copyButtonButton.addEventListener("click", function () {
            copyComponentHandler(buttonTemplate.start + formattedData + buttonTemplate.end);
        });
        copyToCmsButton.style.display = "block";

        // if formatted data length less the 1000:
        if (formattedData.length < 9800) {
            copyButtonButton.style.display = "block";
        } else {
            copyButtonButton.style.display = "none";
            tooBigText.style.display = "block";
        }

        console.log("Component in textbox");
    });
}

// Init
document.addEventListener("DOMContentLoaded", () => {
    createComponent();
    clickDivCopy();
    copyComponentButtons();
});
