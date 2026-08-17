export function safeParseJson<T>(jsonString: string): T | null {
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        console.error('JSON parsing error:', error);
        return null;
    }
}

export function assertIsValidPlayer(player: any): asserts player is Player {
    if (!player || typeof player.name !== 'string' || typeof player.score !== 'number') {
        throw new Error('Invalid player object');
    }
}

export function asyncFetchGameData(url: string): Promise<GameData> {
    return fetch(url) 
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not okay: ${response.statusText}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error fetching game data:', error);
            throw error;  // Rethrow for further handling
        });
}

export function retry<T>(fn: () => Promise<T>, retries: number = 3): Promise<T> {
    return fn().catch((error) => {
        if (retries > 0) {
            console.warn(`Retrying... Attempts left: ${retries}`);
            return retry(fn, retries - 1);
        }
        console.error('Max retries reached:', error);
        throw error;
    });
}