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

// Update combo display
export function updateComboDisplay(combo) {
    comboCounter.textContent = combo + 'x';
    gsap.fromTo(comboBar, { width: '0%' }, { width: '100%', duration: 0.2, ease: "power2.out" });
}

// Reset combo display
export function resetComboDisplay() {
    comboCounter.textContent = '1x';
    gsap.to(comboBar, { width: '0%', duration: 0.3, ease: "power2.out" });
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
}

// Animate punch target
export function animatePunchTarget() {
    gsap.to(punchTarget, { scale: 0.9, duration: 0.1, yoyo: true, repeat: 1 });
}