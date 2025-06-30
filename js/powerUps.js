import { powerUps, powerUpRarityWeights } from './config.js';
import { updateGameUI, showNotification } from './ui.js';

// Power-up management
export class PowerUpManager {
    constructor(gameState) {
        this.gameState = gameState;
        this.powerUpContainer = document.getElementById('power-up-container');
        this.activePowerUps = new Map();
        this.nextPunchMultiplier = 1;
        this.temporaryEffects = new Map();
        
        // Start spawning power-ups
        this.startSpawning();
    }

    // Start the power-up spawning interval
    startSpawning() {
        // Spawn power-ups every 12-18 seconds (random interval)
        const scheduleNextSpawn = () => {
            const interval = 12000 + Math.random() * 6000; // 12-18 seconds
            setTimeout(() => {
                this.spawnPowerUp();
                scheduleNextSpawn();
            }, interval);
        };
        scheduleNextSpawn();
    }

    // Select power-up based on rarity weights
    selectPowerUpByRarity() {
        const totalWeight = Object.values(powerUpRarityWeights).reduce((sum, weight) => sum + weight, 0);
        let random = Math.random() * totalWeight;
        
        for (const [rarity, weight] of Object.entries(powerUpRarityWeights)) {
            random -= weight;
            if (random <= 0) {
                const powerUpsOfRarity = powerUps.filter(p => p.rarity === rarity);
                return powerUpsOfRarity[Math.floor(Math.random() * powerUpsOfRarity.length)];
            }
        }
        
        // Fallback to common if something goes wrong
        const commonPowerUps = powerUps.filter(p => p.rarity === 'common');
        return commonPowerUps[Math.floor(Math.random() * commonPowerUps.length)];
    }

    // Get safe spawn position avoiding UI elements
    getSafeSpawnPosition() {
        const gameContainer = document.querySelector('.game-container');
        const comboContainer = document.getElementById('combo-container');
        
        if (!gameContainer) {
            // Fallback to safe center area
            return {
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)'
            };
        }
        
        const containerRect = gameContainer.getBoundingClientRect();
        const comboRect = comboContainer ? comboContainer.getBoundingClientRect() : null;
        
        let attempts = 0;
        let position;
        
        do {
            // Generate random position within game container bounds
            const leftPercent = Math.random() * 60 + 20; // 20% to 80% to avoid edges
            const topPercent = Math.random() * 60 + 20;  // 20% to 80% to avoid edges
            
            position = {
                left: `${leftPercent}%`,
                top: `${topPercent}%`
            };
            
            // Check if position conflicts with combo container
            if (comboRect) {
                const powerUpLeft = (leftPercent / 100) * containerRect.width;
                const powerUpTop = (topPercent / 100) * containerRect.height;
                
                // Define safe zones (avoid top-left for combo, center for punch target)
                const isInComboZone = powerUpLeft < 200 && powerUpTop < 150;
                const isInCenterZone = Math.abs(powerUpLeft - containerRect.width / 2) < 150 && 
                                     Math.abs(powerUpTop - containerRect.height / 2) < 150;
                
                if (!isInComboZone && !isInCenterZone) {
                    break; // Found safe position
                }
            } else {
                break; // No combo container to avoid
            }
            
            attempts++;
        } while (attempts < 10);
        
