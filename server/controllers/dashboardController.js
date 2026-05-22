import dbService from "../database.js";

export const dashboardController = {
  async getStats(req, res) {
    try {
      const user = req.user;
      if (!user) {
        res.status(401).json({ error: "Unauthorized." });
        return;
      }

      const stats = await dbService.getDashboardStats(user.id);
      res.json({ stats });
    } catch (err) {
      console.error("Dashboard stats error:", err);
      res.status(500).json({ error: "Failed to gather dashboard statistics." });
    }
  }
};
