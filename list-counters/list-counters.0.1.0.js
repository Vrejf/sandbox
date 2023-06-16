// list counters 0.1.0 230616 - 15.00

function listCounters() {
    console.log("Hello world!");

    const params = {
        apiUrl: "https://utils-api-git-experimental-vrejf.vercel.app/api/counters?limit=4",
        putUrl: "https://utils-api-git-experimental-vrejf.vercel.app/api/counter/",
    }

    // fetch data
    async function fetchCounters() {
        console.log("fetching...")
        try {
            let data;
            const response = await fetch(params.apiUrl);
            if (!response.ok) {
                data = await response.json();
                console.log(data);
                console.log(response.statusText)
            }
            data = await response.json();
            return data

        } catch (e) {
            console.log("Catch error: ", e)
            return {
                error: e
            }
        }
    }
    // render to page
    function renderList(data) {
        const listanElement = document.querySelector(".listan");

        data.forEach(item => {
            const itemHTML = `
            <div>
            <h2>${item.name}</h2>
            <h3 id="counter-${item.id}">${item.count}</h3>
            <p>Item ID: ${item.id}</p>
            <p>Form: ${item.form}</p>
            <p>Date Created: ${item.date_created}</p>
            <p>Last Updated: ${item.last_updated}</p>
            <p>Site ID: ${item.site_id}</p>
            <input type="number" name="newvalue" value="${item.count}" id="new-${item.id}">
            <input type="button" value="Update" onclick="listUpdateCounter('${encodeURIComponent(JSON.stringify(item))}')">
            </div>
            `;

            listanElement.innerHTML += itemHTML;
        });
    }
    //<input type="button" value="Update" onclick="listUpdateCounter('${item.name}', '${item.id}')">
    // send data
    async function makeUpdateFetch(data) {
        console.log("make update fetch")
        console.log("counter name: ", data.name)
        const url = new URL(data.name, params.putUrl);
        console.log("put to url: ", url);
        try {
            const response = await fetch(url, {
                method: "PUT",
                body: JSON.stringify({
                    name: "default",
                    site: data.site_id,
                    count: data.newValue,
                }),
            });

            if (!response.ok) {
                throw new Error('Response error');
            }
            // SUccess
            console.log(await response.statusText)

            //return response.json();

        } catch (error) {

            console.error('An error occurred:', error);
        }
    }
    // {
    //     "count": 8111,
    //     "name": "default",
    //     "site": "63ee0fb8d55a33704ca9a61a"
    // }
    const getlink = document.getElementById("getlist");

    getlink.addEventListener("click", async function (event) {
        event.preventDefault();
        console.log("getting data")
        const data = await fetchCounters();
        console.log("data: ", data);
        renderList(data);

    })

    return { makeUpdateFetch };

};
// update counter
function listUpdateCounter(item) {
    const decodedItemString = decodeURIComponent(item); // Decode the encoded JSON string
    const data = JSON.parse(decodedItemString)

    const main = listCounters();
    data.newValue = document.getElementById(`new-${data.id}`).value;
    console.log("update counter ", data);
    console.log("update", data.name, "new value: ", data.newValue)
    document.getElementById(`counter-${data.id}`).innerText = data.newValue;
    main.makeUpdateFetch(data, data.newValue);
}



(function initListCounters() {
    console.log("init list counters");
    //listUpdateCounter("jens", "1");
    document.addEventListener("DOMContentLoaded", listCounters);
})();