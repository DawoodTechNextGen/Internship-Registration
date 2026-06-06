const { connection } = require("../config/connection");

const registerIntern = (req, res) => {
  const {
    name,
    email,
    country,
    mbl_number,
    city,
    cnic,
    technology,
    Internship_type,
    experience,
    technology_name,
    experience_label,
  } = req.body;

  const query = `
    INSERT INTO registrations
    (name, email, country, mbl_number, cnic, city, technology_id, internship_type, experience)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    name,
    email,
    country,
    mbl_number,
    cnic || null,
    city,
    technology,
    Internship_type,
    experience || 0,
    technology_name || "",
    experience_label || "",
  ];

  connection.query(query, values, async (err, result) => {
    if (err) {
      console.error("DB insert error:", err);
      if (err.code === "ER_DUP_ENTRY") {
        return res
          .status(400)
          .json({ message: "Email or Mobile already exists" });
      }
      return res
        .status(500)
        .json({ message: "Server error. Please try again." });
    }

    return res.status(201).json({
      message: "Registration successful",
      id: result.insertId,
    });
  });
};

// count function
const getRegistrationCount = async (req, res) => {
  const sql = "SELECT COUNT(*) as total FROM registrations";

  // Prevent browser/CDN caching of registration count
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  connection.query(sql, (err, data) => {
    if (err) {
      console.error("Database query error in getRegistrationCount:", err);
      return res.status(500).json({ error: "Failed to get registration count" });
    }
    return res.json(data[0].total);
  });
};

module.exports = { registerIntern, getRegistrationCount };
