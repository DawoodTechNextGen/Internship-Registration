const fs = require("fs");
const path = require("path");
const { connection } = require("./connection");

const SQL_DIR = path.join(__dirname, "..", "sql");

const runQuery = (sql, values = []) =>
  new Promise((resolve, reject) => {
    connection.query(sql, values, (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });

// Strip `--` comments and split the file into individual statements
const splitStatements = (raw) =>
  raw
    .split("\n")
    .filter((line) => !line.trim().startsWith("--"))
    .join("\n")
    .split(";")
    .map((statement) => statement.trim())
    .filter(Boolean);

const getCreatedTableName = (statement) => {
  const match = statement.match(
    /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?`?([A-Za-z0-9_]+)`?/i,
  );
  return match ? match[1] : null;
};

const tableExists = async (table) => {
  const rows = await runQuery("SHOW TABLES LIKE ?", [table]);
  return rows.length > 0;
};

// Runs every .sql file in backend/sql on boot, so a missing table
// is created automatically instead of failing on the first request.
async function initDb() {
  if (!fs.existsSync(SQL_DIR)) {
    console.warn(`Migration folder not found, skipping: ${SQL_DIR}`);
    return;
  }

  const files = fs
    .readdirSync(SQL_DIR)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  if (files.length === 0) {
    console.log("No .sql migration files found, skipping schema check");
    return;
  }

  for (const file of files) {
    const raw = fs.readFileSync(path.join(SQL_DIR, file), "utf8");

    for (const statement of splitStatements(raw)) {
      const table = getCreatedTableName(statement);

      try {
        if (table && (await tableExists(table))) {
          console.log(`Table \`${table}\` already exists, skipping`);
          continue;
        }

        await runQuery(statement);
        console.log(
          table
            ? `Table \`${table}\` created successfully`
            : `Migration statement from ${file} executed successfully`,
        );
      } catch (err) {
        const reason = err.message || err.code || "Unknown error";
        console.error(`Migration error in ${file}: ${reason}`);

        // Connection is gone, no point trying the remaining statements
        if (err.fatal) {
          console.error(
            "Database unreachable, schema check aborted. Fix the DB connection and restart.",
          );
          return;
        }
      }
    }
  }

  console.log("Database schema check completed");
}

module.exports = { initDb };
