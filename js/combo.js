import { updateComboDisplay, resetComboDisplay } from './ui.js';

// Combo management
export class ComboManager {
    constructor(gameState) {
        this.gameState = gameState;
        this.comboTimer = null;
    }

    // Handle combo increase
    handleCombo() {
        this.gameState.combo++;
        updateComboDisplay(this.gameState.combo);
        
        // Clear existing timer and set new one
        clearTimeout(this.comboTimer);
        this.comboTimer = setTimeout(() => this.resetCombo(), this.gameState.comboDuration);
    }

    // Reset combo to 1
    resetCombo() {
        this.gameState.combo = 1;
        resetComboDisplay();
    }

    // Get current combo multiplier
    getComboMultiplier() {
        return this.gameState.combo;
    }
}