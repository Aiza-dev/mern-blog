import { useEffect, useState } from "react";
import { Search, SlidersHorizontal, Grid, FileText, ChevronDown } from "lucide-react";
import api from "../services/api.js";
import BlogCard from "../components/BlogCard.jsx";
import Loader from "../components/Loader.jsx";
import { toast } from "react-toastify";

const CATEGORIES = ["All", "Coding", "Lifestyle", "Cooking", "Travel", "Technology", "Health", "Education", "Fashion"];

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering & search
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest"); // newest, oldest, popular

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/blogs");
      if (response.data && response.data.blogs) {
        setBlogs(response.data.blogs);
      }
    } catch (err) {
      console.error("Error fetching blogs:", err);
      toast.error("Could not fetch blogs list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Filter & sort logic
  const filteredAndSortedBlogs = blogs
    .filter((blog) => {
      const matchesCategory = selectedCategory === "All" || blog.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch = 
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.authorName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === "popular") {
        // Sort by likes length
        return (b.likes || []).length - (a.likes || []).length;
      }
      return 0;
    });

  return (
    <div className="space-y-8" id="blogs-index-screen font-sans">
      {/* Header Summary */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-brown-850 dark:text-white">
          The Mural Feed
        </h1>
        <p className="text-sm sm:text-base text-brown-605 dark:text-brown-300">
          Browse the complete collective of articles. Filter by your topics of interest or sort to see popular and newly published murals.
        </p>
      </div>

      {/* Control center - filters, sort list, search bar with hover glow */}
      <div className="bg-white dark:bg-brown-850 p-4 rounded-xl shadow-sm border border-peach-200 dark:border-brown-800/80 transition-colors duration-300 neon-hover cursor-pointer">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          
          {/* Search box (Col: 5) */}
          <div className="relative md:col-span-5">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brown-405 h-4.5 w-4.5" />
            <input 
              type="text"
              placeholder="Search title, author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-peach-55/40 dark:bg-brown-900/40 rounded-lg border border-peach-150 dark:border-brown-700 text-brown-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-peach-550 text-sm"
            />
          </div>

          {/* Category Dropdown (Col: 3) */}
          <div className="relative md:col-span-3">
            <div className="flex items-center space-x-1">
              <span className="text-xs font-bold text-brown-500 uppercase hidden sm:inline">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-peach-55/40 dark:bg-brown-900/40 border border-peach-150 dark:border-brown-700 text-brown-700 dark:text-brown-200 text-sm rounded-lg p-2 focus:ring-1 focus:ring-peach-500 focus:outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "All" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sort Menu (Col: 2) */}
          <div className="relative md:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-peach-55/40 dark:bg-brown-900/40 border border-peach-150 dark:border-brown-700 text-brown-700 dark:text-brown-200 text-sm rounded-lg p-2 focus:ring-1 focus:ring-peach-500 focus:outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="popular">Popular Articles</option>
            </select>
          </div>

          {/* Meta detail (Col: 2) */}
          <div className="md:col-span-2 text-right">
            <span className="text-xs font-semibold text-brown-500 dark:text-brown-400 block pb-1">
              {filteredAndSortedBlogs.length} results
            </span>
          </div>

        </div>
      </div>

      {/* Grid listing */}
      {loading ? (
        <Loader />
      ) : filteredAndSortedBlogs.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-brown-850 rounded-xl border border-peach-100 dark:border-brown-800 p-8 space-y-4">
          <FileText className="h-10 w-10 text-brown-400 dark:text-brown-500 mx-auto" />
          <h3 className="font-display font-semibold text-lg text-brown-800 dark:text-white">
            No columns match your criteria
          </h3>
          <p className="text-sm text-brown-655 dark:text-brown-400 max-w-sm mx-auto">
            Try adjusting your search queries, choosing a different category chip, or reset parameters.
          </p>
          <button 
            onClick={() => { setSearchTerm(""); setSelectedCategory("All"); setSortBy("newest"); }}
            className="px-4 py-2 bg-peach-100 text-peach-700 hover:bg-peach-200 rounded-lg text-xs font-bold transition-all cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredAndSortedBlogs.map((blog) => (
            <BlogCard key={blog.id || blog._id} blog={blog} onUpdate={fetchBlogs} />
          ))}
        </div>
      )}
    </div>
  );
}
