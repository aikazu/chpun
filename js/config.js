// Game configuration constants
export const config = {
    PRESTIGE_REQUIREMENT: 1000000,
    critChance: 0.05,
    critMultiplier: 5,
    comboDuration: 3000,
    autoPuncherPower: 1,
    initialCost: 10,
    initialAutoPuncherCost: 50,
};

// Game constants for better maintainability
export const GAME_CONSTANTS = {
    UI: {
        // Animation durations
        ANIMATION_DURATION: 150,
        PARTICLE_LIFETIME: 1000,
        NOTIFICATION_DURATION: 3000,
        UPDATE_THROTTLE: 16, // ~60fps
        FLOATING_NUMBER_DURATION: 1500,
        FLOATING_DAMAGE_DURATION: 1.5,
        MILESTONE_DISPLAY_DURATION: 1500,
        COMBO_BAR_UPDATE_DURATION: 100,
        COMBO_RESET_DURATION: 0.3,
        COMBO_FADE_DURATION: 0.2,
        MILESTONE_ANIMATION_DURATION: 0.6,
        MILESTONE_FADE_DURATION: 0.4,
        MILESTONE_DISPLAY_TIME: 3000,
        
        // Update intervals
        UPDATE_INTERVAL: 100, // Main UI update interval (ms)
        AUTO_PUNCH_INTERVAL: 1000, // Auto puncher interval (ms)
        
        // Z-index values
        FLOATING_DAMAGE_Z_INDEX: 1000,
        MILESTONE_Z_INDEX: 10000,
        
        // Colors
        CRIT_COLOR: '#ffff00',
        NORMAL_DAMAGE_COLOR: '#ffffff',
        DEFAULT_TEXT_COLOR: '#ecf0f1',
        COMMON_COMBO_COLOR: '#2ecc71',
        UNCOMMON_COMBO_COLOR: '#3498db',
        RARE_COMBO_COLOR: '#9b59b6',
        LEGENDARY_COMBO_COLOR: '#ff6b35',
        
        // Combo bar colors
        COMBO_BAR_SAFE_COLOR: '#2ecc71',
        COMBO_BAR_WARNING_COLOR: '#f39c12',
        COMBO_BAR_DANGER_COLOR: '#e74c3c',
        COMBO_BAR_WARNING_THRESHOLD: 60,
        COMBO_BAR_DANGER_THRESHOLD: 30,
        
        // Font sizes
        CRIT_FONT_SIZE: '24px',
        NORMAL_FONT_SIZE: '18px',
        
        // Animation distances and spreads
        FLOATING_DAMAGE_RISE: 80,
        FLOATING_DAMAGE_SPREAD: 100,
        FLOATING_DAMAGE_VERTICAL_SPREAD: 50
    },
    SCALING: {
        POWER_COST_MULTIPLIER: 1.5,
        AUTO_PUNCHER_COST_MULTIPLIER: 1.5,
        PRESTIGE_REQUIREMENT_MULTIPLIER: 2,
        CRIT_CHANCE_INCREMENT: 0.005,
        COMBO_DURATION_INCREMENT: 100,
        CRIT_CHANCE_UPGRADE_BASE_COST: 100,
        CRIT_CHANCE_UPGRADE_MULTIPLIER: 2,
        CRIT_MULTIPLIER_UPGRADE_BASE_COST: 500,
        CRIT_MULTIPLIER_UPGRADE_MULTIPLIER: 3,
        COMBO_DURATION_UPGRADE_BASE_COST: 200,
        COMBO_DURATION_UPGRADE_MULTIPLIER: 1.8,
        AUTO_PUNCHER_POWER_UPGRADE_BASE_COST: 1000,
        AUTO_PUNCHER_POWER_UPGRADE_MULTIPLIER: 2.5
    },
    LIMITS: {
        MAX_CRIT_CHANCE: 0.5,
        MAX_CRIT_MULTIPLIER: 20,
        MAX_COMBO_DURATION: 10000,
        MAX_AUTO_PUNCHER_POWER: 100,
        MAX_CONCURRENT_POWERUPS: 3,
        MAX_PARTICLES_PER_PUNCH: 100,
        MIN_PARTICLES_PER_PUNCH: 30,
        MAX_PRESTIGE_POINTS: 1000000,
        MAX_ERROR_LOG_SIZE: 100
    },
    COMBO: {
        BASE_DURATION: 3000,
        DECAY_RATE: 0.95,
        MILESTONE_THRESHOLDS: [10, 25, 50, 100, 250, 500, 1000],
        MAX_FOR_FULL_BAR: 100,
        HIGH_COMBO_THRESHOLD: 50,
        COMMON_THRESHOLD: 10,
        UNCOMMON_THRESHOLD: 25,
        RARE_THRESHOLD: 50,
        LEGENDARY_THRESHOLD: 100,
        TIER_COLORS: {
            BASIC: '#ecf0f1',
            COMMON: '#2ecc71',
            UNCOMMON: '#3498db',
            RARE: '#9b59b6',
            EPIC: '#ff6b35'
        },
        TIER_THRESHOLDS: {
            COMMON: 10,
            UNCOMMON: 25,
            RARE: 50,
            EPIC: 100
        }
    },
    POWERUPS: {
        SPAWN_INTERVAL: 30000, // 30 seconds
        SPAWN_CHANCE: 0.3, // 30% chance per interval
        SAFE_SPAWN_MARGIN: 100, // pixels from UI elements
        DESPAWN_TIME: 15000 // 15 seconds
    },
    PARTICLES: {
        DEFAULT_COLOR: '#ff6b6b',
        SIZE: 6,
        Z_INDEX: 1000,
        SPREAD: 200,
        RISE_MIN: 100,
        RISE_VARIANCE: 100,
        DURATION_MIN: 1,
        DURATION_VARIANCE: 0.5,
        CRIT_COUNT: 100,
        NORMAL_COUNT: 30,
        MILESTONE_COUNT: 15,
        MILESTONE_SIZE: 8,
        MILESTONE_SPREAD: 200,
        MILESTONE_LIFETIME: 800
    },
    ACHIEVEMENTS: {
        SPEED_DEMON_THRESHOLD: 100, // punches in 10 seconds
        SPEED_DEMON_TIME_WINDOW: 10000, // 10 seconds
        OVER_9000_THRESHOLD: 9000
    }
};

