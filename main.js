/**
 * This widget was made by Jair4x, if you see this and someone sold it to you, they're a scammer.
 * Btw, thanks for using this widget!
 */
let totalSeconds = 0;
let initialTime = 0;
let paused = true; // By default, the timer is stopped until we start the stuff
let config = {};
const userLastMessage = {};
const STORE_KEY = "SCST_Timer";

const timerElement = document.getElementById("timer");

// Format time in HH:MM:SS
function formatTime(sec) {
    const h = String(Math.floor(sec / 3600)).padStart(2, "0");
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
}

function showTimeBonus(seconds) {
    const bonus = document.createElement("span");
    bonus.className = "time-bonus";
    bonus.textContent = `+${seconds}s`;

    // Position animation on timer
    const rect = timerElement.getBoundingClientRect();
    bonus.style.left = `${rect.left + rect.width / 2}px`;
    bonus.style.top = `${rect.top}px`;

    document.body.appendChild(bonus);

    // Delete after animation
    bonus.addEventListener("animationend", () => {
        bonus.remove();
    });
}
function updateDisplay() {
    timerElement.textContent = formatTime(totalSeconds);

    // Change color when time's running low
    if (config.lowTimeEnabled && totalSeconds <= config.lowTimeThreshold) {
        timerElement.style.color = config.lowTimeColor || "#ff0000";
    } else {
        timerElement.style.color = config.fontColor || "#00ffcc";
    }
}

function addTime(seconds) {
    totalSeconds += seconds;
    updateDisplay();
    showTimeBonus(seconds);
    saveTime(totalSeconds);
}

// To prevent losing time when changing a setting
function saveTime(seconds) {
    try {
        SE_API.store.set(STORE_KEY, { seconds: Number(seconds) || 0 });
    } catch (e) {
        console.log("SE_API.store.set error:", e);
    }
}

async function loadTime() {
    try {
        const obj = await SE_API.store.get(STORE_KEY);
        if (obj && typeof obj.seconds === "number" && !Number.isNaN(obj.seconds)) {
        return obj.seconds;
        }
    } catch (e) {
        console.log("SE_API.store.get error:", e);
    }
    return initialTime; // fallback
}

// Lower timer
setInterval(() => {
    if (!paused && totalSeconds > 0) {
        totalSeconds--;
        saveTime(totalSeconds);
        updateDisplay();
    }
}, 1000);

// StreamElements events
window.addEventListener("onEventReceived", function (obj) {
    if (!obj.detail.event) return;
    const listener = obj.detail.listener;
    const data = obj.detail.event;

    if (data.listener === 'widget-button') {
        if (data.field === 'resetButton') {
            const startTime = parseInt(initialTime, 10) || 0;
            totalSeconds = startTime;
            updateDisplay();
        }

        if (data.field === 'startButton') {
            paused = false;
        }

        if (data.field === 'pauseButton') {
            paused = true;
        }
    }

    if (listener === "message" && config.msgEnabled) {
        const userId = data.userId || data.displayName || "anon";
        const now = Date.now();

        if (userId) {
            const lastTime = userLastMessage[userId] || 0;
            const cooldownSeconds = Number(config.msgCooldown);
            const cooldownMs = (!isNaN(cooldownSeconds) ? cooldownSeconds : 5) * 1000;

            if (now - lastTime >= cooldownMs) {
                addTime(config.msgIncrement);
                userLastMessage[userId] = now;
            }
        } else {
            addTime(config.msgIncrement);
        }
    }

    if ((listener === "subscriber" && config.subEnabled) || (listener === "subscriber-latest" && config.subEnabled)) {
        let secondsToAdd = config.subIncrement;
        let giftedBonus = config.subGiftBonusIncrement || 0;
        const tier2Bonus = config.subTierBonusT2;
        const tier3Bonus = config.subTierBonusT3;

        if (data.gifted && config.subGiftBonusEnabled) {
            secondsToAdd += giftedBonus;
        }

        if (data.tier && config.subTierBonusEnabled) {
            switch (data.tier) {
                case "2000": // Tier 2
                    secondsToAdd += tier2Bonus;
                    break;

                case "3000": // Tier 3
                    secondsToAdd += tier3Bonus;
                    break;

                default: break; // Tier 1 or Prime Sub
            }
        }

        if (data.bulkGifted) {
            if (config.subCommunityBulkAmount === "yes") {
                const GiftSeconds = secondsToAdd + (config.subGiftBonusEnabled ? giftedBonus : 0); // Terniary cuz lazy
                const amountOfGifted = Number(data.amount) || 1;
                addTime(GiftSeconds * amountOfGifted);
            }
            return; // To prevent first 30s triggering without reason.
        }

        // Prevent community gifts to add value to timer if we add everything at once.
        if (data.isCommunityGift && config.subCommunityBulkAmount === "yes") {
            return;
        }

        addTime(secondsToAdd);
    }

    if ((listener === "follower" && config.followEnabled) || (listener === "follower-latest" && config.followEnabled)) addTime(config.followIncrement);

    if ((listener === "cheer" && config.cheerEnabled) || (listener === "cheer-latest" && config.cheerEnabled)) {
        const bits = data.amount || 0;
        let increment = 0;

        // Custom rules (Bits are exact)
        for (const rule of config.cheerCustomRules) {
            if (bits === rule.bits) {
                increment = rule.seconds;
                break;
            }
        }

        // If there aren't any custom rules, default
        if (increment === 0) {
            increment = Math.floor(bits / (parseFloat(config.cheerPerSecond) || 10));
        }

        if (increment > 0) addTime(increment);
    }

    if ((listener === "tip" && config.tipEnabled) || (listener === "tip-latest" && config.tipEnabled)) {
        const amount = data.amount || 0;
        let increment = 0;

        // Custom rules (Have a margin of +1 to add same time)
        for (const rule of config.tipCustomRules) {
            if (amount >= rule.amount && amount <= (rule.amount + 1)) {
                increment = rule.seconds;
                break;
            }
        }

        // If there aren't any custom rules, default
        if (increment === 0) {
            increment = Math.floor(amount / (parseFloat(config.tipPerSecond) || 0.1));
        }

        if (increment > 0) addTime(increment);
    }
});

