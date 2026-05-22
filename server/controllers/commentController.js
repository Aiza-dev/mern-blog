import dbService from "../database.js";

export const commentController = {
  // POST add a comment to a blog
  async addComment(req, res) {
    try {
      const { id: blogId } = req.params;
      const { content } = req.body;
      const user = req.user;

      if (!user) {
        res.status(401).json({ error: "Unauthorized. Please log in to comment." });
        return;
      }

      if (!content || content.trim() === "") {
        res.status(400).json({ error: "Comment content cannot be empty." });
        return;
      }

      const blog = await dbService.getBlogById(blogId);
      if (!blog) {
        res.status(404).json({ error: "Blog not found." });
        return;
      }

      const newComment = await dbService.addComment(blogId, {
        blogId,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        content: content.trim()
      });

      // Fetch updated lists of comments for response
      const updatedBlog = await dbService.getBlogById(blogId);

      res.status(201).json({
        message: "Comment posted!",
        comment: newComment,
        comments: updatedBlog?.comments || []
      });
    } catch (err) {
      console.error("Error adding comment:", err);
      res.status(500).json({ error: "Failed to post comment." });
    }
  },

  // DELETE a comment from a blog
  async deleteComment(req, res) {
    try {
      const { id: blogId, commentId } = req.params;
      const user = req.user;

      if (!user) {
        res.status(401).json({ error: "Unauthorized." });
        return;
      }

      const blog = await dbService.getBlogById(blogId);
      if (!blog) {
        res.status(404).json({ error: "Blog not found." });
        return;
      }

      // Check the comment details to see who created it
      const targetComment = blog.comments?.find(c => c.id === commentId || c._id === commentId);
      if (!targetComment) {
        res.status(404).json({ error: "Comment not found." });
        return;
      }

      // Permissions check: User is either the comment owner OR the blog owner
      const isCommentOwner = targetComment.userId === user.id;
      const isBlogOwner = blog.authorId === user.id;

      if (!isCommentOwner && !isBlogOwner) {
        res.status(403).json({ error: "Access denied. You can only delete your own comments, or comments on your own blogs." });
        return;
      }

      const success = await dbService.deleteComment(blogId, commentId);
      if (success) {
        const uBlog = await dbService.getBlogById(blogId);
        res.json({
          message: "Comment deleted successfully!",
          comments: uBlog?.comments || []
        });
      } else {
        res.status(500).json({ error: "Failed to delete comment." });
      }
    } catch (err) {
      console.error("Error deleting comment:", err);
      res.status(500).json({ error: "Failed to delete comment." });
    }
  }
};
