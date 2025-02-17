let isRunning = false;
let interval;

document.getElementById("start").addEventListener("click", async () => {
    isRunning = true;
    document.getElementById("start").innerText = "Running...";
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: startClicking
    });
});

document.getElementById("stop").addEventListener("click", async () => {
    isRunning = false;
    document.getElementById("start").innerText = "Start";
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: stopClicking
    });
});

function startClicking() {
    if (window.autoClickInterval) return;

    const clickPositions = [
        { x: 672, y: 559 }, { x: 622, y: 542 }, { x: 374, y: 574 },
        { x: 429, y: 643 }, { x: 329, y: 671 }, { x: 639, y: 632 },
        { x: 629, y: 379 }, { x: 792, y: 493 }, { x: 849, y: 689 },
        { x: 777, y: 555 }, { x: 414, y: 624 }, { x: 631, y: 482 },
        { x: 536, y: 591 }, { x: 648, y: 544 }, { x: 625, y: 489 }
    ];

    window.autoClickInterval = setInterval(() => {
        const index = Math.floor(Math.random() * clickPositions.length);
        const pos = clickPositions[index];

        console.log(`Trying to click at: ${pos.x}, ${pos.y}`);
        
        const element = document.elementFromPoint(pos.x, pos.y);
        if (element) {
            element.click();
            console.log(`Clicked at: ${pos.x}, ${pos.y}`);
            showClickEffect(pos.x, pos.y);
        } else {
            console.warn(`No clickable element found at: ${pos.x}, ${pos.y}`);
        }
    }, Math.floor(Math.random() * 40) + 10); // Klik lebih cepat
}

function stopClicking() {
    clearInterval(window.autoClickInterval);
    window.autoClickInterval = null;
    console.log("Auto-clicker stopped");
}

function showClickEffect(x, y) {
    const clickEffect = document.createElement("div");
    clickEffect.className = "click-effect";
    clickEffect.style.position = "absolute";
    clickEffect.style.top = `${y}px`;
    clickEffect.style.left = `${x}px`;
    clickEffect.style.width = "20px";
    clickEffect.style.height = "20px";
    clickEffect.style.background = "rgba(255, 0, 0, 0.7)";
    clickEffect.style.borderRadius = "50%";
    clickEffect.style.transform = "translate(-50%, -50%)";
    clickEffect.style.pointerEvents = "none";
    clickEffect.style.zIndex = "9999";
    
    document.body.appendChild(clickEffect);

    setTimeout(() => {
        clickEffect.remove();
    }, 300);
}

const style = document.createElement("style");
style.innerHTML = `
    .click-effect {
        animation: fadeOut 0.3s ease-out;
    }
    @keyframes fadeOut {
        0% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(2); }
    }
`;
document.head.appendChild(style);
