import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Feather, Upload, X, ChevronDown, CheckCircle2, ArrowLeft } from "lucide-react";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import Loader from "../components/Loader.jsx";
import { toast } from "react-toastify";

const CATEGORIES = ["Coding", "Lifestyle", "Cooking", "Travel", "Technology", "Health", "Education", "Fashion"];

export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Technology");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(""); // base64 string
  const [imagePreview, setImagePreview] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        if (!id) return;
        const response = await api.get(`/api/blogs/${id}`);
        if (response.data && response.data.blog) {
          const blog = response.data.blog;
          
          // Verify permissions
          if (blog.authorId !== user?.id && blog.authorId !== user?._id) {
            toast.error("You are not authorized to edit this article.");
            navigate(`/blogs/${id}`);
            return;
          }

          setTitle(blog.title);
          setCategory(blog.category);
          setDescription(blog.description);
          setImagePreview(blog.imageUrl); // show current cover image
        }
      } catch (err) {
        console.error("Fetch blog error:", err);
        toast.error("Could not locate blog details.");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBlog();
    } else {
      toast.warning("Sign in to edit this mural.");
      navigate("/login");
    }
  }, [id, user, navigate]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    if (file.size > 12 * 1024 * 1024) {
      toast.error("File is too large. Max size 12MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setImage(base64String);
      setImagePreview(base64String);
      toast.success("New file selected.");
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const clearImage = () => {
    setImage("");
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please specify a title.");
      return;
    }

    if (!description.trim() || description.length < 20) {
      toast.error("Content must be at least 20 characters long.");
      return;
    }

    try {
      setSubmitting(true);
      const response = await api.put(`/api/blogs/${id}`, {
        title: title.trim(),
        description: description.trim(),
        category,
        image
      });

      if (response.status === 200) {
        toast.success(response.data.message || "Mural updated successfully!");
        navigate(`/blogs/${id}`);
      }
    } catch (err) {
      console.error("Update blog error:", err);
      toast.error(err.response?.data?.error || "Could not update blog.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader size="lg" />;

  return (
    <div className="max-w-3xl mx-auto space-y-8" id="edit-blog-canvas">
      
      {/* Header bar */}
      <div className="flex justify-between items-center pb-4 border-b border-peach-100 dark:border-brown-800">
        <button 
          onClick={() => navigate(`/blogs/${id}`)}
          className="flex items-center space-x-1.5 text-sm font-semibold text-brown-650 hover:text-peach-600 dark:text-brown-300 dark:hover:text-peach-400"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Reader</span>
        </button>
      </div>

      <div className="space-y-1">
        <h1 className="font-display font-black text-3xl text-brown-900 dark:text-white">
          Edit Your Mural
        </h1>
        <p className="text-sm text-brown-605 dark:text-brown-300">
          Make updates to your published thoughts, recipes, formulas, or images.
        </p>
      </div>

      {/* Draft Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-brown-850 rounded-2xl shadow-sm border border-peach-100 dark:border-brown-800 p-6 sm:p-8 space-y-6 transition-colors duration-300 font-sans">
        
        {/* Title input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-brown-600 dark:text-peach-200">
            Blog Title
          </label>
          <input 
            type="text"
            required
            maxLength={100}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-base sm:text-lg font-semibold px-4 py-3 bg-peach-55/20 dark:bg-brown-900/40 rounded-xl border border-peach-200 dark:border-brown-700 text-brown-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-peach-550"
          />
        </div>

        {/* Categories picker */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-brown-600 dark:text-peach-200">
              Category
            </label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-peach-55/20 dark:bg-brown-900/40 rounded-xl border border-peach-200 dark:border-brown-700 text-brown-800 dark:text-brown-100 focus:outline-none focus:ring-2 focus:ring-peach-500 appearance-none font-medium cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-brown-500 pointer-events-none h-5 w-5" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-brown-600 dark:text-peach-200">
              Author
            </label>
            <div className="px-4 py-3 bg-brown-50 dark:bg-brown-900/60 rounded-xl border border-peach-100/55 dark:border-brown-800/80 text-brown-700 dark:text-brown-200 text-sm font-semibold">
              {user?.name}
            </div>
          </div>
        </div>

        {/* Cover image modification */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-brown-600 dark:text-peach-200 block">
            Cover Image
          </label>
          
          <input 
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
          />

          {!imagePreview ? (
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={triggerFileSelect}
              className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer border-peach-250 bg-peach-50/10 dark:bg-brown-900/10 hover:border-peach-400 font-medium text-sm flex flex-col items-center justify-center space-y-2"
            >
              <Upload className="h-6 w-6 text-peach-500" />
              <span>Drag and drop image or click to browse</span>
            </div>
          ) : (
            <div className="relative rounded-xl overflow-hidden aspect-video bg-peach-55 dark:bg-brown-900 border border-peach-155 dark:border-brown-800 group">
              <img 
                src={imagePreview} 
                alt="Profile preview" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3">
                <button 
                  type="button"
                  onClick={triggerFileSelect}
                  className="px-4 py-2 bg-white text-brown-850 hover:bg-peach-55 text-xs font-bold rounded-lg shadow transition"
                >
                  Change Photo
                </button>
                <button 
                  type="button"
                  onClick={clearImage}
                  className="p-2.5 bg-red-655 hover:bg-red-750 text-white rounded-lg shadow transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="absolute top-3 left-3 flex items-center space-x-1.5 bg-emerald-500 text-white px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow">
                <CheckCircle2 className="h-3 w-3" />
                <span>Image Saved</span>
              </div>
            </div>
          )}
        </div>

        {/* Content modification */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-brown-600 dark:text-peach-200">
            Write Content
          </label>
          <textarea 
            required
            rows={12}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-4 bg-peach-55/20 dark:bg-brown-900/40 rounded-xl border border-peach-200 dark:border-brown-700 text-brown-850 dark:text-white focus:outline-none focus:ring-2 focus:ring-peach-550 placeholder-brown-400 min-h-[300px] leading-relaxed font-sans"
          />
        </div>

        {/* Control actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-peach-100 dark:border-brown-800 font-sans">
          <button
            type="button"
            onClick={() => navigate(`/blogs/${id}`)}
            className="px-5 py-2.5 bg-brown-50 dark:bg-brown-800 hover:bg-brown-100 text-brown-700 dark:text-peach-100 font-semibold rounded-xl text-sm transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-peach-550 border border-peach-600 hover:bg-peach-600 text-white font-bold rounded-xl text-sm shadow-md transition disabled:opacity-50 hover:-translate-y-0.5 cursor-pointer flex items-center space-x-1.5"
          >
            <Feather className="h-4.5 w-4.5" />
            <span>{submitting ? "Updating Mural..." : "Update Mural"}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
