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
    const copyButtonButton = document.querySelector('[data-copy="pasted"]');
    copyButtonButton.style.display = "none";
}
let formattedData = "";

function activateCopyButton() {
    // Activate Copy button for code blocks
    // hljs.addPlugin(
    //     new CopyButtonPlugin({
    //         callback: (text, el) => console.log("Copied to clipboard", text),
    //         //.component-code-block
    //     })
    // );
    hljs.addPlugin(
        new CopyButtonPlugin({
            hook: (text, element) => {
                if (element.classList.contains("component-code-block")) {
                    text = formattedData;
                    return text;
                }
                return text;
            },
            callback: (text, el) => {
                /* logs `gretel configure --key grtf32a35bbc...` */
                console.log(text);
            },
        })
    );
}
// activateCopyButton();

const buttons = document.querySelectorAll(".copy-component-button");
buttons.forEach((button) => {
    const formattedData = button.dataset.json.replace(/'/g, '"');
    button.addEventListener("click", function () {
        clickHandler(formattedData);
    });
});

function clickHandler(data) {
    console.log("CLicked");
    document.addEventListener(
        "copy",
        (event) => {
            if (event.clipboardData) {
                event.clipboardData.setData("application/json", data);
            } else if (window.clipboardData) {
                window.clipboardData.setData("application/json", data);
            }
            console.log("Object copied");
            event.preventDefault();
        },
        true
    );
    document.execCommand("copy");
    showCopyPopup();

    setTimeout(() => {}, 500);
}

function showCopyPopup() {
    const copyPopup = document.querySelector(".copy-popup");
    copyPopup.style.opacity = 1;
    // timout 200 ms then hide the popup

    setTimeout(() => {
        copyPopup.style.opacity = 0;
    }, "2000");
}

const clipboardTextbox = document.querySelector(".clipboard-textbox");

const copyButtonButton = document.querySelector('[data-copy="pasted"]');
copyButtonButton.style.display = "none";
const tooBigText = document.querySelector(".too-big");
let buttonTemplate1 = `{"type":"@webflow/XscpData","payload":{"nodes":[{"_id":"161b77c0-10f8-5ac2-dc05-71c6cf50fdfa","type":"Link","tag":"a","classes":["9107e8fa-66f8-1dab-b2fe-6302ef5bd3eb"],"children":["161b77c0-10f8-5ac2-dc05-71c6cf50fdfb"],"data":{"search":{"exclude":true},"xattr":[{"name":"data-json","value":"`;
let buttonTemplate2 = `"}],"block":"","displayName":"","devlink":{"runtimeProps":{},"slot":""},"attr":{"id":""},"visibility":{"conditions":[]},"button":true,"link":{"mode":"external","url":"#"}}},{"_id":"161b77c0-10f8-5ac2-dc05-71c6cf50fdfb","text":true,"v":"Copy component"}],"styles":[{"_id":"9107e8fa-66f8-1dab-b2fe-6302ef5bd3eb","fake":false,"type":"class","name":"copy-component-button","namespace":"","comb":"","styleLess":"","variants":{},"children":[],"createdBy":"64392523fff632c4f7f0c7bf","selector":null}],"assets":[],"ix1":[],"ix2":{"interactions":[],"events":[],"actionLists":[]}},"meta":{"unlinkedSymbolCount":0,"droppedLinks":0,"dynBindRemovedCount":0,"dynListBindRemovedCount":0,"paginationRemovedCount":0}}`;
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
    // activateCopyButton();

    // if formatted data length less the 1000:
    if (formattedData.length < 10000) {
        copyButtonButton.style.display = "inline-block";
        copyButtonButton.addEventListener("click", function () {
            clickHandler(buttonTemplate1 + formattedData + buttonTemplate2);
        });
    } else {
        copyButtonButton.style.display = "none";
        tooBigText.style.display = "inline-block";
    }

    console.log("result: ", buttonTemplate1 + formattedData + buttonTemplate2);
    console.log("Component in textbox");
});

function clickDivCopy() {
    const clickableDivs = document.querySelectorAll(".click-copy");

    clickableDivs.forEach((div) => {
        div.addEventListener("click", function () {
            console.log("leyts copy...");
            const data = div.innerHTML;
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
clickDivCopy();

function addCopyListenerToElement(el, text) {
    el.style.cursor = "pointer";

    el.addEventListener("click", function () {
        if (el.classList.contains("component-code-block")) {
            text = formattedData;
        }
        navigator.clipboard
            .writeText(text)
            .then(function () {
                console.log("Text copied to clipboard:", text.slice(0, 100));
                showCopyPopup();
            })
            .catch(function (error) {
                console.error("Failed to copy text:", error);
            });
    });
}

hljs.addPlugin({
    "after:highlightElement": function ({ el, result, text }) {
        addCopyListenerToElement(el, text);
    },
});
