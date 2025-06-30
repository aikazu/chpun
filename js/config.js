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

// Achievement definitions
export const achievements = {
    firstPunch: { name: 'First Blood... or Punch', unlocked: false },
    carpalTunnel: { name: 'Carpal Tunnel Here I Come', unlocked: false },
    onePunchMan: { name: 'The One-Punch Man', unlocked: false },
    over9000: { name: "It's Over 9000!", unlocked: false },
    inevitable: { name: 'I Am Inevitable', unlocked: false },
};

// Power-up definitions
export const powerUps = [
    {
        name: 'Frenzy Mode',
        duration: 10000,
        activate() {
            // This will be handled by the game state manager
            return { type: 'powerMultiplier', value: 10, duration: this.duration };
        }
    },
    {
        name: 'Punch-splosion',
        activate() {
            // This will be handled by the game state manager
            return { type: 'instantPunches', value: 100 };
        }
    }
];