window.addEventListener("onWidgetLoad", async function (obj) {
    const fieldData = obj.detail.fieldData;

    // Get time to show
    initialTime = parseInt(fieldData.startTime, 10) || 0;
    totalSeconds = await loadTime() ? await loadTime() : initialTime;
    saveTime(totalSeconds);

    // General config
    config.fontColor = fieldData.fontColor;
    config.fontSize = fieldData.fontSize;
    config.fontFamily = fieldData.fontFamily;
    config.lowTimeEnabled = fieldData.lowTimeEnabled;
    config.lowTimeThreshold = parseInt(fieldData.lowTimeThreshold, 10) || 60;
    config.lowTimeColor = fieldData.lowTimeColor;

    // Message config
    config.msgEnabled = fieldData.msgEnabled;
    config.msgIncrement = parseInt(fieldData.msgIncrement, 10) || 0;
    config.msgCooldown = parseInt(fieldData.msgCooldown, 10) || 0;

    // Sub config
    config.subEnabled = fieldData.subEnabled;
    config.subGiftBonusEnabled = fieldData.subGiftBonusEnabled;
    config.subTierBonusEnabled = fieldData.subTierBonusEnabled;
    config.subIncrement = parseInt(fieldData.subIncrement, 10) || 0;
    config.subGiftBonusIncrement = parseInt(fieldData.subGiftBonusIncrement, 10) || 0;
    config.subCommunityBulkAmount = fieldData.subCommunityBulkAmount || "no";
    config.subTierBonusT2 = parseInt(fieldData.subTierBonusT2, 10) || 0;
    config.subTierBonusT3 = parseInt(fieldData.subTierBonusT3, 10) || 0;

    // Follow config
    config.followEnabled = fieldData.followEnabled;
    config.followIncrement = parseInt(fieldData.followIncrement, 10) || 0;

    // Cheering config
    config.cheerEnabled = fieldData.cheerEnabled;
    config.cheerPerSecond = fieldData.cheerPerSecond;
    try {
        config.cheerCustomRules = JSON.parse(fieldData.cheerCustomRules);
    } catch {
        config.cheerCustomRules = [];
    }

    // Tipping config
    config.tipEnabled = fieldData.tipEnabled;
    config.tipPerSecond = fieldData.tipPerSecond;
    try {
        config.tipCustomRules = JSON.parse(fieldData.tipCustomRules);
    } catch {
        config.tipCustomRules = [];
    }

    // Text config (font)
    timerElement.style.fontSize = config.fontSize || "4em";
    if (config.fontFamily) {
        const link = document.createElement("link");
        link.href = `https://fonts.googleapis.com/css2?family=${config.fontFamily.replace(/ /g, '+')}:wght@400;700&display=swap`;
        link.rel = "stylesheet";
        document.head.appendChild(link);

        timerElement.style.fontFamily = `"${config.fontFamily}", Arial, sans-serif`;
    }

    // Show timer
    updateDisplay();
});
