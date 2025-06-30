// Settings management
export class SettingsManager {
    constructor(gameState, modal) {
        this.gameState = gameState;
        this.modal = modal;
        this.nameElement = document.getElementById('name');
        this.punchTarget = document.getElementById('punch-target');
        this.punchSound = document.getElementById('punch-sound');
        
        // Default settings
        this.settings = {
            soundEnabled: true,
            autoSave: true,
            autoSaveInterval: 30, // seconds
            showParticles: true,
            showFloatingNumbers: true,
            reducedMotion: false,
            theme: 'default'
        };
        
        this.loadAllSettings();
    }

    // Load saved settings
    loadSettings() {
        const savedName = localStorage.getItem('name');
        const savedImage = localStorage.getItem('image');

        if (savedName) {
            this.nameElement.textContent = savedName;
        }
        if (savedImage) {
            this.punchTarget.src = savedImage;
        }
    }

    // Load all settings including game preferences
    loadAllSettings() {
        this.loadSettings();
        
        // Load game settings
        const savedSettings = localStorage.getItem('gameSettings');
        if (savedSettings) {
            try {
                const parsed = JSON.parse(savedSettings);
                this.settings = { ...this.settings, ...parsed };
            } catch (error) {
                console.warn('Failed to parse saved settings, using defaults');
            }
        }
        
        // Apply settings
        this.applySettings();
    }

    // Apply current settings to the game
    applySettings() {
        // Apply sound setting
        if (this.punchSound) {
            this.punchSound.muted = !this.settings.soundEnabled;
        }
        
        // Apply theme
        document.body.className = document.body.className.replace(/theme-\w+/g, '');
        if (this.settings.theme !== 'default') {
            document.body.classList.add(`theme-${this.settings.theme}`);
        }
        
        // Apply reduced motion
        if (this.settings.reducedMotion) {
            document.body.classList.add('reduced-motion');
        } else {
            document.body.classList.remove('reduced-motion');
        }
    }

    // Save game settings
    saveGameSettings() {
        try {
            localStorage.setItem('gameSettings', JSON.stringify(this.settings));
        } catch (error) {
            console.error('Failed to save game settings:', error);
        }
    }

