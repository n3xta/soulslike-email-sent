// content.js

// 函数：显示覆盖层
function showOverlay() {
    // 检查是否已经存在覆盖层，避免重复创建
    if (document.getElementById('soulslike-email-overlay')) return;

    // 创建覆盖层
    const overlay = document.createElement('div');
    overlay.id = 'soulslike-email-overlay';
    overlay.className = 'overlay visible';

    // 创建图片元素
    const img = document.createElement('img');
    img.src = chrome.runtime.getURL('emailsent.png');
    img.alt = 'Email Sent';
    img.className = 'popup';

    overlay.appendChild(img);
    document.body.appendChild(overlay);

    // 在3秒后移除覆盖层
    setTimeout(() => {
        overlay.classList.remove('visible');
        // 等待过渡动画完成后移除元素
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, 500); // 与CSS中的transition时间一致
    }, 3000);
}

// 事件委托：监听所有点击事件
document.addEventListener('click', (event) => {
    let target = event.target;

    // 向上遍历DOM树，查找是否有匹配的发送按钮
    while (target && target !== document.body) {
        // 使用更通用的选择器，避免依赖具体的类名
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

// 使用 MutationObserver 监听 DOM 变化，确保动态加载的按钮也能被监听
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) { // 元素节点
                // 检查是否是发送按钮
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

// 配置观察选项
const config = { childList: true, subtree: true };

// 开始监视 Gmail 的 DOM 变化
observer.observe(document.body, config);

// 初始化时查找发送按钮
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