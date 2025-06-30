// Upgrades management
export class UpgradeManager {
    constructor(gameState, modal) {
        this.gameState = gameState;
        this.modal = modal;
    }

    // Generate upgrades modal content
    generateUpgradesContent() {
        return `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <p class="text-lg">Punches per click: <span class="font-bold">${this.gameState.power}</span></p>
                    <p class="text-lg">Upgrade cost: <span class="font-bold">${this.gameState.cost}</span></p>
                    <button id="upgrade-button" class="ui-button bg-indigo-600 hover:bg-indigo-700">Buy</button>
                </div>
                <div>
                    <p class="text-lg">Auto Punchers: <span class="font-bold">${this.gameState.autoPunchers}</span></p>
                    <p class="text-lg">Upgrade cost: <span class="font-bold">${this.gameState.autoPuncherCost}</span></p>
                    <button id="buy-auto-puncher-button" class="ui-button bg-indigo-600 hover:bg-indigo-700">Buy</button>
                </div>
                <div>
                    <p class="text-lg">Crit Chance: <span class="font-bold">${(this.gameState.critChance * 100).toFixed(2)}%</span></p>
                    <p class="text-lg">Upgrade cost: <span class="font-bold">${Math.ceil(this.gameState.cost * 2)}</span></p>
                    <button id="upgrade-crit-chance-button" class="ui-button bg-indigo-600 hover:bg-indigo-700">Buy</button>
                </div>
                <div>
                    <p class="text-lg">Crit Multiplier: <span class="font-bold">${this.gameState.critMultiplier}x</span></p>
                    <p class="text-lg">Upgrade cost: <span class="font-bold">${Math.ceil(this.gameState.cost * 5)}</span></p>
                    <button id="upgrade-crit-multiplier-button" class="ui-button bg-indigo-600 hover:bg-indigo-700">Buy</button>
                </div>
                <div>
                    <p class="text-lg">Combo Duration: <span class="font-bold">${(this.gameState.comboDuration / 1000).toFixed(1)}s</span></p>
                    <p class="text-lg">Upgrade cost: <span class="font-bold">${Math.ceil(this.gameState.cost * 1.2)}</span></p>
                    <button id="upgrade-combo-duration-button" class="ui-button bg-indigo-600 hover:bg-indigo-700">Buy</button>
                </div>
                <div>
                    <p class="text-lg">Auto Puncher Power: <span class="font-bold">${this.gameState.autoPuncherPower}</span></p>
                    <p class="text-lg">Upgrade cost: <span class="font-bold">${Math.ceil(this.gameState.autoPuncherCost * 3)}</span></p>
                    <button id="upgrade-auto-puncher-power-button" class="ui-button bg-indigo-600 hover:bg-indigo-700">Buy</button>
                </div>
            </div>
        `;
    }

    // Setup upgrade event listeners
    setupUpgradeListeners(renderCallback) {
        const upgradeButton = document.getElementById('upgrade-button');
        const buyAutoPuncherButton = document.getElementById('buy-auto-puncher-button');
        const upgradeCritChanceButton = document.getElementById('upgrade-crit-chance-button');
        const upgradeCritMultiplierButton = document.getElementById('upgrade-crit-multiplier-button');
        const upgradeComboDurationButton = document.getElementById('upgrade-combo-duration-button');
        const upgradeAutoPuncherPowerButton = document.getElementById('upgrade-auto-puncher-power-button');

        if (upgradeButton) {
            upgradeButton.addEventListener('click', () => {
                if (this.gameState.upgradePower()) {
                    renderCallback();
                }
            });
        }

        if (buyAutoPuncherButton) {
            buyAutoPuncherButton.addEventListener('click', () => {
                if (this.gameState.buyAutoPuncher()) {
                    renderCallback();
                }
            });
        }

        if (upgradeCritChanceButton) {
            upgradeCritChanceButton.addEventListener('click', () => {
                if (this.gameState.upgradeCritChance()) {
                    renderCallback();
                }
            });
        }

        if (upgradeCritMultiplierButton) {
            upgradeCritMultiplierButton.addEventListener('click', () => {
                if (this.gameState.upgradeCritMultiplier()) {
                    renderCallback();
                }
            });
        }

        if (upgradeComboDurationButton) {
            upgradeComboDurationButton.addEventListener('click', () => {
                if (this.gameState.upgradeComboDuration()) {
                    renderCallback();
                }
            });
        }

        if (upgradeAutoPuncherPowerButton) {
            upgradeAutoPuncherPowerButton.addEventListener('click', () => {
                if (this.gameState.upgradeAutoPuncherPower()) {
                    renderCallback();
                }
            });
        }
    }

    // Show upgrades modal
    showUpgrades() {
        const renderUpgrades = () => {
            const upgradesContent = this.generateUpgradesContent();
            this.modal.show('Upgrades', upgradesContent);
            this.setupUpgradeListeners(renderUpgrades);
        };
        renderUpgrades();
    }
}