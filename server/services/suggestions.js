// // This mock data simulates fetched market data
// const mockMarketData = [
//     {
//       symbol: "AAPL",
//       name: "Apple Inc.",
//       sector: "Technology",
//       priceChangePercent: 2.5,
//       volume: 100_000_000,
//       reason: "Strong momentum and high trading volume",
//     },
//     {
//       symbol: "NVDA",
//       name: "NVIDIA Corp.",
//       sector: "Technology",
//       priceChangePercent: 3.8,
//       volume: 75_000_000,
//       reason: "AI sector leader with aggressive price movement",
//     },
//     {
//       symbol: "TSLA",
//       name: "Tesla Inc.",
//       sector: "Automotive",
//       priceChangePercent: 1.9,
//       volume: 90_000_000,
//       reason: "Recent rebound and increased investor interest",
//     },
//     {
//       symbol: "MSFT",
//       name: "Microsoft Corp.",
//       sector: "Technology",
//       priceChangePercent: 1.5,
//       volume: 60_000_000,
//       reason: "Steady growth in cloud and AI initiatives",
//     },
//     {
//       symbol: "JPM",
//       name: "JPMorgan Chase",
//       sector: "Finance",
//       priceChangePercent: 0.5,
//       volume: 40_000_000,
//       reason: "Stable performance in the financial sector",
//     },
//   ];
  
//   export async function getTopStockSuggestions(sector = null) {
//     // Filter by sector if provided
//     let filtered = sector
//       ? mockMarketData.filter(stock =>
//           stock.sector.toLowerCase() === sector.toLowerCase()
//         )
//       : mockMarketData;
  
//     // Sort by highest price change % and volume
//     filtered.sort((a, b) => {
//       const momentumA = a.priceChangePercent * a.volume;
//       const momentumB = b.priceChangePercent * b.volume;
//       return momentumB - momentumA;
//     });
  
//     // Return top 3 suggestions
//     return filtered.slice(0, 3).map(stock => ({
//       symbol: stock.symbol,
//       reason: stock.reason,
//     }));
//   }
import { aggregateMarketData } from "./fetchData.js";

// Optional sector mapping if needed in the future
const symbolToMeta = {
  AAPL: { name: "Apple Inc.", sector: "Technology", reason: "Strong brand and fundamentals" },
  NVDA: { name: "NVIDIA Corp.", sector: "Technology", reason: "Dominating AI GPU market" },
  TSLA: { name: "Tesla Inc.", sector: "Automotive", reason: "Innovative and volatile play" },
  MSFT: { name: "Microsoft Corp.", sector: "Technology", reason: "Growth in AI and Azure" },
  JPM: { name: "JPMorgan Chase", sector: "Finance", reason: "Resilient banking stock" },
};

export async function getTopStockSuggestions(sector = null) {
  const symbols = Object.keys(symbolToMeta);

  const allData = await Promise.all(
    symbols.map(async (symbol) => {
      try {
        const marketData = await aggregateMarketData(symbol);
        return {
          ...symbolToMeta[symbol],
          ...marketData,
        };
      } catch (err) {
        console.error(`Error fetching data for ${symbol}:`, err.message);
        return null;
      }
    })
  );

  const filtered = allData
    .filter(Boolean)
    .filter((stock) =>
      sector ? stock.sector.toLowerCase() === sector.toLowerCase() : true
    );

  filtered.sort((a, b) => {
    const momentumA = a.priceChangePercent * a.volume;
    const momentumB = b.priceChangePercent * b.volume;
    return momentumB - momentumA;
  });

  return filtered.slice(0, 3).map((stock) => ({
    symbol: stock.symbol,
    reason: stock.reason,
  }));
}
