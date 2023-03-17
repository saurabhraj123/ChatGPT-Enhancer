let content = '';
let speechText = '';
let textToSpeechEnabled = true; 
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
    chrome.runtime.sendMessage({ action: action, response: response })
}

const divTarget = document.querySelector('main > div.flex-1.overflow-hidden > div > div > div');
const target = document.querySelector('body');

const observer = new MutationObserver((mutations) => {
    handlePageMutation();
    console.log('mutations are happening');
    mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
            sendResponse('newParagraph');
            text = '';
        } else if (mutation.type === 'characterData' && mutation.target === divTarget || target.contains(mutation.target)) {
            let output = mutation.target.textContent.trimEnd();
            sendResponse('on_response_update', output);

            console.log('just before puncutation');
            const lastChar = output.slice(-1) !== '"' ? output.slice(-1) : output[output.length - 2];
            console.log('Text:', text, '-> lastChar:', lastChar);
            if(isPunctuation(lastChar)) {
                if(!textToSpeechEnabled) return;
                
                console.log('puncutation found');
                let newPara = output.slice(text.length);
                let speech = new SpeechSynthesisUtterance(newPara);
                speechSynthesis.speak(speech);
                text = output;
            }
        }
    })
})

function isPunctuation(char) {
    return char === '.' || char === '?' || char === '!' || char === ':';
}

const config = { childList: true, characterData: true, subtree: true };

window.onload = () => {
    observer.observe(target, config);

    addSpeakBtn();
    bindSpeechFeature();

    setInterval(() => {
        // console.log('Copy btn added');
        addCopyBtn();
        observer.observe(target, config);
    }, 500)
}

function handlePageMutation() {
    setInterval(() => {
        const speakBtn = document.querySelector('#speakBtn');

        if(speakBtn) return;

        addSpeakBtn();
        bindSpeechFeature();
        observer.observe(target, config);
    }, 1000)
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

    const textarea = document.querySelector('textarea');
    textarea.style.paddingRight = '4rem';
}

function bindSpeechFeature() {
    let speechRecognition = window.webkitSpeechRecognition;
    let recognition = new speechRecognition();
    recognition.interimResults = true;
    const speakBtn = document.querySelector('#speakBtn');

    recognition.onstart = () => {
        listening = true;
        const speakBtn = document.querySelector('#speakBtn');
        speakBtn.src = chrome.runtime.getURL("images/mic-active.svg");
        // console.log('recognition started');
    }

    recognition.onspeechend = () => {
        listening = false;
        // console.log('recognition end');
        const submitBtn = document.querySelector('button.absolute.p-1.rounded-md.text-gray-500.bottom-1\\.5.right-1.md\\:bottom-2\\.5.md\\:right-2.hover\\:bg-gray-100.dark\\:hover\\:text-gray-400.dark\\:hover\\:bg-gray-900.disabled\\:hover\\:bg-transparent.dark\\:disabled\\:hover\\:bg-transparent');

        setTimeout(() => {
            submitBtn.click();

            const speakBtn = document.querySelector('#speakBtn');
            speakBtn.src = chrome.runtime.getURL("images/mic.svg");
        }, 1000)

        document.querySelector('textarea').style.height = 0;
    }

    recognition.onerror = () => {
        console.log('recognition error');
        const speakBtn = document.querySelector('#speakBtn');
        speakBtn.src = chrome.runtime.getURL("images/mic.svg");
    }

    recognition.addEventListener('result', (event) => {
        let transcript = event.results[0][0].transcript;

        content = transcript;
        // console.log('content is->', content);

        const textarea = document.querySelector('textarea');


        textarea.setAttribute("style", "height:" + (textarea.scrollHeight) + "px;overflow-y:hidden;");
        textarea.addEventListener("input", OnInput, false);


        function OnInput() {
            this.style.height = 0;
            this.style.height = (this.scrollHeight) + "px";
        }

        textarea.value = content;
    })

    speakBtn.addEventListener('click', () => {
        if (content.length) {
            content = '';
        }
        // console.log(speakBtn);

        // console.log('speech btn is clicked')

        if (!listening) {
            recognition.start();
            listening = true;
        } else {
            // listening = false;
            const speakBtn = document.querySelector('#speakBtn');
            speakBtn.src = chrome.runtime.getURL("images/mic-active.svg");
        }
    })
}

function addCopyBtn() {
    const outerDiv = document.querySelectorAll('.relative.flex.w-\\[calc\\(100\\%-50px\\)\\].flex-col.gap-1.md\\:gap-3.lg\\:w-\\[calc\\(100\\%-115px\\)\\]');

    // console.log('outerDiv:', outerDiv);
    let count = 0;
    outerDiv.forEach((innerDiv) => {
        // console.log(++count, ':', innerDiv.innerText);
        try {
            let likeDiv = innerDiv.getElementsByClassName('flex justify-between')[0].firstChild;

            if (likeDiv) {
                if (likeDiv.querySelector('.copyIcon')) return;

                const copyIcon = document.createElement('img');
                copyIcon.classList.add("copyIcon");
                copyIcon.classList.add('p-1');
                copyIcon.style.height = '30px';
                copyIcon.style.width = '25px';
                copyIcon.style.cursor = 'pointer';
                copyIcon.src = chrome.runtime.getURL('images/copy.svg');
                likeDiv.appendChild(copyIcon);

                copyIcon.addEventListener('mouseover', () => {
                    copyIcon.style.backgroundColor = '#ECECF1';
                    copyIcon.style.borderRadius = '7px';
                })

                copyIcon.addEventListener('mouseleave', () => {
                    copyIcon.style.backgroundColor = 'transparent';
                })

                copyIcon.addEventListener('click', () => {
                    const output = likeDiv.parentElement.parentElement.parentElement.innerText;
                    copyToClipboard(output);

                    copyIcon.src = chrome.runtime.getURL('images/yes.svg');
                    setTimeout(() => {
                        copyIcon.src = chrome.runtime.getURL('images/copy.svg');
                    }, 2000)
                })
            }
        }catch(err) {};
    });
}

function copyToClipboard(text) {
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
}

