import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Zap } from "lucide-react";
import api from "../utils/axios";
import { addUser } from "../store/userSlice";

const getErrorMessage = (data) =>
  typeof data === "string"
    ? data.replace(/^ERROR\s*:\s*/, "")
    : data?.message || "Something went wrong. Please try again.";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleDemoLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await api.post("/login", { emailId: "arjun.mehta@seed.dev", password: "demo123" });
      const res = await api.get("/profile/view");
      dispatch(addUser(res.data));
      navigate("/");
    } catch (err) {
      setError(getErrorMessage(err.response?.data));
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/login", { emailId, password });
      const res = await api.get("/profile/view");
      dispatch(addUser(res.data));
      navigate("/");
    } catch (err) {
      setError(getErrorMessage(err.response?.data));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-md rounded-3xl p-8 transform transition-all hover:scale-[1.01] duration-500 relative z-10">

        <div className="text-center mb-6">
          <h2 className="text-4xl font-black mb-2 tracking-tight">Welcome Back</h2>
          <p className="text-base-content/60 font-medium">Log in to sync your skills and connect.</p>
        </div>

        {/* 1-Click Demo Login */}
        <div className="mb-6">
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-primary/20 to-secondary/20 hover:from-amber-500/30 hover:via-primary/30 hover:to-secondary/30 border border-amber-500/30 hover:border-amber-400 text-white font-bold flex items-center justify-center gap-2.5 shadow-lg shadow-primary/10 transition-all transform hover:scale-[1.01] active:scale-[0.99] group"
          >
            <Zap size={18} className="text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-bold tracking-wide">1-Click Demo Login</span>
            <span className="badge badge-warning text-[10px] font-black uppercase tracking-wider px-2 py-0.5">Instant</span>
          </button>
          <div className="flex items-center gap-3 my-4">
            <div className="h-px bg-white/10 flex-1" />
            <span className="text-[11px] uppercase tracking-wider text-white/30 font-semibold">Or with password</span>
            <div className="h-px bg-white/10 flex-1" />
          </div>
        </div>

        {error && (
          <div role="alert" className="flex items-center gap-3 p-3.5 mb-6 rounded-xl border border-rose-500/30 bg-rose-500/15 text-rose-200 animate-in fade-in slide-in-from-top-2 shadow-lg shadow-rose-950/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-rose-400 shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span className="text-sm font-semibold text-rose-200">{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
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
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

          </div>

          <button
            type="submit"
            className="btn animated-gradient-btn w-full rounded-xl mt-2 text-base h-12 border-0 shadow-lg"
            disabled={loading}
          >
            {loading && <span className="loading loading-spinner"></span>}
            {loading ? "Authenticating…" : "Login to your account"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm font-medium text-base-content/70">
          New to SkillSync?{" "}
          <Link to="/signup" className="link link-primary font-bold hover:text-primary/80 transition-colors ml-1">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
