import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon, Menu, X, Feather, LayoutDashboard, LogOut, FileText, User } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Active path highlight helper
  const isActive = (path) => {
    return location.pathname === path
      ? "text-peach-600 dark:text-peach-400 font-semibold"
      : "text-brown-700 hover:text-peach-600 dark:text-brown-200 dark:hover:text-peach-300";
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-brown-850/95 backdrop-blur-md shadow-sm border-b border-brown-300/30 transition-colors duration-300 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-peach-100 dark:bg-brown-800 rounded-xl flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-200 group-hover:shadow-[0_0_15px_rgba(255,158,125,0.7)]">
                <Feather className="h-5 w-5 text-brown-800 dark:text-peach-200 transition-transform group-hover:rotate-12 animate-logo-svg" />
              </div>
              <span className="font-display font-black text-xl sm:text-2xl tracking-tight text-brown-800 dark:text-white flex items-center">
                Peach<span className="text-peach-400">Mural</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`transition-colors duration-200 font-medium ${isActive("/")}`}>
              Home
            </Link>
            <Link to="/blogs" className={`transition-colors duration-200 font-medium ${isActive("/blogs")}`}>
              Blogs
            </Link>
            <Link to="/about" className={`transition-colors duration-200 font-medium ${isActive("/about")}`}>
              About
            </Link>

            {user ? (
              <div className="flex items-center space-x-4 border-l border-brown-300/30 pl-4">
                <Link 
                  to="/dashboard" 
                  className={`flex items-center space-x-1 transition-colors duration-200 font-medium ${isActive("/dashboard")}`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <Link 
                  to="/create" 
                  className="px-4 py-2 bg-brown-800 hover:bg-brown-900 border border-brown-700/20 text-peach-100 dark:bg-peach-400 dark:hover:bg-peach-550 dark:text-brown-900 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-1"
                >
                  <Feather className="h-4 w-4" />
                  <span className="font-semibold text-sm">Write Blog</span>
                </Link>
                
                {/* User Dropdown/Identifier */}
                <div className="flex items-center space-x-2 bg-peach-100/10 dark:bg-brown-800/10 rounded-full border border-peach-100/40 dark:border-brown-300/40 px-3 py-1.5 text-brown-800 dark:text-peach-100">
                  <div className="w-6 h-6 rounded-full bg-brown-300 dark:bg-brown-700 flex items-center justify-center text-[10px] text-white font-bold uppercase shrink-0">
                    {user.name.substring(0, 2)}
                  </div>
                  <span className="text-sm font-semibold max-w-[120px] truncate">
                    {user.name}
                  </span>
                </div>

                <button 
                  onClick={handleLogout}
                  className="p-2 text-brown-350 hover:text-red-500 transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3 border-l border-brown-300/30 pl-4">
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-brown-500 hover:text-peach-400 dark:text-brown-200 dark:hover:text-peach-300 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="px-4 py-2 bg-brown-800 hover:bg-brown-900 text-peach-100 rounded-lg font-medium transition-colors shadow"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Dark Mode Switcher */}
            <button
              onClick={toggleTheme}
              className="p-2 bg-brown-100 dark:bg-brown-800 hover:bg-peach-100 dark:hover:bg-brown-700 rounded-full text-brown-500 dark:text-peach-200 transition-all duration-150 shadow-inner cursor-pointer"
              aria-label="Toggle Theme"
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile Right Bar */}
          <div className="flex md:hidden items-center space-x-3">
            {/* Dark Mode Switcher (always visible) */}
            <button
              onClick={toggleTheme}
              className="p-2 bg-brown-100 dark:bg-brown-800 rounded-full text-brown-700 dark:text-peach-200"
              aria-label="Toggle Theme"
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-brown-700 dark:text-brown-200 hover:bg-brown-100 dark:hover:bg-brown-800 rounded-md"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-brown-300/30 bg-white dark:bg-brown-900 transition-colors duration-300">
          <div className="px-2 pt-2 pb-4 space-y-1">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-md font-medium ${isActive("/")}`}
            >
              Home
            </Link>
            <Link
              to="/blogs"
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-md font-medium ${isActive("/blogs")}`}
            >
              Blogs
            </Link>
            <Link
              to="/about"
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-md font-medium ${isActive("/about")}`}
            >
              About
            </Link>

            {user ? (
              <div className="pt-2 border-t border-brown-300/30 mt-2 space-y-1">
                <div className="px-3 py-2 text-xs font-semibold text-brown-500 uppercase">
                  User: {user.name}
                </div>
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md font-medium ${isActive("/dashboard")}`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/create"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 bg-brown-800 text-peach-100 dark:bg-peach-400 dark:text-brown-900 font-semibold rounded-md text-center shadow-sm"
                >
                  Write Blog
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-3 py-2 text-red-500 font-medium hover:bg-red-50 dark:hover:bg-red-950/20 rounded-md cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-brown-300/30 mt-2 flex flex-col space-y-2 px-3">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center py-2 border border-brown-300/30 rounded-md text-brown-700 dark:text-brown-200"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center py-2 bg-brown-800 text-peach-100 rounded-md font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
