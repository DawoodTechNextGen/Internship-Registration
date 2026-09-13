const { connection } = require("../config/connection");

const patterns = {
  name: /^[a-zA-Z\s]{2,50}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  mbl_number: /^\+92\d{10}$/,
  city: /^[a-zA-Z\s]{2,30}$/,
};

const HACKATHON_STATUSES = ["draft", "upcoming", "open", "closed", "completed"];
const HACKATHON_MODES = ["online", "onsite", "hybrid"];

// ---------------------------------------------------------------------------
// Hackathons (admin CRUD-lite)
// ---------------------------------------------------------------------------

const validateHackathonBody = (body, { isUpdate = false } = {}) => {
  const errors = {};
  const has = (key) => Object.prototype.hasOwnProperty.call(body, key);

  if (!isUpdate || has("title")) {
    if (!body.title || !body.title.trim() || body.title.trim().length > 150)
      errors.title = ["Title is required (max 150 characters)"];
  }

  if (!isUpdate || has("slug")) {
    if (!body.slug || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(body.slug.trim()))
      errors.slug = ["Slug must be lowercase letters/numbers separated by hyphens"];
  }

  if (has("mode") && !HACKATHON_MODES.includes(body.mode))
    errors.mode = [`Mode must be one of: ${HACKATHON_MODES.join(", ")}`];

  if (has("status") && !HACKATHON_STATUSES.includes(body.status))
    errors.status = [`Status must be one of: ${HACKATHON_STATUSES.join(", ")}`];

  const allowIndividual = has("allow_individual") ? !!body.allow_individual : true;
  const allowTeam = has("allow_team") ? !!body.allow_team : true;
  if ((has("allow_individual") || has("allow_team")) && !allowIndividual && !allowTeam)
    errors.allow_individual = ["At least one of individual or team registration must be allowed"];

  const minTeamSize = has("min_team_size") ? Number(body.min_team_size) : 1;
  const maxTeamSize = has("max_team_size") ? Number(body.max_team_size) : 4;
  if (has("min_team_size") && (!Number.isInteger(minTeamSize) || minTeamSize < 1))
    errors.min_team_size = ["Minimum team size must be a positive integer"];
  if (has("max_team_size") && (!Number.isInteger(maxTeamSize) || maxTeamSize < 1))
    errors.max_team_size = ["Maximum team size must be a positive integer"];
  if (!errors.min_team_size && !errors.max_team_size && minTeamSize > maxTeamSize)
    errors.max_team_size = ["Maximum team size must be greater than or equal to minimum team size"];

  return errors;
};

const listHackathons = (req, res) => {
  const { status } = req.query;
  const limit = Math.min(parseInt(req.query.limit, 10) || 0, 50);

  let sql = "SELECT * FROM `hackathons`";
  const values = [];

  if (status) {
    if (!HACKATHON_STATUSES.includes(status)) {
      return res.status(400).json({ error: "Invalid status filter" });
    }
    sql += " WHERE `status` = ?";
    values.push(status);
  }

  sql += status === "completed" ? " ORDER BY `event_end` DESC" : " ORDER BY `event_start` ASC";

  if (limit > 0) {
    sql += " LIMIT ?";
    values.push(limit);
  }

  connection.query(sql, values, (err, rows) => {
    if (err) {
      console.error("Database query error in listHackathons:", err);
      return res.status(500).json({ error: "Failed to load hackathons" });
    }
    return res.json(rows);
  });
};

const getHackathonBySlug = (req, res) => {
  const sql = "SELECT * FROM `hackathons` WHERE `slug` = ?";

  connection.query(sql, [req.params.slug], (err, rows) => {
    if (err) {
      console.error("Database query error in getHackathonBySlug:", err);
      return res.status(500).json({ error: "Failed to load hackathon" });
    }
    if (rows.length === 0) {
      return res.status(404).json({ message: "Hackathon not found" });
    }
    return res.json(rows[0]);
  });
};

