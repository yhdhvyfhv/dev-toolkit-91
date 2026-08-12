import axios, { AxiosError } from 'axios';

type RequestConfig = {
  url: string;
  method?: 'GET' | 'POST';
  data?: any;
  retries?: number;
  delay?: number;
};

const defaultRetries = 3;
const defaultDelay = 1000;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function retryRequest(config: RequestConfig): Promise<any> {
  const retries = config.retries || defaultRetries;
  const delayTime = config.delay || defaultDelay;

  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.request({
        url: config.url,
        method: config.method,
        data: config.data,
      });
      return response.data;
    } catch (error) {
      if (i < retries - 1) {
        console.warn(`Retrying request... Attempt ${i + 2} of ${retries}`);
        await delay(delayTime);
      } else {
        const axiosError = error as AxiosError;
        throw new Error(`Request failed after ${retries} attempts: ${axiosError.message}`);
      }
    }
  }
}

export { retryRequest };