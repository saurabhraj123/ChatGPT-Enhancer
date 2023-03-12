let content = '';
let listening = false;

chrome.runtime.onMessage.addListener((request, sender, response) => {
    if (request.action === 'makeSearch') {
        makeSearch(request.input);
    }
})

function makeSearch(input) {
    // console.log('I am inside makeSearch');
    const textArea = document.querySelector('textarea');
    textArea.value = input;

    const submitBtn = document.querySelector('button.absolute.p-1.rounded-md.text-gray-500.bottom-1\\.5.right-1.md\\:bottom-2\\.5.md\\:right-2.hover\\:bg-gray-100.dark\\:hover\\:text-gray-400.dark\\:hover\\:bg-gray-900.disabled\\:hover\\:bg-transparent.dark\\:disabled\\:hover\\:bg-transparent');

    submitBtn.click();
}

function sendResponse(action, response) {
    chrome.runtime.sendMessage({ action: action, response: response })
}

const target = document.querySelector('main > div.flex-1.overflow-hidden > div > div > div');

const observer = new MutationObserver((mutations) => {
    handlePageMutation();
    // console.log('I am called');
    mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
            sendResponse('newParagraph');
            // console.log('yaha aa gya');
        }
        else if (mutation.type === 'characterData') {
            let output = mutation.target.textContent.trimEnd();
            // console.log('Output', output);
            sendResponse('on_response_update', output);
        }
    })
})

const config = { childList: true, characterData: true, subtree: true };

window.onload = () => {
    // console.log('window loaded');
    observer.observe(target, config);
    
    addSpeakBtn();
    bindSpeechFeature();
}

function handlePageMutation() {
    setInterval(() => {
        const speakBtn = document.querySelector('#speakBtn');

        // console.log('run before');
        if (speakBtn) return;

        addSpeakBtn();
        bindSpeechFeature();
        observer.observe(target, config);

        // console.log('run after');

        // clearInterval(speakBtnCheck);
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
    console.log(speakBtn);

    recognition.onstart = () => {
        listening = true;
        console.log('recognition started');
    }

    recognition.onspeechend = () => {
        listening = false;
        console.log('recognition end');
        const submitBtn = document.querySelector('button.absolute.p-1.rounded-md.text-gray-500.bottom-1\\.5.right-1.md\\:bottom-2\\.5.md\\:right-2.hover\\:bg-gray-100.dark\\:hover\\:text-gray-400.dark\\:hover\\:bg-gray-900.disabled\\:hover\\:bg-transparent.dark\\:disabled\\:hover\\:bg-transparent');

        setTimeout(() => {
            submitBtn.click();
        }, 1000)

        document.querySelector('textarea').style.height = 0;
    }

    recognition.onerror = () => {
        console.log('recognition error');
    }

    recognition.addEventListener('result', (event) => {
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

        textarea.value = content;
    })

    speakBtn.addEventListener('click', () => {
        if (content.length) {
            content = '';
        }
        console.log(speakBtn);

        console.log('speech btn is clicked')

        if (!listening) {
            recognition.start();
            // listening = true;
        } else {
            recognition.stop();
            // listening = false;
        }
    })
}

// const main = document.querySelector('main');
// const mainObserver = new MutationObserver((mutations) => {
//     console.log('mutation ho gya yaha he ram');
//     addCopyBtn();
// })

setInterval(() => {
    // console.log('bar bar dekho aur copy btn add karo');
    addCopyBtn();
}, 500)

function addCopyBtn() {
    const outerDiv = document.getElementsByClassName('relative flex w-[calc(100%-50px)] flex-col gap-1 md:gap-3 lg:w-[calc(100%-115px)]');
    // console.log('inside copy btn fun');
    for(let innerDiv of outerDiv) {
        // console.log('inside loop')
        let likeDiv = innerDiv.getElementsByClassName('flex justify-between')[0].firstChild;
    
        if(likeDiv) {
            if(likeDiv.querySelector('.copyIcon')) return;

            // console.log('Length like:', likeDiv.length);
            const copyIcon = document.createElement('img');
            copyIcon.classList.add("copyIcon");
            copyIcon.classList.add('p-1');
            copyIcon.style.height = '25px';
            copyIcon.style.width = '21px';
            copyIcon.style.cursor = 'pointer';
            copyIcon.src = chrome.runtime.getURL('images/copy.svg');
            
            likeDiv.appendChild(copyIcon);

            likeDiv.addEventListener('click', () => {
                const output = likeDiv.parentElement.parentElement.parentElement.innerText;
                // console.log('output is:', output);
                copyToClipboard(output);
            })
        }
    }    
}

function copyToClipboard(text) {
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
  }
  
  