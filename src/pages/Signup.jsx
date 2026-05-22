import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Mail, Lock, User, Feather, ArrowLeft } from "lucide-react";
import api from "../services/api.js";
import { toast } from "react-toastify";

export default function Signup() {
  const navigate = useNavigate();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      toast.error("Please fill in all registration fields.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Confirmation password does not match original password.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/api/auth/signup", {
        name: name.trim(),
        email: email.trim(),
        password,
        confirmPassword
      });

      if (response.status === 201) {
        toast.success(response.data.message || "Registration successful! Proceeding to Login...");
        navigate("/login");
      }
    } catch (err) {
      console.error("Signup failed:", err);
      toast.error(err.response?.data?.error || "Registration failed. Try checking your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8 font-sans" id="signup-screen">
      <div className="bg-white dark:bg-brown-850 rounded-2xl shadow-lg border border-peach-105 dark:border-brown-800 p-8 space-y-6 transition-colors duration-300 neon-hover group cursor-pointer">
        
        {/* Header brand */}
        <div className="text-center space-y-2">
          <div className="mx-auto h-12 w-12 bg-peach-100 dark:bg-brown-805 text-peach-600 rounded-xl flex items-center justify-center font-display font-black text-xl shadow-md transition-transform group-hover:scale-110">
            <Feather className="h-6 w-6 animate-logo-svg" />
          </div>
          <h2 className="font-display font-black text-2xl text-brown-850 dark:text-white">
            Create an Account
          </h2>
          <p className="text-xs text-brown-555 dark:text-brown-400">
            Publish articles, participate in discussions, and catalog murals in our peach domain.
          </p>
        </div>

        {/* Input fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* UserName */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-brown-650 dark:text-peach-200">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brown-405">
                <User className="h-4 w-4" />
              </span>
              <input 
                type="text"
                required
                placeholder="Sarah Chen"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-peach-55/10 dark:bg-brown-900/30 rounded-xl border border-peach-200 dark:border-brown-700 text-brown-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-peach-500 text-sm placeholder-brown-405"
              />
            </div>
          </div>

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
                className="w-full pl-10 pr-4 py-2 bg-peach-55/10 dark:bg-brown-900/30 rounded-xl border border-peach-200 dark:border-brown-700 text-brown-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-peach-500 text-sm placeholder-brown-405"
              />
            </div>
          </div>

          {/* Pass */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-brown-650 dark:text-peach-200">
              Password (6+ chars)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brown-405">
                <Lock className="h-4 w-4" />
              </span>
              <input 
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-peach-55/10 dark:bg-brown-900/30 rounded-xl border border-peach-200 dark:border-brown-700 text-brown-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-peach-500 text-sm placeholder-brown-405"
              />
            </div>
          </div>

          {/* Confirm pass */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-brown-650 dark:text-peach-200">
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brown-405">
                <Lock className="h-4 w-4" />
              </span>
              <input 
                type="password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-peach-55/10 dark:bg-brown-900/30 rounded-xl border border-peach-200 dark:border-brown-700 text-brown-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-peach-500 text-sm placeholder-brown-405"
              />
            </div>
          </div>

          {/* Trigger Registration */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brown-600 hover:bg-brown-700 disabled:opacity-55 text-white font-bold rounded-xl text-sm transition-all shadow shadow-peach-100/10 hover:-translate-y-0.5 flex items-center justify-center space-x-2 cursor-pointer pt-2 pb-2"
          >
            <UserPlus className="h-4 w-4" />
            <span>{loading ? "Registering account..." : "Sign Up"}</span>
          </button>
        </form>

        {/* Redirect signups */}
        <div className="text-center pt-2 border-t border-peach-100 dark:border-brown-800">
          <p className="text-xs text-brown-500 dark:text-brown-450">
            Already have an account?
          </p>
          <Link 
            to="/login" 
            className="text-xs font-bold text-peach-600 dark:text-peach-400 hover:underline inline-flex items-center space-x-1 mt-1"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Back to sign in</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
