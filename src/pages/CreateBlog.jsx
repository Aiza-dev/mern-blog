import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Feather, Upload, Image as ImageIcon, X, ChevronDown, CheckCircle2 } from "lucide-react";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { toast } from "react-toastify";

const CATEGORIES = ["Coding", "Lifestyle", "Cooking", "Travel", "Technology", "Health", "Education", "Fashion"];

export default function CreateBlog() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Technology");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(""); // base64 string
  const [imagePreview, setImagePreview] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef(null);

  // Guard routing - redirect to login if no auth using useEffect to prevent state update in render
  useEffect(() => {
    if (!user) {
      toast.warning("Please sign in to access the creation canvas.");
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  // Handle Drag-and-Drop events
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
      toast.error("Invalid file format. Please upload an image.");
      return;
    }

    if (file.size > 12 * 1024 * 1024) {
      toast.error("File is too large. Max size is 12MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setImage(base64String);
      setImagePreview(base64String);
      toast.success("Image uploaded successfully!");
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
      toast.error("Please specify a title for your blog post.");
      return;
    }

    if (!description.trim() || description.length < 20) {
      toast.error("Please add a description (at least 20 characters).");
      return;
    }

    try {
      setSubmitting(true);
      const response = await api.post("/api/blogs", {
        title: title.trim(),
        description: description.trim(),
        category,
        image
      });

      if (response.status === 201) {
        toast.success(response.data.message || "Blog published!");
        navigate("/");
      }
    } catch (err) {
      console.error("Create blog error:", err);
      toast.error(err.response?.data?.error || "Could not publish blog post.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8" id="create-blog-screen">
      
      {/* Title segment */}
      <div className="space-y-2">
        <h1 className="font-display font-black text-3xl sm:text-4xl text-brown-900 dark:text-white flex items-center space-x-2">
          <Feather className="h-8 w-8 text-peach-555" />
          <span>Publish a Mural</span>
        </h1>
        <p className="text-sm text-brown-605 dark:text-brown-300">
          Combine words and images to share your thoughts, cooking recipes, coding blueprints, or travel diaries with the world.
        </p>
      </div>

      {/* Form Canvas */}
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
            placeholder="e.g., 10 Tips for Mindful Cooking with Fresh Peaches"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-base sm:text-lg font-semibold px-4 py-3 bg-peach-50/20 dark:bg-brown-900/40 rounded-xl border border-peach-200 dark:border-brown-700 text-brown-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-peach-500 placeholder-brown-400"
          />
        </div>

        {/* Category Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-brown-600 dark:text-peach-200">
              Category
            </label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-peach-50/20 dark:bg-brown-900/40 rounded-xl border border-peach-200 dark:border-brown-700 text-brown-800 dark:text-brown-100 focus:outline-none focus:ring-2 focus:ring-peach-500 appearance-none font-medium cursor-pointer"
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

          {/* Author information display */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-brown-600 dark:text-peach-200">
              Author
            </label>
            <div className="px-4 py-3 bg-brown-50 dark:bg-brown-900/60 rounded-xl border border-peach-100/55 dark:border-brown-800/80 text-brown-800 dark:text-brown-200 text-sm font-semibold flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              <span>{user.name}</span>
            </div>
          </div>
        </div>

        {/* Drag and Drop File Selector - complying with specific usability patterns */}
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
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-3 ${
                dragActive 
                  ? "border-peach-500 bg-peach-100/50 dark:bg-brown-850" 
                  : "border-peach-200 dark:border-brown-750 bg-peach-5/10 dark:bg-brown-900/10 hover:border-peach-400 hover:bg-peach-50/30"
              }`}
            >
              <div className="p-3 bg-peach-100 dark:bg-brown-800 rounded-full text-peach-600 shadow-sm">
                <Upload className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-brown-800 dark:text-peach-100">
                  Drag and drop cover image here, or <span className="text-peach-600 hover:underline">browse files</span>
                </p>
                <p className="text-xs text-brown-505 dark:text-brown-400">
                  PNG, JPG, JPEG, GIF or WEBP (Max size: 12MB)
                </p>
              </div>
            </div>
          ) : (
            <div className="relative rounded-xl overflow-hidden aspect-video bg-peach-55 dark:bg-brown-900 border border-peach-150 dark:border-brown-800 group">
              <img 
                src={imagePreview} 
                alt="Upload preview" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3">
                <button 
                  type="button"
                  onClick={triggerFileSelect}
                  className="px-4 py-2 bg-white text-brown-850 hover:bg-peach-50 text-xs font-bold rounded-lg shadow transition"
                >
                  Change Photo
                </button>
                <button 
                  type="button"
                  onClick={clearImage}
                  className="p-2.5 bg-red-650 hover:bg-red-750 text-white rounded-lg shadow transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="absolute top-3 left-3 flex items-center space-x-1.5 bg-emerald-500 text-white px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow">
                <CheckCircle2 className="h-3 w-3" />
                <span>Ready to upload</span>
              </div>
            </div>
          )}
        </div>

        {/* Blog description text editor area */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-brown-600 dark:text-peach-200">
            Blog Content (Rich Markdown Supported)
          </label>
          <textarea 
            required
            rows={12}
            placeholder="Type your story, guidelines, recipe code, tutorial logs, and details here..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-4 bg-peach-5/10 dark:bg-brown-900/30 rounded-xl border border-peach-200 dark:border-brown-700 text-brown-855 dark:text-white focus:outline-none focus:ring-2 focus:ring-peach-500 placeholder-brown-400 min-h-[300px] leading-relaxed"
          />
        </div>

        {/* Buttons drawer */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-peach-100 dark:border-brown-800 font-sans">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="px-5 py-2.5 bg-brown-50 dark:bg-brown-800 hover:bg-brown-100 text-brown-700 dark:text-peach-100 font-semibold rounded-xl text-sm transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-peach-550 border border-peach-peach hover:bg-peach-600 text-white font-bold rounded-xl text-sm shadow hover:shadow-md transition disabled:opacity-50 hover:-translate-y-0.5 cursor-pointer flex items-center space-x-1.5 pb-2.5 pt-2"
          >
            <Feather className="h-4.5 w-4.5" />
            <span>{submitting ? "Publishing Mural..." : "Publish Mural"}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