const createHackathon = (req, res) => {
  const errors = validateHackathonBody(req.body);
  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      message: "Please fix the errors below and try again.",
      errors,
    });
  }

  const {
    title,
    slug,
    description,
    mode,
    status,
    allow_individual,
    allow_team,
    min_team_size,
    max_team_size,
    registration_start,
    registration_end,
    event_start,
    event_end,
    venue,
    banner_url,
  } = req.body;

  const query = `
    INSERT INTO hackathons
    (slug, title, description, mode, status, allow_individual, allow_team,
     min_team_size, max_team_size, registration_start, registration_end,
     event_start, event_end, venue, banner_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    slug.trim(),
    title.trim(),
    description || null,
    mode || "online",
    status || "draft",
    allow_individual === undefined ? 1 : allow_individual ? 1 : 0,
    allow_team === undefined ? 1 : allow_team ? 1 : 0,
    min_team_size || 1,
    max_team_size || 4,
    registration_start || null,
    registration_end || null,
    event_start || null,
    event_end || null,
    venue || null,
    banner_url || null,
  ];

  connection.query(query, values, (err, result) => {
    if (err) {
      console.error("DB insert error in createHackathon:", err);
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ message: "A hackathon with this slug already exists" });
      }
      return res.status(500).json({ message: "Server error. Please try again." });
    }

    return res.status(201).json({ message: "Hackathon created successfully", id: result.insertId });
  });
};

const updateHackathon = (req, res) => {
  const errors = validateHackathonBody(req.body, { isUpdate: true });
  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      message: "Please fix the errors below and try again.",
      errors,
    });
  }

  const updatableFields = [
    "title",
    "slug",
    "description",
    "mode",
    "status",
    "allow_individual",
    "allow_team",
    "min_team_size",
    "max_team_size",
    "registration_start",
    "registration_end",
    "event_start",
    "event_end",
    "venue",
    "banner_url",
  ];

  const setClauses = [];
  const values = [];

  updatableFields.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(req.body, field)) {
      setClauses.push(`\`${field}\` = ?`);
      let value = req.body[field];
      if (field === "allow_individual" || field === "allow_team") value = value ? 1 : 0;
      values.push(value);
    }
  });

  if (setClauses.length === 0) {
    return res.status(400).json({ message: "No valid fields to update" });
  }

  values.push(req.params.id);
  const query = `UPDATE hackathons SET ${setClauses.join(", ")} WHERE id = ?`;

  connection.query(query, values, (err, result) => {
    if (err) {
      console.error("DB update error in updateHackathon:", err);
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ message: "A hackathon with this slug already exists" });
      }
      return res.status(500).json({ message: "Server error. Please try again." });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Hackathon not found" });
    }
    return res.json({ message: "Hackathon updated successfully" });
  });
};

// ---------------------------------------------------------------------------
// Hackathon registration (individual or team)
// ---------------------------------------------------------------------------

const validateHackathonRegistrationBody = (body, hackathon) => {
  const errors = {};
  const { registration_type, team_name, name, email, mbl_number, city, members } = body;

  if (registration_type !== "individual" && registration_type !== "team") {
    errors.registration_type = ["Registration type must be 'individual' or 'team'"];
  } else if (registration_type === "individual" && !hackathon.allow_individual) {
    errors.registration_type = ["Individual registration is not available for this hackathon"];
  } else if (registration_type === "team" && !hackathon.allow_team) {
    errors.registration_type = ["Team registration is not available for this hackathon"];
  }

  if (!name || !patterns.name.test(name.trim()))
    errors.name = ["Name must be 2-50 characters, letters only"];

  if (!email || !patterns.email.test(email.trim()))
    errors.email = ["Please enter a valid email address"];

  if (!mbl_number || !patterns.mbl_number.test(mbl_number.trim()))
    errors.mbl_number = ["WhatsApp number must be in +92XXXXXXXXXX format"];

  if (!city || !patterns.city.test(city.trim()))
    errors.city = ["Please enter a valid city name"];

  if (registration_type === "team") {
    if (!team_name || !team_name.trim() || team_name.trim().length > 100) {
      errors.team_name = ["Team name is required (max 100 characters)"];
    }

    const memberList = Array.isArray(members) ? members : [];
    const teamSize = memberList.length + 1; // + leader

    if (teamSize < hackathon.min_team_size || teamSize > hackathon.max_team_size) {
      errors.members = [
        `Team size (including you) must be between ${hackathon.min_team_size} and ${hackathon.max_team_size}`,
      ];
    } else {
      const seenEmails = new Set([email.trim().toLowerCase()]);
      memberList.forEach((member, index) => {
        const memberName = member && member.name;
        const memberEmail = member && member.email;

        if (!memberName || !patterns.name.test(memberName.trim())) {
          errors[`members.${index}.name`] = ["Member name must be 2-50 characters, letters only"];
        }
        if (!memberEmail || !patterns.email.test(memberEmail.trim())) {
          errors[`members.${index}.email`] = ["Please enter a valid email address for this member"];
        } else if (seenEmails.has(memberEmail.trim().toLowerCase())) {
          errors[`members.${index}.email`] = ["Each team member must have a unique email"];
        } else {
          seenEmails.add(memberEmail.trim().toLowerCase());
        }
      });
    }
  }

  return errors;
};

