const copyPopup = document.querySelector(".copy-popup");
copyPopup.style.opacity = 0;

// Activate Copy button for code blocks
hljs.addPlugin(
    new CopyButtonPlugin({
        callback: (text, el) => console.log("Copied to clipboard", text),
    })
);

// Copy components buttons:
// const buttons = document.querySelectorAll(".copy-component-button");
// buttons.forEach((button) => {
//     button.addEventListener("click", copyJSON);
// });

// Copy components:
// function copyJSON(event) {
//     const button = event.target;
//     const jsonData = button.dataset.json;
//     const formattedData = jsonData.replace(/'/g, '"');
//     // Parse the JSON data
//     let data = JSON.stringify(formattedData);

//     document.addEventListener(
//         "copy",
//         (event) => {
//             console.log("Object copied");
//             if (event.clipboardData) {
//                 event.clipboardData.setData("application/json", formattedData);
//             } else if (window.clipboardData) {
//                 window.clipboardData.setData("application/json", formattedData);
//             }
//             event.preventDefault();
//         },
//         true
//     );
//     document.execCommand("copy");
//     showCopyPopup();
// }
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

    setTimeout(() => {
        // Code to be executed after the copy action and a delay
        // ...
    }, 1000); // 1000 milliseconds (1 second) delay
}

function showCopyPopup() {
    const copyPopup = document.querySelector(".copy-popup");
    copyPopup.style.opacity = 1;
    // timout 200 ms then hide the popup

    setTimeout(() => {
        copyPopup.style.opacity = 0;
    }, "3000");
}

const clipboardTextbox = document.querySelector(".clipboard-textbox");
const copyButtonButton = document.querySelector(".copy-button-button");
copyButtonButton.display = "none";
let buttonTemplate1 = `{"type":"@webflow/XscpData","payload":{"nodes":[{"_id":"161b77c0-10f8-5ac2-dc05-71c6cf50fdfa","type":"Link","tag":"a","classes":["9107e8fa-66f8-1dab-b2fe-6302ef5bd3eb"],"children":["161b77c0-10f8-5ac2-dc05-71c6cf50fdfb"],"data":{"search":{"exclude":true},"xattr":[{"name":"data-json","value":"`;
let buttonTemplate2 = `"}],"block":"","displayName":"","devlink":{"runtimeProps":{},"slot":""},"attr":{"id":""},"visibility":{"conditions":[]},"button":true,"link":{"mode":"external","url":"#"}}},{"_id":"161b77c0-10f8-5ac2-dc05-71c6cf50fdfb","text":true,"v":"Copy component"}],"styles":[{"_id":"9107e8fa-66f8-1dab-b2fe-6302ef5bd3eb","fake":false,"type":"class","name":"copy-component-button","namespace":"","comb":"","styleLess":"","variants":{},"children":[],"createdBy":"64392523fff632c4f7f0c7bf","selector":null}],"assets":[],"ix1":[],"ix2":{"interactions":[],"events":[],"actionLists":[]}},"meta":{"unlinkedSymbolCount":0,"droppedLinks":0,"dynBindRemovedCount":0,"dynListBindRemovedCount":0,"paginationRemovedCount":0}}`;
// Get component from clipboard
clipboardTextbox.addEventListener("paste", (event) => {
    const clipboardData = event.clipboardData;
    const jsonData = clipboardData.getData("application/json");

    // Replace all double quotes with single quotes
    const formattedData = jsonData.replace(/"/g, "'");

    // Display clipboard data in the code block
    document.querySelector(".component-code-block").innerHTML = formattedData;
    copyButtonButton.display = "inline-block";
    copyButtonButton.setAttribute(
        "data-json",
        buttonTemplate1 + formattedData + buttonTemplate2
    );

    console.log("Component in textbox");
});

//{"type":"@webflow/XscpData","payload":{"nodes":[{"_id":"161b77c0-10f8-5ac2-dc05-71c6cf50fdfa","type":"Link","tag":"a","classes":["9107e8fa-66f8-1dab-b2fe-6302ef5bd3eb"],"children":["161b77c0-10f8-5ac2-dc05-71c6cf50fdfb"],"data":{"search":{"exclude":true},"xattr":[{"name":"data-json","value":"
//{'type':'@webflow/XscpData','payload':{'nodes':[{'_id':'7acbaf0d-55aa-cd00-845b-0387236286fa','type':'Heading','tag':'h1','classes':['0e60b558-fba8-4fc9-ef22-471bbe1b0c29'],'children':['7acbaf0d-55aa-cd00-845b-0387236286fb'],'data':{'search':{'exclude':false},'xattr':[],'displayName':'','devlink':{'runtimeProps':{},'slot':''},'attr':{'id':''},'visibility':{'conditions':[]},'tag':'h1'}},{'_id':'7acbaf0d-55aa-cd00-845b-0387236286fb','text':true,'v':'HTML'}],'styles':[{'_id':'0e60b558-fba8-4fc9-ef22-471bbe1b0c29','fake':false,'type':'class','name':'Heading-small','namespace':'','comb':'','styleLess':'font-family: Montserrat; font-size: 20px; font-weight: 600;','variants':{},'children':[],'createdBy':'64392523fff632c4f7f0c7bf','selector':null}],'assets':[],'ix1':[],'ix2':{'interactions':[],'events':[],'actionLists':[]}},'meta':{'unlinkedSymbolCount':0,'droppedLinks':0,'dynBindRemovedCount':0,'dynListBindRemovedCount':0,'paginationRemovedCount':0}}
//"}],"block":"","displayName":"","devlink":{"runtimeProps":{},"slot":""},"attr":{"id":""},"visibility":{"conditions":[]},"button":true,"link":{"mode":"external","url":"#"}}},{"_id":"161b77c0-10f8-5ac2-dc05-71c6cf50fdfb","text":true,"v":"Copy component"}],"styles":[{"_id":"9107e8fa-66f8-1dab-b2fe-6302ef5bd3eb","fake":false,"type":"class","name":"copy-component-button","namespace":"","comb":"","styleLess":"","variants":{},"children":[],"createdBy":"64392523fff632c4f7f0c7bf","selector":null}],"assets":[],"ix1":[],"ix2":{"interactions":[],"events":[],"actionLists":[]}},"meta":{"unlinkedSymbolCount":0,"droppedLinks":0,"dynBindRemovedCount":0,"dynListBindRemovedCount":0,"paginationRemovedCount":0}}
