import axios, { AxiosError } from 'axios';

interface ApiResponse<T> {
  data: T;
  error?: string;
}

export async function fetchData<T>(url: string): Promise<ApiResponse<T>> {
  try {
    const response = await axios.get<T>(url);
    return { data: response.data };
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      // Server responded with a status code outside 2xx range
      return { data: null as any, error: axiosError.response.data };
    } else if (axiosError.request) {
      // No response was received
      return { data: null as any, error: 'No response from server' };
    } else {
      // Something happened while setting up the request
      return { data: null as any, error: axiosError.message };
    }
  }
}

export function handleApiError(error: string): void {
  console.error('API Error:', error);
  // Handle logging or displaying the error as necessary
}