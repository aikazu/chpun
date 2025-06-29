
import { Modal } from './modal.js';

const punchTarget = document.getElementById('punch-target');
const punchCount = document.getElementById('punch-count');
const nameElement = document.getElementById('name');
const punchSound = document.getElementById('punch-sound');
const gameContainer = document.querySelector('.game-container');
const settingsButton = document.getElementById('settings-button');
const upgradesButton = document.getElementById('upgrades-button');
const comboCounter = document.getElementById('combo-counter');
const comboBar = document.getElementById('combo-bar');
const particlesContainer = document.getElementById('particles-container');
const achievementsButton = document.getElementById('achievements-button');
const prestigeButton = document.getElementById('prestige-button');

const config = {
    PRESTIGE_REQUIREMENT: 1000000,
    critChance: 0.05,
    critMultiplier: 5,
    comboDuration: 3000,
    autoPuncherPower: 1,
    initialCost: 10,
    initialAutoPuncherCost: 50,
};

const achievements = {
    firstPunch: { name: 'First Blood... or Punch', unlocked: false },
    carpalTunnel: { name: 'Carpal Tunnel Here I Come', unlocked: false },
    onePunchMan: { name: 'The One-Punch Man', unlocked: false },
    over9000: { name: "It's Over 9000!", unlocked: false },
    inevitable: { name: 'I Am Inevitable', unlocked: false },
};

let unlockedAchievements = JSON.parse(localStorage.getItem('unlockedAchievements')) || {};

function unlockAchievement(id) {
    if (!unlockedAchievements[id]) {
        unlockedAchievements[id] = true;
        localStorage.setItem('unlockedAchievements', JSON.stringify(unlockedAchievements));
        // You can add a notification here to show the player they unlocked an achievement
    }
}

function checkAchievements() {
    if (count >= 1) unlockAchievement('firstPunch');
    if (count >= 100000) unlockAchievement('carpalTunnel');
    if (count >= 1000000) unlockAchievement('onePunchMan');
    if (prestigePoints > 0) unlockAchievement('inevitable');
}

achievementsButton.addEventListener('click', () => {
    let achievementsContent = '<div class="grid grid-cols-1 gap-4">';
    for (const id in achievements) {
        const achievement = achievements[id];
        const isUnlocked = unlockedAchievements[id];
        achievementsContent += `
            <div class="p-4 rounded-md ${isUnlocked ? 'bg-green-200' : 'bg-gray-200'}">
                <h4 class="font-bold">${achievement.name}</h4>
                <p>${isUnlocked ? 'Unlocked' : 'Locked'}</p>
            </div>
        `;
    }
    achievementsContent += '</div>';
    modal.show('Achievements', achievementsContent);
});

const modal = new Modal('modal', document.querySelector('.close-button'));

let count = 0;
let power = 1;
let cost = config.initialCost;
let combo = 1;
let comboTimer;
let prestigePoints = 0;
let autoPuncherCost = config.initialAutoPuncherCost;
let autoPunchers = 0;
let critChance = config.critChance;
let critMultiplier = config.critMultiplier;
let comboDuration = config.comboDuration;
let autoPuncherPower = config.autoPuncherPower;

function updateGameState() {
    punchCount.textContent = Math.floor(count);
    updatePrestigeButton();
    checkAchievements();
    saveGameData();
}

// Function to load game data from local storage
function loadGameData() {
    count = Number(localStorage.getItem('count')) || 0;
    power = Number(localStorage.getItem('power')) || 1;
    cost = Number(localStorage.getItem('cost')) || config.initialCost;
    prestigePoints = Number(localStorage.getItem('prestigePoints')) || 0;
    autoPunchers = Number(localStorage.getItem('autoPunchers')) || 0;
    autoPuncherCost = Number(localStorage.getItem('autoPuncherCost')) || config.initialAutoPuncherCost;
    critChance = Number(localStorage.getItem('critChance')) || config.critChance;
    critMultiplier = Number(localStorage.getItem('critMultiplier')) || config.critMultiplier;
    comboDuration = Number(localStorage.getItem('comboDuration')) || config.comboDuration;
    autoPuncherPower = Number(localStorage.getItem('autoPuncherPower')) || config.autoPuncherPower;
    const savedName = localStorage.getItem('name');
    const savedImage = localStorage.getItem('image');

    if (savedName) {
        nameElement.textContent = savedName;
    }
    if (savedImage) {
        punchTarget.src = savedImage;
    }

    updateGameState();
}

