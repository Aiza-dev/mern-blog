import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbService from "../database.js";

const JWT_SECRET = process.env.JWT_SECRET || "f7b6a482d92147320bdfcdfaaa39bdf1176";

export const authController = {
  async signup(req, res) {
    try {
      const { name, email, password, confirmPassword } = req.body;

      if (!name || !email || !password || !confirmPassword) {
        res.status(400).json({ error: "All fields are required." });
        return;
      }

      if (password !== confirmPassword) {
        res.status(400).json({ error: "Passwords do not match." });
        return;
      }

      if (password.length < 6) {
        res.status(400).json({ error: "Password must be at least 6 characters long." });
        return;
      }

      const existingUser = await dbService.getUserByEmail(email);
      if (existingUser) {
        res.status(400).json({ error: "An account with this email already exists." });
        return;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const savedUser = await dbService.createUser({
        name,
        email,
        password: hashedPassword,
      });

      res.status(201).json({
        message: "User registered successfully! Please log in.",
        user: { name: savedUser.name, email: savedUser.email }
      });
    } catch (err) {
      console.error("Signup error:", err);
      res.status(500).json({ error: "Internal server error during registration." });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: "Email and password are required." });
        return;
      }

      const user = await dbService.getUserByEmail(email);
      if (!user) {
        res.status(401).json({ error: `The email "${email}" is not registered. Please sign up for a new account first!` });
        return;
      }

      if (!user.password) {
        res.status(401).json({ error: `The account "${email}" is a seed template profile and doesn't have a login password. Please sign up for your own account!` });
        return;
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(401).json({ error: "Incorrect password. Please verify your typing or register a new profile!" });
        return;
      }

      // Generate JWT
      const payload = {
        id: user.id || user._id,
        name: user.name,
        email: user.email,
      };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

      res.json({
        message: "Logged in successfully!",
        token,
        user: {
          id: user.id || user._id,
          name: user.name,
          email: user.email,
        }
      });
    } catch (err) {
      console.error("Login Error:", err);
      res.status(500).json({ error: "Internal server error during login." });
    }
  },

  async getCurrentUser(req, res) {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Unauthorized." });
        return;
      }
      res.json({ user: req.user });
    } catch (err) {
      res.status(500).json({ error: "Internal server error." });
    }
  }
};