    // Generate settings modal content
    generateSettingsContent() {
        return `
            <div class="space-y-6 max-h-96 overflow-y-auto">
                <!-- Profile Settings -->
                <div class="border-b border-gray-600 pb-4">
                    <h4 class="text-lg font-semibold text-white mb-3">Profile</h4>
                    <div class="space-y-3">
                        <div>
                            <label for="name-input" class="block text-sm font-medium text-gray-400 mb-1">Name</label>
                            <input type="text" id="name-input" class="mt-1 block w-full bg-gray-700 border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" placeholder="Enter a new name" value="${this.nameElement.textContent}">
                        </div>
                        <div>
                            <label for="image-input" class="block text-sm font-medium text-gray-400 mb-1">Image</label>
                            <input type="file" id="image-input" class="mt-1 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-500/30 file:text-indigo-300 hover:file:bg-indigo-400/30" accept="image/*">
                        </div>
                    </div>
                </div>

                <!-- Game Settings -->
                <div class="border-b border-gray-600 pb-4">
                    <h4 class="text-lg font-semibold text-white mb-3">Game Settings</h4>
                    <div class="space-y-3">
                        <div class="flex items-center justify-between">
                            <label for="sound-toggle" class="text-sm font-medium text-gray-400">Sound Effects</label>
                            <input type="checkbox" id="sound-toggle" class="toggle-checkbox" ${this.settings.soundEnabled ? 'checked' : ''}>
                        </div>
                        <div class="flex items-center justify-between">
                            <label for="particles-toggle" class="text-sm font-medium text-gray-400">Particle Effects</label>
                            <input type="checkbox" id="particles-toggle" class="toggle-checkbox" ${this.settings.showParticles ? 'checked' : ''}>
                        </div>
                        <div class="flex items-center justify-between">
                            <label for="floating-numbers-toggle" class="text-sm font-medium text-gray-400">Floating Damage Numbers</label>
                            <input type="checkbox" id="floating-numbers-toggle" class="toggle-checkbox" ${this.settings.showFloatingNumbers ? 'checked' : ''}>
                        </div>
                        <div class="flex items-center justify-between">
                            <label for="reduced-motion-toggle" class="text-sm font-medium text-gray-400">Reduce Motion</label>
                            <input type="checkbox" id="reduced-motion-toggle" class="toggle-checkbox" ${this.settings.reducedMotion ? 'checked' : ''}>
                        </div>
                    </div>
                </div>

                <!-- Auto-Save Settings -->
                <div class="border-b border-gray-600 pb-4">
                    <h4 class="text-lg font-semibold text-white mb-3">Auto-Save</h4>
                    <div class="space-y-3">
                        <div class="flex items-center justify-between">
                            <label for="auto-save-toggle" class="text-sm font-medium text-gray-400">Enable Auto-Save</label>
                            <input type="checkbox" id="auto-save-toggle" class="toggle-checkbox" ${this.settings.autoSave ? 'checked' : ''}>
                        </div>
                        <div>
                            <label for="auto-save-interval" class="block text-sm font-medium text-gray-400 mb-1">Auto-Save Interval (seconds)</label>
                            <select id="auto-save-interval" class="mt-1 block w-full bg-gray-700 border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2">
                                <option value="10" ${this.settings.autoSaveInterval === 10 ? 'selected' : ''}>10 seconds</option>
                                <option value="30" ${this.settings.autoSaveInterval === 30 ? 'selected' : ''}>30 seconds</option>
                                <option value="60" ${this.settings.autoSaveInterval === 60 ? 'selected' : ''}>1 minute</option>
                                <option value="300" ${this.settings.autoSaveInterval === 300 ? 'selected' : ''}>5 minutes</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Theme Settings -->
                <div class="pb-4">
                    <h4 class="text-lg font-semibold text-white mb-3">Theme</h4>
                    <div>
                        <label for="theme-select" class="block text-sm font-medium text-gray-400 mb-1">Color Theme</label>
                        <select id="theme-select" class="mt-1 block w-full bg-gray-700 border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2">
                            <option value="default" ${this.settings.theme === 'default' ? 'selected' : ''}>Default</option>
                            <option value="dark" ${this.settings.theme === 'dark' ? 'selected' : ''}>Dark Mode</option>
                            <option value="neon" ${this.settings.theme === 'neon' ? 'selected' : ''}>Neon</option>
                            <option value="retro" ${this.settings.theme === 'retro' ? 'selected' : ''}>Retro</option>
                        </select>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex space-x-3 pt-4">
                    <button id="save-button" class="flex-1 ui-button bg-green-600 hover:bg-green-700">Save Settings</button>
                    <button id="export-button" class="flex-1 ui-button bg-blue-600 hover:bg-blue-700">Export Save</button>
                </div>
                <div class="flex space-x-3">
                    <button id="import-button" class="flex-1 ui-button bg-yellow-600 hover:bg-yellow-700">Import Save</button>
                    <button id="reset-button" class="flex-1 ui-button bg-red-600 hover:bg-red-700">Reset Game</button>
                </div>
                <input type="file" id="import-file" accept=".json" style="display: none;">
            </div>
        `;
    }

    // Setup settings event listeners
    setupSettingsListeners() {
        const saveButton = document.getElementById('save-button');
        const resetButton = document.getElementById('reset-button');
        const exportButton = document.getElementById('export-button');
        const importButton = document.getElementById('import-button');
        const importFile = document.getElementById('import-file');

        // Settings toggles
        const soundToggle = document.getElementById('sound-toggle');
        const particlesToggle = document.getElementById('particles-toggle');
        const floatingNumbersToggle = document.getElementById('floating-numbers-toggle');
        const reducedMotionToggle = document.getElementById('reduced-motion-toggle');
        const autoSaveToggle = document.getElementById('auto-save-toggle');
        const autoSaveInterval = document.getElementById('auto-save-interval');
        const themeSelect = document.getElementById('theme-select');

        if (saveButton) {
            saveButton.addEventListener('click', () => {
                this.saveAllSettings();
            });
        }

        if (resetButton) {
            resetButton.addEventListener('click', () => {
                this.resetGame();
            });
        }

        if (exportButton) {
            exportButton.addEventListener('click', () => {
                this.exportSave();
            });
        }

        if (importButton) {
            importButton.addEventListener('click', () => {
                importFile.click();
            });
        }

        if (importFile) {
            importFile.addEventListener('change', (e) => {
                this.importSave(e.target.files[0]);
            });
        }

        // Settings change handlers
        if (soundToggle) {
            soundToggle.addEventListener('change', (e) => {
                this.settings.soundEnabled = e.target.checked;
                this.applySettings();
            });
        }

        if (particlesToggle) {
            particlesToggle.addEventListener('change', (e) => {
                this.settings.showParticles = e.target.checked;
            });
        }

        if (floatingNumbersToggle) {
            floatingNumbersToggle.addEventListener('change', (e) => {
                this.settings.showFloatingNumbers = e.target.checked;
            });
        }

        if (reducedMotionToggle) {
            reducedMotionToggle.addEventListener('change', (e) => {
                this.settings.reducedMotion = e.target.checked;
                this.applySettings();
            });
        }

        if (autoSaveToggle) {
            autoSaveToggle.addEventListener('change', (e) => {
                this.settings.autoSave = e.target.checked;
            });
        }

        if (autoSaveInterval) {
            autoSaveInterval.addEventListener('change', (e) => {
                this.settings.autoSaveInterval = parseInt(e.target.value);
            });
        }

        if (themeSelect) {
            themeSelect.addEventListener('change', (e) => {
                this.settings.theme = e.target.value;
                this.applySettings();
            });
        }
    }

