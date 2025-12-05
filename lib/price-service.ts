export async function getBTCPrice(): Promise<number> {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd',
      {
        next: { revalidate: 60 }, // Cache for 60 seconds
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch BTC price');
    }

    const data = await response.json();
    return data.bitcoin.usd;
  } catch (error) {
    console.error('Error fetching BTC price:', error);
    // Fallback or rethrow depending on needs. For now, return a dummy value or rethrow.
    // Returning a safe fallback for demo purposes if API fails (e.g. rate limit)
    return 95000; 
  }
}
