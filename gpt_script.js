let content = '';
let listening = false;

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
        if(mutation.type === 'childList') {
            sendResponse('newParagraph');
            console.log('yaha aa gya');
        }
        else if(mutation.type === 'characterData') {
            let output = mutation.target.textContent.trimEnd();
            console.log('Output', output);
            sendResponse('sendResponse', output);
        }
    })
})

const config = { childList: true, characterData: true, subtree: true };

window.onload = () => {
    observer.observe(target, config);
    // formObserver.observe(form, config);
    addSpeakBtn();
    bindSpeechFeature();
}


function addSpeakBtn() {
    const formContainer = document.querySelector('form').lastChild.lastChild;

    const speakBtn = document.createElement('img');
    speakBtn.id = 'speakBtn';
    speakBtn.src = chrome.runtime.getURL("images/mic.svg");
    speakBtn.style.position = 'absolute';
    speakBtn.style.bottom = '13px';
    speakBtn.style.right = '45px';
    speakBtn.style.width = '20px';
    speakBtn.style.height = '20px';
    speakBtn.style.zIndex = '999999999999';
    speakBtn.style.cursor = 'pointer';

    formContainer.appendChild(speakBtn);
}

function bindSpeechFeature() {
    let speechRecognition = window.webkitSpeechRecognition;
    let recognition = new speechRecognition();
    recognition.interimResults = true;
    const speakBtn = document.querySelector('#speakBtn');
    console.log(speakBtn);

    recognition.onstart = () => {
        listening = true;
        console.log('recognition started');
    }

    recognition.onspeechend = () => {
        listening = false;
        console.log('recognition end');
    }

    recognition.onerror = () => {
        console.log('recognition error');
    }

    // recognition.onresult = (event) => {
    //     let current = event.resultIndex;
        
    //     let transcript = event.results[current][0].transcript;

    //     content += transcript;
    //     console.log('content is->', content);

    //     document.querySelector('textarea').value = content;
    // }

    recognition.addEventListener('result', (event) => {
        let current = event.resultIndex;
        
        let transcript = event.results[0][0].transcript;

        content = transcript;
        console.log('content is->', content);

        const textarea = document.querySelector('textarea');

        
        textarea.setAttribute("style", "height:" + (textarea.scrollHeight) + "px;overflow-y:hidden;");
        textarea.addEventListener("input", OnInput, false);
        

        function OnInput() {
            this.style.height = 0;
            this.style.height = (this.scrollHeight) + "px";
        }

        textarea.style.height = 'auto';
        textarea.value = content;
        textarea.dispatchEvent(new Event('input'));
    })

    // recognition.addEventListener('interimresult', event => {
    //     const transcript = Array.from(event.results)
    //       .map(result => result[0].transcript)
    //       .join(' ');
        
    //       content = transcript;
    //   });

    speakBtn.addEventListener('click', () => {
        if(content.length) {
            content = '';
        }
        console.log(speakBtn);

        console.log('speech btn is clicked')

        if(!listening) {
            recognition.start();
            // listening = true;
        } else {
            recognition.stop();
            // listening = false;
        }
    })
}
