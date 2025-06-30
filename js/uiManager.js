// UI Manager for optimized DOM operations and performance
export class UIManager {
    constructor() {
        this.elements = this.cacheElements();
        this.lastUpdateTime = 0;
        this.updateThrottle = 16; // ~60fps
    }
    
    /**
     * Cache frequently used DOM elements
     * @returns {Object} Cached DOM elements
     */
    cacheElements() {
        return {
            // Game UI elements - match actual HTML IDs
            countDisplay: document.getElementById('punch-count'),
            punchTarget: document.getElementById('punch-target'),
            
            // Combo elements
            comboCounter: document.getElementById('combo-counter'),
            comboBar: document.getElementById('combo-bar'),
            comboContainer: document.getElementById('combo-container'),
            comboStats: document.getElementById('combo-stats'),
            comboBest: document.getElementById('combo-best'),
            comboBonus: document.getElementById('combo-bonus'),
            
            // Button elements
            upgradesButton: document.getElementById('upgrades-button'),
            achievementsButton: document.getElementById('achievements-button'),
            settingsButton: document.getElementById('settings-button'),
            prestigeButton: document.getElementById('prestige-button'),
            
            // Container elements
            notificationContainer: document.getElementById('notification-container'),
            particlesContainer: document.getElementById('particles-container'),
            powerUpContainer: document.getElementById('power-up-container'),
            
            // Modal elements
            modal: document.getElementById('modal'),
            modalTitle: document.getElementById('modal-title'),
            modalBody: document.getElementById('modal-body'),
            
            // Audio
            punchSound: document.getElementById('punch-sound'),
            
            // Name element
            nameElement: document.getElementById('name')
        };
    }
    
    /**
     * Get cached element or query if not cached
     * @param {string} id - Element ID
     * @returns {HTMLElement|null} DOM element
     */
    getElement(id) {
        if (this.elements[id]) {
            return this.elements[id];
        }
        
        // If not cached, query and cache it
        const element = document.getElementById(id);
        if (element) {
            this.elements[id] = element;
        }
        return element;
    }
    
    /**
     * Throttled UI update to prevent excessive DOM manipulation
     * @param {Function} updateFunction - Function to execute
     * @param {boolean} force - Force immediate update
     */
    throttledUpdate(updateFunction, force = false) {
        const now = performance.now();
        
        if (force || now - this.lastUpdateTime >= this.updateThrottle) {
            updateFunction();
            this.lastUpdateTime = now;
        }
    }
    
    /**
     * Debounce function for rapid successive calls
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    /**
     * Update numeric display with formatting
     * @param {HTMLElement} element - Target element
     * @param {number} value - Value to display
     * @param {Object} options - Formatting options
     */
    updateNumericDisplay(element, value, options = {}) {
        if (!element) return;
        
        const {
            decimals = 0,
            prefix = '',
            suffix = '',
            formatLarge = true
        } = options;
        
        let displayValue = value;
        
        if (formatLarge && value >= 1000000) {
            displayValue = (value / 1000000).toFixed(1) + 'M';
        } else if (formatLarge && value >= 1000) {
            displayValue = (value / 1000).toFixed(1) + 'K';
        } else {
            displayValue = value.toFixed(decimals);
        }
        
        element.textContent = `${prefix}${displayValue}${suffix}`;
    }
    
    /**
     * Update percentage display
     * @param {HTMLElement} element - Target element
     * @param {number} value - Percentage value (0-1)
     */
    updatePercentageDisplay(element, value) {
        if (!element) return;
        element.textContent = `${(value * 100).toFixed(1)}%`;
    }
    
    /**
     * Safely update element text content
     * @param {string} elementId - Element ID
     * @param {string} content - Text content
     */
    updateText(elementId, content) {
        const element = this.getElement(elementId);
        if (element) {
            element.textContent = content;
        }
    }
    
    /**
     * Safely update element HTML content
     * @param {string} elementId - Element ID
     * @param {string} html - HTML content
     */
    updateHTML(elementId, html) {
        const element = this.getElement(elementId);
        if (element) {
            element.innerHTML = html;
        }
    }
    
    /**
     * Add CSS class to element
     * @param {string} elementId - Element ID
     * @param {string} className - CSS class name
     */
    addClass(elementId, className) {
        const element = this.getElement(elementId);
        if (element) {
            element.classList.add(className);
        }
    }
    
    /**
     * Remove CSS class from element
     * @param {string} elementId - Element ID
     * @param {string} className - CSS class name
     */
    removeClass(elementId, className) {
        const element = this.getElement(elementId);
        if (element) {
            element.classList.remove(className);
        }
    }
    
    /**
     * Show notification with error handling
     * @param {string} message - Notification message
     * @param {string} type - Notification type (info, warning, error)
     * @param {number} duration - Display duration in milliseconds
     */
    showNotification(message, type = 'info', duration = 3000) {
        try {
            const container = this.elements.notificationContainer;
            if (!container) {
                console.warn('Notification container not found');
                return;
            }
            
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.textContent = message;
            container.appendChild(notification);
            
            // Animate in
            if (window.gsap) {
                gsap.fromTo(notification, 
                    { opacity: 0, y: -20 }, 
                    { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
                );
                
                // Animate out and remove
                gsap.to(notification, {
                    opacity: 0, 
                    y: -20, 
                    duration: 0.5, 
                    delay: duration / 1000, 
                    ease: 'power2.in',
                    onComplete: () => {
                        if (notification.parentNode) {
                            notification.remove();
                        }
                    }
                });
            } else {
                // Fallback without GSAP
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, duration);
            }
        } catch (error) {
            console.error('Failed to show notification:', error);
        }
    }
    
    /**
     * Validate that required elements exist
     * @returns {Array} Array of missing element IDs
     */
    validateElements() {
        const missing = [];
        const requiredElements = [
            'punch-count', 'punch-target', 'combo-counter', 'combo-bar',
            'upgrades-button', 'achievements-button', 'settings-button'
        ];
        
        for (const id of requiredElements) {
            if (!document.getElementById(id)) {
                missing.push(id);
            }
        }
        
        if (missing.length > 0) {
            console.warn('Missing required UI elements:', missing);
        }
        
        return missing;
    }
}

// Create singleton instance
export const uiManager = new UIManager();