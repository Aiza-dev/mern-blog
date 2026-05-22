import { Link } from "react-router-dom";
import { Feather, Facebook, Instagram, Youtube } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Footer() {
  const { user } = useAuth();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-brown-850 border-t border-brown-300/30 transition-colors duration-300 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo Brand Segment */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2 group animate-wiggle-trigger">
              <div className="w-10 h-10 bg-peach-100 dark:bg-brown-800 rounded-xl flex items-center justify-center shadow-inner group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(255,158,125,0.7)] transition-all duration-200">
                <Feather className="h-5 w-5 text-brown-800 dark:text-peach-200 transition-transform group-hover:rotate-12 animate-logo-svg" />
              </div>
              <span className="font-display font-black text-xl tracking-tight text-brown-800 dark:text-white flex items-center">
                Peach<span className="text-peach-400">Mural</span>
              </span>
            </Link>
            <p className="text-sm text-brown-600 dark:text-brown-300 max-w-sm">
              Discover stories, technical tutorials, baking ideas, and fashion inspirations colored in beautiful peach and woody earthen brown aesthetics. Write your custom journey today.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-4 pt-2">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer"
                className="p-2 bg-white dark:bg-brown-800 text-brown-600 dark:text-brown-300 hover:text-white hover:bg-peach-500 dark:hover:bg-peach-600 rounded-full transition-all duration-200 shadow-sm"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer"
                className="p-2 bg-white dark:bg-brown-800 text-brown-600 dark:text-brown-300 hover:text-white hover:bg-peach-500 dark:hover:bg-peach-600 rounded-full transition-all duration-200 shadow-sm"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noreferrer"
                className="p-2 bg-white dark:bg-brown-800 text-brown-600 dark:text-brown-300 hover:text-white hover:bg-peach-500 dark:hover:bg-peach-600 rounded-full transition-all duration-200 shadow-sm"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-brown-800 dark:text-peach-200">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-brown-600 dark:text-brown-300">
              <li>
                <Link to="/" className="hover:text-peach-600 dark:hover:text-peach-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="hover:text-peach-600 dark:hover:text-peach-400 transition-colors">
                  Blogs
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-peach-600 dark:hover:text-peach-400 transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Account Links Column */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-brown-800 dark:text-peach-200">
              Your Space
            </h4>
            <ul className="space-y-2 text-sm text-brown-600 dark:text-brown-300">
              {user ? (
                <>
                  <li>
                    <Link to="/dashboard" className="hover:text-peach-600 dark:hover:text-peach-400 transition-colors">
                      Your Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/create" className="hover:text-peach-600 dark:hover:text-peach-400 transition-colors">
                      Write a Blog
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login" className="hover:text-peach-600 dark:hover:text-peach-400 transition-colors">
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link to="/signup" className="hover:text-peach-600 dark:hover:text-peach-400 transition-colors">
                      Signup
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom copyright section */}
        <div className="border-t border-brown-300/30 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-brown-500 dark:text-brown-400 space-y-4 sm:space-y-0">
          <div>
            &copy; {currentYear} PeachMural Blog Platform. All rights reserved. Built using MERN.
          </div>
          <div className="flex space-x-6">
            <span className="hover:text-peach-600 dark:hover:text-peach-400 cursor-pointer transition-colors">
              Terms of Use
            </span>
            <span className="hover:text-peach-600 dark:hover:text-peach-400 cursor-pointer transition-colors">
              Privacy Policy
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
