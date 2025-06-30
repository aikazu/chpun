// Settings management
export class SettingsManager {
    constructor(gameState, modal) {
        this.gameState = gameState;
        this.modal = modal;
        this.nameElement = document.getElementById('name');
        this.punchTarget = document.getElementById('punch-target');
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

    // Generate settings modal content
    generateSettingsContent() {
        return `
            <div class="space-y-4">
                <div>
                    <label for="name-input" class="block text-sm font-medium text-gray-400 mb-1">Name</label>
                    <input type="text" id="name-input" class="mt-1 block w-full bg-gray-700 border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" placeholder="Enter a new name" value="${this.nameElement.textContent}">
                </div>
                <div>
                    <label for="image-input" class="block text-sm font-medium text-gray-400 mb-1">Image</label>
                    <input type="file" id="image-input" class="mt-1 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-500/30 file:text-indigo-300 hover:file:bg-indigo-400/30" accept="image/*">
                </div>
                <button id="save-button" class="ui-button bg-green-600 hover:bg-green-700">Save</button>
                <button id="reset-button" class="ui-button bg-red-600 hover:bg-red-700">Reset Game</button>
            </div>
        `;
    }

    // Setup settings event listeners
    setupSettingsListeners() {
        const saveButton = document.getElementById('save-button');
        const resetButton = document.getElementById('reset-button');

        if (saveButton) {
            saveButton.addEventListener('click', () => {
                this.saveSettings();
            });
        }

        if (resetButton) {
            resetButton.addEventListener('click', () => {
                this.resetGame();
            });
        }
    }

    // Save settings
    saveSettings() {
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
        
        this.modal.hide();
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