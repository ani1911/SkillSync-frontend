import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Users, Globe, User as UserIcon, Settings, LogOut, Home } from "lucide-react";
import logo from "../assets/logo.png";
import api from "../utils/axios";
import { FALLBACK_AVATAR } from "../utils/constants";
import { removeUser } from "../store/userSlice";
import { setPendingCount } from "../store/requestsSlice";

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const { pendingCount } = useSelector((store) => store.requests || { pendingCount: 0 });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      api.get("/user/requests/pending")
        .then((res) => {
          dispatch(setPendingCount(res.data.count));
        })
        .catch(console.error);
    }
  }, [user, location.pathname, dispatch]);

  const handleLogout = async () => {
    try {
      await api.post("/logout");
      dispatch(removeUser());
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="navbar glass-nav sticky top-0 z-50 px-4 sm:px-8 py-3 transition-all duration-300">
      <div className="flex-1">
        <div 
          onClick={() => navigate("/")} 
          className="inline-flex items-center gap-2 cursor-pointer group"
        >
          <img
            src={logo}
            alt="skillsync-logo"
            className="w-48 sm:w-64 h-auto group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>

      {user ? (
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2">
            <Link to="/" className="px-4 py-2 text-sm font-bold text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-all flex items-center gap-2">
              <Home size={16} />
              Feed
            </Link>
            <Link to="/matches" className="px-4 py-2 text-sm font-bold text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-all flex items-center gap-2">
              <Users size={16} />
              Matches
            </Link>
            <Link to="/connections" className="px-4 py-2 text-sm font-bold text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-all flex items-center gap-2 relative">
              <Globe size={16} />
              Network
              {pendingCount > 0 && (
                <span className="absolute top-1 -right-1 bg-error text-white text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-lg border-2 border-[#1e1e24] min-w-[18px] text-center animate-pulse">
                  {pendingCount}
                </span>
              )}
            </Link>
          </div>

          <div className="hidden sm:flex flex-col items-end">
            <p className="font-semibold text-sm">{user.firstName} {user.lastName}</p>
            <p className="text-xs text-base-content/60">{user.headline || 'Member'}</p>
          </div>
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar ring ring-primary/30 ring-offset-base-100 ring-offset-2 hover:ring-primary transition-all duration-300"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="User Avatar"
                  src={user.photourl || FALLBACK_AVATAR}
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_AVATAR;
                  }}
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-300/90 backdrop-blur-xl border border-white/10 rounded-box z-1 mt-4 w-56 p-2 shadow-2xl"
            >
              <li className="menu-title px-4 py-2">
                <span className="text-xs font-bold uppercase tracking-wider text-base-content/50">Account</span>
              </li>
              <li>
                <Link to="/profile" className="hover:bg-primary/20 hover:text-primary transition-colors py-3">
                  <UserIcon size={18} className="opacity-70" />
                  Profile
                </Link>
              </li>
              <li className="md:hidden">
                <Link to="/" className="hover:bg-primary/20 hover:text-primary transition-colors py-3">
                  <Home size={18} className="opacity-70" />
                  Feed
                </Link>
              </li>
              <li className="md:hidden">
                <Link to="/matches" className="hover:bg-primary/20 hover:text-primary transition-colors py-3">
                  <Users size={18} className="opacity-70" />
                  Matches
                </Link>
              </li>
              <li className="md:hidden">
                <Link to="/connections" className="hover:bg-primary/20 hover:text-primary transition-colors py-3 relative">
                  <div className="flex items-center gap-2">
                    <Globe size={18} className="opacity-70" />
                    Network
                    {pendingCount > 0 && (
                      <span className="bg-error text-white text-[10px] font-black px-1.5 py-0.5 rounded-full ml-1">
                        {pendingCount}
                      </span>
                    )}
                  </div>
                </Link>
              </li>
              <li>
                <Link to="/settings" className="hover:bg-primary/20 hover:text-primary transition-colors py-3">
                  <Settings size={18} className="opacity-70" />
                  Settings
                </Link>
              </li>
              <div className="divider my-0 opacity-20"></div>
              <li>
                <button onClick={handleLogout} className="text-error hover:bg-error/20 py-3">
                  <LogOut size={18} className="opacity-70" />
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="flex gap-3 items-center">
          <Link to="/login" className="btn btn-ghost btn-sm sm:btn-md hover:bg-base-content/10 font-medium">
            Login
          </Link>
          <Link to="/signup" className="btn animated-gradient-btn btn-sm sm:btn-md border-0">
            Get Started
          </Link>
        </div>
      )}
    </div>
  );
};

export default NavBar;
