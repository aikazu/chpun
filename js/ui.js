// UI utility functions
const notificationContainer = document.getElementById('notification-container');
const particlesContainer = document.getElementById('particles-container');
const punchTarget = document.getElementById('punch-target');
const comboCounter = document.getElementById('combo-counter');
const comboBar = document.getElementById('combo-bar');

// Show notification
export function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notificationContainer.appendChild(notification);

    gsap.fromTo(notification, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
    gsap.to(notification, { opacity: 0, y: -20, duration: 0.5, delay: 3, ease: 'power2.in', onComplete: () => notification.remove() });
}

// Create particle effects
export function createParticles(amount) {
    const rect = punchTarget.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < amount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        const x = (Math.random() - 0.5) * 500;
        const y = (Math.random() - 0.5) * 500;

        particle.style.left = startX + 'px';
        particle.style.top = startY + 'px';

        fragment.appendChild(particle);

        gsap.fromTo(particle, { x: 0, y: 0, opacity: 1 }, { x, y, opacity: 0, duration: 1, ease: "power2.out", onComplete: () => particle.remove() });
    }
    particlesContainer.appendChild(fragment);
}

// Show floating damage number
export function showFloatingNumber(amount, x, y, isCrit = false) {
    const number = document.createElement('div');
    number.textContent = `+${amount}`;
    number.style.position = 'absolute';
    const rect = punchTarget.getBoundingClientRect();
    number.style.left = (rect.left + rect.width / 2) + 'px';
    number.style.top = (rect.top + rect.height / 2) + 'px';
    number.style.fontSize = isCrit ? '36px' : '24px';
    number.style.fontWeight = 'bold';
    number.style.color = isCrit ? '#ff4d4d' : '#ffc107';
    number.style.pointerEvents = 'none';
    document.body.appendChild(number);

    gsap.fromTo(number, { y: 0, opacity: 1 }, { y: -150, opacity: 0, duration: 1.5, ease: "power1.out", onComplete: () => number.remove() });
}

// Update combo display with enhanced features
export function updateComboDisplay(combo, bonus = 0, timeRemaining = 0) {
    const comboCounter = document.getElementById('combo-counter');
    const comboBar = document.getElementById('combo-bar');
    const comboContainer = document.getElementById('combo-container');
    
    if (comboCounter) {
        // Update combo text with bonus information
        let comboText = `${combo}x`;
        if (bonus > 0) {
            comboText += ` (+${Math.round(bonus * 100)}%)`;
        }
        comboCounter.textContent = comboText;
        
        // Add different animations based on combo level
        if (combo >= 100) {
            // Epic combo animation
            gsap.fromTo(comboCounter, 
                { scale: 1, rotation: 0 },
                { scale: 1.3, rotation: 5, duration: 0.15, yoyo: true, repeat: 1, ease: "back.out(1.7)" }
            );
            comboCounter.style.color = '#ff6b35';
            comboCounter.style.textShadow = '0 0 10px #ff6b35, 0 0 20px #ff6b35';
        } else if (combo >= 50) {
            // Rare combo animation
            gsap.fromTo(comboCounter, 
                { scale: 1 },
                { scale: 1.25, duration: 0.12, yoyo: true, repeat: 1, ease: "back.out(1.5)" }
            );
            comboCounter.style.color = '#9b59b6';
            comboCounter.style.textShadow = '0 0 8px #9b59b6';
        } else if (combo >= 25) {
            // Uncommon combo animation
            gsap.fromTo(comboCounter, 
                { scale: 1 },
                { scale: 1.2, duration: 0.1, yoyo: true, repeat: 1 }
            );
            comboCounter.style.color = '#3498db';
            comboCounter.style.textShadow = '0 0 5px #3498db';
        } else if (combo >= 10) {
            // Common combo animation
            gsap.fromTo(comboCounter, 
                { scale: 1 },
                { scale: 1.15, duration: 0.1, yoyo: true, repeat: 1 }
            );
            comboCounter.style.color = '#2ecc71';
            comboCounter.style.textShadow = '0 0 3px #2ecc71';
        } else {
            // Basic combo
            gsap.fromTo(comboCounter, 
                { scale: 1 },
                { scale: 1.1, duration: 0.1, yoyo: true, repeat: 1 }
            );
            comboCounter.style.color = '#ecf0f1';
            comboCounter.style.textShadow = 'none';
        }
    }
    
    if (comboBar && timeRemaining > 0) {
        // Update combo bar based on time remaining
        const maxDuration = 3000; // Base combo duration
        const fillPercentage = Math.max((timeRemaining / maxDuration) * 100, 0);
        
        // Color based on time remaining
        let barColor = '#2ecc71'; // Green
        if (fillPercentage < 30) {
            barColor = '#e74c3c'; // Red
        } else if (fillPercentage < 60) {
            barColor = '#f39c12'; // Orange
        }
        
        gsap.to(comboBar, {
            width: `${fillPercentage}%`,
            backgroundColor: barColor,
            duration: 0.1,
            ease: "none"
        });
        
        // Add urgency effect when time is low
        if (fillPercentage < 20) {
            gsap.to(comboContainer, {
                scale: 1.05,
                duration: 0.1,
                yoyo: true,
                repeat: -1
            });
        } else {
            gsap.killTweensOf(comboContainer);
            gsap.set(comboContainer, { scale: 1 });
        }
    }
}

