import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import logo from "./assets/logo.png";
import api from "./utils/axios";
import { FALLBACK_AVATAR } from "./utils/constants";
import { removeUser } from "./store/userSlice";

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
          className="flex items-center gap-2 cursor-pointer group"
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
            <Link to="/matches" className="px-4 py-2 text-sm font-bold text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-all flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              Matches
            </Link>
            <Link to="/connections" className="px-4 py-2 text-sm font-bold text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-all flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              Network
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
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  Profile
                </Link>
              </li>
              <li className="md:hidden">
                <Link to="/matches" className="hover:bg-primary/20 hover:text-primary transition-colors py-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  Matches
                </Link>
              </li>
              <li className="md:hidden">
                <Link to="/connections" className="hover:bg-primary/20 hover:text-primary transition-colors py-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  Network
                </Link>
              </li>
              <li>
                <Link to="/settings" className="hover:bg-primary/20 hover:text-primary transition-colors py-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  Settings
                </Link>
              </li>
              <div className="divider my-0 opacity-20"></div>
              <li>
                <button onClick={handleLogout} className="text-error hover:bg-error/20 py-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
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
