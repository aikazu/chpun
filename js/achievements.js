import { achievements } from './config.js';
import { showNotification } from './ui.js';

// Achievement management
export class AchievementManager {
    constructor(gameState) {
        this.gameState = gameState;
    }

    // Unlock an achievement
    unlockAchievement(id) {
        if (!this.gameState.unlockedAchievements[id]) {
            this.gameState.unlockedAchievements[id] = true;
            this.gameState.applyAchievementReward(id);
            this.gameState.saveGameData();
            showNotification(`Achievement Unlocked: ${achievements[id].name}\n${achievements[id].reward}`);
        }
    }

    // Check all achievements
    checkAchievements() {
        // Punch count achievements
        if (this.gameState.totalPunches >= 1) this.unlockAchievement('firstPunch');
        if (this.gameState.totalPunches >= 100) this.unlockAchievement('hundredPunches');
        if (this.gameState.totalPunches >= 1000) this.unlockAchievement('thousandPunches');
        if (this.gameState.totalPunches >= 100000) this.unlockAchievement('carpalTunnel');
        if (this.gameState.totalPunches >= 1000000) this.unlockAchievement('onePunchMan');
        
        // Critical hit achievements
        if (this.gameState.critChance >= 0.25) this.unlockAchievement('criticalMaster');
        
        // Combo achievements
        if (this.gameState.maxCombo >= 10) this.unlockAchievement('comboStarter');
        if (this.gameState.maxCombo >= 50) this.unlockAchievement('comboMaster');
        if (this.gameState.maxCombo >= 100) this.unlockAchievement('comboGod');
        
        // Auto puncher achievements
        if (this.gameState.autoPunchers >= 1) this.unlockAchievement('automation');
        if (this.gameState.autoPunchers >= 10) this.unlockAchievement('autoArmy');
        
        // Prestige achievements
        if (this.gameState.prestigePoints >= 1) this.unlockAchievement('inevitable');
        if (this.gameState.prestigePoints >= 5) this.unlockAchievement('prestigeMaster');
        
        // Power achievements
        if (this.gameState.power >= 100) this.unlockAchievement('powerHouse');
        
        // Speed achievements
        if (this.gameState.recentPunches.length >= 100) this.unlockAchievement('speedDemon');
        
        // Secret achievement (unlock after getting 10 other achievements)
        const unlockedCount = Object.values(this.gameState.unlockedAchievements).filter(Boolean).length;
        if (unlockedCount >= 10) this.unlockAchievement('secretPuncher');
    }

    // Check for over 9000 achievement (called when crit happens)
    checkOver9000(amount) {
        if (amount > 9000) this.unlockAchievement('over9000');
    }

    // Generate achievements modal content
    generateAchievementsContent() {
        let achievementsContent = '<div class="grid grid-cols-1 gap-4">';
        
        // Group achievements by category
        const categories = {
            'Punch Count': ['firstPunch', 'hundredPunches', 'thousandPunches', 'carpalTunnel', 'onePunchMan'],
            'Critical Hits': ['over9000', 'criticalMaster'],
            'Combos': ['comboStarter', 'comboMaster', 'comboGod'],
            'Automation': ['automation', 'autoArmy'],
            'Prestige': ['inevitable', 'prestigeMaster'],
            'Power': ['powerHouse'],
            'Speed': ['speedDemon'],
            'Secret': ['secretPuncher']
        };
        
        for (const [categoryName, achievementIds] of Object.entries(categories)) {
            achievementsContent += `<div class="mb-6">`;
            achievementsContent += `<h3 class="text-xl font-bold text-yellow-400 mb-3 border-b border-yellow-400/30 pb-1">${categoryName}</h3>`;
            
            for (const id of achievementIds) {
                const achievement = achievements[id];
                const isUnlocked = this.gameState.unlockedAchievements[id];
                const isHidden = achievement.hidden && !isUnlocked;
                
                if (isHidden) continue; // Skip hidden achievements until unlocked
                
                achievementsContent += `
                    <div class="p-4 mb-3 rounded-lg shadow-md transition-all duration-300 ${isUnlocked ? 'bg-green-500/20 border-l-4 border-green-400' : 'bg-gray-500/10 border-l-4 border-gray-600'}">
                        <div class="flex justify-between items-start mb-2">
                            <h4 class="font-bold text-white text-lg">${achievement.name}</h4>
                            <span class="px-2 py-1 rounded text-xs font-semibold ${isUnlocked ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-300'}">
                                ${isUnlocked ? '✓ UNLOCKED' : '🔒 LOCKED'}
                            </span>
                        </div>
                        <p class="text-gray-300 mb-2 text-sm">${achievement.description}</p>
                        <div class="text-xs ${isUnlocked ? 'text-green-300' : 'text-yellow-400'}">
                            <strong>Reward:</strong> ${achievement.reward}
                        </div>
                    </div>
                `;
            }
            achievementsContent += `</div>`;
        }
        
        // Achievement progress summary
        const totalAchievements = Object.keys(achievements).length;
        const unlockedCount = Object.values(this.gameState.unlockedAchievements).filter(Boolean).length;
        const progressPercent = Math.round((unlockedCount / totalAchievements) * 100);
        
        achievementsContent += `
            <div class="mt-6 p-4 bg-blue-500/20 rounded-lg border border-blue-400/30">
                <h3 class="text-lg font-bold text-blue-400 mb-2">Achievement Progress</h3>
                <div class="flex justify-between items-center mb-2">
                    <span class="text-white">${unlockedCount} / ${totalAchievements} Unlocked</span>
                    <span class="text-blue-300 font-semibold">${progressPercent}%</span>
                </div>
                <div class="w-full bg-gray-700 rounded-full h-3">
                    <div class="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500" style="width: ${progressPercent}%"></div>
                </div>
            </div>
        `;
        
        achievementsContent += '</div>';
        return achievementsContent;
    }
}