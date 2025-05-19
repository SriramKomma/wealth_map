const cron = require("node-cron");
const { fetchPropertyData } = require("./services/apiFetcher");

cron.schedule("0 */12 * * *", async () => {
  console.log("Fetching fresh data from API...");
  await fetchPropertyData();
});
