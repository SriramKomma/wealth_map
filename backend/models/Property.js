const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  propertyId: Number,
  address: String,
  owner: String,
  value: Number,
  lastUpdated: Date,
  source: String,
});

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;
