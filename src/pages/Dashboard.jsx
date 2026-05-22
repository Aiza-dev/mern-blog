import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LayoutDashboard, BookOpen, Heart, MessageSquare, Plus, FileText, ArrowRight, Trash2, Edit, User, Eye } from "lucide-react";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import Loader from "../components/Loader.jsx";
import ConfirmationModal from "../components/ConfirmationModal.jsx";
import { toast } from "react-toastify";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Deletion modal states
  const [deleteBlogModalOpen, setDeleteBlogModalOpen] = useState(false);
  const [blogIdToDelete, setBlogIdToDelete] = useState(null);

  const [deleteCommentModalOpen, setDeleteCommentModalOpen] = useState(false);
  const [commentDataToDelete, setCommentDataToDelete] = useState(null); // { blogId, commentId }

  // Fetch stats from server
  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/dashboard");
      if (response.data && response.data.stats) {
        setStats(response.data.stats);
      }
    } catch (err) {
      console.error("Error loading dashboard stats:", err);
      toast.error("Could not obtain dashboard statistics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchStats();
    } else {
      toast.warning("Sign in to view your designer dashboard.");
      navigate("/login");
    }
  }, [user, navigate]);

  // Trigger Comment Deletion Modal
  const triggerDeleteComment = (blogId, commentId) => {
    setCommentDataToDelete({ blogId, commentId });
    setDeleteCommentModalOpen(true);
  };

  const executeDeleteComment = async () => {
    if (!commentDataToDelete) return;
    const { blogId, commentId } = commentDataToDelete;
    try {
      const response = await api.delete(`/api/blogs/${blogId}/comments/${commentId}`);
      if (response.status === 200) {
        toast.success("Comment deleted successfully.");
        fetchStats();
      }
    } catch (err) {
      console.error("Moderation delete error:", err);
      toast.error("Could not delete comment.");
    } finally {
      setDeleteCommentModalOpen(false);
      setCommentDataToDelete(null);
    }
  };

  // Trigger Blog Deletion Modal
  const triggerDeleteBlog = (blogId) => {
    setBlogIdToDelete(blogId);
    setDeleteBlogModalOpen(true);
  };

  const executeDeleteBlog = async () => {
    if (!blogIdToDelete) return;
    try {
      const response = await api.delete(`/api/blogs/${blogIdToDelete}`);
      if (response.status === 200) {
        toast.success("Blog deleted successfully!");
        fetchStats();
      }
    } catch (err) {
      console.error("Delete blog error:", err);
      toast.error("Could not delete article.");
    } finally {
      setDeleteBlogModalOpen(false);
      setBlogIdToDelete(null);
    }
  };

  if (loading) return <Loader size="lg" />;
  if (!stats || !user) return null;

  return (
    <div className="space-y-8" id="user-dashboard-view">
      
      {/* 1. Welcoming message */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-peach-100 dark:border-brown-800 pb-5">
        <div className="space-y-1 font-sans">
          <h1 className="font-display font-black text-3xl text-brown-900 dark:text-white flex items-center space-x-2">
            <LayoutDashboard className="h-7 w-7 text-peach-600 dark:text-peach-400" />
            <span>Artist Workspace</span>
          </h1>
          <p className="text-sm text-brown-605 dark:text-brown-300">
            Welcome back, <span className="font-bold text-peach-650 dark:text-peach-350">{user.name}</span>. Monitor interactions on your blogs.
          </p>
        </div>

        <Link 
          to="/create"
          className="px-5 py-2.5 bg-peach-550 hover:bg-peach-600 text-white rounded-xl shadow font-semibold text-sm transition-all flex items-center space-x-1.5 self-start hover:-translate-y-0.5 cursor-pointer"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>Write New Article</span>
        </Link>
      </div>

      {/* 2. Dynamic statistics cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-sans">
        
        {/* Total Blogs Card */}
        <div className="bg-white dark:bg-brown-850 rounded-xl p-5 border border-peach-150 dark:border-brown-800 flex items-center space-x-4 shadow-sm neon-hover group cursor-pointer transition">
          <div className="p-3.5 bg-peach-100 dark:bg-brown-800 text-peach-600 rounded-xl group-hover:scale-110 transition-transform duration-200">
            <BookOpen className="h-6 w-6 animate-logo-svg" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-brown-900 dark:text-white block tracking-tight leading-none mb-1">
              {stats.totalBlogs}
            </span>
            <span className="text-xs font-bold text-brown-500 uppercase dark:text-brown-300">Your Murals</span>
          </div>
        </div>

        {/* Total Likes Card */}
        <div className="bg-white dark:bg-brown-850 rounded-xl p-5 border border-peach-150 dark:border-brown-800 flex items-center space-x-4 shadow-sm neon-hover group cursor-pointer transition">
          <div className="p-3.5 bg-rose-50 dark:bg-brown-800 text-rose-500 rounded-xl group-hover:scale-110 transition-transform duration-200">
            <Heart className="h-6 w-6 fill-rose-100 dark:fill-transparent group-hover:fill-rose-500 transition-colors animate-bounce" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-brown-900 dark:text-white block tracking-tight leading-none mb-1">
              {stats.totalLikes}
            </span>
            <span className="text-xs font-bold text-brown-500 uppercase dark:text-brown-300">Likes Earned</span>
          </div>
        </div>

        {/* Total Comments Card */}
        <div className="bg-white dark:bg-brown-850 rounded-xl p-5 border border-peach-150 dark:border-brown-800 flex items-center space-x-4 shadow-sm neon-hover group cursor-pointer transition">
          <div className="p-3.5 bg-blue-50 dark:bg-brown-800 text-blue-500 rounded-xl group-hover:scale-110 transition-transform duration-200">
            <MessageSquare className="h-6 w-6 group-hover:rotate-12 transition-transform" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-brown-900 dark:text-white block tracking-tight leading-none mb-1">
              {stats.totalComments}
            </span>
            <span className="text-xs font-bold text-brown-500 uppercase dark:text-brown-300">Comments Received</span>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 3. Recent Blogs section (Col: 7) with neon hover effect */}
        <section className="lg:col-span-7 bg-white dark:bg-brown-850 rounded-2xl border border-peach-200 dark:border-brown-800 p-6 space-y-4 neon-hover transition-colors">
          <h3 className="font-display font-bold text-lg text-brown-855 dark:text-white flex items-center space-x-2 border-b border-peach-55 pb-3">
            <span>Your Publications</span>
            <span className="text-xs font-light text-brown-500 dark:text-brown-400">({stats.recentBlogs.length} total)</span>
          </h3>

          {stats.recentBlogs.length === 0 ? (
            <div className="text-center py-12 p-4 space-y-3 font-sans">
              <FileText className="h-8 w-8 text-brown-400 mx-auto" />
              <p className="text-sm text-brown-655 dark:text-brown-400 italic">
                You haven't published any blogs yet. Create your first epic mural!
              </p>
              <Link 
                to="/create"
                className="px-4 py-2 bg-peach-100 hover:bg-peach-200 text-peach-700 text-xs font-bold rounded-lg inline-block transition shadow-sm"
              >
                Write standard blog
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-peach-50 dark:divide-brown-800 font-sans">
              {stats.recentBlogs.map((blog) => (
                <div key={blog.id || blog._id} className="py-4 flex justify-between items-center space-x-4 first:pt-0 last:pb-0 group">
                  <div className="space-y-1 select-none pr-4">
                    <span className="text-[10px] font-bold text-peach-600 block uppercase tracking-wide">
                      {blog.category}
                    </span>
                    <Link 
                      to={`/blogs/${blog.id || blog._id}`}
                      className="font-bold text-sm text-brown-800 hover:text-peach-600 dark:text-white dark:hover:text-peach-350 block leading-tight transition"
                    >
                      {blog.title}
                    </Link>
                    <span className="text-[11px] text-brown-400 block">
                      Published on {new Date(blog.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Actions cabinet */}
                  <div className="flex items-center space-x-1 shrink-0">
                    <Link 
                      to={`/blogs/${blog.id || blog._id}`}
                      className="p-1.5 text-brown-500 hover:text-peach-650 hover:bg-peach-50 dark:hover:bg-brown-800 rounded transition"
                      title="View Article"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link 
                      to={`/blogs/${blog.id || blog._id}/edit`}
                      className="p-1.5 text-brown-500 hover:text-brown-700 hover:bg-peach-55 dark:hover:bg-brown-800 rounded transition"
                      title="Edit Article"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button 
                      onClick={() => triggerDeleteBlog(blog.id || blog._id)}
                      className="p-1.5 text-brown-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-brown-800 rounded transition cursor-pointer"
                      title="Delete Article"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 4. Comments moderator section (Col: 5) with neon hover effect */}
        <section className="lg:col-span-5 bg-white dark:bg-brown-850 rounded-2xl border border-peach-200 dark:border-brown-800 p-6 space-y-4 font-sans neon-hover transition-colors">
          <h3 className="font-display font-bold text-lg text-brown-855 dark:text-white flex items-center space-x-2 border-b border-peach-55 pb-3">
            <span>Comment Moderation</span>
          </h3>

          {stats.commentsList.length === 0 ? (
            <div className="text-center py-12 p-4">
              <MessageSquare className="h-8 w-8 text-brown-400 mx-auto mb-2" />
              <p className="text-xs text-brown-555 dark:text-brown-400 italic">
                No comments are currently left on your publications. Check back later!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-peach-50 dark:divide-brown-800 max-h-[350px] overflow-y-auto pr-1">
              {stats.commentsList.map((comObj) => (
                <div key={comObj.commentId} className="py-4 space-y-2 first:pt-0 last:pb-0">
                  <div className="flex justify-between items-start space-x-2">
                    <div className="space-y-0.5">
                      <span className="text-[11px] text-brown-500 dark:text-brown-400">
                        <span className="font-bold text-brown-800 dark:text-peach-100">{comObj.userName}</span> commented on:
                      </span>
                      <Link 
                        to={`/blogs/${comObj.blogId}`}
                        className="text-[11px] font-semibold text-peach-600 block hover:underline"
                      >
                        {comObj.blogTitle}
                      </Link>
                    </div>

                    <button 
                      onClick={() => triggerDeleteComment(comObj.blogId, comObj.commentId)}
                      className="p-1 text-brown-400 hover:text-red-500 rounded bg-brown-50 hover:bg-red-50 dark:bg-brown-800 dark:hover:bg-red-950/20 transition cursor-pointer"
                      title="Moderate Comment"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <p className="text-xs text-brown-700 dark:text-brown-200 bg-brown-50/40 dark:bg-brown-800/10 p-2.5 rounded-lg border border-peach-100/50 dark:border-brown-800 leading-relaxed break-words whitespace-pre-wrap">
                    "{comObj.content}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>

      {/* Custom Confirmation Modals */}
      <ConfirmationModal
        isOpen={deleteBlogModalOpen}
        title="Delete Article"
        message="Are you sure you want to delete this blog post permanently? This action cannot be undone, and all comments and likes will be deleted."
        confirmText="Delete Article"
        cancelText="Cancel"
        onConfirm={executeDeleteBlog}
        onCancel={() => {
          setDeleteBlogModalOpen(false);
          setBlogIdToDelete(null);
        }}
        type="danger"
      />

      <ConfirmationModal
        isOpen={deleteCommentModalOpen}
        title="Moderate Comment"
        message="Are you sure you want to permanently delete this comment from your blog post? This action cannot be undone."
        confirmText="Moderate Comment"
        cancelText="Cancel"
        onConfirm={executeDeleteComment}
        onCancel={() => {
          setDeleteCommentModalOpen(false);
          setCommentDataToDelete(null);
        }}
        type="danger"
      />

    </div>
  );
}
