// Game data management with error handling and versioning
export class GameDataManager {
    static SAVE_KEY = 'punchGameData';
    static VERSION = '1.0';
    
    /**
     * Save game state to localStorage with error handling
     * @param {GameState} gameState - The game state to save
     * @returns {boolean} Success status
     */
    static save(gameState) {
        try {
            const data = {
                version: this.VERSION,
                timestamp: Date.now(),
                state: {
                    count: gameState.count,
                    power: gameState.power,
                    cost: gameState.cost,
                    combo: gameState.combo,
                    prestigePoints: gameState.prestigePoints,
                    prestigeRequirement: gameState.prestigeRequirement,
                    autoPunchers: gameState.autoPunchers,
                    autoPuncherCost: gameState.autoPuncherCost,
                    critChance: gameState.critChance,
                    critMultiplier: gameState.critMultiplier,
                    comboDuration: gameState.comboDuration,
                    autoPuncherPower: gameState.autoPuncherPower,
                    autoPuncherSpeed: gameState.autoPuncherSpeed,
                    unlockedAchievements: gameState.unlockedAchievements,
                    totalPunches: gameState.totalPunches,
                    maxCombo: gameState.maxCombo,
                    achievementBonuses: gameState.achievementBonuses
                }
            };
            
            const serialized = JSON.stringify(data);
            localStorage.setItem(this.SAVE_KEY, serialized);
            return true;
        } catch (error) {
            console.error('Failed to save game data:', error);
            this.handleSaveError(error);
            return false;
        }
    }
    
    /**
     * Load game state from localStorage with validation
     * @returns {Object|null} Loaded game state or null if failed
     */
    static load() {
        try {
            const savedData = localStorage.getItem(this.SAVE_KEY);
            if (!savedData) {
                console.log('No saved game data found, using defaults');
                return null;
            }
            
            const data = JSON.parse(savedData);
            return this.validateAndMigrate(data);
        } catch (error) {
            console.warn('Failed to load save data, using defaults:', error);
            return null;
        }
    }
    
    /**
     * Validate and migrate save data if needed
     * @param {Object} data - Raw save data
     * @returns {Object|null} Validated data or null if invalid
     */
    static validateAndMigrate(data) {
        if (!data || typeof data !== 'object') {
            console.warn('Invalid save data format');
            return null;
        }
        
        // Version migration logic can be added here
        if (data.version !== this.VERSION) {
            console.log(`Migrating save data from version ${data.version} to ${this.VERSION}`);
            // Add migration logic as needed
        }
        
        // Validate required fields
        const state = data.state;
        if (!state || typeof state !== 'object') {
            console.warn('Invalid game state in save data');
            return null;
        }
        
        // Validate numeric fields
        const numericFields = ['count', 'power', 'cost', 'combo', 'prestigePoints', 
                              'prestigeRequirement', 'autoPunchers', 'autoPuncherCost',
                              'critChance', 'critMultiplier', 'comboDuration', 
                              'autoPuncherPower', 'autoPuncherSpeed', 'totalPunches', 'maxCombo'];
        
        for (const field of numericFields) {
            if (state[field] !== undefined && (typeof state[field] !== 'number' || isNaN(state[field]))) {
                console.warn(`Invalid ${field} value in save data:`, state[field]);
                return null;
            }
        }
        
        return state;
    }
    
    /**
     * Handle save errors with user feedback
     * @param {Error} error - The error that occurred
     */
    static handleSaveError(error) {
        if (error.name === 'QuotaExceededError') {
            console.error('Storage quota exceeded. Consider clearing old save data.');
            // Could show user notification here
        } else {
            console.error('Unexpected save error:', error);
        }
    }
    
    /**
     * Clear all save data
     * @returns {boolean} Success status
     */
    static clearSaveData() {
        try {
            localStorage.removeItem(this.SAVE_KEY);
            return true;
        } catch (error) {
            console.error('Failed to clear save data:', error);
            return false;
        }
    }
    
    /**
     * Get save data info without loading
     * @returns {Object|null} Save info or null if no save exists
     */
    static getSaveInfo() {
        try {
            const savedData = localStorage.getItem(this.SAVE_KEY);
            if (!savedData) return null;
            
            const data = JSON.parse(savedData);
            return {
                version: data.version,
                timestamp: data.timestamp,
                hasValidData: !!data.state
            };
        } catch (error) {
            console.warn('Failed to get save info:', error);
            return null;
        }
    }
}