// Achievement definitions
export const achievements = {
    // Punch Count Achievements
    firstPunch: { 
        name: 'First Blood... or Punch', 
        description: 'Throw your very first punch',
        reward: 'You\'ve started your journey!',
        unlocked: false 
    },
    hundredPunches: { 
        name: 'Getting Warmed Up', 
        description: 'Throw 100 punches',
        reward: '+10% punch power for next 50 punches',
        unlocked: false 
    },
    thousandPunches: { 
        name: 'Punch Enthusiast', 
        description: 'Throw 1,000 punches',
        reward: '+25% punch power for next 100 punches',
        unlocked: false 
    },
    carpalTunnel: { 
        name: 'Carpal Tunnel Here I Come', 
        description: 'Throw 100,000 punches',
        reward: 'Permanent +5% critical chance',
        unlocked: false 
    },
    onePunchMan: { 
        name: 'The One-Punch Man', 
        description: 'Throw 1,000,000 punches',
        reward: 'Permanent +2x critical multiplier',
        unlocked: false 
    },
    
    // Critical Hit Achievements
    over9000: { 
        name: "It's Over 9000!", 
        description: 'Deal over 9,000 damage in a single punch',
        reward: 'Permanent +10% critical chance',
        unlocked: false 
    },
    criticalMaster: { 
        name: 'Critical Master', 
        description: 'Achieve 25% critical hit chance',
        reward: 'Permanent +1x critical multiplier',
        unlocked: false 
    },
    
    // Combo Achievements
    comboStarter: { 
        name: 'Combo Starter', 
        description: 'Reach a 10x combo multiplier',
        reward: '+500ms combo duration',
        unlocked: false 
    },
    comboMaster: { 
        name: 'Combo Master', 
        description: 'Reach a 50x combo multiplier',
        reward: '+1000ms combo duration',
        unlocked: false 
    },
    comboGod: { 
        name: 'Combo God', 
        description: 'Reach a 100x combo multiplier',
        reward: 'Permanent +2000ms combo duration',
        unlocked: false 
    },
    
    // Auto Puncher Achievements
    automation: { 
        name: 'Automation Begins', 
        description: 'Purchase your first auto puncher',
        reward: '+1 auto puncher power',
        unlocked: false 
    },
    autoArmy: { 
        name: 'Auto Punch Army', 
        description: 'Own 10 auto punchers',
        reward: '+5 auto puncher power',
        unlocked: false 
    },
    
    // Prestige Achievements
    inevitable: { 
        name: 'I Am Inevitable', 
        description: 'Perform your first prestige',
        reward: '+1 bonus prestige point',
        unlocked: false 
    },
    prestigeMaster: { 
        name: 'Prestige Master', 
        description: 'Reach 5 prestige points',
        reward: 'Permanent +20% prestige bonus',
        unlocked: false 
    },
    
    // Power Achievements
    powerHouse: { 
        name: 'Power House', 
        description: 'Reach 100 punch power',
        reward: 'Permanent +50% power upgrade efficiency',
        unlocked: false 
    },
    
    // Speed Achievements
    speedDemon: { 
        name: 'Speed Demon', 
        description: 'Throw 100 punches in 10 seconds',
        reward: '+20% auto puncher speed',
        unlocked: false 
    },
    
    // Secret Achievements
    secretPuncher: { 
        name: '???', 
        description: 'A mysterious achievement awaits...',
        reward: 'Something special...',
        unlocked: false,
        hidden: true
    }
};