// Function to save game data to local storage
function saveGameData() {
    localStorage.setItem('count', count);
    localStorage.setItem('power', power);
    localStorage.setItem('cost', cost);
    localStorage.setItem('prestigePoints', prestigePoints);
    localStorage.setItem('autoPunchers', autoPunchers);
    localStorage.setItem('autoPuncherCost', autoPuncherCost);
    localStorage.setItem('critChance', critChance);
    localStorage.setItem('critMultiplier', critMultiplier);
    localStorage.setItem('comboDuration', comboDuration);
    localStorage.setItem('autoPuncherPower', autoPuncherPower);
}

// Initial load
loadGameData();

setInterval(() => {
    const autoPunchAmount = autoPunchers * autoPuncherPower * (1 + prestigePoints * 0.1);
    if (autoPunchAmount > 0) {
        count += autoPunchAmount;
        updateGameState();
    }
}, 1000);

const powerUpContainer = document.getElementById('power-up-container');

const powerUps = [
    {
        name: 'Frenzy Mode',
        duration: 10000,
        activate() {
            power *= 10;
            setTimeout(() => {
                power /= 10;
            }, this.duration);
        }
    },
    {
        name: 'Punch-splosion',
        activate() {
            count += power * 100;
            updateGameState();
        }
    }
];

function spawnPowerUp() {
    const powerUp = powerUps[Math.floor(Math.random() * powerUps.length)];
    const powerUpElement = document.createElement('div');
    powerUpElement.textContent = powerUp.name;
    powerUpElement.classList.add('power-up', 'absolute', 'bg-yellow-400', 'text-white', 'font-bold', 'py-2', 'px-4', 'rounded-full', 'cursor-pointer', 'pointer-events-auto');
    powerUpElement.style.left = `${Math.random() * 80 + 10}%`;
    powerUpElement.style.top = `${Math.random() * 80 + 10}%`;
    powerUpElement.style.zIndex = '1000';

    powerUpElement.addEventListener('click', () => {
        powerUp.activate();
        punchCount.textContent = Math.floor(count);
        saveGameData();
        powerUpElement.remove();
    });

    powerUpContainer.appendChild(powerUpElement);

    setTimeout(() => {
        if (powerUpElement.parentNode) {
            powerUpElement.remove();
        }
    }, 5000);
}

setInterval(spawnPowerUp, 15000);

// Punch event
punchTarget.addEventListener('click', (e) => {
    let amount = power * combo * (1 + prestigePoints * 0.1);
    const isCrit = Math.random() < critChance;
    if (isCrit) {
        amount *= critMultiplier;
        if (amount > 9000) unlockAchievement('over9000');
    }

    count += amount;
    try {
        punchSound.currentTime = 0;
        punchSound.play().catch(() => {});
    } catch (e) {
        // Audio play failed, continue without sound
    }
    gsap.to(punchTarget, { scale: 0.9, duration: 0.1, yoyo: true, repeat: 1 });
    createParticles(isCrit ? 100 : 30);
    handleCombo();
    showFloatingNumber(Math.floor(amount), e.clientX, e.clientY, isCrit);
    updateGameState();
});

