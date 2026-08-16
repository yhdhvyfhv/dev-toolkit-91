import axios from 'axios';

export const fetchWithRetry = async (url: string, retries: number = 3, delay: number = 1000) => {
    for (let i = 0; i <= retries; i++) {
        try {
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            if (i < retries) {
                console.warn(`Attempt ${i + 1} failed. Retrying in ${delay}ms...`);
                await new Promise(res => setTimeout(res, delay));
            } else {
                console.error('All retry attempts failed:', error);
                throw error;
            }
        }
    }
};

export const postWithRetry = async (url: string, data: any, retries: number = 3, delay: number = 1000) => {
    for (let i = 0; i <= retries; i++) {
        try {
            const response = await axios.post(url, data);
            return response.data;
        } catch (error) {
            if (i < retries) {
                console.warn(`Attempt ${i + 1} failed. Retrying in ${delay}ms...`);
                await new Promise(res => setTimeout(res, delay));
            } else {
                console.error('All retry attempts failed:', error);
                throw error;
            }
        }
    }
};
