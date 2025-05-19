// services/apiFetcher.js
const axios = require("axios");
const { saveToDB } = require("./dataSaver");

const API_KEY = process.env.API_KEY;
const API_URL = "https://api.example.com/property-data";

async function fetchPropertyData() {
  try {
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });

    if (response.data) {
      await saveToDB(response.data);
    }
  } catch (error) {
    console.error("Error fetching data:", error.response?.data || error.message);
    // Optionally: Retry logic here (e.g. exponential backoff)
  }
}

module.exports = { fetchPropertyData };
