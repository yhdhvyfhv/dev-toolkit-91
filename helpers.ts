export const isArray = (input: any): input is any[] => Array.isArray(input);

export const deepClone = <T>(obj: T): T => {
    return JSON.parse(JSON.stringify(obj));
};

export const throttle = (func: Function, limit: number) => {
    let lastFunc: ReturnType<typeof setTimeout>;
    let lastRan: number;

    return function (...args: any[]) {
        const context = this;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function () {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
};

export const formatDate = (date: Date, format: string): string => {
    const options: Intl.DateTimeFormatOptions = {};
    if (format.includes('year')) options.year = 'numeric';
    if (format.includes('month')) options.month = 'short';
    if (format.includes('day')) options.day = 'numeric';
    return new Intl.DateTimeFormat('en-US', options).format(date);
};

export const randomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};