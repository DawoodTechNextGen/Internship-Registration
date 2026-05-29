const mysql = require("mysql");
require("dotenv").config();

const connection = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "task_desk",
});

async function createDbConnection() {
  connection.getConnection((err, conn) => {
    if (err) {
      console.error("Error connecting to MYSQL pool: ", err);
      return;
    }
    console.log("Database Connected Successfully to Pool");
    conn.release();
  });
}

module.exports = {createDbConnection, connection};
