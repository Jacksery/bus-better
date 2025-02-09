interface DelayData {
    currentDelay: number;
    targetDelay: number;
    lastUpdate: number;
}

const storageKey = 'bus-delays';

// Load delays from localStorage or initialize empty
const loadDelays = (): Map<string, DelayData> => {
    try {
        const saved = localStorage.getItem('busDelays');
        if (saved) {
            return new Map(JSON.parse(saved));
        }
    } catch (e) {
        console.warn('Failed to load delays from storage', e);
    }
    return new Map();
};

// Save delays to localStorage
const saveDelays = (delays: Map<string, DelayData>) => {
    try {
        localStorage.setItem('busDelays', JSON.stringify(Array.from(delays.entries())));
    } catch (e) {
        console.warn('Failed to save delays to storage', e);
    }
};

const delayCache = loadDelays();

// Returns a random delay between -5 and 15 minutes with higher probability of small delays
function generateRandomDelay(): number {
    const rand = Math.random();

    // 20% chance of being early (negative delay)
    if (rand < 0.2) {
        return -Math.floor(Math.random() * 5); // -1 to -5 minutes
    }

    // 50% chance of small delay
    if (rand < 0.7) {
        return Math.floor(Math.random() * 6); // 0 to 5 minutes
    }

    // 20% chance of medium delay
    if (rand < 0.9) {
        return 5 + Math.floor(Math.random() * 6); // 6 to 10 minutes
    }

    // 10% chance of large delay
    return 10 + Math.floor(Math.random() * 6); // 11 to 15 minutes
}

// Returns number between -1 and 1 with higher probability of positive delays
function getWeightedRandom() {
    const rand = Math.random();

    // 30% chance of being ahead (negative delay)
    if (rand < 0.3) {
        return -(Math.random() * 0.8); // -0.8 to 0
    }

    // 70% chance of being behind (positive delay)
    return Math.random() * 1.2; // 0 to 1.2
}

export function addRandomOffset(timeString: string, busId: string): string {
    if (!timeString) return timeString;

    // Get or initialize stored delays
    const storedDelays = JSON.parse(localStorage.getItem(storageKey) || '{}');

    // If this bus already has a delay factor, use it
    if (storedDelays[busId]) {
        const delayFactor = storedDelays[busId];
        const date = new Date(timeString);
        // Convert delay factor to minutes: -12 to +18 minute range
        const offsetMinutes = Math.round(delayFactor * 15);
        date.setMinutes(date.getMinutes() + offsetMinutes);
        return date.toISOString();
    }

    // Generate new delay factor for this bus
    const delayFactor = getWeightedRandom();
    storedDelays[busId] = delayFactor;
    localStorage.setItem(storageKey, JSON.stringify(storedDelays));

    const date = new Date(timeString);
    const offsetMinutes = Math.round(delayFactor * 15);
    date.setMinutes(date.getMinutes() + offsetMinutes);
    return date.toISOString();
}

export function resetAllDelays(): void {
    localStorage.removeItem(storageKey);
}

// Clean up old entries periodically
setInterval(() => {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    let hasChanges = false;

    delayCache.forEach((value, key) => {
        if (value.lastUpdate < oneHourAgo) {
            delayCache.delete(key);
            hasChanges = true;
        }
    });

    if (hasChanges) {
        saveDelays(delayCache);
    }
}, 60000);