const registerHackathon = (req, res) => {
  const { hackathon_id, hackathon_slug } = req.body;

  if (!hackathon_id && !hackathon_slug) {
    return res.status(400).json({ message: "hackathon_id or hackathon_slug is required" });
  }

  const lookupSql = hackathon_id
    ? "SELECT * FROM `hackathons` WHERE `id` = ?"
    : "SELECT * FROM `hackathons` WHERE `slug` = ?";

  connection.query(lookupSql, [hackathon_id || hackathon_slug], (err, rows) => {
    if (err) {
      console.error("Database query error in registerHackathon lookup:", err);
      return res.status(500).json({ message: "Server error. Please try again." });
    }
    if (rows.length === 0) {
      return res.status(404).json({ message: "Hackathon not found" });
    }

    const hackathon = rows[0];

    if (hackathon.status !== "open") {
      return res.status(400).json({ message: "Registration is not open for this hackathon" });
    }

    const errors = validateHackathonRegistrationBody(req.body, hackathon);
    if (Object.keys(errors).length > 0) {
      return res.status(422).json({
        message: "Please fix the errors below and try again.",
        errors,
      });
    }

    const { registration_type, team_name, name, email, mbl_number, city, technology_id, project_idea, members } =
      req.body;

    const insertSql = `
      INSERT INTO hackathon_registrations
      (hackathon_id, registration_type, team_name, name, email, mbl_number, city, technology_id, project_idea)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const insertValues = [
      hackathon.id,
      registration_type,
      registration_type === "team" ? team_name.trim() : null,
      name.trim(),
      email.trim(),
      mbl_number.trim(),
      city.trim(),
      technology_id || null,
      project_idea || null,
    ];

    connection.query(insertSql, insertValues, (insertErr, result) => {
      if (insertErr) {
        console.error("DB insert error in registerHackathon:", insertErr);
        if (insertErr.code === "ER_DUP_ENTRY") {
          return res
            .status(400)
            .json({ message: "Email or WhatsApp number already registered for this hackathon" });
        }
        return res.status(500).json({ message: "Server error. Please try again." });
      }

      const registrationId = result.insertId;

      if (registration_type !== "team") {
        return res.status(201).json({ message: "Registration successful", id: registrationId });
      }

      const memberRows = [
        [registrationId, name.trim(), email.trim(), 1],
        ...members.map((member) => [registrationId, member.name.trim(), member.email.trim(), 0]),
      ];

      connection.query(
        "INSERT INTO hackathon_team_members (registration_id, name, email, is_leader) VALUES ?",
        [memberRows],
        (memberErr) => {
          if (memberErr) {
            console.error("DB insert error in registerHackathon (members):", memberErr);
            return res.status(500).json({ message: "Server error. Please try again." });
          }
          return res.status(201).json({ message: "Registration successful", id: registrationId });
        },
      );
    });
  });
};

const getHackathonCount = (req, res) => {
  const sql = "SELECT COUNT(*) as total FROM hackathon_registrations WHERE hackathon_id = ?";

  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  connection.query(sql, [req.params.hackathonId], (err, data) => {
    if (err) {
      console.error("Database query error in getHackathonCount:", err);
      return res.status(500).json({ error: "Failed to get registration count" });
    }
    return res.json(data[0].total);
  });
};

// ---------------------------------------------------------------------------
// Leaderboard / results (admin managed)
// ---------------------------------------------------------------------------

const getLeaderboard = (req, res) => {
  const sql = "SELECT * FROM `hackathon_leaderboard_entries` WHERE `hackathon_id` = ? ORDER BY `rank` ASC";

  connection.query(sql, [req.params.id], (err, rows) => {
    if (err) {
      console.error("Database query error in getLeaderboard:", err);
      return res.status(500).json({ error: "Failed to load leaderboard" });
    }
    return res.json(rows);
  });
};

const addLeaderboardEntry = (req, res) => {
  const { rank, display_name, project_title, score, prize, registration_id } = req.body;
  const errors = {};

  if (!Number.isInteger(Number(rank)) || Number(rank) < 1)
    errors.rank = ["Rank must be a positive integer"];
  if (!display_name || !display_name.trim() || display_name.trim().length > 150)
    errors.display_name = ["Display name is required (max 150 characters)"];

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      message: "Please fix the errors below and try again.",
      errors,
    });
  }

  const query = `
    INSERT INTO hackathon_leaderboard_entries
    (hackathon_id, \`rank\`, display_name, project_title, score, prize, registration_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    req.params.id,
    rank,
    display_name.trim(),
    project_title || null,
    score === undefined || score === null || score === "" ? null : score,
    prize || null,
    registration_id || null,
  ];

  connection.query(query, values, (err, result) => {
    if (err) {
      console.error("DB insert error in addLeaderboardEntry:", err);
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ message: "This rank is already taken for this hackathon" });
      }
      return res.status(500).json({ message: "Server error. Please try again." });
    }

    return res.status(201).json({ message: "Leaderboard entry added successfully", id: result.insertId });
  });
};

const deleteLeaderboardEntry = (req, res) => {
  const query = "DELETE FROM hackathon_leaderboard_entries WHERE id = ? AND hackathon_id = ?";

  connection.query(query, [req.params.entryId, req.params.id], (err, result) => {
    if (err) {
      console.error("DB delete error in deleteLeaderboardEntry:", err);
      return res.status(500).json({ message: "Server error. Please try again." });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Leaderboard entry not found" });
    }
    return res.json({ message: "Leaderboard entry removed" });
  });
};

module.exports = {
  listHackathons,
  getHackathonBySlug,
  createHackathon,
  updateHackathon,
  registerHackathon,
  getHackathonCount,
  getLeaderboard,
  addLeaderboardEntry,
  deleteLeaderboardEntry,
};
