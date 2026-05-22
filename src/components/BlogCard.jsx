import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, MessageSquare, Send, Trash2, Calendar, User, Eye, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { toast } from "react-toastify";

export default function BlogCard({ blog, onUpdate }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isLiking, setIsLiking] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  
  // Local states to make interactions feel instant and fluid!
  const [likes, setLikes] = useState(blog.likes || []);
  const [comments, setComments] = useState(blog.comments || []);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const isLikedByMe = user ? likes.includes(user.id || user._id || "") : false;

  const handleLike = async () => {
    if (!user) {
      toast.warning("Please sign in to like this blog post.");
      navigate("/login");
      return;
    }

    if (isLiking) return;
    setIsLiking(true);

    try {
      // Optimistic state update
      const myId = user.id || user._id || "";
      let newLikes = [...likes];
      if (isLikedByMe) {
        newLikes = newLikes.filter(id => id !== myId);
      } else {
        newLikes.push(myId);
      }
      setLikes(newLikes);

      const response = await api.post(`/api/blogs/${blog.id || blog._id}/like`);
      if (response.data && response.data.likes) {
        setLikes(response.data.likes);
      }
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error("Like error:", err);
      toast.error(err.response?.data?.error || "Failed to update like status.");
      // Revert state
      setLikes(blog.likes || []);
    } finally {
      setIsLiking(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.warning("Please sign in to post a comment.");
      navigate("/login");
      return;
    }

    if (!commentText.trim()) return;
    setIsCommenting(true);

    try {
      const response = await api.post(`/api/blogs/${blog.id || blog._id}/comments`, {
        content: commentText.trim()
      });
      
      if (response.data && response.data.comments) {
        setComments(response.data.comments);
        setCommentText("");
        toast.success("Comment posted successfully!");
      }
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error("Add comment error:", err);
      toast.error(err.response?.data?.error || "Failed to post comment.");
    } finally {
      setIsCommenting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!user) return;
    
    // Require double confirmation natively to bypass browser blocks
    if (confirmDeleteId !== commentId) {
      setConfirmDeleteId(commentId);
      setTimeout(() => {
        setConfirmDeleteId(prev => prev === commentId ? null : prev);
      }, 3000); // clear after 3 seconds automatically
      return;
    }

    try {
      const response = await api.delete(`/api/blogs/${blog.id || blog._id}/comments/${commentId}`);
      if (response.data && response.data.comments) {
        setComments(response.data.comments);
        toast.success("Comment deleted successfully.");
      }
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error("Delete comment error:", err);
      toast.error(err.response?.data?.error || "Failed to delete comment.");
    } finally {
      setConfirmDeleteId(null);
    }
  };

  // Truncate long descriptions for card preview
  const truncateText = (text, length = 140) => {
    if (text.length <= length) return text;
    return text.substring(0, length) + "...";
  };

  const categoryColorMap = {
    Coding: "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/20 dark:text-blue-300 dark:border-blue-900",
    Lifestyle: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-300 dark:border-emerald-900",
    Cooking: "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/20 dark:text-amber-300 dark:border-amber-900",
    Travel: "bg-teal-50 text-teal-600 border-teal-100 dark:bg-teal-950/20 dark:text-teal-300 dark:border-teal-900",
    Technology: "bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-950/20 dark:text-indigo-300 dark:border-indigo-900",
    Health: "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/20 dark:text-rose-300 dark:border-rose-900",
    Education: "bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-950/20 dark:text-purple-300 dark:border-purple-900",
    Fashion: "bg-pink-50 text-pink-600 border-pink-100 dark:bg-pink-950/20 dark:text-pink-300 dark:border-pink-900",
  };

  const currentCategoryClass = categoryColorMap[blog.category] || "bg-peach-55 text-peach-600 border-peach-100 dark:bg-brown-800 dark:text-peach-200";

  return (
    <article 
      className="shiny-card neon-hover bg-white dark:bg-brown-850 rounded-xl overflow-hidden shadow-md border border-peach-100 dark:border-brown-800/80 flex flex-col group h-full"
      id={`blog-card-${blog.id || blog._id}`}
    >
      {/* Blog Hero Banner */}
      <div className="relative overflow-hidden aspect-video bg-peach-50 dark:bg-brown-900/40">
        <img 
          src={blog.imageUrl} 
          alt={blog.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=1000";
          }}
        />
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 text-xs font-semibold rounded-full border text-center ${currentCategoryClass}`}>
            {blog.category}
          </span>
        </div>
      </div>

      {/* Card Contents */}
      <div className="p-5 flex-grow flex flex-col">
        {/* Date and Author */}
        <div className="flex items-center space-x-4 text-xs text-brown-500 dark:text-brown-400 mb-3">
          <span className="flex items-center space-x-1">
            <User className="h-3.5 w-3.5 text-peach-500" />
            <span className="font-medium truncate max-w-[120px]">{blog.authorName}</span>
          </span>
          <span className="flex items-center space-x-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>{new Date(blog.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span>
          </span>
        </div>

        {/* Title */}
        <h3 className="font-display font-bold text-lg sm:text-xl text-brown-800 dark:text-white mb-2 leading-snug group-hover:text-peach-650 dark:group-hover:text-peach-400 transition-colors duration-200">
          <Link to={`/blogs/${blog.id || blog._id}`}>{blog.title}</Link>
        </h3>

        {/* Preview */}
        <p className="text-sm text-brown-600 dark:text-brown-300 mb-4 line-clamp-3 leading-relaxed flex-grow">
          {truncateText(blog.description)}
        </p>

        {/* Row Activators */}
        <div className="flex items-center justify-between border-t border-peach-50 dark:border-brown-800/60 pt-4 mt-auto">
          <div className="flex items-center space-x-4">
            {/* Likes Toggler */}
            <button 
              onClick={handleLike}
              className={`flex items-center space-x-1.5 text-xs font-medium transition-all duration-150 p-1 rounded hover:bg-peach-50 dark:hover:bg-brown-850 ${
                isLikedByMe 
                  ? "text-red-550 fill-red-500 hover:text-red-650 scale-105" 
                  : "text-brown-555 hover:text-red-500 dark:text-brown-300"
              }`}
            >
              <Heart className={`h-4.5 w-4.5 ${isLikedByMe ? "text-red-550" : ""}`} />
              <span>{likes.length}</span>
            </button>

            {/* Comments Expander */}
            <button 
              onClick={() => setShowComments(!showComments)}
              className={`flex items-center space-x-1.5 text-xs font-medium transition-all duration-150 p-1 rounded hover:bg-peach-50 dark:hover:bg-brown-850 ${
                showComments 
                  ? "text-peach-600 dark:text-peach-400 scale-105 font-bold" 
                  : "text-brown-555 hover:text-peach-600 dark:text-brown-300"
              }`}
            >
              <MessageSquare className="h-4.5 w-4.5" />
              <span>{comments.length}</span>
            </button>
          </div>

          <Link 
            to={`/blogs/${blog.id || blog._id}`}
            className="flex items-center space-x-1 text-xs font-semibold text-peach-600 dark:text-peach-400 hover:text-peach-700 dark:hover:text-peach-300 transition-colors group/btn"
          >
            <span>Read More</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Dynamic Slide-down Comment Section */}
      {showComments && (
        <div className="border-t border-peach-100 dark:border-brown-800/80 bg-peach-50/40 dark:bg-brown-900/30 p-4 transition-colors duration-300">
          <h4 className="text-xs font-bold uppercase tracking-wider text-brown-600 dark:text-peach-350 mb-3 flex items-center justify-between">
            <span>Comments ({comments.length})</span>
          </h4>

          {/* Comment Stream */}
          <div className="space-y-3 max-h-48 overflow-y-auto mb-3 pr-1">
            {comments.length === 0 ? (
              <p className="text-xs text-brown-500 dark:text-brown-400 italic py-2">
                No comments yet. Share your thoughts!
              </p>
            ) : (
              comments.map((comment) => {
                const commentUserObjId = comment.userId;
                const activeUserObjId = user?.id || user?._id || "";
                const isCommentAuthor = commentUserObjId === activeUserObjId;
                const isBlogAuthor = blog.authorId === activeUserObjId;
                const canDelete = isCommentAuthor || isBlogAuthor;

                return (
                  <div 
                    key={comment.id || comment._id}
                    className="p-2 bg-white dark:bg-brown-850 rounded-lg shadow-sm border border-peach-50 dark:border-brown-800 text-xs flex justify-between items-start"
                  >
                    <div className="space-y-1 pr-4">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-brown-800 dark:text-peach-105">{comment.userName}</span>
                        <span className="text-[10px] text-brown-400 dark:text-brown-500">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-brown-600 dark:text-brown-300 break-words font-sans whitespace-pre-wrap">{comment.content}</p>
                    </div>

                    {canDelete && (
                      <button 
                        onClick={() => handleDeleteComment(comment.id || comment._id || "")}
                        className={`p-1 px-1.5 rounded transition-all flex items-center space-x-0.5 text-[10px] cursor-pointer font-bold ${
                          confirmDeleteId === (comment.id || comment._id)
                            ? "bg-red-500 text-white animate-pulse"
                            : "text-brown-400 hover:text-red-505 hover:bg-red-50 dark:hover:bg-red-950/20"
                        }`}
                        title={confirmDeleteId === (comment.id || comment._id) ? "Click again to confirm" : "Delete Comment"}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        {confirmDeleteId === (comment.id || comment._id) && (
                          <span className="text-[9px]">Sure?</span>
                        )}
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Comment Form */}
          <form onSubmit={handleAddComment} className="flex gap-2">
            <input 
              type="text" 
              placeholder={user ? "Write a comment..." : "Unlock commenting by signing in"} 
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={!user || isCommenting}
              maxLength={250}
              className="flex-grow p-2 text-xs bg-white dark:bg-brown-850 rounded-lg border border-peach-200 dark:border-brown-700 text-brown-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-peach-500 placeholder-brown-400"
            />
            <button 
              type="submit" 
              disabled={!user || isCommenting || !commentText.trim()}
              className="p-2 bg-peach-500 hover:bg-peach-600 text-white rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 pointer-events-auto cursor-pointer"
              title="Post Comment"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      )}
    </article>
  );
}
