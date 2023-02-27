chrome.runtime.onMessage.addListener((request, sender, response) => {
    if (request.action === 'makeSearch') {
        makeSearch(request.input);
    }
})

function makeSearch(input) {
    const textArea = document.querySelector('textarea');
    textArea.value = input;

    const submitBtn = document.querySelector('button.absolute.p-1.rounded-md.text-gray-500.bottom-1\\.5.right-1.md\\:bottom-2\\.5.md\\:right-2.hover\\:bg-gray-100.dark\\:hover\\:text-gray-400.dark\\:hover\\:bg-gray-900.disabled\\:hover\\:bg-transparent.dark\\:disabled\\:hover\\:bg-transparent');

    submitBtn.click();
}

function sendResponse(action, response) {
    chrome.runtime.sendMessage({action: action, response: response})
}

const target = document.querySelector('main > div.flex-1.overflow-hidden > div > div > div');

const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if(mutation.type === 'characterData') {
            let output = mutation.target.textContent.trimEnd();
            console.log('Output', output);
            sendResponse('sendResponse', output);
        }
    })
})

const config = { childList: true, characterData: true, subtree: true };

window.onload = () => {
    observer.observe(target, config);
}