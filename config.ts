interface RetryOptions { attempts: number; delay: number; }

async function retry<T>(fn: () => Promise<T>, options: RetryOptions): Promise<T> {
    const { attempts, delay } = options;
    let lastError;
    for (let attempt = 0; attempt < attempts; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            if (attempt < attempts - 1) {
                await new Promise(res => setTimeout(res, delay));
            }
        }
    }
    throw lastError;
}

export { retry, RetryOptions };