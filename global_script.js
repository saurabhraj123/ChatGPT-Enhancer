let popup_visible = false;
let scrolled = false;
let text = '';

chrome.runtime.onMessage.addListener((request, sender, response) => {
    if(request.action === "on_screen_popup") {
        console.log('On screen popup activated');
        
        if(!popup_visible) {
            container.style.display = "flex";
            input.focus();
        }
        else
            container.style.display = "none";

        popup_visible = !popup_visible;

    }else if(request.action === 'sendResponse') {
        updateResponseData(request.response);
        scrollToBottom();

        console.log('popup_visible:', popup_visible);
        console.log('In the sendResponse function');
    }else if(request.action === 'newParagraph') {
        console.log('In the new paragraph');
        let currentParagraph = getCurrentParagraph();
        console.log('Current Paragraph is:', currentParagraph);

        if(!currentParagraph.endsWith('\n') && currentParagraph != '') {
            text = (currentParagraph + '\n\n');
            console.log('New text is:', text);
        }
        console.log('popup_visible:', popup_visible);
        scrollToBottom();
    }
});

function scrollToBottom() {
    if(scrolled === false)
        textArea.scrollTop = textArea.scrollHeight;
    
    console.log('scrolled is:', scrolled);
}

function sendMessage(action, input) {
    chrome.runtime.sendMessage({action:action, input:input});
}

function getCurrentParagraph() {
    const div = document.querySelector('#chatHead').nextElementSibling;
    
    return div?.lastChild?.lastChild?.innerText ? div.lastChild.lastChild.innerText : '';
}

function isReponseDivAdded() {
    // const div = document.querySelector('body > div:nth-child(5) > div > div:nth-child(2)')
    const div = document.querySelector('#chatHead').nextElementSibling;

    const sender = div.lastChild.querySelector('div').innerText.trim();
    
    if(sender == 'You:')
        return false;
    else
        return true;
}

function updateResponseData(response) {
    // const div = document.querySelector('body > div:nth-child(5) > div > div:nth-child(2)');
    const div = document.querySelector('#chatHead').nextElementSibling;
    // console.log(response);
    div.lastChild.lastChild.innerText = text + response;
}

const container = document.createElement('div');
container.style.display = 'flex';
container.style.width = '100vw';
container.style.height = '100vh';
container.style.justifyContent = 'center';
container.style.alignItems = 'center';
container.style.position = 'fixed';
container.style.top = '0';
container.style.bottom = '0';
container.style.left = '0';
container.style.right = '0;'
container.style.zIndex = '999999';
container.style.display = "none";

const mainArea  = document.createElement('div');
mainArea.id = 'chatContainer';
mainArea.style.display = "flex";
mainArea.style.flexDirection = 'column';
mainArea.style.width = "480px";
mainArea.style.height = "580px";
mainArea.style.backgroundColor = "white";
mainArea.style.padding = "10px";
mainArea.style.boxShadow = '2px 2px 22px 0px rgba(153,153,153,1)';
container.appendChild(mainArea);

const header = document.createElement('header');
header.id = 'chatHead';
header.style.display = 'flex';
header.style.justifyContent = 'center';
header.style.backgroundColor = '#202123';
header.style.padding = '10px';
const h1 = document.createElement('h1');
h1.innerText = 'ChatGPT Anywhere'
h1.style.color = 'white';
header.appendChild(h1);
mainArea.appendChild(header);

const body = document.querySelector('body');
body.appendChild(container);

const textArea = document.createElement('div');
textArea.style.display = 'flex';
textArea.style.flexDirection = 'column';
textArea.style.height = '100%';
textArea.style.overflowY = 'auto';
textArea.style.padding = '10px';
mainArea.appendChild(textArea);

const inputArea = document.createElement('div');
inputArea.style.display = 'flex';
inputArea.style.justifyContent = 'space-between';
inputArea.style.alignItems = 'center';
inputArea.style.gap = "0.5rem";
inputArea.style.padding = '10px';
mainArea.appendChild(inputArea);

const input = document.createElement('textarea');
input.style.width = '90%';
input.style.padding = '10px';
input.style.resize = 'none';
input.rows = '1';
input.focus();
inputArea.appendChild(input);

const button = document.createElement('button');
button.innerText = 'Send';
button.style.width = '10%';
button.style.height = '40px';
button.style.border = "none";
button.style.outline = "none";
button.style.cursor = "pointer";

button.addEventListener('click', () => {
    const msg = document.createElement('div');
    msg.style.marginBottom = '10px';
    msg.style.borderRadius = '5px';
    msg.style.padding = '10px';
  
    const sender = document.createElement('div');
    sender.innerText = 'You: ';
    sender.style.backgroundColor = '#202123';
    sender.style.color = 'white';
    sender.style.borderRadius = '5px';
    sender.style.padding = '5px';
    msg.appendChild(sender);
  
    const message = document.createElement('div');
    message.innerText = input.value;
    message.style.backgroundColor = '#f2f2f2';
    message.style.borderRadius = '5px';
    message.style.padding = '5px';
    msg.appendChild(message);
    textArea.appendChild(msg);

    sendMessage('makeSearch', input.value);
    
    addResponseContainer();
    text = ''

    input.value = '';
  });
  
  inputArea.appendChild(button);


function addResponseContainer() {
    // Create a div to hold the received messages
    const receivedArea = document.createElement('div');
    receivedArea.style.marginBottom = '10px';
    receivedArea.style.borderRadius = '5px';
    receivedArea.style.padding = '10px';

    // Create a div to hold the sender of the message
    const receiver = document.createElement('div');
    receiver.innerText = 'ChatGPT: ';
    receiver.style.backgroundColor = '#202123';
    receiver.style.color = 'white';
    receiver.style.borderRadius = '5px';
    receiver.style.padding = '5px';
    receivedArea.appendChild(receiver);

    // Create a div to hold the message
    const receivedMessage = document.createElement('div');
    receivedMessage.innerText = '';
    receivedMessage.style.backgroundColor = '#f2f2f2';
    receivedMessage.style.borderRadius = '5px';
    receivedMessage.style.padding = '5px';
    receivedArea.appendChild(receivedMessage);
    textArea.append(receivedArea);
}

container.addEventListener('keypress', (event) => {
    if(!popup_visible) return;

    scrolled = false;


    if(event.shiftKey && event.key === 'Enter') {
        event.preventDefault(); 
        input.value = input.value + '\n';
        
        let currentRows = parseInt(input.rows);
        let newRow =currentRows < 5 ? (currentRows + 1).toString() : input.rows;

        input.rows = newRow;
    }
    else if(event.key === 'Enter') {
        event.preventDefault(); 
        
        if(input.value.trim().length === 0) {
            return;
        }

        button.click();
        scrollToBottom();
    } 
})

let previousScrollY = textArea.scrollTop;
textArea.addEventListener("scroll", function() {
    const currentScrollY = textArea.scrollTop;
    if (currentScrollY < previousScrollY) 
        scrolled = true;
    else if(currentScrollY === previousScrollY)
        scrolled = false;
    
    previousScrollY = currentScrollY;
});    

textArea.addEventListener('scroll', () => {
    if(!popup_visible) return;

    if (textArea.scrollY > this.previousScrollY) 
        scrolled = true;
    
    this.previousScrollY = textArea.scrollY;
    console.log('scrolled is', scrolled);
    
})
