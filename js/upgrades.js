// Upgrades management
export class UpgradeManager {
    constructor(gameState, modal) {
        this.gameState = gameState;
        this.modal = modal;
        this.upgradeDefinitions = this.initializeUpgradeDefinitions();
    }

    // Initialize upgrade definitions with metadata
    initializeUpgradeDefinitions() {
        return {
            power: {
                id: 'upgrade-button',
                title: 'Punch Power',
                description: 'Increase punches per click',
                getCurrentValue: () => this.gameState.power,
                getNextValue: () => this.gameState.power + 1,
                getCost: () => this.gameState.cost,
                getUpgradeMethod: () => this.gameState.upgradePower.bind(this.gameState),
                icon: '👊',
                category: 'basic'
            },
            autoPuncher: {
                id: 'buy-auto-puncher-button',
                title: 'Auto Punchers',
                description: 'Automatically punch for you',
                getCurrentValue: () => this.gameState.autoPunchers,
                getNextValue: () => this.gameState.autoPunchers + 1,
                getCost: () => this.gameState.autoPuncherCost,
                getUpgradeMethod: () => this.gameState.buyAutoPuncher.bind(this.gameState),
                icon: '🤖',
                category: 'automation'
            },
            critChance: {
                id: 'upgrade-crit-chance-button',
                title: 'Critical Chance',
                description: 'Increase chance for critical hits (+0.5%) - Max: 50%',
                getCurrentValue: () => (this.gameState.critChance * 100).toFixed(2) + '%',
                getNextValue: () => {
                    if (this.gameState.critChance >= 0.5) return 'MAX';
                    return ((this.gameState.critChance + 0.005) * 100).toFixed(2) + '%';
                },
                getCost: () => {
                    if (this.gameState.critChance >= 0.5) return 0;
                    const critLevel = Math.floor((this.gameState.critChance - 0.05) / 0.005) + 1;
                    return Math.ceil(100 * Math.pow(2, critLevel));
                },
                getUpgradeMethod: () => this.gameState.upgradeCritChance.bind(this.gameState),
                icon: '⚡',
                category: 'combat'
            },
            critMultiplier: {
                id: 'upgrade-crit-multiplier-button',
                title: 'Critical Multiplier',
                description: 'Increase critical hit damage multiplier - Max: 20x',
                getCurrentValue: () => this.gameState.critMultiplier + 'x',
                getNextValue: () => {
                    if (this.gameState.critMultiplier >= 20) return 'MAX';
                    return (this.gameState.critMultiplier + 1) + 'x';
                },
                getCost: () => {
                    if (this.gameState.critMultiplier >= 20) return 0;
                    const critMultLevel = this.gameState.critMultiplier - 5 + 1;
                    return Math.ceil(500 * Math.pow(3, critMultLevel));
                },
                getUpgradeMethod: () => this.gameState.upgradeCritMultiplier.bind(this.gameState),
                icon: '💥',
                category: 'combat'
            },
            comboDuration: {
                id: 'upgrade-combo-duration-button',
                title: 'Combo Duration',
                description: 'Extend combo timer (+0.1s) - Max: 10s',
                getCurrentValue: () => (this.gameState.comboDuration / 1000).toFixed(1) + 's',
                getNextValue: () => {
                    if (this.gameState.comboDuration >= 10000) return 'MAX';
                    return ((this.gameState.comboDuration + 100) / 1000).toFixed(1) + 's';
                },
                getCost: () => {
                    if (this.gameState.comboDuration >= 10000) return 0;
                    const comboLevel = Math.floor((this.gameState.comboDuration - 3000) / 100) + 1;
                    return Math.ceil(200 * Math.pow(1.8, comboLevel));
                },
                getUpgradeMethod: () => this.gameState.upgradeComboDuration.bind(this.gameState),
                icon: '⏱️',
                category: 'combo'
            },
            autoPuncherPower: {
                id: 'upgrade-auto-puncher-power-button',
                title: 'Auto Puncher Power',
                description: 'Increase auto puncher damage - Max: 100',
                getCurrentValue: () => this.gameState.autoPuncherPower,
                getNextValue: () => {
                    if (this.gameState.autoPuncherPower >= 100) return 'MAX';
                    return this.gameState.autoPuncherPower + 1;
                },
                getCost: () => {
                    if (this.gameState.autoPuncherPower >= 100) return 0;
                    const powerLevel = this.gameState.autoPuncherPower - 1 + 1;
                    return Math.ceil(1000 * Math.pow(2.5, powerLevel));
                },
                getUpgradeMethod: () => this.gameState.upgradeAutoPuncherPower.bind(this.gameState),
                icon: '⚙️',
                category: 'automation'
            }
        };
    }

    // Format large numbers for display
    formatNumber(num) {
        if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
        if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
        if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
        if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
        return num.toString();
    }

