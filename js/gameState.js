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
        this.autoPuncherSpeed = 1; // New property for power-up boosts
        this.unlockedAchievements = {};
        
        // Achievement tracking statistics
        this.totalPunches = 0;
        this.maxCombo = 1;
        this.recentPunches = [];
        this.achievementBonuses = {
            critChanceBonus: 0,
            critMultiplierBonus: 0,
            comboDurationBonus: 0,
            autoPuncherPowerBonus: 0,
            prestigeBonus: 0,
            powerEfficiencyBonus: 0
        };
        
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
        this.autoPuncherSpeed = Number(localStorage.getItem('autoPuncherSpeed')) || 1;
        this.unlockedAchievements = JSON.parse(localStorage.getItem('unlockedAchievements')) || {};
        
        // Load achievement tracking statistics
        this.totalPunches = Number(localStorage.getItem('totalPunches')) || 0;
        this.maxCombo = Number(localStorage.getItem('maxCombo')) || 1;
        this.achievementBonuses = JSON.parse(localStorage.getItem('achievementBonuses')) || {
            critChanceBonus: 0,
            critMultiplierBonus: 0,
            comboDurationBonus: 0,
            autoPuncherPowerBonus: 0,
            prestigeBonus: 0,
            powerEfficiencyBonus: 0
        };
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
        localStorage.setItem('autoPuncherSpeed', this.autoPuncherSpeed);
        localStorage.setItem('unlockedAchievements', JSON.stringify(this.unlockedAchievements));
        
        // Save achievement tracking statistics
        localStorage.setItem('totalPunches', this.totalPunches);
        localStorage.setItem('maxCombo', this.maxCombo);
        localStorage.setItem('achievementBonuses', JSON.stringify(this.achievementBonuses));
    }

    // Calculate punch damage
    calculatePunchDamage() {
        // Apply achievement bonuses
        const effectiveCritChance = Math.min(1, this.critChance + this.achievementBonuses.critChanceBonus);
        const effectiveCritMultiplier = this.critMultiplier + this.achievementBonuses.critMultiplierBonus;
        const prestigeMultiplier = Math.pow(1.1 + this.achievementBonuses.prestigeBonus, this.prestigePoints);
        const powerEfficiency = 1 + this.achievementBonuses.powerEfficiencyBonus;
        
        let amount = this.power * powerEfficiency * this.combo * prestigeMultiplier;
        
        // Apply combo bonus (separate from base multiplier)
        if (this.comboManager) {
            const comboBonus = this.comboManager.getComboBonus();
            amount *= (1 + comboBonus);
        }
        
        const isCrit = Math.random() < effectiveCritChance;
        if (isCrit) {
            amount *= effectiveCritMultiplier;
        }
        
        // Apply next punch multiplier from power-ups
        if (this.powerUpManager) {
            const nextPunchMultiplier = this.powerUpManager.getNextPunchMultiplier();
            amount *= nextPunchMultiplier;
        }
        
        return { amount, isCrit };
    }

    // Add punches to count
    addPunches(amount) {
        this.count += amount;
        this.totalPunches++;
        
        // Track recent punches for speed achievements
        const now = Date.now();
        this.recentPunches.push(now);
        // Keep only punches from last 10 seconds
        this.recentPunches = this.recentPunches.filter(time => now - time <= 10000);
        
        // Update max combo if current combo is higher
        if (this.combo > this.maxCombo) {
            this.maxCombo = this.combo;
        }
    }
    
    // Apply achievement reward
    applyAchievementReward(achievementId) {
        switch(achievementId) {
            case 'carpalTunnel':
                this.achievementBonuses.critChanceBonus += 0.05;
                break;
            case 'onePunchMan':
                this.achievementBonuses.critMultiplierBonus += 2;
                break;
            case 'over9000':
                this.achievementBonuses.critChanceBonus += 0.1;
                break;
            case 'criticalMaster':
                this.achievementBonuses.critMultiplierBonus += 1;
                break;
            case 'comboStarter':
                this.achievementBonuses.comboDurationBonus += 500;
                break;
            case 'comboMaster':
                this.achievementBonuses.comboDurationBonus += 1000;
                break;
            case 'comboGod':
                this.achievementBonuses.comboDurationBonus += 2000;
                break;
            case 'automation':
                this.achievementBonuses.autoPuncherPowerBonus += 1;
                break;
            case 'autoArmy':
                this.achievementBonuses.autoPuncherPowerBonus += 5;
                break;
            case 'inevitable':
                this.prestigePoints += 1;
                break;
            case 'prestigeMaster':
                this.achievementBonuses.prestigeBonus += 0.2;
                break;
            case 'powerHouse':
                this.achievementBonuses.powerEfficiencyBonus += 0.5;
                break;
            case 'secretPuncher':
                // Secret reward: massive bonuses
                this.achievementBonuses.critChanceBonus += 0.25;
                this.achievementBonuses.critMultiplierBonus += 5;
                this.achievementBonuses.comboDurationBonus += 5000;
                this.achievementBonuses.autoPuncherPowerBonus += 10;
                break;
        }
    }
    
    // Get effective combo duration with bonuses
    getEffectiveComboDuration() {
        return this.comboDuration + this.achievementBonuses.comboDurationBonus;
    }
    
    // Get effective auto puncher power with bonuses
    getEffectiveAutoPuncherPower() {
        return this.autoPuncherPower + this.achievementBonuses.autoPuncherPowerBonus;
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
        // Calculate cost based on current crit chance level (exponential scaling)
        const critLevel = Math.floor((this.critChance - config.critChance) / 0.005) + 1;
        const upgradeCost = Math.ceil(100 * Math.pow(2, critLevel));
        
        // Cap critical chance at 50%
        if (this.critChance >= 0.5) {
            return false;
        }
        
        if (this.spend(upgradeCost)) {
            this.critChance += 0.005;
            this.critChance = Math.min(this.critChance, 0.5); // Ensure cap
            return true;
        }
        return false;
    }

    // Upgrade critical multiplier
    upgradeCritMultiplier() {
        // Calculate cost based on current crit multiplier level
        const critMultLevel = this.critMultiplier - config.critMultiplier + 1;
        const upgradeCost = Math.ceil(500 * Math.pow(3, critMultLevel));
        
        // Cap critical multiplier at 20x
        if (this.critMultiplier >= 20) {
            return false;
        }
        
        if (this.spend(upgradeCost)) {
            this.critMultiplier++;
            return true;
        }
        return false;
    }

    // Upgrade combo duration
    upgradeComboDuration() {
        // Calculate cost based on current combo duration level
        const comboLevel = Math.floor((this.comboDuration - config.comboDuration) / 100) + 1;
        const upgradeCost = Math.ceil(200 * Math.pow(1.8, comboLevel));
        
        // Cap combo duration at 10 seconds (10000ms)
        if (this.comboDuration >= 10000) {
            return false;
        }
        
        if (this.spend(upgradeCost)) {
            this.comboDuration += 100;
            this.comboDuration = Math.min(this.comboDuration, 10000); // Ensure cap
            return true;
        }
        return false;
    }

    // Upgrade auto puncher power
    upgradeAutoPuncherPower() {
        // Calculate cost based on current auto puncher power level
        const powerLevel = this.autoPuncherPower - config.autoPuncherPower + 1;
        const upgradeCost = Math.ceil(1000 * Math.pow(2.5, powerLevel));
        
        // Cap auto puncher power at 100
        if (this.autoPuncherPower >= 100) {
            return false;
        }
        
        if (this.spend(upgradeCost)) {
            this.autoPuncherPower++;
            return true;
        }
        return false;
    }

    // Calculate auto punch amount
    getAutoPunchAmount() {
        const effectiveAutoPuncherPower = this.getEffectiveAutoPuncherPower();
        const prestigeMultiplier = Math.pow(1.1 + this.achievementBonuses.prestigeBonus, this.prestigePoints);
        const speedMultiplier = this.autoPuncherSpeed || 1; // Apply speed boost from power-ups
        return this.autoPunchers * effectiveAutoPuncherPower * prestigeMultiplier * speedMultiplier;
    }

    // Check if prestige is available
    canPrestige() {
        return this.count >= this.prestigeRequirement;
    }

    // Perform prestige
    prestige() {
        if (this.canPrestige()) {
            // Award 1 prestige point per prestige (simple and predictable)
            this.prestigePoints += 1;
            
            // Scale prestige requirement more reasonably (2x multiplier)
            this.prestigeRequirement = Math.floor(this.prestigeRequirement * 2);
            
            // Reset basic game state but preserve some upgrades for progression
            this.count = 0;
            this.power = 1;
            this.cost = config.initialCost;
            // Don't reset combo - let it continue
            this.autoPunchers = 0;
            this.autoPuncherCost = config.initialAutoPuncherCost;
            
            // Preserve some upgrade progress (50% retention for better progression)
            const critChanceProgress = this.critChance - config.critChance;
            const critMultProgress = this.critMultiplier - config.critMultiplier;
            const comboDurationProgress = this.comboDuration - config.comboDuration;
            
            this.critChance = config.critChance + (critChanceProgress * 0.5);
            this.critMultiplier = config.critMultiplier + Math.floor(critMultProgress * 0.5);
            this.comboDuration = config.comboDuration + Math.floor(comboDurationProgress * 0.5);
            
            // autoPuncherPower persists fully through prestige
            this.autoPuncherSpeed = 1; // Reset auto puncher speed
            
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