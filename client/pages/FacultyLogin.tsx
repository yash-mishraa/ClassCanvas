import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users } from "lucide-react";

export default function FacultyLogin() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [departmentCode, setDepartmentCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (isSignUp && !departmentCode) {
      setError("Department code is required");
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const endpoint = isSignUp ? "/api/auth/faculty/signup" : "/api/auth/faculty/login";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          ...(isSignUp && { departmentCode }),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Authentication failed");
        return;
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", "faculty");
      navigate("/faculty/dashboard");
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-slate-800/50 backdrop-blur border border-purple-500/20 rounded-2xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="p-2 bg-purple-600/10 rounded-lg">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              ClassCanvas
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-center mb-2 text-purple-400">
            Faculty Portal
          </h1>
          <p className="text-center text-slate-400 mb-8">
            {isSignUp ? "Create your account" : "Sign in to your account"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="your@email.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="••••••••"
              />
            </div>

            {/* Department Code (Sign Up) */}
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Department Code
                </label>
                <input
                  type="text"
                  value={departmentCode}
                  onChange={(e) => setDepartmentCode(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="e.g., CSE001"
                />
              </div>
            )}

            {/* Confirm Password (Sign Up) */}
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Submit button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-purple-600/30"
            >
              {loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
            </motion.button>
          </form>

          {/* Toggle sign up/in */}
          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError("");
                }}
                className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </div>

          {/* Back to home */}
          <div className="mt-6 pt-6 border-t border-slate-700">
            <Link
              to="/"
              className="text-slate-400 hover:text-slate-300 text-sm text-center block transition-colors"
            >
              ← Back to ClassCanvas
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
