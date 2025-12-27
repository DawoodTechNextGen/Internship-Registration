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
    internship_type,
    experience,
    technology_name,
    experience_label,
  } = req.body;

  console.log(req.body)

  // Basic validation
  const errors = {};
  if (!name) errors.name = ["Name is required"];
  if (!email) errors.email = ["Email is required"];
  if (!country) errors.country = ["Country is required"];
  if (!mbl_number) errors.mbl_number = ["Mobile number is required"];
  if (!city) errors.city = ["City is required"];
  if (!technology) errors.technology = ["Technology selection is required"];

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      message: "Validation failed",
      errors,
    });
  }

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
    city,
    cnic || null,
    technology,
    internship_type || 0,
    experience || 0,
    technology_name || "",
    experience_label || "",
  ];

//   connection.query(query, values, (err, result) => {
//     if (err) {
//       console.error("DB insert error:", err);
//       if (err.code === "ER_DUP_ENTRY") {
//         return res
//           .status(400)
//           .json({ message: "Email or Mobile already exists" });
//       }
//       return res
//         .status(500)
//         .json({ message: "Server error. Please try again." });
//     }

//     return res.status(201).json({
//       message: "Registration successful",
//       id: result.insertId,
//     });
//   });
};

module.exports = registerIntern;
