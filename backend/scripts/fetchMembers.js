// fetchMembers.js
const axios = require("axios");
require("dotenv").config({ path: "../.env" }); // if .env is one level up


const tickers = [
  { id: 1, ticker: "AAPL", position: [37.3349, -122.0090] },      // Apple Inc.
  { id: 2, ticker: "GOOGL", position: [37.422, -122.084] },       // Alphabet Inc. (Google)
  { id: 3, ticker: "TSLA", position: [37.3947, -122.1503] },      // Tesla, Inc.
  { id: 4, ticker: "MSFT", position: [47.6401, -122.1295] },      // Microsoft Corporation
  { id: 5, ticker: "NVDA", position: [37.3705, -122.036] },       // NVIDIA Corporation
  { id: 6, ticker: "AMZN", position: [47.6062, -122.3321] },      // Amazon.com, Inc.
  { id: 7, ticker: "META", position: [37.4845, -122.1477] },      // Meta Platforms, Inc.
  { id: 8, ticker: "BRK.A", position: [41.2565, -95.9345] },      // Berkshire Hathaway Inc.
  { id: 9, ticker: "AVGO", position: [37.3688, -122.0363] },      // Broadcom Inc.
  { id: 10, ticker: "TSM", position: [25.033964, 121.562321] },   // Taiwan Semiconductor Manufacturing Company
];


const fetchMembers = async () => {
  const members = [];

  for (const item of tickers) {
    try {
      const { ticker, position, id } = item;

      // Fetch company profile from FMP API
      const response = await axios.get(
        `https://financialmodelingprep.com/api/v3/profile/${ticker}?apikey=${process.env.FMP_API_KEY}`
      );
      const profile = response.data[0];

      if (!profile) {
        console.warn(`No profile data found for ${ticker}`);
        continue;
      }

      const name = profile.ceo || "N/A";
      const company = profile.companyName || ticker;
      const industry = profile.industry || "Unknown";

      // Fake net worth using random high value
      const netWorthVal = Math.floor(Math.random() * 90_000_000) + 10_000_000;
      const netWorth = `$${netWorthVal.toLocaleString("en-US")}`;

      // Split wealth randomly
      const stocks = Math.floor(netWorthVal * 0.4);
      const realEstate = Math.floor(netWorthVal * 0.5);
      const crypto = netWorthVal - stocks - realEstate;

      members.push({
        id,
        name,
        position,
        netWorth,
        company,
        industry,
        role: "CEO",
        wealthBreakdown: {
          Stocks: stocks,
          "Real Estate": realEstate,
          Crypto: crypto,
        },
      });
    } catch (error) {
      console.error(`Error fetching data for ${item.ticker}:`, error.message);
    }
  }

  return members;
};

fetchMembers().then((data) => {
  console.log("export const members =", JSON.stringify(data, null, 2), ";");
});
