export function debounce<T extends (...args: any[]) => void>(func: T, wait: number): T {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    } as T;
}

export function throttle<T extends (...args: any[]) => void>(func: T, limit: number): T {
    let lastFunc: NodeJS.Timeout;
    let lastRan: number;
    return function executedFunction(...args: any[]) {
        const context = this;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        }
        clearTimeout(lastFunc);
        lastFunc = setTimeout(function() {
            if ((Date.now() - lastRan) >= limit) {
                func.apply(context, args);
                lastRan = Date.now();
            }
        }, 100);
    } as T;
}

export function memoize<T extends (...args: any[]) => any>(func: T): T {
    const cache: { [key: string]: ReturnType<T> } = {};
    return function (...args: any[]) {
        const key = JSON.stringify(args);
        if (cache[key]) {
            return cache[key];
        } else {
            const result = func(...args);
            cache[key] = result;
            return result;
        }
    } as T;
}
