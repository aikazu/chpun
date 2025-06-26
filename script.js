class Modal {
    constructor(modalId, closeButton) {
        this.modal = document.getElementById(modalId);
        this.closeButton = closeButton;
        this.title = this.modal.querySelector('#modal-title');
        this.body = this.modal.querySelector('#modal-body');

        this.closeButton.addEventListener('click', () => this.hide());
        window.addEventListener('click', (event) => {
            if (event.target === this.modal) {
                this.hide();
            }
        });
    }

    show(title, content) {
        this.title.innerHTML = title;
        this.body.innerHTML = content;
        this.modal.classList.remove('hidden');
    }

    hide() {
        this.modal.classList.add('hidden');
    }
}

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
const prestigeButton = document.getElementById('prestige-button');

const modal = new Modal('modal', document.querySelector('.close-button'));

let count = 0;
let power = 1;
let cost = 10;
let combo = 1;
let comboTimer;
let prestigePoints = 0;
const PRESTIGE_REQUIREMENT = 1000000;
let autoPuncherCost = 50;
let autoPunchers = 0;
let critChance = 0.05;
let critMultiplier = 5;

// Function to load game data from local storage
function loadGameData() {
    count = parseInt(localStorage.getItem('count')) || 0;
    power = parseInt(localStorage.getItem('power')) || 1;
    cost = parseInt(localStorage.getItem('cost')) || 10;
    prestigePoints = parseInt(localStorage.getItem('prestigePoints')) || 0;
    autoPunchers = parseInt(localStorage.getItem('autoPunchers')) || 0;
    autoPuncherCost = parseInt(localStorage.getItem('autoPuncherCost')) || 50;
    const savedName = localStorage.getItem('name');
    const savedImage = localStorage.getItem('image');

    if (savedName) {
        nameElement.textContent = savedName;
    }
    if (savedImage) {
        punchTarget.src = savedImage;
    }

    punchCount.textContent = count;
    updatePrestigeButton();
}

// Function to save game data to local storage
function saveGameData() {
    localStorage.setItem('count', count);
    localStorage.setItem('power', power);
    localStorage.setItem('cost', cost);
    localStorage.setItem('prestigePoints', prestigePoints);
    localStorage.setItem('autoPunchers', autoPunchers);
    localStorage.setItem('autoPuncherCost', autoPuncherCost);
}

// Initial load
loadGameData();

setInterval(() => {
    const autoPunchAmount = autoPunchers * (1 + prestigePoints * 0.1);
    if (autoPunchAmount > 0) {
        count += autoPunchAmount;
        punchCount.textContent = Math.floor(count);
        updatePrestigeButton();
    }
}, 1000);

gsap.to(punchTarget, { scale: 1.05, duration: 1, yoyo: true, repeat: -1, ease: "power1.inOut" });

// Punch event
punchTarget.addEventListener('click', (e) => {
    let amount = power * combo * (1 + prestigePoints * 0.1);
    const isCrit = Math.random() < critChance;
    if (isCrit) {
        amount *= critMultiplier;
    }

    count += amount;
    punchCount.textContent = Math.floor(count);
    punchSound.currentTime = 0;
    punchSound.play();
    gsap.to(punchTarget, { scale: 0.9, duration: 0.1, yoyo: true, repeat: 1 });
    createParticles(isCrit ? 100 : 30);
    handleCombo();
    showFloatingNumber(Math.floor(amount), e.clientX, e.clientY, isCrit);
    updatePrestigeButton();
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

upgradesButton.addEventListener('click', () => {
    const renderUpgrades = () => {
        const upgradesContent = `
            <div>
                <p class="text-lg">Punches per click: <span class="font-bold">${power}</span></p>
                <p class="text-lg">Upgrade cost: <span class="font-bold">${cost}</span></p>
                <button id="upgrade-button" class="mt-6 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm">Buy Upgrade</button>
            </div>
            <div class="mt-8">
                <p class="text-lg">Auto Punchers: <span class="font-bold">${autoPunchers}</span></p>
                <p class="text-lg">Upgrade cost: <span class="font-bold">${autoPuncherCost}</span></p>
                <button id="buy-auto-puncher-button" class="mt-6 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm">Buy Auto Puncher</button>
            </div>
        `;
        modal.show('Upgrades', upgradesContent);

        document.getElementById('upgrade-button').addEventListener('click', () => {
            if (count >= cost) {
                count -= cost;
                power++;
                cost = Math.ceil(cost * 1.5);
                punchCount.textContent = count;
                saveGameData();
                renderUpgrades();
            }
        });

        document.getElementById('buy-auto-puncher-button').addEventListener('click', () => {
            if (count >= autoPuncherCost) {
                count -= autoPuncherCost;
                autoPunchers++;
                autoPuncherCost = Math.ceil(autoPuncherCost * 1.5);
                punchCount.textContent = count;
                saveGameData();
                renderUpgrades();
            }
        });
    }
    renderUpgrades();
});

prestigeButton.addEventListener('click', () => {
    if (count >= PRESTIGE_REQUIREMENT) {
        const newPrestigePoints = Math.floor(count / PRESTIGE_REQUIREMENT);
        prestigePoints += newPrestigePoints;
        count = 0;
        power = 1;
        cost = 10;
        combo = 1;
        saveGameData();
        loadGameData();
        modal.hide();
    }
});

function updatePrestigeButton() {
    if (count >= PRESTIGE_REQUIREMENT) {
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

        gsap.to(particle, { x, y, opacity: 0, duration: 1, ease: "power2.out", onComplete: () => particle.remove() });
    }
    particlesContainer.appendChild(fragment);
}

function handleCombo() {
    combo++;
    comboCounter.textContent = combo + 'x';
    gsap.to(comboBar, { width: '100%', duration: 0.1 });
    clearTimeout(comboTimer);
    comboTimer = setTimeout(resetCombo, 1000);
}

function resetCombo() {
    combo = 1;
    comboCounter.textContent = combo + 'x';
    gsap.to(comboBar, { width: '0%', duration: 0.5 });
}

function showFloatingNumber(amount, x, y, isCrit = false) {
    const number = document.createElement('div');
    number.textContent = `+${amount}`;
    number.style.position = 'absolute';
    number.style.left = x + 'px';
    number.style.top = y + 'px';
    number.style.fontSize = isCrit ? '36px' : '24px';
    number.style.fontWeight = 'bold';
    number.style.color = isCrit ? '#ff4d4d' : '#ffc107';
    number.style.pointerEvents = 'none';
    document.body.appendChild(number);

    gsap.to(number, { y: y - 150, opacity: 0, duration: 1.5, ease: "power1.out", onComplete: () => number.remove() });
}