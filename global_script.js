let popup_visible = false;

chrome.runtime.onMessage.addListener((request, sender, response) => {
    if(request.action === "on_screen_popup") {
        console.log('On screen popup activated');
        
        if(!popup_visible)
            container.style.display = "flex";
        else
            container.style.display = "none";

        popup_visible = !popup_visible;

    }
});

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
mainArea.style.display = "flex";
mainArea.style.flexDirection = 'column';
mainArea.style.width = "480px";
mainArea.style.height = "580px";
mainArea.style.backgroundColor = "white";
mainArea.style.padding = "10px";
mainArea.style.boxShadow = '2px 2px 22px 0px rgba(153,153,153,1)';
container.appendChild(mainArea);

const header = document.createElement('header');
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
inputArea.appendChild(input);

const button = document.createElement('button');
button.innerText = 'Send';
button.style.width = '10%';
button.style.height = '40px';
button.style.border = "none";
button.style.outline = "none";

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
    input.value = '';
  });
  
  inputArea.appendChild(button);

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
receivedMessage.innerText = 'Hello, how can I help you?';
receivedMessage.style.backgroundColor = '#f2f2f2';
receivedMessage.style.borderRadius = '5px';
receivedMessage.style.padding = '5px';
receivedArea.appendChild(receivedMessage);
textArea.append(receivedArea);

document.addEventListener('keypress', (event) => {
    if(event.shiftKey && event.key === 'Enter') {
        event.preventDefault(); 
        input.value = input.value + '\n';
        
        let currentRows = parseInt(input.rows);
        let newRow =currentRows < 5 ? (currentRows + 1).toString() : input.rows;

        input.rows = newRow;
    }
    else if(event.key === 'Enter') {
        event.preventDefault(); 
        button.click();
    } 
})