    // Generate upgrade card HTML
    generateUpgradeCard(upgradeKey, upgrade) {
        const cost = upgrade.getCost();
        const canAfford = this.gameState.canAfford(cost);
        const affordabilityClass = canAfford ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-500 cursor-not-allowed';
        const cardClass = canAfford ? 'border-indigo-200' : 'border-gray-300 opacity-75';
        
        return `
            <div class="upgrade-card border-2 ${cardClass} rounded-lg p-4 transition-all duration-200 hover:shadow-lg">
                <div class="flex items-center mb-2">
                    <span class="text-2xl mr-2">${upgrade.icon}</span>
                    <h3 class="text-lg font-bold text-gray-800">${upgrade.title}</h3>
                </div>
                <p class="text-sm text-gray-600 mb-3">${upgrade.description}</p>
                <div class="space-y-2">
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-gray-700">Current:</span>
                        <span class="font-bold text-indigo-600">${upgrade.getCurrentValue()}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-gray-700">Next:</span>
                        <span class="font-bold text-green-600">${upgrade.getNextValue()}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-gray-700">Cost:</span>
                        <span class="font-bold ${canAfford ? 'text-gray-800' : 'text-red-600'}">${this.formatNumber(cost)}</span>
                    </div>
                </div>
                <button id="${upgrade.id}" 
                        class="ui-button w-full mt-3 ${affordabilityClass}" 
                        ${!canAfford ? 'disabled' : ''}>
                    ${canAfford ? 'Buy Upgrade' : 'Not Enough Punches'}
                </button>
            </div>
        `;
    }

    // Generate upgrades modal content
    generateUpgradesContent() {
        const categories = {
            basic: [],
            combat: [],
            combo: [],
            automation: []
        };

        // Group upgrades by category
        Object.entries(this.upgradeDefinitions).forEach(([key, upgrade]) => {
            categories[upgrade.category].push(this.generateUpgradeCard(key, upgrade));
        });

        return `
            <div class="upgrades-container">
                <div class="mb-4 text-center">
                    <p class="text-lg font-semibold">Current Punches: <span class="text-indigo-600 font-bold">${this.formatNumber(this.gameState.count)}</span></p>
                </div>
                
                <div class="space-y-6">
                    <div>
                        <h2 class="text-xl font-bold mb-3 text-gray-800 border-b-2 border-indigo-200 pb-1">🎯 Basic Upgrades</h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            ${categories.basic.join('')}
                        </div>
                    </div>
                    
                    <div>
                        <h2 class="text-xl font-bold mb-3 text-gray-800 border-b-2 border-red-200 pb-1">⚔️ Combat Upgrades</h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            ${categories.combat.join('')}
                        </div>
                    </div>
                    
                    <div>
                        <h2 class="text-xl font-bold mb-3 text-gray-800 border-b-2 border-yellow-200 pb-1">🔥 Combo Upgrades</h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            ${categories.combo.join('')}
                        </div>
                    </div>
                    
                    <div>
                        <h2 class="text-xl font-bold mb-3 text-gray-800 border-b-2 border-green-200 pb-1">🤖 Automation Upgrades</h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            ${categories.automation.join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Setup upgrade event listeners
    setupUpgradeListeners(renderCallback) {
        Object.entries(this.upgradeDefinitions).forEach(([upgradeKey, upgrade]) => {
            const button = document.getElementById(upgrade.id);
            if (!button) return;
            
            // Check if upgrade is at max level
            const isMaxLevel = (
                (upgradeKey === 'critChance' && this.gameState.critChance >= 0.5) ||
                (upgradeKey === 'critMultiplier' && this.gameState.critMultiplier >= 20) ||
                (upgradeKey === 'comboDuration' && this.gameState.comboDuration >= 10000) ||
                (upgradeKey === 'autoPuncherPower' && this.gameState.autoPuncherPower >= 100)
            );
            
            if (isMaxLevel) {
                button.textContent = 'MAX LEVEL';
                button.disabled = true;
                button.classList.remove('bg-indigo-600', 'hover:bg-indigo-700');
                button.classList.add('bg-green-600', 'cursor-not-allowed');
                return;
            }
            
            if (!button.disabled) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    // Add visual feedback
                    button.classList.add('animate-pulse');
                    
                    const upgradeMethod = upgrade.getUpgradeMethod();
                    const success = upgradeMethod();
                    
                    if (success) {
                        // Show success feedback
                        this.showUpgradeSuccess(upgrade.title);
                        
                        // Save game state
                        this.gameState.saveGameData();
                        
                        // Re-render the upgrades
                        renderCallback();
                    } else {
                        // Show error feedback
                        this.showUpgradeError('Not enough punches!');
                        
                        // Remove pulse animation
                        setTimeout(() => {
                            button.classList.remove('animate-pulse');
                        }, 300);
                    }
                });
            }
        });
    }

    // Show upgrade success notification
    showUpgradeSuccess(upgradeName) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300';
        notification.textContent = `${upgradeName} upgraded! ✅`;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Remove after 2 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 2000);
    }

    // Show upgrade error notification
    showUpgradeError(message) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300';
        notification.textContent = `${message} ❌`;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Remove after 2 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 2000);
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