// Settings and Upgrades event listeners
settingsButton.addEventListener('click', () => {
    const settingsContent = `
        <label for="name-input" class="block text-sm font-medium text-gray-700">Name</label>
        <input type="text" id="name-input" class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Enter a new name" value="${nameElement.textContent}">
        <label for="image-input" class="block text-sm font-medium text-gray-700 mt-4">Image</label>
        <input type="file" id="image-input" class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100" accept="image/*">
        <button id="save-button" class="mt-6 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm">Save</button>
        <button id="reset-button" class="mt-4 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm">Reset Game</button>
    `;
    modal.show('Settings', settingsContent);

    document.getElementById('save-button').addEventListener('click', () => {
        const newName = document.getElementById('name-input').value;
        const newImage = document.getElementById('image-input').files[0];

        if (newName) {
            nameElement.textContent = newName;
            localStorage.setItem('name', newName);
        }

        if (newImage) {
            const reader = new FileReader();
            reader.onload = () => {
                const imageUrl = reader.result;
                punchTarget.src = imageUrl;
                localStorage.setItem('image', imageUrl);
            };
            reader.readAsDataURL(newImage);
        }
        modal.hide();
    });

    document.getElementById('reset-button').addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all your progress? This cannot be undone.')) {
            localStorage.clear();
            location.reload();
        }
    });
});

function upgradePower(callback) {
    if (count >= cost) {
        count -= cost;
        power++;
        cost = Math.ceil(cost * 1.5);
        updateGameState();
        callback();
    }
}

function buyAutoPuncher(callback) {
    if (count >= autoPuncherCost) {
        count -= autoPuncherCost;
        autoPunchers++;
        autoPuncherCost = Math.ceil(autoPuncherCost * 1.5);
        updateGameState();
        callback();
    }
}

function upgradeCritChance(callback) {
    const upgradeCost = Math.ceil(cost * 2);
    if (count >= upgradeCost) {
        count -= upgradeCost;
        critChance += 0.005;
        updateGameState();
        callback();
    }
}

function upgradeCritMultiplier(callback) {
    const upgradeCost = Math.ceil(cost * 5);
    if (count >= upgradeCost) {
        count -= upgradeCost;
        critMultiplier++;
        updateGameState();
        callback();
    }
}

function upgradeComboDuration(callback) {
    const upgradeCost = Math.ceil(cost * 1.2);
    if (count >= upgradeCost) {
        count -= upgradeCost;
        comboDuration += 100;
        updateGameState();
        callback();
    }
}

function upgradeAutoPuncherPower(callback) {
    const upgradeCost = Math.ceil(autoPuncherCost * 3);
    if (count >= upgradeCost) {
        count -= upgradeCost;
        autoPuncherPower++;
        updateGameState();
        callback();
    }
}

upgradesButton.addEventListener('click', () => {
    const renderUpgrades = () => {
        const upgradesContent = `
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <p class="text-lg">Punches per click: <span class="font-bold">${power}</span></p>
                    <p class="text-lg">Upgrade cost: <span class="font-bold">${cost}</span></p>
                    <button id="upgrade-button" class="mt-2 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm">Buy</button>
                </div>
                <div>
                    <p class="text-lg">Auto Punchers: <span class="font-bold">${autoPunchers}</span></p>
                    <p class="text-lg">Upgrade cost: <span class="font-bold">${autoPuncherCost}</span></p>
                    <button id="buy-auto-puncher-button" class="mt-2 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm">Buy</button>
                </div>
                <div>
                    <p class="text-lg">Crit Chance: <span class="font-bold">${(critChance * 100).toFixed(2)}%</span></p>
                    <p class="text-lg">Upgrade cost: <span class="font-bold">${Math.ceil(cost * 2)}</span></p>
                    <button id="upgrade-crit-chance-button" class="mt-2 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm">Buy</button>
                </div>
                <div>
                    <p class="text-lg">Crit Multiplier: <span class="font-bold">${critMultiplier}x</span></p>
                    <p class="text-lg">Upgrade cost: <span class="font-bold">${Math.ceil(cost * 5)}</span></p>
                    <button id="upgrade-crit-multiplier-button" class="mt-2 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm">Buy</button>
                </div>
                <div>
                    <p class="text-lg">Combo Duration: <span class="font-bold">${(comboDuration / 1000).toFixed(1)}s</span></p>
                    <p class="text-lg">Upgrade cost: <span class="font-bold">${Math.ceil(cost * 1.2)}</span></p>
                    <button id="upgrade-combo-duration-button" class="mt-2 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm">Buy</button>
                </div>
                <div>
                    <p class="text-lg">Auto Puncher Power: <span class="font-bold">${autoPuncherPower}</span></p>
                    <p class="text-lg">Upgrade cost: <span class="font-bold">${Math.ceil(autoPuncherCost * 3)}</span></p>
                    <button id="upgrade-auto-puncher-power-button" class="mt-2 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm">Buy</button>
                </div>
            </div>
        `;
        modal.show('Upgrades', upgradesContent);

        document.getElementById('upgrade-button').addEventListener('click', () => upgradePower(renderUpgrades));
        document.getElementById('buy-auto-puncher-button').addEventListener('click', () => buyAutoPuncher(renderUpgrades));
        document.getElementById('upgrade-crit-chance-button').addEventListener('click', () => upgradeCritChance(renderUpgrades));
        document.getElementById('upgrade-crit-multiplier-button').addEventListener('click', () => upgradeCritMultiplier(renderUpgrades));
        document.getElementById('upgrade-combo-duration-button').addEventListener('click', () => upgradeComboDuration(renderUpgrades));
        document.getElementById('upgrade-auto-puncher-power-button').addEventListener('click', () => upgradeAutoPuncherPower(renderUpgrades));
    }
    renderUpgrades();
});

