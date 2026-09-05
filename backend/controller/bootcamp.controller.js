const { connection } = require("../config/connection");

const patterns = {
  name: /^[a-zA-Z\s]{2,50}$/,
  email: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
  mbl_number: /^\+92\d{10}$/,
  cnic: /^\d{5}-\d{7}-\d{1}$/,
  city: /^[a-zA-Z\s]{2,30}$/,
};

const validateBootcampBody = ({ name, email, mbl_number, province, city, cnic }) => {
  const errors = {};

  if (!name || !patterns.name.test(name.trim()))
    errors.name = ["Name must be 2-50 characters, letters only"];

  if (!email || !patterns.email.test(email.trim()))
    errors.email = ["Only Gmail addresses are allowed"];

  if (!mbl_number || !patterns.mbl_number.test(mbl_number.trim()))
    errors.mbl_number = ["WhatsApp number must be in +92XXXXXXXXXX format"];

  if (!province || !province.trim()) errors.province = ["Province is required"];

  if (!city || !patterns.city.test(city.trim()))
    errors.city = ["Please enter a valid city name"];

  if (!cnic || !patterns.cnic.test(cnic.trim()))
    errors.cnic = ["CNIC format must be 00000-0000000-0"];

  return errors;
};

const registerBootcamp = (req, res) => {
  const { name, email, mbl_number, province, city, cnic } = req.body;

  const errors = validateBootcampBody(req.body);
  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      message: "Please fix the errors below and try again.",
      errors,
    });
  }

  const query = `
    INSERT INTO bootcamp_registrations
    (name, email, mbl_number, province, city, cnic)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const values = [
    name.trim(),
    email.trim(),
    mbl_number.trim(),
    province.trim(),
    city.trim(),
    cnic.trim(),
  ];

  connection.query(query, values, (err, result) => {
    if (err) {
      console.error("DB insert error in registerBootcamp:", err);
      if (err.code === "ER_DUP_ENTRY") {
        return res
          .status(400)
          .json({ message: "Email, WhatsApp number or CNIC already exists" });
      }
      return res
        .status(500)
        .json({ message: "Server error. Please try again." });
    }

    return res.status(201).json({
      message: "Bootcamp enrollment successful",
      id: result.insertId,
    });
  });
};

// count function
const getBootcampCount = (req, res) => {
  const sql = "SELECT COUNT(*) as total FROM bootcamp_registrations";

  // Prevent browser/CDN caching of enrollment count
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  connection.query(sql, (err, data) => {
    if (err) {
      console.error("Database query error in getBootcampCount:", err);
      return res.status(500).json({ error: "Failed to get enrollment count" });
    }
    return res.json(data[0].total);
  });
};

module.exports = { registerBootcamp, getBootcampCount };
