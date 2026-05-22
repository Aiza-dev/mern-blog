import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Feather, Code, Heart, Coffee, Utensils, Compass, Cpu, HeartPulse, BookOpen, Shirt, FileText } from "lucide-react";
import api from "../services/api.js";
import BlogCard from "../components/BlogCard.jsx";
import Loader from "../components/Loader.jsx";
import { toast } from "react-toastify";

const CATEGORIES = [
  { name: "Coding", icon: Code, color: "text-blue-500 bg-blue-50 dark:bg-blue-950/20" },
  { name: "Lifestyle", icon: Coffee, color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20" },
  { name: "Cooking", icon: Utensils, color: "text-amber-500 bg-amber-50 dark:bg-amber-950/20" },
  { name: "Travel", icon: Compass, color: "text-teal-500 bg-teal-50 dark:bg-teal-950/20" },
  { name: "Technology", icon: Cpu, color: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20" },
  { name: "Health", icon: HeartPulse, color: "text-rose-500 bg-rose-50 dark:bg-rose-950/20" },
  { name: "Education", icon: BookOpen, color: "text-purple-500 bg-purple-50 dark:bg-purple-950/20" },
  { name: "Fashion", icon: Shirt, color: "text-pink-500 bg-pink-50 dark:bg-pink-950/20" },
];

export default function Home() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering & search
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const fetchBlogs = async () => {
    try {
      const response = await api.get("/api/blogs");
      if (response.data && response.data.blogs) {
        setBlogs(response.data.blogs);
      }
    } catch (err) {
      console.error("Error fetching blogs:", err);
      toast.error("Could not load blog feed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleChipClick = (catName) => {
    if (selectedCategory === catName) {
      setSelectedCategory("All"); // Toggle back
    } else {
      setSelectedCategory(catName);
    }
  };

  // Filter clientside based on parameters
  const filteredBlogs = blogs.filter(blog => {
    const matchesCategory = selectedCategory === "All" || blog.category.toLowerCase() === selectedCategory.toLowerCase();
    const query = searchTerm.toLowerCase();
    const matchesSearch = 
      blog.title.toLowerCase().includes(query) || 
      blog.description.toLowerCase().includes(query) ||
      blog.authorName.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-12">
      {/* 1. Hero Section Banner with glowing neon effect */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-peach-100 to-brown-100 dark:from-brown-850 dark:to-brown-950 border border-peach-200 dark:border-brown-850 p-8 sm:p-12 lg:p-16 shadow-md neon-hover group cursor-pointer transition-colors duration-300">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-peach-200/20 via-transparent to-transparent pointer-events-none"></div>
        <div className="max-w-3xl relative z-10 space-y-6 font-sans">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-peach-200/50 dark:bg-brown-800 rounded-full text-xs font-semibold text-peach-700 dark:text-peach-300">
            <Feather className="h-3 w-3 animate-bounce" />
            <span>Discover local masteries & narratives</span>
          </span>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-brown-900 dark:text-white leading-tight">
            Write, Explore & <span className="text-peach-600 dark:text-peach-400 group-hover:underline dec-peach-400">Share</span> Earthen Wisdom.
          </h1>
          <p className="text-base sm:text-lg text-brown-700 dark:text-brown-200 max-w-2xl leading-relaxed">
            Welcome to <span className="font-semibold text-brown-800 dark:text-peach-100">PeachMural</span>. A professional repository where tech meets food, code meets travel, and lifestyle meets aesthetics. Share draft templates, ideas and published murals in minutes.
          </p>
          <div className="pt-4 flex flex-wrap gap-4">
            <Link 
              to="/create" 
              className="px-6 py-3 bg-peach-550 border border-peach-600 hover:bg-peach-600 text-white rounded-xl shadow-lg hover:shadow-peach-300/30 font-semibold transition-all duration-200 hover:-translate-y-0.5 flex items-center space-x-2 cursor-pointer"
            >
              <Feather className="h-5 w-5 animate-logo-svg" />
              <span>Write Blog</span>
            </Link>
            <Link 
              to="/blogs" 
              className="px-6 py-3 bg-white dark:bg-brown-800 hover:bg-brown-100 dark:hover:bg-brown-700 text-brown-800 dark:text-white border border-peach-200 dark:border-brown-700 font-semibold rounded-xl shadow-sm transition-all duration-200 hover:-translate-y-0.5"
            >
              Explore All Articles
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Search & Category Filters Row */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 font-sans">
          <div>
            <h2 className="font-display font-bold text-2xl text-brown-805 dark:text-white">
              Explore Popular Categories
            </h2>
            <p className="text-sm text-brown-555 dark:text-brown-400">
              Filter blogs by clicking category tags or search by titles, authors, descriptions.
            </p>
          </div>

          {/* Search bar integration */}
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brown-405 h-5 w-5" />
            <input 
              type="text"
              placeholder="Search title, author, description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-brown-850 rounded-xl border border-peach-200 dark:border-brown-700 text-brown-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-peach-500 text-sm shadow-sm transition-colors"
            />
          </div>
        </div>

        {/* Category tags row */}
        <div className="flex flex-wrap gap-2.5 font-sans">
          <button 
            onClick={() => setSelectedCategory("All")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-150 cursor-pointer ${
              selectedCategory === "All"
                ? "bg-brown-800 text-white border-brown-700 dark:bg-peach-555 dark:border-peach-400"
                : "bg-white dark:bg-brown-850 text-brown-700 dark:text-brown-300 border-peach-150 dark:border-brown-800 hover:bg-peach-50/55 dark:hover:bg-brown-800"
            }`}
          >
            All Categories
          </button>
          
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.name;

            return (
              <button 
                key={cat.name}
                onClick={() => handleChipClick(cat.name)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-150 flex items-center space-x-1.5 cursor-pointer ${
                  isSelected
                    ? "bg-peach-550 border-peach-600 text-white shadow-sm"
                    : "bg-white dark:bg-brown-850 text-brown-700 dark:text-brown-300 border-peach-150 dark:border-brown-800 hover:bg-peach-50/55 dark:hover:bg-brown-800"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isSelected ? "text-white" : cat.color.split(" ")[0]}`} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Blog Cards Grid */}
      <section className="space-y-6">
        <div className="flex justify-between items-center font-sans">
          <h3 className="font-display font-medium text-lg text-brown-800 dark:text-peach-250 uppercase tracking-widest flex items-center space-x-2">
            <span>Recent Murals</span>
            <span className="h-1.5 w-1.5 bg-peach-500 rounded-full"></span>
            <span className="text-xs font-mono font-normal tracking-normal text-brown-400 capitalize">
              ({filteredBlogs.length} shown)
            </span>
          </h3>
        </div>

        {loading ? (
          <Loader />
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-brown-850 rounded-2xl border border-dashed border-peach-200 dark:border-brown-800 p-8 space-y-4 font-sans">
            <div className="p-4 bg-peach-100 dark:bg-brown-800 text-peach-500 dark:text-peach-350 rounded-full inline-block">
              <FileText className="h-8 w-8" />
            </div>
            <h4 className="font-display font-bold text-lg text-brown-800 dark:text-white">No columns matched your filters</h4>
            <p className="text-sm text-brown-500 dark:text-brown-400 max-w-md mx-auto">
              We couldn't find any articles matching your search or category specifications. Try resetting filters or write the very first one!
            </p>
            <button 
              onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }}
              className="text-xs font-bold text-peach-600 dark:text-peach-400 hover:underline cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredBlogs.map((blog) => (
              <BlogCard key={blog.id || blog._id} blog={blog} onUpdate={fetchBlogs} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
