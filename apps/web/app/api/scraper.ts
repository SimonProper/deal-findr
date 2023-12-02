export const scrapePrice = async (url: string): Promise<number> => {
  try {
    const response = await fetch(
      `http://localhost:3001/api/scrape?url=${encodeURIComponent(url)}`
    );
    const data: { price: number } = await response.json();
    return data.price;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
