let copyButton2 = document.getElementById("copy-button-2");
let data2;

const codeSnippet2 = JSON.parse(document.querySelector(".snippet").textContent);

/*copyButton.addEventListener('copy', (event) => {
event.clipboardData.setData('application/json',codeSnippet);
    console.log('copied to cb', JSON.parse(codeSnippet));
    event.preventDefault();
}); */

document.addEventListener("copy", (event) => {
    event.clipboardData.setData("application/json", JSON.stringify(codeSnippet2));
    event.preventDefault();
    console.log("copied to cb", codeSnippet2);
});

copyButton2.onclick = function () {
    document.execCommand("copy");
    copyButton2.innerText = "Copied to clipboard";
    changeButtonText();
};

function changeButtonText() {
    setTimeout(() => {
        copyButton2.innerText = "Copy template";
        // copyButton.innerHTML = `<img src="https://assets-global.website-files.com/6132770a5e2efb2a37b68270/6132770a5e2efbb78db682e2_copy-icon.svg" loading="lazy"><span>Click to Copy!`
    }, 3000);
}

