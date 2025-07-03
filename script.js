const objectImage = document.getElementById('object-image');
const moneyDisplay = document.getElementById('money');
const objectValueBar = document.getElementById('object-value');
const bankruptcyButton = document.getElementById('bankruptcy-button');
const leaderboard = document.getElementById('leaderboard');

let money = 0;
let moneyPerPunch = 1;
let objectValue = 1000;
const maxObjectValue = 1000;
let goldenGloves = 0;
let nickname = '';

function getNickname() {
    nickname = localStorage.getItem('nickname');
    if (!nickname) {
        nickname = prompt('Please enter your nickname for the leaderboard:');
        localStorage.setItem('nickname', nickname);
    }
}

function saveScore() {
    if (nickname) {
        db.collection('leaderboard').doc(nickname).set({
            nickname: nickname,
            score: money
        });
    }
}

function displayLeaderboard() {
    db.collection('leaderboard').orderBy('score', 'desc').limit(10).onSnapshot(snapshot => {
        leaderboard.innerHTML = '';
        snapshot.forEach(doc => {
            const score = doc.data();
            const entry = document.createElement('div');
            entry.textContent = `${score.nickname}: $${score.score}`;
            leaderboard.appendChild(entry);
        });
    });
}

const upgrades = [
    {
        name: 'Canvas Wraps',
        cost: 10,
        moneyPerPunch: 1,
        type: 'active'
    },
    {
        name: 'Boxing Gloves',
        cost: 100,
        moneyPerPunch: 5,
        type: 'active'
    },
    {
        name: 'Spiked Gauntlets',
        cost: 1000,
        moneyPerPunch: 25,
        type: 'active'
    },
    {
        name: 'Golden Fists',
        cost: 10000,
        moneyPerPunch: 100,
        type: 'active'
    },
    {
        name: 'A Ticking Metronome',
        cost: 50,
        moneyPerSecond: 1,
        type: 'passive'
    },
    {
        name: 'A Mechanical Piston',
        cost: 500,
        moneyPerSecond: 10,
        type: 'passive'
    },
    {
        name: 'A Disgruntled Intern',
        cost: 5000,
        moneyPerSecond: 100,
        type: 'passive'
    },
    {
        name: 'An Orbiting Fist Satellite',
        cost: 50000,
        moneyPerSecond: 1000,
        type: 'passive'
    }
];

const arenaOpponents = [
    { name: 'Tomato', value: 10000, reward: 100000 },
    { name: 'Brick', value: 100000, reward: 1000000 },
    { name: 'Car', value: 1000000, reward: 10000000 },
    { name: 'T-Rex', value: 10000000, reward: 100000000 },
    { name: 'Skyscraper', value: 100000000, reward: 1000000000 },
    { name: 'Mountain', value: 1000000000, reward: 10000000000 }
];

objectImage.addEventListener('click', () => {
    money += moneyPerPunch;
    objectValue -= moneyPerPunch;
    moneyDisplay.textContent = `$${money}`;
    updateObjectValueBar();

    if (objectValue <= 0) {
        breakObject();
    }

    // Visual feedback
    objectImage.classList.add('shake');
    setTimeout(() => {
        objectImage.classList.remove('shake');
    }, 200);

    const plusOne = document.createElement('div');
    plusOne.textContent = `+$${moneyPerPunch}`;
    plusOne.classList.add('plus-one');
    objectImage.parentElement.appendChild(plusOne);

    setTimeout(() => {
        plusOne.remove();
    }, 1000);
});

function updateObjectValueBar() {
    const percentage = (objectValue / maxObjectValue) * 100;
    objectValueBar.style.width = `${percentage}%`;
}

function breakObject() {
    money += 50000;
    moneyDisplay.textContent = `$${money}`;
    objectValue = maxObjectValue;
    updateObjectValueBar();
    alert('You have utterly destroyed Chokoui and earned an extra $50,000!');
    checkBankruptcy();
    saveScore();
}

function checkBankruptcy() {
    if (money >= 1000000000000) {
        bankruptcyButton.style.display = 'block';
    }
}

bankruptcyButton.addEventListener('click', () => {
    money = 0;
    moneyPerPunch = 1;
    objectValue = 1000;
    goldenGloves++;
    moneyPerPunch *= (1 + (goldenGloves * 0.1));

    moneyDisplay.textContent = `$${money}`;
    updateObjectValueBar();

    alert(`You have declared glorious bankruptcy and earned a Golden Glove! You now have ${goldenGloves} Golden Gloves, providing a ${goldenGloles * 10}% boost to all future earnings.`);

    bankruptcyButton.style.display = 'none';
    saveScore();
});


function displayUpgrades() {
    const activeUpgradesContainer = document.getElementById('active-upgrades');
    const passiveUpgradesContainer = document.getElementById('passive-upgrades');

    upgrades.forEach(upgrade => {
        const upgradeButton = document.createElement('button');
        upgradeButton.textContent = `${upgrade.name} - ${upgrade.cost}`;
        upgradeButton.addEventListener('click', () => {
            if (money >= upgrade.cost) {
                money -= upgrade.cost;
                moneyDisplay.textContent = `${money}`;

                if (upgrade.type === 'active') {
                    moneyPerPunch += upgrade.moneyPerPunch;
                } else if (upgrade.type === 'passive') {
                    setInterval(() => {
                        money += upgrade.moneyPerSecond;
                        moneyDisplay.textContent = `${money}`;
                    }, 1000);
                }

                upgradeButton.disabled = true;
            }
        });

        if (upgrade.type === 'active') {
            activeUpgradesContainer.appendChild(upgradeButton);
        } else if (upgrade.type === 'passive') {
            passiveUpgradesContainer.appendChild(upgradeButton);
        }
    });
}

function displayArena() {
    const arenaContainer = document.getElementById('arena');
    arenaOpponents.forEach(opponent => {
        const opponentButton = document.createElement('button');
        opponentButton.textContent = `${opponent.name} - Value: ${opponent.value}`;
        opponentButton.addEventListener('click', () => {
            objectValue = opponent.value;
            maxObjectValue = opponent.value;
            document.getElementById('object-name').textContent = opponent.name;
            updateObjectValueBar();
        });
        arenaContainer.appendChild(opponentButton);
    });
}

function triggerRandomEvent() {
    const randomNumber = Math.random();
    if (randomNumber < 0.1) { // 10% chance
        goldenObjectEvent();
    }
}

function goldenObjectEvent() {
    const defaultMoneyPerPunch = moneyPerPunch;
    moneyPerPunch *= 100;
    objectImage.style.border = '5px solid gold';

    setTimeout(() => {
        moneyPerPunch = defaultMoneyPerPunch;
        objectImage.style.border = '2px solid #333';
    }, 30000); // 30 seconds
}

getNickname();
displayUpgrades();
updateObjectValueBar();
displayLeaderboard();
displayArena();
setInterval(triggerRandomEvent, 60000); // Check for random event every 60 seconds
