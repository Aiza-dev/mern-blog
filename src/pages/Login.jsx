import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, Mail, Lock, Feather, ArrowRight, Eye, EyeOff } from "lucide-react";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { toast } from "react-toastify";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in both email and password fields.");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/api/auth/login", {
        email: email.trim(),
        password: password
      });

      if (response.data && response.data.token) {
        login(response.data.token, response.data.user);
        toast.success(response.data.message || "Welcome back!");
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login failure:", err);
      toast.error(err.response?.data?.error || "Invalid email or password credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8 font-sans" id="login-screen">
      <div className="bg-white dark:bg-brown-850 rounded-2xl shadow-lg border border-peach-105 dark:border-brown-800 p-8 space-y-6 transition-colors duration-300 neon-hover group cursor-pointer">
        
        {/* Title Brand */}
        <div className="text-center space-y-2">
          <div className="mx-auto h-12 w-12 bg-peach-100 dark:bg-brown-800 text-peach-600 rounded-xl flex items-center justify-center font-display font-black text-xl shadow-md transition-transform group-hover:scale-110">
            <Feather className="h-6 w-6 animate-logo-svg" />
          </div>
          <h2 className="font-display font-black text-2xl text-brown-850 dark:text-white">
            Welcome Back!
          </h2>
          <p className="text-xs text-brown-605 dark:text-brown-400">
            Sign in to write new blogs, interact with authors, and manage comments.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-brown-650 dark:text-peach-200">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brown-405">
                <Mail className="h-4 w-4" />
              </span>
              <input 
                type="email"
                required
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-peach-55/10 dark:bg-brown-900/30 rounded-xl border border-peach-200 dark:border-brown-700 text-brown-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-peach-550 text-sm placeholder-brown-405"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-brown-650 dark:text-peach-200">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brown-405">
                <Lock className="h-4 w-4" />
              </span>
              <input 
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-peach-55/10 dark:bg-brown-900/30 rounded-xl border border-peach-200 dark:border-brown-700 text-brown-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-peach-550 text-sm placeholder-brown-405"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-405 hover:text-brown-600 transition cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Submit Trigger */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-peach-550 border border-peach-650 hover:bg-peach-600 disabled:opacity-55 text-white font-bold rounded-xl text-sm transition-all shadow shadow-peach-100/20 hover:shadow-md hover:-translate-y-0.5 flex items-center justify-center space-x-2 cursor-pointer pb-2.5"
          >
            <LogIn className="h-4 w-4" />
            <span>{loading ? "Authenticating Session..." : "Sign In"}</span>
          </button>
        </form>

        {/* Redirect signups */}
        <div className="text-center pt-2 border-t border-peach-100 dark:border-brown-800">
          <p className="text-xs text-brown-500 dark:text-brown-450">
            Don't have an account on PeachMural?
          </p>
          <Link 
            to="/signup" 
            className="text-xs font-bold text-peach-600 dark:text-peach-400 hover:underline inline-flex items-center space-x-1 mt-1"
          >
            <span>Create a new account</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

      </div>
    </div>
  );
}
