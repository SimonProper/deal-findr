"use client";
import React, { useState } from "react";
import { scrapePrice } from "../app/api/scraper";

export default function Home() {
  const [url, setUrl] = useState("");
  const [price, setPrice] = useState<null | number>(null);

  const handleButtonClick = async () => {
    try {
      const scrapedPrice = await scrapePrice(url);
      console.log(scrapedPrice);
      setPrice(scrapedPrice);
    } catch (error) {}
  };

  return (
    <main className="flex flex-col h-full w-full justify-center items-center p-24 min-h-screen">
      <h1 className="text-5xl">Welcome to Deal Findr</h1>
      <div className="flex items-center space-x-4 mt-4">
        <input
          type="text"
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500 text-black"
        />
        <button
          onClick={handleButtonClick}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
        >
          Scrape Price
        </button>
      </div>
      {price !== null && (
        <p className="mt-4 text-xl">
          Scraped Price: <span className="font-semibold">{price} kr</span>
        </p>
      )}
    </main>
  );
}
