import { updateComboDisplay, resetComboDisplay, showComboMilestone, showFloatingNumber } from './ui.js';

// Combo management
export class ComboManager {
    constructor(gameState) {
        this.gameState = gameState;
        this.comboTimer = null;
        this.comboStartTime = null;
        this.lastComboMilestone = 0;
        this.comboStreaks = {
            current: 0,
            best: 0,
            milestones: [5, 10, 25, 50, 100, 250, 500, 1000]
        };
        this.comboTimeRemaining = 0;
        this.comboUpdateInterval = null;
    }

    // Handle combo increase
    handleCombo() {
        const wasFirstCombo = this.gameState.combo === 1;
        this.gameState.combo++;
        
        // Track combo start time
        if (wasFirstCombo) {
            this.comboStartTime = Date.now();
            this.startComboTimer();
        }
        
        // Update streak tracking
        this.comboStreaks.current = this.gameState.combo;
        if (this.gameState.combo > this.comboStreaks.best) {
            this.comboStreaks.best = this.gameState.combo;
        }
        
        // Check for combo milestones
        this.checkComboMilestones();
        
        // Update max combo tracking
        if (this.gameState.combo > this.gameState.maxCombo) {
            this.gameState.maxCombo = this.gameState.combo;
        }
        
        // Update display
        updateComboDisplay(this.gameState.combo, this.getComboBonus(), this.comboTimeRemaining);
        
        // Reset and restart timer
        this.resetComboTimer();
    }

    // Start combo timer with visual countdown
    startComboTimer() {
        this.comboTimeRemaining = this.gameState.getEffectiveComboDuration();
        
        // Update countdown every 100ms for smooth animation
        this.comboUpdateInterval = setInterval(() => {
            this.comboTimeRemaining -= 100;
            if (this.comboTimeRemaining <= 0) {
                this.resetCombo();
            } else {
                updateComboDisplay(this.gameState.combo, this.getComboBonus(), this.comboTimeRemaining);
            }
        }, 100);
    }

    // Reset combo timer
    resetComboTimer() {
        clearTimeout(this.comboTimer);
        clearInterval(this.comboUpdateInterval);
        
        this.comboTimeRemaining = this.gameState.getEffectiveComboDuration();
        this.comboTimer = setTimeout(() => this.resetCombo(), this.comboTimeRemaining);
        this.startComboTimer();
    }

    // Check for combo milestones and show celebrations
    checkComboMilestones() {
        const currentCombo = this.gameState.combo;
        
        for (const milestone of this.comboStreaks.milestones) {
            if (currentCombo === milestone && milestone > this.lastComboMilestone) {
                this.lastComboMilestone = milestone;
                this.celebrateComboMilestone(milestone);
                break;
            }
        }
    }

    // Celebrate combo milestone
    celebrateComboMilestone(milestone) {
        const bonus = this.getComboMilestoneBonus(milestone);
        showComboMilestone(milestone, bonus);
        
        // Apply milestone bonus
        if (bonus.type === 'damage') {
            this.gameState.addPunches(bonus.value);
            showFloatingNumber(bonus.value, 0, 0, false, 'COMBO BONUS!');
        }
    }

    // Get bonus for reaching combo milestone
    getComboMilestoneBonus(milestone) {
        const baseDamage = this.gameState.power * milestone;
        return {
            type: 'damage',
            value: Math.floor(baseDamage * (1 + milestone / 100))
        };
    }

    // Extend current combo duration (for power-ups)
    extendCombo(extraDuration) {
        if (this.comboTimer && this.gameState.combo > 1) {
            this.comboTimeRemaining += extraDuration;
            clearTimeout(this.comboTimer);
            this.comboTimer = setTimeout(() => this.resetCombo(), this.comboTimeRemaining);
        }
    }

    // Reset combo to 1
    resetCombo() {
        clearTimeout(this.comboTimer);
        clearInterval(this.comboUpdateInterval);
        
        const previousCombo = this.gameState.combo;
        this.gameState.combo = 1;
        this.comboStartTime = null;
        this.comboTimeRemaining = 0;
        this.lastComboMilestone = 0;
        this.comboStreaks.current = 1;
        
        resetComboDisplay(previousCombo);
    }

    // Get current combo multiplier with bonus scaling
    getComboMultiplier() {
        return this.gameState.combo;
    }

    // Get additional combo bonus (separate from base multiplier)
    getComboBonus() {
        const combo = this.gameState.combo;
        if (combo < 10) return 0;
        
        // Bonus scaling: 1% per combo after 10, with diminishing returns
        const baseBonus = Math.min((combo - 10) * 0.01, 2.0); // Cap at 200%
        const milestoneBonus = this.getMilestoneBonus(combo);
        
        return baseBonus + milestoneBonus;
    }

    // Get milestone-based bonus
    getMilestoneBonus(combo) {
        if (combo >= 1000) return 1.0; // 100% bonus
        if (combo >= 500) return 0.5;  // 50% bonus
        if (combo >= 250) return 0.3;  // 30% bonus
        if (combo >= 100) return 0.2;  // 20% bonus
        if (combo >= 50) return 0.1;   // 10% bonus
        return 0;
    }

    // Get combo statistics
    getComboStats() {
        return {
            current: this.gameState.combo,
            best: this.comboStreaks.best,
            timeRemaining: this.comboTimeRemaining,
            bonus: this.getComboBonus(),
            duration: this.comboStartTime ? Date.now() - this.comboStartTime : 0
        };
    }
}