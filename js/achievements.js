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
            this.gameState.saveGameData();
            showNotification(`Achievement Unlocked: ${achievements[id].name}`);
        }
    }

    // Check all achievements
    checkAchievements() {
        if (this.gameState.count >= 1) this.unlockAchievement('firstPunch');
        if (this.gameState.count >= 100000) this.unlockAchievement('carpalTunnel');
        if (this.gameState.count >= 1000000) this.unlockAchievement('onePunchMan');
        if (this.gameState.prestigePoints > 0) this.unlockAchievement('inevitable');
    }

    // Check for over 9000 achievement (called when crit happens)
    checkOver9000(amount) {
        if (amount > 9000) this.unlockAchievement('over9000');
    }

    // Generate achievements modal content
    generateAchievementsContent() {
        let achievementsContent = '<div class="grid grid-cols-1 gap-4">';
        for (const id in achievements) {
            const achievement = achievements[id];
            const isUnlocked = this.gameState.unlockedAchievements[id];
            achievementsContent += `
                <div class="p-4 rounded-lg shadow-md transition-all duration-300 ${isUnlocked ? 'bg-green-500/20' : 'bg-gray-500/10'}">
                    <h4 class="font-bold text-white">${achievement.name}</h4>
                    <p class="${isUnlocked ? 'text-green-300' : 'text-gray-400'}">${isUnlocked ? 'Unlocked' : 'Locked'}</p>
                </div>
            `;
        }
        achievementsContent += '</div>';
        return achievementsContent;
    }
}