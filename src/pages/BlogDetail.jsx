import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  Heart, 
  MessageSquare, 
  ArrowLeft, 
  Calendar, 
  User, 
  Trash2, 
  Edit, 
  Send,
  Printer
} from "lucide-react";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import Loader from "../components/Loader.jsx";
import ConfirmationModal from "../components/ConfirmationModal.jsx";
import { toast } from "react-toastify";

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Interactive comments/likes local state
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [togglingLike, setTogglingLike] = useState(false);

  // Custom Confirmation Dialog states
  const [deleteBlogModalOpen, setDeleteBlogModalOpen] = useState(false);
  const [deleteCommentModalOpen, setDeleteCommentModalOpen] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState(null);

  const isLikedByMe = user ? likes.includes(user.id || user._id || "") : false;
  const isAuthor = user && blog && (blog.authorId === user.id || blog.authorId === user._id);

  const fetchBlogDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/blogs/${id}`);
      if (response.data && response.data.blog) {
        setBlog(response.data.blog);
        setLikes(response.data.blog.likes || []);
        setComments(response.data.blog.comments || []);
      }
    } catch (err) {
      console.error("Error loading blog details:", err);
      toast.error("Requested article was not found.");
      navigate("/blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchBlogDetails();
    }
  }, [id]);

  const handleLike = async () => {
    if (!user) {
      toast.warning("Please sign in to like this blog.");
      navigate("/login");
      return;
    }
    if (togglingLike) return;
    setTogglingLike(true);

    try {
      const response = await api.post(`/api/blogs/${id}/like`);
      if (response.data && response.data.likes) {
        setLikes(response.data.likes);
      }
    } catch (err) {
      console.error("Like error:", err);
      toast.error("Could not register your like.");
    } finally {
      setTogglingLike(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.warning("Sign in to comment.");
      navigate("/login");
      return;
    }
    if (!commentText.trim()) return;
    setSubmittingComment(true);

    try {
      const response = await api.post(`/api/blogs/${id}/comments`, { content: commentText.trim() });
      if (response.data && response.data.comments) {
        setComments(response.data.comments);
        setCommentText("");
        toast.success("Comment posted successfully!");
      }
    } catch (err) {
      console.error("Comment submit error:", err);
      toast.error("Could not upload your comment.");
    } finally {
      setSubmittingComment(false);
    }
  };

  const triggerDeleteComment = (commentId) => {
    if (!user) return;
    setCommentIdToDelete(commentId);
    setDeleteCommentModalOpen(true);
  };

  const executeDeleteComment = async () => {
    if (!commentIdToDelete) return;
    try {
      const response = await api.delete(`/api/blogs/${id}/comments/${commentIdToDelete}`);
      if (response.data && response.data.comments) {
        setComments(response.data.comments);
        toast.success("Comment deleted successfully.");
      }
    } catch (err) {
      console.error("Delete comment error:", err);
      toast.error("Could not delete comment.");
    } finally {
      setDeleteCommentModalOpen(false);
      setCommentIdToDelete(null);
    }
  };

  const triggerDeleteBlog = () => {
    if (!isAuthor) return;
    setDeleteBlogModalOpen(true);
  };

  const executeDeleteBlog = async () => {
    try {
      const response = await api.delete(`/api/blogs/${id}`);
      if (response.status === 200) {
        toast.success("Blog deleted successfully!");
        navigate("/");
      }
    } catch (err) {
      console.error("Delete blog error:", err);
      toast.error("Failed to delete the article.");
    } finally {
      setDeleteBlogModalOpen(false);
    }
  };

  const handlePrint = () => {
    try {
      // Create a print-optimized window that works perfectly even within iframe previews
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        // Fallback to calling window.print() directly if popup is blocked
        window.focus();
        window.print();
        return;
      }
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${blog.title} - PDF Export</title>
            <meta charset="utf-8" />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;1,400&display=swap" rel="stylesheet">
            <style>
              body {
                font-family: 'Inter', sans-serif;
                color: #2D2522;
                background: #FFFFFF;
                line-height: 1.6;
                padding: 40px;
                max-width: 800px;
                margin: 0 auto;
              }
              .category {
                text-transform: uppercase;
                font-size: 11px;
                font-weight: 800;
                letter-spacing: 0.12em;
                color: #A36B5E;
                background-color: #FFF2F0;
                padding: 6px 14px;
                border-radius: 9999px;
                display: inline-block;
                margin-bottom: 20px;
              }
              .meta {
                font-size: 13px;
                color: #796660;
                margin-bottom: 24px;
                border-bottom: 2px solid #F3EDEC;
                padding-bottom: 15px;
              }
              h1 {
                font-family: 'Playfair Display', Georgia, serif;
                font-size: 38px;
                font-weight: 700;
                line-height: 1.25;
                margin-top: 0;
                margin-bottom: 15px;
                color: #1A1210;
              }
              .banner {
                width: 100%;
                max-height: 420px;
                object-fit: cover;
                border-radius: 12px;
                margin-bottom: 30px;
              }
              .content {
                font-size: 16px;
                white-space: pre-wrap;
                color: #3C2E2B;
                text-align: justify;
              }
              .footer {
                margin-top: 60px;
                border-top: 1px solid #EBE3E1;
                padding-top: 20px;
                font-size: 12px;
                color: #9C8983;
                text-align: center;
              }
              @media print {
                body {
                  padding: 20px;
                }
                .banner {
                  max-height: 380px;
                }
              }
            </style>
          </head>
          <body>
            <div>
              <span class="category">${blog.category || "General"}</span>
              <h1>${blog.title}</h1>
              <div class="meta">
                <strong>By:</strong> ${blog.authorName || "Author"} &nbsp;&bull;&nbsp; 
                <strong>Published:</strong> ${new Date(blog.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
              </div>
              ${blog.imageUrl ? `<img src="${blog.imageUrl}" class="banner" />` : ""}
              <div class="content">${blog.description}</div>
              <div class="footer">
                Published on PeachBlog. All rights reserved.
              </div>
            </div>
            <script>
              window.onload = function() {
                window.focus();
                window.print();
                setTimeout(() => { window.close(); }, 1000);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } catch (err) {
      console.error("PDF Print error:", err);
      window.focus();
      window.print();
    }
  };

  if (loading) return <Loader size="lg" />;
  if (!blog) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8" id="blog-details-and-ai-container">
      
      {/* Return button and actions row */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-peach-100 dark:border-brown-850 pb-4 print:hidden">
        <Link 
          to="/blogs" 
          className="flex items-center space-x-1.5 text-sm font-semibold text-brown-605 hover:text-peach-600 dark:text-brown-300 dark:hover:text-peach-400 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Feed</span>
        </Link>

        <div className="flex items-center space-x-2">
          {/* Export to PDF print driver */}
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-peach-550 border border-peach-650 hover:bg-peach-600 font-bold rounded-xl text-white text-xs shadow-md hover:shadow-lg hover:-translate-y-0.5 transition flex cursor-pointer"
            title="Export This Blog to a Clean PDF Document"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Export to PDF</span>
          </button>

          {isAuthor && (
            <>
              <Link 
                to={`/blogs/${blog.id || blog._id}/edit`}
                className="flex items-center space-x-1 px-3 py-1.5 bg-brown-150 hover:bg-brown-200 dark:bg-brown-800 dark:hover:bg-brown-700 text-brown-800 dark:text-peach-100 rounded-lg text-xs font-semibold transition flex cursor-pointer"
              >
                <Edit className="h-3.5 w-3.5" />
                <span>Edit Post</span>
              </Link>
              <button 
                onClick={triggerDeleteBlog}
                className="flex items-center space-x-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/40 text-red-650 rounded-lg text-xs font-semibold transition flex cursor-pointer animate-fade-in"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete Post</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Centered Blog layout (Max Width 4xl for premium readability) */}
      <div className="max-w-4xl mx-auto space-y-8" id="blog-core-content-centered">
        
        <article className="bg-white dark:bg-brown-850 rounded-2xl shadow-sm border border-peach-200 dark:border-brown-800 overflow-hidden p-6 sm:p-8 space-y-6 transition-colors duration-300 font-sans print:border-none print:shadow-none print:p-0">
          
          {/* Category & Metas */}
          <div className="flex flex-wrap items-center justify-between text-sm text-brown-505 dark:text-brown-400 gap-2">
            <span className="px-3.5 py-1.5 bg-peach-100 text-peach-750 dark:bg-brown-800 dark:text-peach-200 rounded-full font-bold text-xs uppercase tracking-wider print:bg-[#FFE4E1]">
              {blog.category}
            </span>
            <div className="flex items-center space-x-4 print:text-xs">
              <span className="flex items-center space-x-1">
                <User className="h-4 w-4 text-peach-550" />
                <span className="font-semibold text-brown-850 dark:text-peach-100">{blog.authorName}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Calendar className="h-4 w-4 text-brown-405" />
                <span>{new Date(blog.createdAt).toLocaleDateString(undefined, { dateStyle: "long" })}</span>
              </span>
            </div>
          </div>

          {/* Title */}
          <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-brown-850 dark:text-white leading-tight">
            {blog.title}
          </h1>

          {/* Image Display */}
          <div className="relative rounded-xl overflow-hidden aspect-video bg-peach-50 dark:bg-brown-900 border border-peach-100 dark:border-brown-800 print:break-inside-avoid print:max-h-96">
            <img 
              src={blog.imageUrl} 
              alt={blog.title} 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover" 
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=1000";
              }}
            />
          </div>

          {/* Article text body */}
          <div className="text-base sm:text-lg text-brown-850 dark:text-brown-100 leading-relaxed whitespace-pre-wrap space-y-4 font-sans max-w-none [overflow-wrap:anywhere]">
            {blog.description}
          </div>

          {/* Likes Row interaction */}
          <div className="flex items-center justify-between border-t border-peach-100 dark:border-brown-800 pt-6 print:hidden">
            <div className="flex items-center space-x-1.5">
              <button 
                onClick={handleLike}
                className={`p-3 rounded-full flex items-center justify-center transition-all ${
                  isLikedByMe 
                    ? "bg-red-50 text-red-500 dark:bg-red-950/20 fill-red-500" 
                    : "bg-brown-50 text-brown-505 dark:bg-brown-800 hover:text-red-500 dark:hover:text-red-400"
                }`}
              >
                <Heart className="h-6 w-6" />
              </button>
              <div>
                <span className="font-bold text-base text-brown-800 dark:text-white">{likes.length}</span>
                <span className="text-xs text-brown-505 block dark:text-brown-400">Total Likes</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-brown-555 text-sm">
              <MessageSquare className="h-5 w-5 text-peach-555" />
              <span className="font-medium">{comments.length} Comments</span>
            </div>
          </div>

        </article>

        {/* Embedded Deep Comment Box Column */}
        <section className="bg-white dark:bg-brown-850 rounded-2xl shadow-sm border border-peach-200 dark:border-brown-805 p-6 sm:p-8 space-y-6 transition-colors duration-300 font-sans print:hidden">
          <h3 className="font-display font-bold text-xl text-brown-800 dark:text-white flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-peach-550" />
            <span>Interactive Discussion Room</span>
          </h3>

          {/* Comment input form */}
          <form onSubmit={handleAddComment} className="space-y-3">
            <textarea 
              rows={3}
              placeholder={user ? "Write something meaningful..." : "Sign in to join the conversation!"}
              disabled={!user || submittingComment}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full p-4 text-sm bg-peach-50/10 dark:bg-brown-900/30 rounded-xl border border-peach-200 dark:border-brown-700 text-brown-850 dark:text-white focus:outline-none focus:ring-2 focus:ring-peach-500 focus:border-transparent placeholder-brown-405 min-h-[100px]"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!user || submittingComment || !commentText.trim()}
                className="px-5 py-2.5 bg-peach-550 hover:bg-peach-600 text-white rounded-xl shadow border border-peach-600 font-semibold text-sm transition flex items-center space-x-1.5 disabled:opacity-50 disabled:translate-y-0 hover:-translate-y-0.5 cursor-pointer"
              >
                <Send className="h-4 w-4" />
                <span>Post Comment</span>
              </button>
            </div>
          </form>

          {/* Stream */}
          <div className="space-y-4 pt-4 border-t border-peach-100 dark:border-brown-800/60">
            {comments.length === 0 ? (
              <p className="text-sm text-brown-555 dark:text-brown-400 italic text-center py-4">
                Be the first user to share a comment, observation, or question!
              </p>
            ) : (
              comments.map((comment) => {
                const activeUserObjId = user?.id || user?._id || "";
                const isCommentOwner = comment.userId === activeUserObjId;
                const isBlogOwner = blog.authorId === activeUserObjId;
                const canDelete = isCommentOwner || isBlogOwner;

                return (
                  <div 
                    key={comment.id || comment._id}
                    className="p-4 bg-brown-100/30 dark:bg-brown-900/10 rounded-xl border border-peach-100/50 dark:border-brown-800 flex justify-between items-start space-x-4 text-sm"
                  >
                    <div className="space-y-2 flex-grow pr-4">
                      <div className="flex items-center space-x-2">
                        <div className="h-7 w-7 bg-peach-100 dark:bg-brown-800 text-peach-600 dark:text-peach-200 rounded-full flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                          {comment.userName.charAt(0)}
                        </div>
                        <div>
                          <span className="font-semibold text-brown-800 dark:text-peach-100 block leading-tight">{comment.userName}</span>
                          <span className="text-[10px] text-brown-405 block dark:text-brown-500">
                            {new Date(comment.createdAt).toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" })}
                          </span>
                        </div>
                      </div>
                      <p className="text-brown-700 dark:text-brown-200 pl-9 font-sans whitespace-pre-wrap break-all leading-relaxed">
                        {comment.content}
                      </p>
                    </div>

                    {canDelete && (
                      <button 
                        onClick={() => triggerDeleteComment(comment.id || comment._id || "")}
                        className="p-2 text-brown-400 hover:text-red-500 hover:bg-white dark:hover:bg-brown-800 rounded-lg transition shadow-sm border border-transparent hover:border-red-100 cursor-pointer"
                        title="Delete Comment"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>

        </section>

      </div>

      {/* Blog Deletion Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteBlogModalOpen}
        title="Delete Post permanently?"
        message="Are you absolutely sure you want to delete this blog post? This action is permanent, and all associated likes and comments will be destroyed."
        confirmText="Yes, Delete Post"
        cancelText="Keep Post"
        onConfirm={executeDeleteBlog}
        onCancel={() => setDeleteBlogModalOpen(false)}
        type="danger"
      />

      {/* Comment Deletion Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteCommentModalOpen}
        title="Delete Comment?"
        message="Are you sure you want to delete this comment? This action is permanent."
        confirmText="Yes, Delete Comment"
        cancelText="Keep Comment"
        onConfirm={executeDeleteComment}
        onCancel={() => {
          setDeleteCommentModalOpen(false);
          setCommentIdToDelete(null);
        }}
        type="danger"
      />

    </div>
  );
}
