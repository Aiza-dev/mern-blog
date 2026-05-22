import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Determine if we are using Real MongoDB
const MONGO_URI = process.env.MONGODB_URI || "";
let isMongoConnected = false;

// Local JSON File Database path
const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "blog_db.json");

// Ensure the data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial seed blogs to make the platform beautiful and functional right away
const SEED_BLOGS = [
  {
    id: "seed-1",
    _id: "seed-1",
    title: "Mastering TypeScript: 5 Advanced Concepts You Should Know",
    authorName: "Sarah Chen",
    authorId: "seed-user-1",
    description: "TypeScript has become the de facto standard for building large-scale web applications. In this article, we dive deep into advanced structural elements like mapped types, conditional types, template literal types, and type guards. These techniques will help you write extremely type-safe and modular code.",
    category: "Coding",
    imageUrl: "https://images.unsplash.com/photo-1516116211223-5c359a36298a?auto=format&fit=crop&q=80&w=1000",
    likes: ["seed-user-2", "seed-user-3"],
    comments: [
      {
        id: "comment-1",
        _id: "comment-1",
        blogId: "seed-1",
        userId: "seed-user-2",
        userName: "Alex Rivers",
        userEmail: "alex@example.com",
        content: "This is a fantastic breakdown! Understood conditional types finally.",
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      }
    ],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "seed-2",
    _id: "seed-2",
    title: "A Minimalist's Guide to Digital Wellness & Work-Life Sync",
    authorName: "Marcus Thorne",
    authorId: "seed-user-2",
    description: "In an era of hyper-connectivity, our attention has become our most precious commodity. This article explores practical systems to reduce digital clutter, master deep work intervals, and build mindful screen time habits that prioritize real life connection without sacrificing professional performance.",
    category: "Lifestyle",
    imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1000",
    likes: ["seed-user-1"],
    comments: [],
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: "seed-3",
    _id: "seed-3",
    title: "The Alchemy of Sourdough: Mastering Bread at Home",
    authorName: "Elena Rostova",
    authorId: "seed-user-3",
    description: "Baking sourdough bread is equal parts art and science. From cultivating your initial wild yeast starter to understanding dough hydration levels and orchestrating oven steam, we explain the step-by-step physics of baking the perfect, gold-crusted rustic loaf from your home oven.",
    category: "Cooking",
    imageUrl: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&q=80&w=1000",
    likes: ["seed-user-1", "seed-user-2"],
    comments: [
      {
        id: "comment-2",
        _id: "comment-2",
        blogId: "seed-3",
        userId: "seed-user-1",
        userName: "Sarah Chen",
        userEmail: "sarah@example.com",
        content: "Made my first loaf following this guide – the crust was absolutely golden!",
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      }
    ],
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: "seed-4",
    _id: "seed-4",
    title: "Hidden Trails of Kyoto: Exploring Japan Outside the Guidebooks",
    authorName: "Sarah Chen",
    authorId: "seed-user-1",
    description: "Kyoto is famous for its crowded temples, but the true spirit of the ancient capital lives in its moss-covered mountain shrines, early morning bamboo groves, and neighborhood teahouses. Walk through quiet local alleys and explore bamboo trails away from the standard tourist clusters.",
    category: "Travel",
    imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=1000",
    likes: ["seed-user-3"],
    comments: [],
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
  {
    id: "seed-5",
    _id: "seed-5",
    title: "The Future of Web Systems: Edge Computing & Serverless Storage",
    authorName: "Alex Rivers",
    authorId: "seed-user-2",
    description: "Where is web computing headed next? We analysis the intersection of edge runtimes and global serverless databases. Discover how moving compute boundaries directly to CDN edges reduces network latency to single-digit milliseconds and creates highly responsive application states globally.",
    category: "Technology",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000",
    likes: [],
    comments: [],
    createdAt: new Date(Date.now() - 86400000 * 9).toISOString(),
  }
];

// Initialize local database JSON file with seed data
function initLocalDbFile() {
  if (!fs.existsSync(DB_FILE)) {
    const initialData = {
      users: [
        { id: "seed-user-1", name: "Sarah Chen", email: "sarah@example.com", createdAt: new Date().toISOString() },
        { id: "seed-user-2", name: "Alex Rivers", email: "alex@example.com", createdAt: new Date().toISOString() },
        { id: "seed-user-3", name: "Elena Rostova", email: "elena@example.com", createdAt: new Date().toISOString() }
      ],
      blogs: SEED_BLOGS
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), "utf8");
    console.log("Local JSON Database initialized at:", DB_FILE);
  }
}