// Power-up definitions with rarity system
export const powerUps = [
    // Common Power-ups (70% spawn chance)
    {
        name: 'Power Boost',
        rarity: 'common',
        color: '#4ade80', // green
        icon: '💪',
        description: 'Double your punch power for 8 seconds',
        duration: 8000,
        activate() {
            return { type: 'powerMultiplier', value: 2, duration: this.duration };
        }
    },
    {
        name: 'Quick Punches',
        rarity: 'common',
        color: '#60a5fa', // blue
        icon: '⚡',
        description: 'Instantly gain 50 punches worth of damage',
        activate() {
            return { type: 'instantPunches', value: 50 };
        }
    },
    {
        name: 'Combo Extender',
        rarity: 'common',
        color: '#a78bfa', // purple
        icon: '🔗',
        description: 'Extend combo duration by 2 seconds',
        duration: 2000,
        activate() {
            return { type: 'comboDurationBoost', value: 2000 };
        }
    },
    
    // Uncommon Power-ups (20% spawn chance)
    {
        name: 'Frenzy Mode',
        rarity: 'uncommon',
        color: '#f59e0b', // amber
        icon: '🔥',
        description: '5x punch power for 10 seconds',
        duration: 10000,
        activate() {
            return { type: 'powerMultiplier', value: 5, duration: this.duration };
        }
    },
    {
        name: 'Critical Storm',
        rarity: 'uncommon',
        color: '#ef4444', // red
        icon: '💥',
        description: '100% critical chance for 6 seconds',
        duration: 6000,
        activate() {
            return { type: 'critChanceBoost', value: 1.0, duration: this.duration };
        }
    },
    {
        name: 'Auto Punch Surge',
        rarity: 'uncommon',
        color: '#06b6d4', // cyan
        icon: '🤖',
        description: '3x auto puncher speed for 15 seconds',
        duration: 15000,
        activate() {
            return { type: 'autoPuncherBoost', value: 3, duration: this.duration };
        }
    },
    
    // Rare Power-ups (8% spawn chance)
    {
        name: 'Mega Punch',
        rarity: 'rare',
        color: '#8b5cf6', // violet
        icon: '🌟',
        description: 'Next punch deals 100x damage',
        activate() {
            return { type: 'nextPunchMultiplier', value: 100 };
        }
    },
    {
        name: 'Punch-splosion',
        rarity: 'rare',
        color: '#f97316', // orange
        icon: '💣',
        description: 'Instantly gain 500 punches worth of damage',
        activate() {
            return { type: 'instantPunches', value: 500 };
        }
    },
    {
        name: 'Time Warp',
        rarity: 'rare',
        color: '#ec4899', // pink
        icon: '⏰',
        description: 'Gain 30 seconds worth of auto punches instantly',
        activate() {
            return { type: 'timeWarp', value: 30 };
        }
    },
    
    // Epic Power-ups (2% spawn chance)
    {
        name: 'God Mode',
        rarity: 'epic',
        color: '#fbbf24', // yellow
        icon: '👑',
        description: '10x power, 100% crit chance for 12 seconds',
        duration: 12000,
        activate() {
            return { type: 'godMode', powerMultiplier: 10, critChance: 1.0, duration: this.duration };
        }
    },
    {
        name: 'Prestige Boost',
        rarity: 'epic',
        color: '#d946ef', // fuchsia
        icon: '✨',
        description: 'Gain 10% of prestige requirement instantly',
        activate() {
            return { type: 'prestigeBoost', value: 0.1 };
        }
    }
];

// Power-up rarity weights for spawn chances
export const powerUpRarityWeights = {
    common: 70,
    uncommon: 20,
    rare: 8,
    epic: 2
};