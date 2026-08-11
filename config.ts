export interface NetworkOptions {  retries?: number;  delay?: number;}

export async function fetchWithRetry(url: string, options?: NetworkOptions): Promise<Response> {
  const { retries = 3, delay = 1000 } = options || {};

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response;
    } catch (error) {
      if (attempt < retries) {
        console.warn(`Attempt ${attempt + 1} failed. Retrying in ${delay}ms...`);
        await new Promise(res => setTimeout(res, delay));
      } else {
        throw new Error(`Failed after ${retries + 1} attempts: ${error.message}`);
      }
    }
  }
  throw new Error(`Request failed after ${retries} retries`);
}

export const DEFAULT_OPTIONS: NetworkOptions = {  retries: 3,  delay: 1000 };