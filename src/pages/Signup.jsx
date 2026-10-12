import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/axios";
import { addUser } from "../store/userSlice";

const getErrorMessage = (data) =>
  typeof data === "string"
    ? data.replace(/^ERROR\s*:\s*/, "")
    : data?.message || "Something went wrong. Please try again.";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/signup", { firstName, lastName, emailId, password });
      await api.post("/login", { emailId, password });
      const res = await api.get("/profile/view");
      dispatch(addUser(res.data));
      setSuccess(true);
      setTimeout(() => navigate("/profile"), 1500);
    } catch (err) {
      setError(getErrorMessage(err.response?.data));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10">
        
        <div className="text-center mb-6">
          <h2 className="text-3xl sm:text-4xl font-black mb-2 tracking-tight">Join SkillSync</h2>
          <p className="text-base-content/60 font-medium">Discover connections and grow your skills.</p>
        </div>

        {error && (
          <div role="alert" className="flex items-center gap-3 p-3.5 mb-6 rounded-xl border border-rose-500/30 bg-rose-500/15 text-rose-200 animate-in fade-in slide-in-from-top-2 shadow-lg shadow-rose-950/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-rose-400 shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span className="text-sm font-semibold text-rose-200">{error}</span>
          </div>
        )}
        
        {success && (
          <div role="alert" className="flex items-center gap-3 p-3.5 mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/15 text-emerald-200 animate-in fade-in zoom-in shadow-lg shadow-emerald-950/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-emerald-400 shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span className="text-sm font-semibold text-emerald-200">Welcome aboard! Redirecting to profile setup...</span>
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="label py-1">
                <span className="label-text font-semibold text-base-content/80">First Name</span>
              </label>
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-base-content/50">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                 </div>
                <input
                  type="text"
                  className="input input-bordered w-full pl-11 bg-base-100/50 border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all duration-300 rounded-xl"
                  placeholder="Jane"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  minLength={2}
                  maxLength={50}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="label py-1">
                <span className="label-text font-semibold text-base-content/80">Last Name</span>
              </label>
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-base-content/50">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                 </div>
                <input
                  type="text"
                  className="input input-bordered w-full pl-11 bg-base-100/50 border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all duration-300 rounded-xl"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="label py-1">
              <span className="label-text font-semibold text-base-content/80">Email Address</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-base-content/50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
              </div>
              <input
                type="email"
                className="input input-bordered w-full pl-11 bg-base-100/50 border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all duration-300 rounded-xl"
                placeholder="you@example.com"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="label py-1">
              <span className="label-text font-semibold text-base-content/80">Password</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-base-content/50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
              </div>
              <input
                type="password"
                className="input input-bordered w-full pl-11 bg-base-100/50 border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all duration-300 rounded-xl"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn animated-gradient-btn w-full rounded-xl mt-4 text-base h-12 border-0 shadow-lg"
            disabled={loading || success}
          >
            {loading && <span className="loading loading-spinner"></span>}
            {loading ? "Creating your account…" : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm font-medium text-base-content/70">
          Already have an account?{" "}
          <Link to="/login" className="link link-primary font-bold hover:text-primary/80 transition-colors ml-1">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