prestigeButton.addEventListener('click', () => {
    if (count >= config.PRESTIGE_REQUIREMENT) {
        const newPrestigePoints = Math.floor(count / config.PRESTIGE_REQUIREMENT);
        prestigePoints += newPrestigePoints;
        count = 0;
        power = 1;
        cost = config.initialCost;
        combo = 1;
        autoPunchers = 0;
        autoPuncherCost = config.initialAutoPuncherCost;
        critChance = config.critChance;
        critMultiplier = config.critMultiplier;
        comboDuration = config.comboDuration;
        autoPuncherPower = config.autoPuncherPower;
        comboCounter.textContent = combo + 'x';
        updateGameState();
        modal.hide();
    }
});

function updatePrestigeButton() {
    if (count >= config.PRESTIGE_REQUIREMENT) {
        prestigeButton.classList.remove('hidden');
    } else {
        prestigeButton.classList.add('hidden');
    }
}

function createParticles(amount) {
    const rect = punchTarget.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < amount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        const x = (Math.random() - 0.5) * 500;
        const y = (Math.random() - 0.5) * 500;

        particle.style.left = startX + 'px';
        particle.style.top = startY + 'px';

        fragment.appendChild(particle);

        gsap.fromTo(particle, { x: 0, y: 0, opacity: 1 }, { x, y, opacity: 0, duration: 1, ease: "power2.out", onComplete: () => particle.remove() });
    }
    particlesContainer.appendChild(fragment);
}

function handleCombo() {
    combo++;
    comboCounter.textContent = combo + 'x';
    gsap.fromTo(comboBar, { width: '0%' }, { width: '100%', duration: 0.2, ease: "power2.out" });
    clearTimeout(comboTimer);
    comboTimer = setTimeout(resetCombo, comboDuration);
}

function resetCombo() {
    combo = 1;
    comboCounter.textContent = combo + 'x';
    gsap.to(comboBar, { width: '0%', duration: 0.3, ease: "power2.out" });
}

function showFloatingNumber(amount, x, y, isCrit = false) {
    const number = document.createElement('div');
    number.textContent = `+${amount}`;
    number.style.position = 'absolute';
    const rect = punchTarget.getBoundingClientRect();
    number.style.left = (rect.left + rect.width / 2) + 'px';
    number.style.top = (rect.top + rect.height / 2) + 'px';
    number.style.fontSize = isCrit ? '36px' : '24px';
    number.style.fontWeight = 'bold';
    number.style.color = isCrit ? '#ff4d4d' : '#ffc107';
    number.style.pointerEvents = 'none';
    document.body.appendChild(number);

    gsap.fromTo(number, { y: 0, opacity: 1 }, { y: -150, opacity: 0, duration: 1.5, ease: "power1.out", onComplete: () => number.remove() });
}
