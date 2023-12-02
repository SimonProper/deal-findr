export const scrapePrice = async (url: string): Promise<{ name: string; price: number | null }> => {
  try {
    const response = await fetch(
      `http://localhost:3001/api/scrape?url=${encodeURIComponent(url)}`
    );
    const data = await response.json();
    return data.productInfo;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