initLocalDbFile();

// Read all standard data from the JSON file
function readLocalDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      initLocalDbFile();
    }
    const content = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(content);
  } catch (err) {
    console.error("Error reading local DB file, returning empty structure:", err);
    return { users: [], blogs: [] };
  }
}

// Write standard data back to the JSON file
function writeLocalDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing to local DB file:", err);
  }
}

// Mongoose Schemas (Only declared and compiled if we can connect)
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const CommentSchema = new mongoose.Schema({
  blogId: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  authorName: { type: String, required: true },
  authorId: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String, required: true },
  likes: [{ type: String }],
  comments: [CommentSchema],
  createdAt: { type: Date, default: Date.now }
});

let UserModel;
let BlogModel;

// Try connecting to MongoDB
export async function connectDatabase() {
  if (!MONGO_URI) {
    console.log("No MONGODB_URI found in environment. Running full-fidelity local sandboxed storage.");
    return;
  }
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(MONGO_URI);
    isMongoConnected = true;
    console.log("🚀 Custom Database Service connected to MongoDB successfully!");
    
    // Set Models
    UserModel = mongoose.models.User || mongoose.model("User", UserSchema);
    BlogModel = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
  } catch (err) {
    console.error("❌ MongoDB Connection failed. Switching to high-fidelity local sandbox file storage.", err);
    isMongoConnected = false;
  }
}

