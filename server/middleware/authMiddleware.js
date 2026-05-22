import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "f7b6a482d92147320bdfcdfaaa39bdf1176";

export function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Access denied. No authorization token provided." });
      return;
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired authorization token." });
  }
}
