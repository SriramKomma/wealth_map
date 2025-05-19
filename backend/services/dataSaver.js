
const Property = require("../models/Property");

async function saveToDB(properties) {
  for (const prop of properties) {
    await Property.findOneAndUpdate(
      { propertyId: prop.id },
      { ...prop, lastUpdated: new Date() },
      { upsert: true }
    );
  }
}
