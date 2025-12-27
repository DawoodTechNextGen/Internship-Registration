const mysql = require("mysql");
require("dotenv").config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "task_desk",
});

async function createDbConnection() {
  connection.connect((err) => {
    if (err) {
      console.error("Error connecting to MYSQL: ", err);
      return;
    }
    console.log("Database Connected Successfuly");
  });
}

module.exports = {createDbConnection, connection};
