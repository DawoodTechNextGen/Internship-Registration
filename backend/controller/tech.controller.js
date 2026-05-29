const { connection } = require("../config/connection");

const getTechs = (req, res) => {
  const query = "SELECT * FROM `technologies` WHERE `status` = 1";

  connection.query(query, (err, techs) => {
    if (err) {
      console.error("Database query error in getTechs:", err);
      return res.status(500).json({ error: "Failed to load technologies" });
    }
    return res.json(techs);
  });
};

module.exports = getTechs;
