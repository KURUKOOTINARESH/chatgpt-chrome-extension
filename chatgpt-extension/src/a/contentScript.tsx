import Chatgpt from "./chatgpt";
import React from 'react';
import ReactDOM from 'react-dom/client';
export {};

let youtubeLeftControls, youtubePlayer;
let currentVideo = "";

const closeModal = ()=>{
    const modalContainer = document.querySelector('.extension-modal');
    if (modalContainer) {
        modalContainer.remove();
    }
}


const openChatGptEventHandler = async ()=>{


    const modalContainer = document.createElement('div');
    modalContainer.className = 'extension-modal';
    modalContainer.id = 'extensionModall';
    modalContainer.setAttribute('style',
    'position:fixed;background-color:#000000a0;top: 0;left: 0;width: 100%;height: 100%;display: flex;flex-direction:column;justify-content: center;align-items: center;z-index: 9999;');
    document.body.appendChild(modalContainer);

    const modalContainerRoot = ReactDOM.createRoot(
        document.getElementById('extensionModall') as HTMLElement
    );
      
      
    modalContainerRoot.render(
        <React.StrictMode>
              <Chatgpt />
        </React.StrictMode>
    );
    
    

    /*// Append the modal container to the document body
    document.body.appendChild(modalContainer);

    // // Get the URL of the extension's popup page
    // const popupUrl = chrome.runtime.getURL('index.html');

    // // Create an iframe element to load the extension's popup
    const modalContentCon = document.createElement('div');
    modalContentCon.setAttribute('id',"modalContentContainer")
    
    
    const leftSectionWrapper = document.createElement("div")

    const closeBtnWrapper = document.createElement("div")
    
    closeBtnWrapper.setAttribute('style','background-color: #fff;width: 70%;padding: 12px;box-sizing:border-box;display: flex;justify-content:end')
    const closeBtn = document.createElement("button")    
    
    closeBtn.setAttribute('style','background-color: transparent;border: none;font-size: 24px;font-weight: bold')
    closeBtn.innerText = "X"
    closeBtnWrapper.appendChild(closeBtn)
    modalContainer.appendChild(closeBtnWrapper)
  
    modalContentCon.setAttribute('style','width: 70%;height: 600px;background-color: #fff;')
    // iframe.src = popupUrl;

    // Append the iframe to the modal container
    modalContainer.appendChild(modalContentCon);
    closeBtn.addEventListener('click', closeModal);*/
}

const getChatGptBtn = (type:boolean)=>{
    
    const chatgptBtn = document.createElement("button");
    chatgptBtn.className = "chatgpt-btn";
    chatgptBtn.setAttribute('style','border:none;background-color:transparent;margin-left:auto');
    chatgptBtn.title = "Click to get chatGPT";

    const chatgptImg = document.createElement("img");

    chatgptImg.src = chrome.runtime.getURL("assets/chatgpt.png");
    chatgptImg.style.width = "32px"
    chatgptImg.className = "chatgpt-btn-image";

    chatgptBtn.appendChild(chatgptImg)
    

    youtubeLeftControls = document.getElementsByClassName("ytp-left-controls")[0];
    youtubePlayer = document.getElementsByClassName('video-stream')[0];

    if(type){
        if(youtubeLeftControls){
            youtubeLeftControls.appendChild(chatgptBtn);
            chatgptBtn.addEventListener("click", openChatGptEventHandler);
        }
    }
    else{
        const chtgptBtnElement = document.getElementsByClassName("chatgpt-btn")[0]
        if(chtgptBtnElement){
            youtubeLeftControls.removeChild(chtgptBtnElement);
        }
        
    }
}

const isEnabled = localStorage.getItem("isEnabled")
const type = isEnabled==="true" ? true : false
getChatGptBtn(type)


chrome.runtime.onMessage.addListener((obj:any, sender:any, response:any) => {
    const { type, isEnabled } = obj;

    if(isEnabled!== undefined){
        localStorage.setItem("isEnabled",isEnabled)
    }
    
    

    if(type === "Enable"){
        getChatGptBtn(true)
    }
    else if(type === "Disable"){
        getChatGptBtn(false)
    }
    else if (type === "New"){
        const isEnabled = localStorage.getItem("isEnabled")
        const type = isEnabled==="true" ? true : false
        getChatGptBtn(type)
    }
    
});

