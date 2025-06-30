import { config, GAME_CONSTANTS } from './config.js';
import { GameDataManager } from './dataManager.js';

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

    // Load game data using GameDataManager
    loadGameData() {
        const savedState = GameDataManager.load();
        
        if (savedState) {
            // Load from saved data with fallbacks
            this.count = savedState.count || 0;
            this.power = savedState.power || 1;
            this.cost = savedState.cost || config.initialCost;
            this.prestigePoints = savedState.prestigePoints || 0;
            this.prestigeRequirement = savedState.prestigeRequirement || config.PRESTIGE_REQUIREMENT;
            this.autoPunchers = savedState.autoPunchers || 0;
            this.autoPuncherCost = savedState.autoPuncherCost || config.initialAutoPuncherCost;
            this.critChance = savedState.critChance || config.critChance;
            this.critMultiplier = savedState.critMultiplier || config.critMultiplier;
            this.comboDuration = savedState.comboDuration || config.comboDuration;
            this.autoPuncherPower = savedState.autoPuncherPower || config.autoPuncherPower;
            this.autoPuncherSpeed = savedState.autoPuncherSpeed || 1;
            this.unlockedAchievements = savedState.unlockedAchievements || {};
            this.totalPunches = savedState.totalPunches || 0;
            this.maxCombo = savedState.maxCombo || 1;
            this.achievementBonuses = savedState.achievementBonuses || {
                critChanceBonus: 0,
                critMultiplierBonus: 0,
                comboDurationBonus: 0,
                autoPuncherPowerBonus: 0,
                prestigeBonus: 0,
                powerEfficiencyBonus: 0
            };
        }
        // If no saved data, constructor defaults are already set
    }

    // Save game data using GameDataManager
    saveGameData() {
        const success = GameDataManager.save(this);
        if (!success) {
            console.warn('Game data save failed - progress may be lost');
            // Could show user notification here
        }
        return success;
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
        if (typeof cost !== 'number' || cost < 0) {
            console.error('Invalid cost value:', cost);
            return false;
        }
        return this.count >= cost;
    }

    // Spend punches with validation
    spend(amount) {
        if (typeof amount !== 'number' || amount < 0) {
            console.error('Invalid spend amount:', amount);
            return false;
        }
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
            this.cost = Math.ceil(this.cost * GAME_CONSTANTS.SCALING.POWER_COST_MULTIPLIER);
            return true;
        }
        return false;
    }

    // Buy auto puncher
    buyAutoPuncher() {
        if (this.spend(this.autoPuncherCost)) {
            this.autoPunchers++;
            this.autoPuncherCost = Math.ceil(this.autoPuncherCost * GAME_CONSTANTS.SCALING.AUTO_PUNCHER_COST_MULTIPLIER);
            return true;
        }
        return false;
    }

    // Upgrade critical chance
    upgradeCritChance() {
        // Calculate cost based on current crit chance level (exponential scaling)
        const critLevel = Math.floor((this.critChance - config.critChance) / GAME_CONSTANTS.SCALING.CRIT_CHANCE_INCREMENT) + 1;
        const upgradeCost = Math.ceil(GAME_CONSTANTS.SCALING.CRIT_CHANCE_UPGRADE_BASE_COST * Math.pow(GAME_CONSTANTS.SCALING.CRIT_CHANCE_UPGRADE_MULTIPLIER, critLevel));
        
        // Cap critical chance at configured maximum
        if (this.critChance >= GAME_CONSTANTS.LIMITS.MAX_CRIT_CHANCE) {
            return false;
        }
        
        if (this.spend(upgradeCost)) {
            this.critChance += GAME_CONSTANTS.SCALING.CRIT_CHANCE_INCREMENT;
            this.critChance = Math.min(this.critChance, GAME_CONSTANTS.LIMITS.MAX_CRIT_CHANCE); // Ensure cap
            return true;
        }
        return false;
    }

    // Upgrade critical multiplier
    upgradeCritMultiplier() {
        // Calculate cost based on current crit multiplier level
        const critMultLevel = this.critMultiplier - config.critMultiplier + 1;
        const upgradeCost = Math.ceil(GAME_CONSTANTS.SCALING.CRIT_MULTIPLIER_UPGRADE_BASE_COST * Math.pow(GAME_CONSTANTS.SCALING.CRIT_MULTIPLIER_UPGRADE_MULTIPLIER, critMultLevel));
        
        // Cap critical multiplier at configured maximum
        if (this.critMultiplier >= GAME_CONSTANTS.LIMITS.MAX_CRIT_MULTIPLIER) {
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
        const comboLevel = Math.floor((this.comboDuration - config.comboDuration) / GAME_CONSTANTS.SCALING.COMBO_DURATION_INCREMENT) + 1;
        const upgradeCost = Math.ceil(GAME_CONSTANTS.SCALING.COMBO_DURATION_UPGRADE_BASE_COST * Math.pow(GAME_CONSTANTS.SCALING.COMBO_DURATION_UPGRADE_MULTIPLIER, comboLevel));
        
        // Cap combo duration at configured maximum
        if (this.comboDuration >= GAME_CONSTANTS.LIMITS.MAX_COMBO_DURATION) {
            return false;
        }
        
        if (this.spend(upgradeCost)) {
            this.comboDuration += GAME_CONSTANTS.SCALING.COMBO_DURATION_INCREMENT;
            this.comboDuration = Math.min(this.comboDuration, GAME_CONSTANTS.LIMITS.MAX_COMBO_DURATION); // Ensure cap
            return true;
        }
        return false;
    }

    // Upgrade auto puncher power
    upgradeAutoPuncherPower() {
        // Calculate cost based on current auto puncher power level
        const powerLevel = this.autoPuncherPower - config.autoPuncherPower + 1;
        const upgradeCost = Math.ceil(GAME_CONSTANTS.SCALING.AUTO_PUNCHER_POWER_UPGRADE_BASE_COST * Math.pow(GAME_CONSTANTS.SCALING.AUTO_PUNCHER_POWER_UPGRADE_MULTIPLIER, powerLevel));
        
        // Cap auto puncher power at configured maximum
        if (this.autoPuncherPower >= GAME_CONSTANTS.LIMITS.MAX_AUTO_PUNCHER_POWER) {
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
            
            // Scale prestige requirement using configured multiplier
            this.prestigeRequirement = Math.floor(this.prestigeRequirement * GAME_CONSTANTS.SCALING.PRESTIGE_REQUIREMENT_MULTIPLIER);
            
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

    // Export game data for backup
    exportData() {
        return {
            count: this.count,
            power: this.power,
            cost: this.cost,
            combo: this.combo,
            maxCombo: this.maxCombo,
            totalPunches: this.totalPunches,
            critChance: this.critChance,
            critMultiplier: this.critMultiplier,
            comboDuration: this.comboDuration,
            autoPunchers: this.autoPunchers,
            autoPuncherCost: this.autoPuncherCost,
            autoPuncherPower: this.autoPuncherPower,
            autoPuncherSpeed: this.autoPuncherSpeed,
            prestigePoints: this.prestigePoints,
            prestigeRequirement: this.prestigeRequirement,
            achievementBonuses: { ...this.achievementBonuses },
            achievements: { ...this.achievements },
            recentPunches: [...this.recentPunches],
            exportTimestamp: Date.now()
        };
    }

    // Import game data from backup
    importData(data) {
        if (!data || typeof data !== 'object') {
            throw new Error('Invalid import data');
        }

        // Validate and import core game state
        this.count = Math.max(0, data.count || 0);
        this.power = Math.max(1, data.power || 1);
        this.cost = Math.max(10, data.cost || 10);
        this.combo = Math.max(1, data.combo || 1);
        this.maxCombo = Math.max(1, data.maxCombo || 1);
        this.totalPunches = Math.max(0, data.totalPunches || 0);
        
        // Import upgrade values with validation
        this.critChance = Math.max(config.critChance, Math.min(GAME_CONSTANTS.LIMITS.MAX_CRIT_CHANCE, data.critChance || config.critChance));
        this.critMultiplier = Math.max(config.critMultiplier, Math.min(GAME_CONSTANTS.LIMITS.MAX_CRIT_MULTIPLIER, data.critMultiplier || config.critMultiplier));
        this.comboDuration = Math.max(config.comboDuration, Math.min(GAME_CONSTANTS.LIMITS.MAX_COMBO_DURATION, data.comboDuration || config.comboDuration));
        
        // Import auto puncher data
        this.autoPunchers = Math.max(0, data.autoPunchers || 0);
        this.autoPuncherCost = Math.max(config.initialAutoPuncherCost, data.autoPuncherCost || config.initialAutoPuncherCost);
        this.autoPuncherPower = Math.max(config.autoPuncherPower, Math.min(GAME_CONSTANTS.LIMITS.MAX_AUTO_PUNCHER_POWER, data.autoPuncherPower || config.autoPuncherPower));
        this.autoPuncherSpeed = Math.max(1, data.autoPuncherSpeed || 1);
        
        // Import prestige data
        this.prestigePoints = Math.max(0, data.prestigePoints || 0);
        this.prestigeRequirement = Math.max(config.PRESTIGE_REQUIREMENT, data.prestigeRequirement || config.PRESTIGE_REQUIREMENT);
        
        // Import achievement bonuses
        if (data.achievementBonuses && typeof data.achievementBonuses === 'object') {
            this.achievementBonuses = {
                critChanceBonus: Math.max(0, data.achievementBonuses.critChanceBonus || 0),
                critMultiplierBonus: Math.max(0, data.achievementBonuses.critMultiplierBonus || 0),
                comboDurationBonus: Math.max(0, data.achievementBonuses.comboDurationBonus || 0),
                autoPuncherPowerBonus: Math.max(0, data.achievementBonuses.autoPuncherPowerBonus || 0),
                prestigeBonus: Math.max(0, data.achievementBonuses.prestigeBonus || 0),
                powerEfficiencyBonus: Math.max(0, data.achievementBonuses.powerEfficiencyBonus || 0)
            };
        }
        
        // Import achievements
        if (data.achievements && typeof data.achievements === 'object') {
            this.achievements = { ...this.achievements, ...data.achievements };
        }
        
        // Import recent punches (for speed achievements)
        if (Array.isArray(data.recentPunches)) {
            this.recentPunches = data.recentPunches.filter(time => typeof time === 'number' && time > 0);
        }
        
        // Save the imported data
        this.saveGameData();
    }

    // Reset all game data
    resetGame() {
        // Clear only game data, preserve user settings
        GameDataManager.clearSaveData();
        
        // Reset all game state properties to initial values
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
        this.autoPuncherSpeed = 1;
        this.unlockedAchievements = {};
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
        
        // Save the reset state
        this.saveGameData();
        
        // Reload the page to ensure all UI is properly reset
        location.reload();
    }
}