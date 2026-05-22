import { Router } from "express";
import { blogController } from "../controllers/blogController.js";
import { commentController } from "../controllers/commentController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

// Guest accessible endpoints
router.get("/", blogController.getAllBlogs);
router.get("/:id", blogController.getBlogById);

// Protected blog endpoints
router.post("/", authMiddleware, blogController.createBlog);
router.put("/:id", authMiddleware, blogController.updateBlog);
router.delete("/:id", authMiddleware, blogController.deleteBlog);
router.post("/:id/like", authMiddleware, blogController.toggleLike);

// Protected comment endpoints
router.post("/:id/comments", authMiddleware, commentController.addComment);
router.delete("/:id/comments/:commentId", authMiddleware, commentController.deleteComment);

export default router;
