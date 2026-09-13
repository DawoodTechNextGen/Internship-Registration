const express = require("express");
const {
  listHackathons,
  getHackathonBySlug,
  createHackathon,
  updateHackathon,
  registerHackathon,
  getHackathonCount,
  getLeaderboard,
  addLeaderboardEntry,
  deleteLeaderboardEntry,
} = require("../controller/hackathon.controller");
const hackathonRouter = express.Router();

hackathonRouter.get("/api/hackathons", listHackathons);
hackathonRouter.get("/api/hackathons/:slug", getHackathonBySlug);
hackathonRouter.post("/api/hackathons", createHackathon);
hackathonRouter.put("/api/hackathons/:id", updateHackathon);

hackathonRouter.post("/api/hackathon-registration", registerHackathon);
hackathonRouter.get("/api/count-hackathon/:hackathonId", getHackathonCount);

hackathonRouter.get("/api/hackathons/:id/leaderboard", getLeaderboard);
hackathonRouter.post("/api/hackathons/:id/leaderboard", addLeaderboardEntry);
hackathonRouter.delete("/api/hackathons/:id/leaderboard/:entryId", deleteLeaderboardEntry);

module.exports = hackathonRouter;
