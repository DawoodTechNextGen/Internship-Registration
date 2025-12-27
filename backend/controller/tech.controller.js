const { connection } = require("../config/connection");

const getTechs = (req, res) => {
  const query = "SELECT * FROM `technologies`";

  connection.query(query, (err, techs) => {
    if (err) return res.json(err);
    return res.json(techs);
  });
};

module.exports = getTechs;