// Reset combo display with enhanced feedback
export function resetComboDisplay(previousCombo = 1) {
    const comboCounter = document.getElementById('combo-counter');
    const comboBar = document.getElementById('combo-bar');
    const comboContainer = document.getElementById('combo-container');
    
    if (comboCounter) {
        comboCounter.textContent = '1x';
        comboCounter.style.color = '#ecf0f1';
        comboCounter.style.textShadow = 'none';
        
        // Different reset animations based on previous combo
        if (previousCombo >= 50) {
            // Dramatic reset for high combos
            gsap.fromTo(comboCounter,
                { scale: 1, opacity: 1 },
                { scale: 0.8, opacity: 0.3, duration: 0.3, ease: "power2.out" }
            ).then(() => {
                gsap.to(comboCounter, { scale: 1, opacity: 1, duration: 0.2 });
            });
        } else {
            // Simple fade for lower combos
            gsap.fromTo(comboCounter,
                { opacity: 1 },
                { opacity: 0.5, duration: 0.2, yoyo: true, repeat: 1 }
            );
        }
    }
    
    if (comboBar) {
        gsap.to(comboBar, {
            width: '0%',
            backgroundColor: '#2ecc71',
            duration: 0.5,
            ease: "power2.out"
        });
    }
    
    if (comboContainer) {
        gsap.killTweensOf(comboContainer);
        gsap.set(comboContainer, { scale: 1 });
    }
}

// Show combo milestone celebration
export function showComboMilestone(milestone, bonus) {
    const milestoneElement = document.createElement('div');
    milestoneElement.className = 'combo-milestone';
    
    // Handle bonus object or number
    const bonusValue = typeof bonus === 'object' ? bonus.value : bonus;
    const bonusText = typeof bonus === 'object' && bonus.type === 'damage' 
        ? `+${bonusValue.toLocaleString()} Damage!`
        : `+${(bonusValue * 100).toFixed(0)}% Damage!`;
    
    milestoneElement.innerHTML = `
        <div style="font-size: 1.8rem; margin-bottom: 5px;">🔥</div>
        <div style="font-size: 1.3rem; font-weight: bold; margin-bottom: 3px;">
            ${milestone}x COMBO!
        </div>
        <div style="font-size: 1rem; opacity: 0.9;">
            ${bonusText}
        </div>
    `;
    
    document.body.appendChild(milestoneElement);
    
    // Animate milestone celebration (shorter)
    gsap.fromTo(milestoneElement, 
        { scale: 0, opacity: 0, y: 30 },
        { 
            scale: 1, 
            opacity: 1, 
            y: 0, 
            duration: 0.3, 
            ease: "back.out(1.5)",
            onComplete: () => {
                gsap.to(milestoneElement, {
                    opacity: 0,
                    y: -30,
                    duration: 0.5,
                    delay: 1,
                    ease: "power2.in",
                    onComplete: () => milestoneElement.remove()
                });
            }
        }
    );
    
    // Create celebration particles (fewer)
    createMilestoneParticles(milestone);
}

