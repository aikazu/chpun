import { config } from './config.js';

// Game state management
export class GameState {
    constructor() {
        this.count = 0;
        this.power = 1;
        this.cost = config.initialCost;
        this.combo = 1;
        this.comboTimer = null;
        this.prestigePoints = 0;
        this.prestigeRequirement = config.PRESTIGE_REQUIREMENT;
        this.autoPuncherCost = config.initialAutoPuncherCost;
        this.autoPunchers = 0;
        this.critChance = config.critChance;
        this.critMultiplier = config.critMultiplier;
        this.comboDuration = config.comboDuration;
        this.autoPuncherPower = config.autoPuncherPower;
        this.unlockedAchievements = {};
        
        this.loadGameData();
    }

    // Load game data from localStorage
    loadGameData() {
        this.count = Number(localStorage.getItem('count')) || 0;
        this.power = Number(localStorage.getItem('power')) || 1;
        this.cost = Number(localStorage.getItem('cost')) || config.initialCost;
        this.prestigePoints = Number(localStorage.getItem('prestigePoints')) || 0;
        this.prestigeRequirement = Number(localStorage.getItem('prestigeRequirement')) || config.PRESTIGE_REQUIREMENT;
        this.autoPunchers = Number(localStorage.getItem('autoPunchers')) || 0;
        this.autoPuncherCost = Number(localStorage.getItem('autoPuncherCost')) || config.initialAutoPuncherCost;
        this.critChance = Number(localStorage.getItem('critChance')) || config.critChance;
        this.critMultiplier = Number(localStorage.getItem('critMultiplier')) || config.critMultiplier;
        this.comboDuration = Number(localStorage.getItem('comboDuration')) || config.comboDuration;
        this.autoPuncherPower = Number(localStorage.getItem('autoPuncherPower')) || config.autoPuncherPower;
        this.unlockedAchievements = JSON.parse(localStorage.getItem('unlockedAchievements')) || {};
    }

    // Save game data to localStorage
    saveGameData() {
        localStorage.setItem('count', this.count);
        localStorage.setItem('power', this.power);
        localStorage.setItem('cost', this.cost);
        localStorage.setItem('prestigePoints', this.prestigePoints);
        localStorage.setItem('prestigeRequirement', this.prestigeRequirement);
        localStorage.setItem('autoPunchers', this.autoPunchers);
        localStorage.setItem('autoPuncherCost', this.autoPuncherCost);
        localStorage.setItem('critChance', this.critChance);
        localStorage.setItem('critMultiplier', this.critMultiplier);
        localStorage.setItem('comboDuration', this.comboDuration);
        localStorage.setItem('autoPuncherPower', this.autoPuncherPower);
        localStorage.setItem('unlockedAchievements', JSON.stringify(this.unlockedAchievements));
    }

    // Calculate punch damage
    calculatePunchDamage() {
        let amount = this.power * this.combo * Math.pow(1.1, this.prestigePoints);
        const isCrit = Math.random() < this.critChance;
        if (isCrit) {
            amount *= this.critMultiplier;
        }
        return { amount, isCrit };
    }

    // Add punches to count
    addPunches(amount) {
        this.count += amount;
    }

    // Check if player can afford an upgrade
    canAfford(cost) {
        return this.count >= cost;
    }

    // Spend punches
    spend(amount) {
        if (this.canAfford(amount)) {
            this.count -= amount;
            return true;
        }
        return false;
    }

    // Upgrade power
    upgradePower() {
        if (this.spend(this.cost)) {
            this.power++;
            this.cost = Math.ceil(this.cost * 1.5);
            return true;
        }
        return false;
    }

    // Buy auto puncher
    buyAutoPuncher() {
        if (this.spend(this.autoPuncherCost)) {
            this.autoPunchers++;
            this.autoPuncherCost = Math.ceil(this.autoPuncherCost * 1.5);
            return true;
        }
        return false;
    }

    // Upgrade critical chance
    upgradeCritChance() {
        const upgradeCost = Math.ceil(this.cost * 2);
        if (this.spend(upgradeCost)) {
            this.critChance += 0.005;
            return true;
        }
        return false;
    }

    // Upgrade critical multiplier
    upgradeCritMultiplier() {
        const upgradeCost = Math.ceil(this.cost * 5);
        if (this.spend(upgradeCost)) {
            this.critMultiplier++;
            return true;
        }
        return false;
    }

    // Upgrade combo duration
    upgradeComboDuration() {
        const upgradeCost = Math.ceil(this.cost * 1.2);
        if (this.spend(upgradeCost)) {
            this.comboDuration += 100;
            return true;
        }
        return false;
    }

    // Upgrade auto puncher power
    upgradeAutoPuncherPower() {
        const upgradeCost = Math.ceil(this.autoPuncherCost * 3);
        if (this.spend(upgradeCost)) {
            this.autoPuncherPower++;
            return true;
        }
        return false;
    }

    // Calculate auto punch amount
    getAutoPunchAmount() {
        return this.autoPunchers * this.autoPuncherPower * Math.pow(1.1, this.prestigePoints);
    }

    // Check if prestige is available
    canPrestige() {
        return this.count >= this.prestigeRequirement;
    }

    // Perform prestige
    prestige() {
        if (this.canPrestige()) {
            const newPrestigePoints = Math.floor(this.count / this.prestigeRequirement);
            this.prestigePoints += newPrestigePoints;
            this.prestigeRequirement = Math.floor(this.prestigeRequirement * (1.5 + newPrestigePoints * 0.1));
            
            // Reset game state
            this.count = 0;
            this.power = 1;
            this.cost = config.initialCost;
            this.combo = 1;
            this.autoPunchers = 0;
            this.autoPuncherCost = config.initialAutoPuncherCost;
            this.critChance = config.critChance;
            this.critMultiplier = config.critMultiplier;
            this.comboDuration = config.comboDuration;
            this.autoPuncherPower = config.autoPuncherPower;
            
            return true;
        }
        return false;
    }

    // Reset all game data
    resetGame() {
        localStorage.clear();
        location.reload();
    }
}