        return position;
    }

    // Spawn a random power-up with rarity-based selection
    spawnPowerUp() {
        // Limit concurrent power-ups to prevent screen clutter
        const activePowerUpElements = this.powerUpContainer.querySelectorAll('.power-up');
        if (activePowerUpElements.length >= 3) {
            return; // Don't spawn if there are already 3 power-ups
        }
        
        const powerUp = this.selectPowerUpByRarity();
        const powerUpElement = document.createElement('div');
        
        // Create power-up content with icon and name
        powerUpElement.innerHTML = `
            <div class="flex items-center space-x-2">
                <span class="text-2xl">${powerUp.icon}</span>
                <div class="flex flex-col">
                    <span class="font-bold text-sm">${powerUp.name}</span>
                    <span class="text-xs opacity-80">${powerUp.rarity}</span>
                </div>
            </div>
        `;
        
        // Style based on rarity
        powerUpElement.classList.add('power-up', 'absolute', 'text-white', 'font-bold', 'py-3', 'px-4', 'rounded-lg', 'cursor-pointer', 'pointer-events-auto', 'shadow-lg', 'power-up-spawn');
        powerUpElement.style.backgroundColor = powerUp.color;
        powerUpElement.style.zIndex = '1000';
        powerUpElement.title = powerUp.description;
        powerUpElement.setAttribute('data-rarity', powerUp.rarity);
        
        // Get safe position avoiding UI conflicts
        const position = this.getSafeSpawnPosition();
        powerUpElement.style.left = position.left;
        powerUpElement.style.top = position.top;
        if (position.transform) {
            powerUpElement.style.transform = position.transform;
        }
        
        // Add click handler
        powerUpElement.addEventListener('click', () => {
            this.activatePowerUp(powerUp);
            this.createPickupEffect(powerUpElement, powerUp);
            powerUpElement.remove();
        });

        this.powerUpContainer.appendChild(powerUpElement);

        // Remove power-up after timeout (longer for rare ones)
        const lifetime = powerUp.rarity === 'epic' ? 12000 : powerUp.rarity === 'rare' ? 10000 : 8000;
        setTimeout(() => {
            if (powerUpElement.parentNode) {
                powerUpElement.style.opacity = '0';
                setTimeout(() => powerUpElement.remove(), 300);
            }
        }, lifetime);
    }

    // Create visual effect when power-up is picked up
    createPickupEffect(element, powerUp) {
        const rect = element.getBoundingClientRect();
        const effect = document.createElement('div');
        effect.innerHTML = `<span style="font-size: 3rem;">${powerUp.icon}</span>`;
        effect.style.position = 'fixed';
        effect.style.left = rect.left + rect.width / 2 + 'px';
        effect.style.top = rect.top + rect.height / 2 + 'px';
        effect.style.transform = 'translate(-50%, -50%)';
        effect.style.pointerEvents = 'none';
        effect.style.zIndex = '9999';
        document.body.appendChild(effect);
        
        // Animate the effect
        if (window.gsap) {
            gsap.fromTo(effect, 
                { scale: 1, opacity: 1 }, 
                { scale: 2, opacity: 0, duration: 0.8, ease: 'power2.out', onComplete: () => effect.remove() }
            );
        } else {
            setTimeout(() => effect.remove(), 800);
        }
    }

    // Activate a power-up
    activatePowerUp(powerUp) {
        const effect = powerUp.activate();
        
        // Show notification with power-up details
        showNotification(`${powerUp.icon} ${powerUp.name} activated! ${powerUp.description}`);
        
        switch (effect.type) {
            case 'powerMultiplier':
                this.applyPowerMultiplier(effect.value, effect.duration);
                break;
            case 'instantPunches':
                this.applyInstantPunches(effect.value);
                break;
            case 'comboDurationBoost':
                this.applyComboDurationBoost(effect.value);
                break;
            case 'critChanceBoost':
                this.applyCritChanceBoost(effect.value, effect.duration);
                break;
            case 'autoPuncherBoost':
                this.applyAutoPuncherBoost(effect.value, effect.duration);
                break;
            case 'nextPunchMultiplier':
                this.applyNextPunchMultiplier(effect.value);
                break;
            case 'timeWarp':
                this.applyTimeWarp(effect.value);
                break;
            case 'godMode':
                this.applyGodMode(effect.powerMultiplier, effect.critChance, effect.duration);
                break;
            case 'prestigeBoost':
                this.applyPrestigeBoost(effect.value);
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

    // Apply combo duration boost
    applyComboDurationBoost(extraDuration) {
        if (this.gameState.comboManager) {
            this.gameState.comboManager.extendCombo(extraDuration);
        }
    }

    // Apply critical chance boost
    applyCritChanceBoost(boost, duration) {
        const effectId = Date.now() + Math.random();
        const originalCritChance = this.gameState.critChance;
        this.gameState.critChance = Math.min(1.0, this.gameState.critChance + boost);
        
        const timeoutId = setTimeout(() => {
            if (this.temporaryEffects.has(effectId)) {
                this.gameState.critChance = originalCritChance;
                this.temporaryEffects.delete(effectId);
            }
        }, duration);
        
        this.temporaryEffects.set(effectId, {
            type: 'critChanceBoost',
            originalValue: originalCritChance,
            timeoutId
        });
    }

    // Apply auto puncher boost
    applyAutoPuncherBoost(multiplier, duration) {
        const effectId = Date.now() + Math.random();
        const originalSpeed = this.gameState.autoPuncherSpeed || 1;
        this.gameState.autoPuncherSpeed = originalSpeed * multiplier;
        
        const timeoutId = setTimeout(() => {
            if (this.temporaryEffects.has(effectId)) {
                this.gameState.autoPuncherSpeed = originalSpeed;
                this.temporaryEffects.delete(effectId);
            }
        }, duration);
        
        this.temporaryEffects.set(effectId, {
            type: 'autoPuncherBoost',
            originalValue: originalSpeed,
            timeoutId
        });
    }

    // Apply next punch multiplier
    applyNextPunchMultiplier(multiplier) {
        this.nextPunchMultiplier = multiplier;
    }

    // Apply time warp (instant auto punches)
    applyTimeWarp(seconds) {
        const autoPunchAmount = this.gameState.getAutoPunchAmount();
        const totalAmount = autoPunchAmount * seconds;
        if (totalAmount > 0) {
            this.gameState.addPunches(totalAmount);
        }
    }

    // Apply god mode (multiple effects)
    applyGodMode(powerMultiplier, critChance, duration) {
        // Apply power multiplier
        this.applyPowerMultiplier(powerMultiplier, duration);
        // Apply crit chance boost
        this.applyCritChanceBoost(critChance, duration);
    }

    // Apply prestige boost
    applyPrestigeBoost(percentage) {
        const boost = this.gameState.config?.PRESTIGE_REQUIREMENT * percentage || 100000;
        this.gameState.addPunches(boost);
    }

    // Get and consume next punch multiplier
    getNextPunchMultiplier() {
        const multiplier = this.nextPunchMultiplier;
        this.nextPunchMultiplier = 1;
        return multiplier;
    }

    // Check if there are active power-ups
    hasActivePowerUps() {
        return this.activePowerUps.size > 0 || this.temporaryEffects.size > 0;
    }

    // Get active power-ups for UI display
    getActivePowerUps() {
        const active = [];
        
        // Add power multipliers
        for (const [id, effect] of this.activePowerUps) {
            if (effect.type === 'powerMultiplier') {
                active.push({
                    name: `${effect.multiplier}x Power`,
                    icon: '💪',
                    timeLeft: this.getTimeLeft(effect.timeoutId)
                });
            }
        }
        
        // Add temporary effects
        for (const [id, effect] of this.temporaryEffects) {
            let name = '';
            let icon = '';
            
            switch (effect.type) {
                case 'critChanceBoost':
                    name = 'Crit Boost';
                    icon = '💥';
                    break;
                case 'autoPuncherBoost':
                    name = 'Auto Boost';
                    icon = '🤖';
                    break;
            }
            
            if (name) {
                active.push({
                    name,
                    icon,
                    timeLeft: this.getTimeLeft(effect.timeoutId)
                });
            }
        }
        
        return active;
    }

    // Helper to get remaining time for an effect
    getTimeLeft(timeoutId) {
        // This is a simplified version - in a real implementation,
        // you'd want to track start times and durations
        return 'Active';
    }
}