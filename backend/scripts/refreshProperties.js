const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Property = require('../models/Property');
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB for property refresh'))
  .catch(err => {
    console.error('MongoDB connection error', err);
    process.exit(1);
  });

// Mock API fetch function (replace with real API later)
const fetchMockPropertyData = async () => {
  return [
    {
      propertyId: 1,
      address: "123 Main St, New York, NY",
      owner: "John Doe",
      value: 1500000,
      source: "MockAPI",
    },
    {
      propertyId: 2,
      address: "456 Park Ave, Los Angeles, CA",
      owner: "Jane Smith",
      value: 2200000,
      source: "MockAPI",
    }
  ];
};

// Main job
const refreshPropertyData = async () => {
  try {
    const data = await fetchMockPropertyData();

    await Property.deleteMany(); // Clear existing data (optional)

    const enrichedData = data.map(d => ({
      ...d,
      lastUpdated: new Date()
    }));

    await Property.insertMany(enrichedData);

    console.log("Property data refreshed successfully");
  } catch (err) {
    console.error("Failed to refresh property data", err);
  } finally {
    mongoose.disconnect();
  }
};

// Add at end:
module.exports = { refreshPropertyData };

