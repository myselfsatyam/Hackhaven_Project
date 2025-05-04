import axios from 'axios';
// import { rapidApiKey } from '../config/settings.js'; // Use `.js` for ES Modules

//const headers = { 'X-RapidAPI-Key': rapidApiKey };


async function fetchPriceTrends(symbol) {
  const res = await axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=compact&apikey=2FP5C6FUR4JNE5ZN`);
  return res.data['Time Series (Daily)'];
}

async function fetchVolume(symbol) {
  const res = await axios.get(`https://api.rapidapi.com/volume/${symbol}`, { headers });
  return res.data;
}

async function fetchNewsSentiment(symbol) {
  const res = await axios.get(`https://api.rapidapi.com/news/${symbol}`, { headers });
  return res.data;
}

async function fetchFundamentals(symbol) {
  const res = await axios.get(`https://api.rapidapi.com/fundamentals/${symbol}`, { headers });
  return res.data;
}

// Explicitly export the aggregateMarketData function
export async function aggregateMarketData(symbol) {
  // Only fetch price trends now
  const priceData = await fetchPriceTrends(symbol);

  const formattedData = {};
  
  for (const date in priceData) {
    formattedData[date] = {
      "1. open": priceData[date]["1. open"],
      "2. high": priceData[date]["2. high"],
      "3. low": priceData[date]["3. low"],
      "4. close": priceData[date]["4. close"],
      "5. volume": priceData[date]["5. volume"]
    };
  }

  return formattedData;
}
