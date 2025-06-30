import { powerUps } from './config.js';
import { updateGameUI } from './ui.js';

// Power-up management
export class PowerUpManager {
    constructor(gameState) {
        this.gameState = gameState;
        this.powerUpContainer = document.getElementById('power-up-container');
        this.activePowerUps = new Map();
        
        // Start spawning power-ups
        this.startSpawning();
    }

    // Start the power-up spawning interval
    startSpawning() {
        setInterval(() => this.spawnPowerUp(), 15000);
    }

    // Spawn a random power-up
    spawnPowerUp() {
        const powerUp = powerUps[Math.floor(Math.random() * powerUps.length)];
        const powerUpElement = document.createElement('div');
        powerUpElement.textContent = powerUp.name;
        powerUpElement.classList.add('power-up', 'absolute', 'bg-yellow-400', 'text-white', 'font-bold', 'py-2', 'px-4', 'rounded-full', 'cursor-pointer', 'pointer-events-auto');
        powerUpElement.style.left = `${Math.random() * 80 + 10}%`;
        powerUpElement.style.top = `${Math.random() * 80 + 10}%`;
        powerUpElement.style.zIndex = '1000';

        powerUpElement.addEventListener('click', () => {
            this.activatePowerUp(powerUp);
            powerUpElement.remove();
        });

        this.powerUpContainer.appendChild(powerUpElement);

        // Remove power-up after 5 seconds if not clicked
        setTimeout(() => {
            if (powerUpElement.parentNode) {
                powerUpElement.remove();
            }
        }, 5000);
    }

    // Activate a power-up
    activatePowerUp(powerUp) {
        const effect = powerUp.activate();
        
        switch (effect.type) {
            case 'powerMultiplier':
                this.applyPowerMultiplier(effect.value, effect.duration);
                break;
            case 'instantPunches':
                this.applyInstantPunches(effect.value);
                break;
        }
        
        this.gameState.saveGameData();
        updateGameUI(this.gameState);
    }

    // Apply power multiplier effect
    applyPowerMultiplier(multiplier, duration) {
        // Check if there's already an active power multiplier
        const existingEffect = Array.from(this.activePowerUps.values())
            .find(effect => effect.type === 'powerMultiplier');
        
        if (existingEffect) {
            // If there's an existing effect, clear it first
            const existingId = Array.from(this.activePowerUps.entries())
                .find(([id, effect]) => effect === existingEffect)?.[0];
            if (existingId) {
                clearTimeout(existingEffect.timeoutId);
                this.activePowerUps.delete(existingId);
                this.gameState.power = existingEffect.basePower;
            }
        }
        
        const basePower = this.gameState.power;
        this.gameState.power *= multiplier;
        
        // Store the effect to remove it later
        const effectId = Date.now() + Math.random(); // Add randomness to prevent collisions
        const timeoutId = setTimeout(() => {
            if (this.activePowerUps.has(effectId)) {
                this.gameState.power = basePower;
                this.activePowerUps.delete(effectId);
            }
        }, duration);
        
        this.activePowerUps.set(effectId, {
            type: 'powerMultiplier',
            basePower,
            multiplier,
            timeoutId
        });
    }

    // Apply instant punches effect
    applyInstantPunches(amount) {
        const totalAmount = this.gameState.power * amount;
        this.gameState.addPunches(totalAmount);
    }
}