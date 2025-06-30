
// Main game controller - imports all modules and coordinates game logic
import { Modal } from './modal.js';
import { GameState } from './gameState.js';
import { AchievementManager } from './achievements.js';
import { PowerUpManager } from './powerUps.js';
import { ComboManager } from './combo.js';
import { UpgradeManager } from './upgrades.js';
import { SettingsManager } from './settings.js';
import { showNotification, showFloatingNumber, updateComboDisplay, resetComboDisplay, createParticle, showFloatingDamage } from './ui.js';
import { GAME_CONSTANTS } from './config.js';
import { UIManager } from './uiManager.js';

// Game controller class
class Game {
    constructor() {
        this.initializeElements();
        this.initializeManagers();
        this.setupEventListeners();
        this.startGameLoop();
    }

    // Initialize DOM elements
    initializeElements() {
        this.punchTarget = document.getElementById('punch-target');
        this.punchSound = document.getElementById('punch-sound');
        this.settingsButton = document.getElementById('settings-button');
        this.upgradesButton = document.getElementById('upgrades-button');
        this.achievementsButton = document.getElementById('achievements-button');
        this.prestigeButton = document.getElementById('prestige-button');
    }

    // Initialize game managers
    initializeManagers() {
        this.modal = new Modal('modal', document.querySelector('.close-button'));
        this.gameState = new GameState();
        this.achievementManager = new AchievementManager(this.gameState);
        this.powerUpManager = new PowerUpManager(this.gameState);
        this.comboManager = new ComboManager(this.gameState);
        this.upgradeManager = new UpgradeManager(this.gameState, this.modal);
        this.settingsManager = new SettingsManager(this.gameState, this.modal);
        this.uiManager = new UIManager();
        
        // Connect managers to game state
        this.gameState.powerUpManager = this.powerUpManager;
        this.gameState.comboManager = this.comboManager;
        
        // Load settings
        this.settingsManager.loadSettings();
        
        // Initial UI update
        this.updateGame();
    }

    // Setup event listeners
    setupEventListeners() {
        // Punch target click
        this.punchTarget.addEventListener('click', (e) => this.handlePunch(e));
        
        // Button clicks
        this.settingsButton.addEventListener('click', () => this.settingsManager.showSettings());
        this.upgradesButton.addEventListener('click', () => this.upgradeManager.showUpgrades());
        this.achievementsButton.addEventListener('click', () => this.showAchievements());
        this.prestigeButton.addEventListener('click', () => this.showPrestige());
    }

    // Handle punch action
    handlePunch(event) {
        const { amount, isCrit } = this.gameState.calculatePunchDamage();
        
        // Check for over 9000 achievement
        if (isCrit) {
            this.achievementManager.checkOver9000(amount);
        }
        
        // Add punches to count
        this.gameState.addPunches(amount);
        
        // Show floating damage number and particles
        const x = event.clientX + (Math.random() - 0.5) * GAME_CONSTANTS.UI.FLOATING_DAMAGE_SPREAD;
        const y = event.clientY + (Math.random() - 0.5) * GAME_CONSTANTS.UI.FLOATING_DAMAGE_VERTICAL_SPREAD;
        
        showFloatingDamage(Math.floor(amount), x, y, isCrit);
        
        // Create particles for visual feedback
        const particleColor = isCrit ? GAME_CONSTANTS.UI.CRIT_COLOR : GAME_CONSTANTS.PARTICLES.DEFAULT_COLOR;
        for (let i = 0; i < (isCrit ? GAME_CONSTANTS.PARTICLES.CRIT_COUNT : GAME_CONSTANTS.PARTICLES.NORMAL_COUNT); i++) {
            createParticle(x + (Math.random() - 0.5) * 20, y + (Math.random() - 0.5) * 20, particleColor);
        }
        
        // Play sound
        this.playPunchSound();
        
        // Handle combo
        this.comboManager.handleCombo();
        
        // Update game state
        this.updateGame();
    }

    // Play punch sound
    playPunchSound() {
        try {
            this.punchSound.currentTime = 0;
            this.punchSound.play().catch(() => {});
        } catch (e) {
            // Audio play failed, continue without sound
        }
    }

    // Show achievements modal
    showAchievements() {
        const achievementsContent = this.achievementManager.generateAchievementsContent();
        this.modal.show('Achievements', achievementsContent);
    }

    // Show prestige modal
    showPrestige() {
        const prestigeContent = `
            <div class="text-center">
                <p class="text-lg mb-4">Are you sure you want to prestige? This will reset your progress in exchange for prestige points, which will boost your future gains.</p>
                <button id="confirm-prestige-button" class="ui-button bg-red-600 hover:bg-red-700">Prestige</button>
            </div>
        `;
        this.modal.show('Prestige', prestigeContent);

        const confirmButton = document.getElementById('confirm-prestige-button');
        if (confirmButton) {
            confirmButton.addEventListener('click', () => {
                if (this.gameState.prestige()) {
                    this.modal.hide();
                    location.reload(); // Reload to reset UI state
                }
            });
        }
    }

    // Update game state and UI
    updateGame() {
        // Update basic stats using UIManager for better performance
        this.uiManager.updateText('punch-count', this.gameState.count.toLocaleString());
        
        // Update combo display
        const comboStats = this.comboManager.getComboStats();
        updateComboDisplay(comboStats.current, comboStats.bonus, comboStats.timeRemaining);
        
        // Show prestige button when available
        if (this.gameState.canPrestige()) {
            this.uiManager.removeClass('prestige-button', 'hidden');
        } else {
            this.uiManager.addClass('prestige-button', 'hidden');
        }
        
        // Update prestige button
        const prestigeBtn = document.getElementById('prestige-btn');
        if (prestigeBtn) {
            if (this.gameState.canPrestige()) {
                prestigeBtn.disabled = false;
                prestigeBtn.textContent = 'Prestige Available!';
            } else {
                prestigeBtn.disabled = true;
                const remaining = this.gameState.prestigeRequirement - this.gameState.count;
                prestigeBtn.textContent = `Need ${remaining.toLocaleString()} more`;
            }
        }
        
        this.achievementManager.checkAchievements();
        this.gameState.saveGameData();
    }

    // Start the main game loop
    startGameLoop() {
        // Auto puncher interval
        setInterval(() => {
            const autoPunchAmount = this.gameState.getAutoPunchAmount();
            if (autoPunchAmount > 0) {
                this.gameState.addPunches(autoPunchAmount);
                this.updateGame();
            }
        }, GAME_CONSTANTS.UI.AUTO_PUNCH_INTERVAL);
        
        // Main game loop for UI updates
        setInterval(() => {
            this.updateGame();
        }, GAME_CONSTANTS.UI.UPDATE_INTERVAL);
    }
}

// Initialize the game when DOM is loaded or immediately if already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new Game());
} else {
    new Game();
}
