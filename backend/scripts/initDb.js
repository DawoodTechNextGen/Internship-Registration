// Standalone runner: `npm run db:init`
// Server boot par yeh khud chalta hai (app.js), yeh sirf manual run ke liye hai.
const { initDb } = require("../config/initDb");
const { connection } = require("../config/connection");

initDb()
  .catch((err) => {
    console.error("Schema init failed:", err.message);
    process.exitCode = 1;
  })
  .finally(() => {
    connection.end((err) => {
      if (err) console.error("Error closing MySQL pool:", err.message);
    });
  });
