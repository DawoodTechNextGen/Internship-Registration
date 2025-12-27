require("dotenv").config();

function customHeaderSet(req, res, next) {
  // Origin (env se)
  res.setHeader("Access-Control-Allow-Origin", process.env.Allow_ORIGIN);

  // Methods allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );

  // 👇 YAHAN custom headers add karo
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, x-access-token, x-client-id"
  );

  // Agar cookies ya auth use ho
  // res.setHeader("Access-Control-Allow-Credentials", "true");

  // Preflight ko yahin end karo
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
}

module.exports = customHeaderSet;
