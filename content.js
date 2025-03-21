function showOverlay() {
    if (document.getElementById('soulslike-email-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'soulslike-email-overlay';
    overlay.className = 'overlay';

    const imgContainer = document.createElement('div');
    imgContainer.className = 'img-container';
    
    const layer1 = document.createElement('img');
    layer1.src = chrome.runtime.getURL('public/layer1.png');
    layer1.alt = 'Layer 1';
    layer1.className = 'layer layer1';
    
    const layer2 = document.createElement('img');
    layer2.src = chrome.runtime.getURL('public/layer2.png');
    layer2.alt = 'Layer 2';
    layer2.className = 'layer layer2';
    
    const layer3 = document.createElement('img');
    layer3.src = chrome.runtime.getURL('public/layer3.png');
    layer3.alt = 'Layer 3';
    layer3.className = 'layer layer3';
    
    imgContainer.appendChild(layer1);
    imgContainer.appendChild(layer2);
    imgContainer.appendChild(layer3);
    
    overlay.appendChild(imgContainer);
    document.body.appendChild(overlay);

    overlay.offsetHeight;

    requestAnimationFrame(() => {
        overlay.classList.add('visible');
    });

    setTimeout(() => {
        overlay.classList.remove('visible');
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, 500);
    }, 2500);
}

document.addEventListener('click', (event) => {
    let target = event.target;

    while (target && target !== document.body) {
        if (
            target.matches('[role="button"][aria-label*="Send"]') ||
            target.textContent.trim() === 'Send'
        ) {
            console.log('Send button clicked');
            showOverlay();
            break;
        }
        target = target.parentElement;
    }
});

const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) { // 元素节点
                if (
                    node.matches('[role="button"][aria-label*="Send"]') ||
                    node.textContent.trim() === 'Send'
                ) {
                    console.log('Send button detected');
                    node.addEventListener('click', () => {
                        console.log('Send button clicked via MutationObserver');
                        showOverlay();
                    });
                }
            }
        });
    });
});

const config = { childList: true, subtree: true };

observer.observe(document.body, config);

const initialSendButton = document.querySelector('[role="button"][aria-label*="Send"], [role="button"][data-tooltip*="Send"]');
if (initialSendButton) {
    console.log('Initial send button found');
    initialSendButton.addEventListener('click', () => {
        console.log('Send button clicked (initial)');
        showOverlay();
    });
} else {
    console.log('Initial send button not found');
}