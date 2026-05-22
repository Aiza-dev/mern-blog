import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { connectDatabase } from "./server/database.js";
import authRoutes from "./server/routes/authRoutes.js";
import blogRoutes from "./server/routes/blogRoutes.js";
import dashboardRoutes from "./server/routes/dashboardRoutes.js";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // 1. Establish database connections
  await connectDatabase();

  // 2. Body Parser Middlewares - configured robustly to accept large Base64 files for inline image uploads
  app.use(express.json({ limit: "25mb" }));
  app.use(express.urlencoded({ limit: "25mb", extended: true }));

  // 3. API Routes FIRST
  app.use("/api/auth", authRoutes);
  app.use("/api/blogs", blogRoutes);
  app.use("/api/dashboard", dashboardRoutes);

  // Global API error handler
  app.use("/api", (req, res) => {
    res.status(404).json({ error: "API endpoint not found" });
  });

  // 4. Vite Dev Middleware / Static Build Asset Serving for Full SPAs
  if (process.env.NODE_ENV !== "production") {
    console.log("🛠️ Starting development environment with Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("🚀 Starting production environment...");
    const distPath = path.join(process.cwd(), "dist");
    
    // Serve static files
    app.use(express.static(distPath));
    
    // Serve client router fallback (Vite Router)
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // 5. Port Listening on Host 0.0.0.0 for seamless reverse proxying
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`===============================================`);
    console.log(` MERN Blog Server running beautifully!`);
    console.log(` Web App URL: http://localhost:${PORT}`);
    console.log(` Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`===============================================`);
  });
}

startServer().catch((error) => {
  console.error("FATAL Error booting full-stack server:", error);
});