    // Save all settings
    saveAllSettings() {
        const nameInput = document.getElementById('name-input');
        const imageInput = document.getElementById('image-input');
        
        const newName = nameInput?.value?.trim();
        const newImage = imageInput?.files[0];

        // Validate and save name
        if (newName && newName.length <= 50) {
            this.nameElement.textContent = newName;
            localStorage.setItem('name', newName);
        } else if (newName && newName.length > 50) {
            alert('Name must be 50 characters or less.');
            return;
        }

        // Validate and save image
        if (newImage) {
            // Check file size (max 5MB)
            if (newImage.size > 5 * 1024 * 1024) {
                alert('Image file must be smaller than 5MB.');
                return;
            }
            
            // Check file type
            if (!newImage.type.startsWith('image/')) {
                alert('Please select a valid image file.');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const imageUrl = reader.result;
                    this.punchTarget.src = imageUrl;
                    localStorage.setItem('image', imageUrl);
                } catch (error) {
                    console.error('Error saving image:', error);
                    alert('Error processing image. Please try a different file.');
                }
            };
            
            reader.onerror = () => {
                alert('Error reading image file. Please try again.');
            };
            
            reader.readAsDataURL(newImage);
        }
        
        // Save game settings
        this.saveGameSettings();
        
        // Show success message
        this.showNotification('Settings saved successfully!', 'success');
        
        this.modal.hide();
    }

    // Export save data
    exportSave() {
        try {
            const saveData = {
                gameData: this.gameState.exportData(),
                settings: this.settings,
                profile: {
                    name: localStorage.getItem('name'),
                    image: localStorage.getItem('image')
                },
                exportDate: new Date().toISOString(),
                version: '1.0'
            };
            
            const dataStr = JSON.stringify(saveData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `chokoui-puncher-save-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            
            this.showNotification('Save data exported successfully!', 'success');
        } catch (error) {
            console.error('Export failed:', error);
            this.showNotification('Failed to export save data.', 'error');
        }
    }

    // Import save data
    importSave(file) {
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const saveData = JSON.parse(e.target.result);
                
                if (!saveData.gameData || !saveData.settings) {
                    throw new Error('Invalid save file format');
                }
                
                if (confirm('This will overwrite your current progress. Are you sure you want to continue?')) {
                    // Import game data
                    this.gameState.importData(saveData.gameData);
                    
                    // Import settings
                    this.settings = { ...this.settings, ...saveData.settings };
                    this.saveGameSettings();
                    this.applySettings();
                    
                    // Import profile
                    if (saveData.profile) {
                        if (saveData.profile.name) {
                            localStorage.setItem('name', saveData.profile.name);
                            this.nameElement.textContent = saveData.profile.name;
                        }
                        if (saveData.profile.image) {
                            localStorage.setItem('image', saveData.profile.image);
                            this.punchTarget.src = saveData.profile.image;
                        }
                    }
                    
                    this.showNotification('Save data imported successfully!', 'success');
                    this.modal.hide();
                    
                    // Reload page to ensure everything is properly updated
                    setTimeout(() => location.reload(), 1000);
                }
            } catch (error) {
                console.error('Import failed:', error);
                this.showNotification('Failed to import save data. Please check the file format.', 'error');
            }
        };
        
        reader.onerror = () => {
            this.showNotification('Error reading file.', 'error');
        };
        
        reader.readAsText(file);
    }

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type} fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg text-white max-w-sm`;
        
        const bgColor = type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-600';
        notification.classList.add(bgColor);
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Reset game
    resetGame() {
        if (confirm('Are you sure you want to reset all your progress? This cannot be undone.')) {
            this.gameState.resetGame();
        }
    }

    // Show settings modal
    showSettings() {
        const settingsContent = this.generateSettingsContent();
        this.modal.show('Settings', settingsContent);
        this.setupSettingsListeners();
    }
}