// --- DATABASE SERVICE API REPRESENTING UNIFIED CRUD ---
export const dbService = {
  // Check connection status
  isUsingMongo: () => isMongoConnected,

  // --- USERS SERVICE ---
  async getUsers() {
    if (isMongoConnected) {
      const users = await UserModel.find({});
      return users.map(u => ({ id: u._id.toString(), name: u.name, email: u.email, createdAt: u.createdAt }));
    } else {
      const db = readLocalDb();
      return db.users;
    }
  },

  async getUserByEmail(email) {
    if (isMongoConnected) {
      const user = await UserModel.findOne({ email });
      if (!user) return null;
      return { id: user._id.toString(), name: user.name, email: user.email, password: user.password, createdAt: user.createdAt };
    } else {
      const db = readLocalDb();
      const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      return user || null;
    }
  },

  async getUserById(id) {
    if (isMongoConnected) {
      if (!mongoose.Types.ObjectId.isValid(id)) return null;
      const user = await UserModel.findById(id);
      if (!user) return null;
      return { id: user._id.toString(), name: user.name, email: user.email, createdAt: user.createdAt };
    } else {
      const db = readLocalDb();
      const user = db.users.find((u) => u.id === id);
      return user || null;
    }
  },

  async createUser(userData) {
    if (isMongoConnected) {
      const user = await UserModel.create({
        name: userData.name,
        email: userData.email,
        password: userData.password,
      });
      return { id: user._id.toString(), name: user.name, email: user.email, createdAt: user.createdAt };
    } else {
      const db = readLocalDb();
      const newUser = {
        id: "user-" + Math.random().toString(36).substring(2, 9),
        name: userData.name,
        email: userData.email,
        password: userData.password,
        createdAt: new Date().toISOString()
      };
      db.users.push(newUser);
      writeLocalDb(db);
      return { id: newUser.id, name: newUser.name, email: newUser.email, createdAt: newUser.createdAt };
    }
  },

  // --- BLOGS SERVICE ---
  async getBlogs() {
    if (isMongoConnected) {
      const blogs = await BlogModel.find({}).sort({ createdAt: -1 });
      return blogs.map((b) => ({
        id: b._id.toString(),
        _id: b._id.toString(),
        title: b.title,
        authorName: b.authorName,
        authorId: b.authorId,
        description: b.description,
        category: b.category,
        imageUrl: b.imageUrl,
        likes: b.likes || [],
        comments: b.comments || [],
        createdAt: b.createdAt.toISOString()
      }));
    } else {
      const db = readLocalDb();
      // Sort modern first
      return [...db.blogs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  },

  async getBlogById(id) {
    if (isMongoConnected) {
      if (!mongoose.Types.ObjectId.isValid(id)) return null;
      const b = await BlogModel.findById(id);
      if (!b) return null;
      return {
        id: b._id.toString(),
        _id: b._id.toString(),
        title: b.title,
        authorName: b.authorName,
        authorId: b.authorId,
        description: b.description,
        category: b.category,
        imageUrl: b.imageUrl,
        likes: b.likes || [],
        comments: b.comments || [],
        createdAt: b.createdAt.toISOString()
      };
    } else {
      const db = readLocalDb();
      const blog = db.blogs.find((b) => b.id === id || b._id === id);
      return blog || null;
    }
  },

  async createBlog(blogData) {
    if (isMongoConnected) {
      const b = await BlogModel.create({
        ...blogData,
        likes: [],
        comments: []
      });
      return {
        id: b._id.toString(),
        _id: b._id.toString(),
        title: b.title,
        authorName: b.authorName,
        authorId: b.authorId,
        description: b.description,
        category: b.category,
        imageUrl: b.imageUrl,
        likes: b.likes,
        comments: b.comments,
        createdAt: b.createdAt.toISOString()
      };
    } else {
      const db = readLocalDb();
      const id = "blog-" + Math.random().toString(36).substring(2, 9);
      const newBlog = {
        ...blogData,
        id,
        _id: id,
        likes: [],
        comments: [],
        createdAt: new Date().toISOString()
      };
      db.blogs.push(newBlog);
      writeLocalDb(db);
      return newBlog;
    }
  },

  async updateBlog(id, blogData) {
    if (isMongoConnected) {
      if (!mongoose.Types.ObjectId.isValid(id)) return null;
      const b = await BlogModel.findByIdAndUpdate(id, { $set: blogData }, { new: true });
      if (!b) return null;
      return {
        id: b._id.toString(),
        _id: b._id.toString(),
        title: b.title,
        authorName: b.authorName,
        authorId: b.authorId,
        description: b.description,
        category: b.category,
        imageUrl: b.imageUrl,
        likes: b.likes,
        comments: b.comments,
        createdAt: b.createdAt.toISOString()
      };
    } else {
      const db = readLocalDb();
      const idx = db.blogs.findIndex((b) => b.id === id || b._id === id);
      if (idx === -1) return null;
      db.blogs[idx] = { ...db.blogs[idx], ...blogData };
      writeLocalDb(db);
      return db.blogs[idx];
    }
  },

  async deleteBlog(id) {
    if (isMongoConnected) {
      if (!mongoose.Types.ObjectId.isValid(id)) return false;
      const result = await BlogModel.findByIdAndDelete(id);
      return !!result;
    } else {
      const db = readLocalDb();
      const originalLength = db.blogs.length;
      db.blogs = db.blogs.filter((b) => b.id !== id && b._id !== id);
      writeLocalDb(db);
      return db.blogs.length < originalLength;
    }
  },

  // --- LIKES OPERATION ---
  async toggleLikeBlog(blogId, userId) {
    if (isMongoConnected) {
      if (!mongoose.Types.ObjectId.isValid(blogId)) return [];
      const blog = await BlogModel.findById(blogId);
      if (!blog) return [];
      
      const likesList = blog.likes || [];
      const index = likesList.indexOf(userId);
      if (index === -1) {
        likesList.push(userId);
      } else {
        likesList.splice(index, 1);
      }
      
      blog.likes = likesList;
      await blog.save();
      return blog.likes;
    } else {
      const db = readLocalDb();
      const blog = db.blogs.find((b) => b.id === blogId || b._id === blogId);
      if (!blog) return [];
      
      if (!blog.likes) blog.likes = [];
      const index = blog.likes.indexOf(userId);
      if (index === -1) {
        blog.likes.push(userId);
      } else {
        blog.likes.splice(index, 1);
      }
      
      writeLocalDb(db);
      return blog.likes;
    }
  },

  // --- COMMENTS OPERATION ---
  async addComment(blogId, commentData) {
    const commentId = "comment-" + Math.random().toString(36).substring(2, 9);
    const newComment = {
      ...commentData,
      id: commentId,
      _id: commentId,
      createdAt: new Date().toISOString()
    };

    if (isMongoConnected) {
      if (!mongoose.Types.ObjectId.isValid(blogId)) throw new Error("Invalid Blog ID");
      const blog = await BlogModel.findById(blogId);
      if (!blog) throw new Error("Blog not found");
      
      blog.comments.push({
        // _id: commentId,
        blogId,
        userId: commentData.userId,
        userName: commentData.userName,
        userEmail: commentData.userEmail,
        content: commentData.content,
        createdAt: new Date()
      });
      await blog.save();
      return newComment;
    } else {
      const db = readLocalDb();
      const blog = db.blogs.find((b) => b.id === blogId || b._id === blogId);
      if (!blog) throw new Error("Blog not found");
      
      if (!blog.comments) blog.comments = [];
      blog.comments.push(newComment);
      writeLocalDb(db);
      return newComment;
    }
  },

  async deleteComment(blogId, commentId) {
    if (isMongoConnected) {
      if (!mongoose.Types.ObjectId.isValid(blogId)) return false;
      const blog = await BlogModel.findById(blogId);
      if (!blog) return false;
      
      const originalLength = blog.comments.length;
      blog.comments = blog.comments.filter((c) => c._id.toString() !== commentId && c.id !== commentId);
      
      if (blog.comments.length < originalLength) {
        await blog.save();
        return true;
      }
      return false;
    } else {
      const db = readLocalDb();
      const blog = db.blogs.find((b) => b.id === blogId || b._id === blogId);
      if (!blog) return false;
      
      if (!blog.comments) return false;
      const originalLength = blog.comments.length;
      blog.comments = blog.comments.filter((c) => c.id !== commentId && c._id !== commentId);
      
      if (blog.comments.length < originalLength) {
        writeLocalDb(db);
        return true;
      }
      return false;
    }
  },

  // --- STATISTICS FOR USER ---
  async getDashboardStats(userId) {
    const allBlogs = await this.getBlogs();
    
    // User's own blogs
    const userBlogs = allBlogs.filter(b => b.authorId === userId);
    const totalBlogs = userBlogs.length;
    
    // Total likes on user's blogs
    let totalLikes = 0;
    userBlogs.forEach(b => {
      totalLikes += (b.likes || []).length;
    });

    // Total comments on user's blogs
    let totalComments = 0;
    userBlogs.forEach(b => {
      totalComments += (b.comments || []).length;
    });

    // Build lists of comments for other people commenting on user's blogs + delete buttons
    const commentsList = [];
    userBlogs.forEach(b => {
      if (b.comments) {
        b.comments.forEach(c => {
          commentsList.push({
            commentId: c.id || c._id || "",
            blogId: b.id || b._id || "",
            blogTitle: b.title,
            userName: c.userName,
            content: c.content,
            createdAt: c.createdAt
          });
        });
      }
    });

    // Sort comments by modern first
    commentsList.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // User dashboard returns userBlogs as recentBlogs, limit 5
    const recentBlogs = userBlogs.slice(0, 5);

    return {
      totalBlogs,
      totalLikes,
      totalComments,
      recentBlogs,
      commentsList
    };
  }
};

export default dbService;
