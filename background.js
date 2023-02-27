chrome.commands.onCommand.addListener(async (command) => {
    if(command === 'start_gpt') {
        const tabID = await getChatTabID();

        if(tabID === -1) {
            openChatGPT();
        }else {
            sendMessage("on_screen_popup");
        }
    }
})

async function getChatTabID() {
    const tabs = await chrome.tabs.query({url: "https://chat.openai.com/chat/*"});

    if(tabs.length === 0)
        return -1; 

    return tabs[0].id;
}

async function getActiveTabID() {
    const tabs = await chrome.tabs.query({active: true, currentWindow: true});

    if(tabs.length === 0)
        return -1;

    return tabs[0].id;
}

function openChatGPT() {
    chrome.tabs.create({url: "https://chat.openai.com/chat"});
}

async function sendMessage(action) {
    const activeTabID = await getActiveTabID();

    chrome.tabs.sendMessage(activeTabID, {action:action});
}
