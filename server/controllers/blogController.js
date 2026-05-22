import dbService from "../database.js";
import { uploadImage } from "../utils/uploader.js";

export const blogController = {
  // GET all blogs with optional search/category filters
  async getAllBlogs(req, res) {
    try {
      const { category, search } = req.query;
      let blogs = await dbService.getBlogs();

      if (category && category !== "All") {
        blogs = blogs.filter(b => b.category.toLowerCase() === category.toLowerCase());
      }

      if (search) {
        const query = search.toLowerCase();
        blogs = blogs.filter(b => 
          b.title.toLowerCase().includes(query) || 
          b.description.toLowerCase().includes(query) ||
          b.authorName.toLowerCase().includes(query)
        );
      }

      res.json({ blogs });
    } catch (err) {
      console.error("Error fetching blogs:", err);
      res.status(500).json({ error: "Failed to fetch blogs." });
    }
  },

  // GET single blog by ID
  async getBlogById(req, res) {
    try {
      const { id } = req.params;
      const blog = await dbService.getBlogById(id);
      
      if (!blog) {
        res.status(404).json({ error: "Blog not found." });
        return;
      }

      res.json({ blog });
    } catch (err) {
      console.error("Error fetching blog by ID:", err);
      res.status(500).json({ error: "Failed to retrieve blog detail." });
    }
  },

  // POST create a blog
  async createBlog(req, res) {
    try {
      const { title, name: authorNameArg, description, category, image } = req.body;
      const user = req.user;

      if (!user) {
        res.status(401).json({ error: "Unauthorized. Please log in first." });
        return;
      }

      if (!title || !description || !category) {
        res.status(400).json({ error: "Title, description, and category are required." });
        return;
      }

      const authorName = authorNameArg || user.name;
      const authorId = user.id;

      // Handle Image Upload with Cloudinary fallback
      const imageUrl = await uploadImage(image, category);

      const newBlog = await dbService.createBlog({
        title,
        authorName,
        authorId,
        description,
        category,
        imageUrl
      });

      res.status(201).json({
        message: "Blog published successfully!",
        blog: newBlog
      });
    } catch (err) {
      console.error("Error creating blog:", err);
      res.status(500).json({ error: "Failed to publish blog." });
    }
  },

  // PUT update a blog
  async updateBlog(req, res) {
    try {
      const { id } = req.params;
      const { title, description, category, image } = req.body;
      const user = req.user;

      if (!user) {
        res.status(401).json({ error: "Unauthorized." });
        return;
      }

      const existingBlog = await dbService.getBlogById(id);
      if (!existingBlog) {
        res.status(404).json({ error: "Blog not found." });
        return;
      }

      // Check permissions (only author can update)
      if (existingBlog.authorId !== user.id) {
        res.status(403).json({ error: "Access denied. You can only edit your own blogs." });
        return;
      }

      const updatedFields = {};
      if (title) updatedFields.title = title;
      if (description) updatedFields.description = description;
      if (category) updatedFields.category = category;
      
      if (image && image.trim() !== "") {
        updatedFields.imageUrl = await uploadImage(image, category || existingBlog.category);
      }

      const updatedBlog = await dbService.updateBlog(id, updatedFields);
      res.json({
        message: "Blog updated successfully!",
        blog: updatedBlog
      });
    } catch (err) {
      console.error("Error updating blog:", err);
      res.status(500).json({ error: "Failed to update blog." });
    }
  },

  // DELETE a blog
  async deleteBlog(req, res) {
    try {
      const { id } = req.params;
      const user = req.user;

      if (!user) {
        res.status(401).json({ error: "Unauthorized." });
        return;
      }

      const existingBlog = await dbService.getBlogById(id);
      if (!existingBlog) {
        res.status(404).json({ error: "Blog not found." });
        return;
      }

      // Check permissions (only author can delete)
      if (existingBlog.authorId !== user.id) {
        res.status(403).json({ error: "Access denied. You can only delete your own blogs." });
        return;
      }

      const success = await dbService.deleteBlog(id);
      if (success) {
        res.json({ message: "Blog deleted successfully!" });
      } else {
        res.status(500).json({ error: "Failed to delete blog." });
      }
    } catch (err) {
      console.error("Error deleting blog:", err);
      res.status(500).json({ error: "Failed to delete blog." });
    }
  },

  // POST like/unlike toggle
  async toggleLike(req, res) {
    try {
      const { id } = req.params;
      const user = req.user;

      if (!user) {
        res.status(401).json({ error: "Unauthorized. Please log in to like this post." });
        return;
      }

      const blog = await dbService.getBlogById(id);
      if (!blog) {
        res.status(404).json({ error: "Blog not found." });
        return;
      }

      const likes = await dbService.toggleLikeBlog(id, user.id);
      res.json({ 
        message: likes.includes(user.id) ? "Liked article!" : "Unliked article.",
        likes 
      });
    } catch (err) {
      console.error("Error toggling like:", err);
      res.status(500).json({ error: "Failed to record like state." });
    }
  }
};
