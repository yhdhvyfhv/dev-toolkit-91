type NetworkOptions = {
  retries: number;
  delay: number;
};

async function fetchWithRetry<T>(url: string, options: NetworkOptions): Promise<T> {
  const { retries, delay } = options;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return (await response.json()) as T;
    } catch (error) {
      if (attempt < retries - 1) {
        await new Promise(res => setTimeout(res, delay));
      } else {
        throw error;
      }
    }
  }
}

export { fetchWithRetry, NetworkOptions };