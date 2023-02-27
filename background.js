chrome.commands.onCommand.addListener(async (command) => {
    if(command === 'start_gpt') {
        const tabID = await getChatTabID();

        if(tabID === -1) {
            openChatGPT();
        }else {
            sendMessageToActiveTab("on_screen_popup");
        }
    }
})

chrome.runtime.onMessage.addListener(async (request, sender, response) => {
    if(request.action === 'makeSearch') {
        sendMessageToChatGPT(request.action, request.input);
    }else if(request.action === 'sendResponse') {
        sendMessageToActiveTab(request.action, request.response);
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

async function sendMessageToActiveTab(action, response) {
    const activeTabID = await getActiveTabID();

    chrome.tabs.sendMessage(activeTabID, {action, response});
}

async function sendMessageToChatGPT(action, input) {
    const chatID = await getChatTabID();

    chrome.tabs.sendMessage(chatID, {action, input})
}