// Create particles for milestone celebration
function createMilestoneParticles(milestone) {
    const particlesContainer = document.getElementById('particles-container');
    if (!particlesContainer) return;
    
    const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3'];
    const particleCount = Math.min(milestone, 8); // Fewer particles
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'milestone-particle';
        particle.style.cssText = `
            position: absolute;
            width: 6px;
            height: 6px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: 50%;
            pointer-events: none;
            z-index: 1002;
            left: 50%;
            top: 30%;
            transform: translate(-50%, -50%);
        `;
        
        particlesContainer.appendChild(particle);
        
        // Animate particle with smaller spread
        const angle = (Math.PI * 2 * i) / particleCount;
        const velocity = 50 + Math.random() * 50; // Smaller spread
        const lifetime = 800 + Math.random() * 400; // Shorter lifetime
        
        gsap.to(particle, {
            x: Math.cos(angle) * velocity,
            y: Math.sin(angle) * velocity,
            opacity: 0,
            scale: 0,
            duration: lifetime / 1000,
            ease: "power2.out",
            onComplete: () => particle.remove()
        });
    }
}

// Update game UI elements
export function updateGameUI(gameState) {
    const punchCount = document.getElementById('punch-count');
    const prestigeButton = document.getElementById('prestige-button');
    
    punchCount.textContent = Math.floor(gameState.count);
    
    // Update prestige button visibility
    if (gameState.canPrestige()) {
        prestigeButton.classList.remove('hidden');
    } else {
        prestigeButton.classList.add('hidden');
    }
    
    // Update combo stats display
    updateComboStatsDisplay(gameState);
    
    // Update active power-ups display
    updateActivePowerUpsDisplay(gameState);
}

// Update combo stats display
function updateComboStatsDisplay(gameState) {
    const comboStats = document.getElementById('combo-stats');
    const comboBest = document.getElementById('combo-best');
    const comboBonus = document.getElementById('combo-bonus');
    
    if (gameState.comboManager && comboStats && comboBest && comboBonus) {
        const stats = gameState.comboManager.getComboStats();
        
        // Show stats when combo is above 1 or best is above 1
        if (stats.current > 1 || stats.best > 1) {
            comboStats.classList.remove('hidden');
            comboBest.textContent = stats.best;
            comboBonus.textContent = Math.round(stats.bonus * 100);
        } else {
            comboStats.classList.add('hidden');
        }
    }
}

// Store the last known state to prevent unnecessary updates
let lastActivePowerUpsState = null;

// Update active power-ups display
function updateActivePowerUpsDisplay(gameState) {
    let powerUpStatusContainer = document.getElementById('power-up-status');
    
    // Create container if it doesn't exist
    if (!powerUpStatusContainer) {
        powerUpStatusContainer = document.createElement('div');
        powerUpStatusContainer.id = 'power-up-status';
        powerUpStatusContainer.className = 'fixed top-4 right-4 z-50 space-y-2';
        document.body.appendChild(powerUpStatusContainer);
    }
    
    // Get current active power-ups
    const currentActivePowerUps = gameState.powerUpManager && gameState.powerUpManager.hasActivePowerUps() 
        ? gameState.powerUpManager.getActivePowerUps() 
        : [];
    
    // Create a state signature to compare with previous state
    const currentStateSignature = currentActivePowerUps.map(p => `${p.name}-${p.timeLeft}`).join('|');
    
    // Only update if the state has actually changed
    if (lastActivePowerUpsState === currentStateSignature) {
        return;
    }
    
    lastActivePowerUpsState = currentStateSignature;
    
    // Clear existing content
    powerUpStatusContainer.innerHTML = '';
    
    // Show active power-ups
    currentActivePowerUps.forEach(powerUp => {
        const powerUpElement = document.createElement('div');
        powerUpElement.className = 'bg-black bg-opacity-75 text-white px-3 py-2 rounded-lg flex items-center space-x-2 text-sm';
        powerUpElement.innerHTML = `
            <span class="text-lg">${powerUp.icon}</span>
            <span class="font-medium">${powerUp.name}</span>
            <span class="text-xs opacity-75">${powerUp.timeLeft}</span>
        `;
        powerUpStatusContainer.appendChild(powerUpElement);
    });
}

// Animate punch target
export function animatePunchTarget() {
    gsap.to(punchTarget, { scale: 0.9, duration: 0.1, yoyo: true, repeat: 1 });
}