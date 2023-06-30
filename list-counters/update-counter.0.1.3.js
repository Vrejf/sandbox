// form-ID "count-form" with fields: counter-name, site_id, count.
// button ID: go
// statusbox css selector ".status-box"
{
    // Run before DOM load:
    const hideCss = `.status-box { opacity: 0; }`;

    const styleTag = document.createElement("style");
    styleTag.textContent = hideCss;
    document.head.appendChild(styleTag);
}

function showStatus(text, success, color = undefined) {
    const statusBox = document.querySelector(".status-box");
    const statusText = document.querySelector(".status-text");
    statusBox.style.backgroundColor = color;
    statusText.innerText = text;
    statusBox.style.opacity = 1;
    setTimeout(() => {
        statusBox.style.opacity = 0;
    }, "2000");
}

document.addEventListener("DOMContentLoaded", () => {
    const baseurl = "https://utils-api.vercel.app/api/counter/";
    const counterNameInput = document.getElementById("counter-name");

    const form = document.querySelector("#count-form");
    const statusBox = document.querySelector(".status-box");
    const orgColor = statusBox.style.backgroundColor;

    const goButton = document.querySelector("#go");
    goButton.addEventListener("click", async (event) => {
        let url = baseurl + counterNameInput.value;
        const formData = new FormData(form);
        try {
            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(Object.fromEntries(formData.entries())),
            });
            let data;
            if (!response.ok) {
                console.log("Error: ", response.statusCode, response.statusText);
                showStatus("Error", false, "red");
                return;
            }
            data = await response.json();
            console.log("Response: ", data);
            showStatus("Success", true, orgColor);
        } catch (error) {
            console.log(error);
            showStatus("Error", false, "red");
            console.log("error: ", error);
        }
    });
});
