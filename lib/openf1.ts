const API_BASE_URL = process.env.NEXT_PUBLIC_OPENF1_API_URL || 'https://api.openf1.org/v1';

/**
 * Utility function to fetch data from the OpenF1 API.
 * @param endpoint The API endpoint (e.g., 'drivers', 'sessions')
 * @param params Optional query parameters to filter the results
 * @returns The JSON response from the API
 */
export async function fetchOpenF1(endpoint: string, params: Record<string, string | number> = {}) {
  // Ensure endpoint doesn't start with a slash if API_BASE_URL ends with one
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`;
  
  const url = new URL(`${baseUrl}${cleanEndpoint}`);
  
  // Append any query parameters
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, String(value));
  });

  try {
    const response = await fetch(url.toString(), {
      // In Next.js, we can optionally cache the response. Here we cache for 60 seconds.
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      throw new Error(`OpenF1 API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch from OpenF1 API (${url.toString()}):`, error);
    throw error;
  }
}
