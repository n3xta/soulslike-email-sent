const STYLE_KEY = 'soulslike_overlay_style';

function getSelectedStyle(callback) {
    try {
        if (chrome && chrome.storage && chrome.storage.sync) {
            chrome.storage.sync.get([STYLE_KEY], (result) => {
                const style = result && result[STYLE_KEY] ? result[STYLE_KEY] : 'elden_ring';
                callback(style);
            });
            return;
        }
    } catch (e) {}
    try {
        const local = localStorage.getItem(STYLE_KEY);
        callback(local || 'elden_ring');
    } catch (e) {
        callback('elden_ring');
    }
}

function setSelectedStyle(style) {
    try {
        if (chrome && chrome.storage && chrome.storage.sync) {
            chrome.storage.sync.set({ [STYLE_KEY]: style });
            return;
        }
    } catch (e) {}
    try {
        localStorage.setItem(STYLE_KEY, style);
    } catch (e) {}
}

function ensureStylePanel() {
    if (document.getElementById('soulslike-style-panel')) return;

    const panel = document.createElement('div');
    panel.id = 'soulslike-style-panel';

    const label = document.createElement('span');
    label.textContent = 'Overlay Style';

    const select = document.createElement('select');
    select.id = 'soulslike-style-select';
    [
        { value: 'ds1', text: 'Dark Souls 1' },
        { value: 'ds2', text: 'Dark Souls 2' },
        { value: 'ds3', text: 'Dark Souls 3' },
        { value: 'elden_ring', text: 'Elden Ring' }
    ].forEach(({ value, text }) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = text;
        select.appendChild(option);
    });

    select.addEventListener('change', () => {
        setSelectedStyle(select.value);
    });

    panel.appendChild(label);
    panel.appendChild(select);
    document.body.appendChild(panel);

    getSelectedStyle((style) => {
        select.value = style;
    });
}

function showOverlayForStyle(style) {
    if (document.getElementById('soulslike-email-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'soulslike-email-overlay';
    overlay.className = 'overlay style-' + style;

    const imgContainer = document.createElement('div');
    imgContainer.className = 'img-container';

    const layer1 = document.createElement('img');
    layer1.src = chrome.runtime.getURL(`public/${style}/layer1.png`);
    layer1.alt = 'Layer 1';
    layer1.className = 'layer layer1';

    const layer2 = document.createElement('img');
    layer2.src = chrome.runtime.getURL(`public/${style}/layer2.png`);
    layer2.alt = 'Layer 2';
    layer2.className = 'layer layer2';

    const layer3 = document.createElement('img');
    layer3.src = chrome.runtime.getURL(`public/${style}/layer3.png`);
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

function showOverlay() {
    getSelectedStyle((style) => {
        showOverlayForStyle(style);
    });
}

document.addEventListener('click', (event) => {
    let target = event.target;

    while (target && target !== document.body) {
        if (target.matches('div.dC')) {
            console.log('dC container clicked');
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
                if (node.matches('div.dC')) {
                    console.log('dC container detected');
                    node.addEventListener('click', () => {
                        console.log('dC container clicked via MutationObserver');
                        showOverlay();
                    });
                }
            }
        });
    });
});

const config = { childList: true, subtree: true };

observer.observe(document.body, config);

const initialDcContainer = document.querySelector('div.dC');
if (initialDcContainer) {
    console.log('Initial dC container found');
    initialDcContainer.addEventListener('click', () => {
        console.log('dC container clicked (initial)');
        showOverlay();
    });
} else {
    console.log('Initial dC container not found');
}

// Ensure the floating style selector panel exists
ensureStylePanel();