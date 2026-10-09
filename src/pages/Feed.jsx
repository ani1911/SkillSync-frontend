import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFeed, removeFromFeed, setFeedLoading, appendFeed } from "../store/feedSlice";
import axiosInstance from "../utils/axios";
import { BASE_URL } from "../utils/constants";
import { motion, useAnimation, useMotionValue, useTransform } from "framer-motion";
import { X, Heart, Calendar, GitBranch, Link, GraduationCap, Users, Briefcase, Code2 } from "lucide-react";

const FALLBACK_AVATAR = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face";

const EXPERIENCE_BADGE = {
  beginner: { label: "Beginner", cls: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" },
  intermediate: { label: "Intermediate", cls: "bg-amber-500/20 text-amber-400 border border-amber-500/30" },
  advanced: { label: "Advanced", cls: "bg-rose-500/20 text-rose-400 border border-rose-500/30" },
};

const getLookingForIcon = (type) => {
  switch(type) {
    case 'mentor': return <GraduationCap size={20} className="text-primary" />;
    case 'collaborator': return <Users size={20} className="text-secondary" />;
    case 'project': return <Briefcase size={20} className="text-accent" />;
    case 'internship': return <Code2 size={20} className="text-info" />;
    default: return <Users size={20} className="text-primary" />;
  }
};

const UserCard = ({ user, onSwipe, index }) => {
  const controls = useAnimation();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-5, 5]);
  const opacity = useTransform(x, [-200, 0, 200], [0.8, 1, 0.8]);
  const likeOpacity = useTransform(x, [20, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-20, -100], [0, 1]);

  const handleDragEnd = async (e, info) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    const swipeThreshold = 100;

    if (offset > swipeThreshold || velocity > 500) {
      await controls.start({ x: 800, opacity: 0, transition: { duration: 0.3 } });
      onSwipe("like", user._id);
    } else if (offset < -swipeThreshold || velocity < -500) {
      await controls.start({ x: -800, opacity: 0, transition: { duration: 0.3 } });
      onSwipe("dislike", user._id);
    } else {
      controls.start({ x: 0, transition: { type: "spring", stiffness: 300, damping: 20 } });
    }
  };

  const handleButtonSwipe = async (type) => {
    const direction = type === "like" ? 800 : -800;
    await controls.start({ x: direction, opacity: 0, transition: { duration: 0.3 } });
    onSwipe(type, user._id);
  };

  const scale = 1 - index * 0.05;
  const yOffset = index * 15;

  const skills = typeof user.skills === "string"
    ? user.skills.split(",").map((s) => s.trim()).filter(Boolean)
    : user.skills || [];

  const interests = typeof user.interests === "string"
    ? user.interests.split(",").map((s) => s.trim()).filter(Boolean)
    : user.interests || [];

  const projects = user.projects || [];
  const expBadge = EXPERIENCE_BADGE[user.experienceLevel];

  return (
    <motion.div
      drag={index === 0 ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={controls}
      style={{ 
        x, 
        rotate: index === 0 ? rotate : 0, 
        opacity: index === 0 ? opacity : 1,
        scale,
        y: yOffset,
        zIndex: 10 - index
      }}
      className={`absolute w-full max-w-[800px] will-change-transform ${index === 0 ? "cursor-grab active:cursor-grabbing" : ""}`}
    >
      <div className="w-full h-[75vh] max-h-[800px] min-h-[500px] bg-[#1e1e24] shadow-2xl overflow-hidden rounded-[2rem] border border-white/5 flex flex-col xl:flex-row relative">
        {/* Left Side: Image Banner */}
        <div className="relative h-[250px] xl:h-full xl:w-[35%] shrink-0 bg-base-300">
          <img
            src={user.photourl || FALLBACK_AVATAR}
            alt={user.firstName}
            className="w-full h-full object-cover pointer-events-none"
            onError={(e) => { e.currentTarget.src = FALLBACK_AVATAR; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t xl:bg-gradient-to-r from-[#1e1e24] via-[#1e1e24]/20 to-transparent pointer-events-none" />
          
          <div className="absolute top-5 left-5 right-5 flex flex-col gap-2 items-start pointer-events-none">
            {expBadge && (
              <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${expBadge.cls}`}>
                {expBadge.label}
              </span>
            )}
            {user.availability && (
              <span className="px-3 py-1 bg-black/40 text-white/90 backdrop-blur-md rounded-full text-xs font-semibold flex items-center gap-1.5">
                <Calendar size={12} />
                {user.availability.charAt(0).toUpperCase() + user.availability.slice(1)}
              </span>
            )}
          </div>

          {/* Swipe Stamps */}
          {index === 0 && (
            <>
              <motion.div style={{ opacity: likeOpacity }} className="absolute top-1/3 left-8 border-4 border-success text-success text-4xl font-black uppercase tracking-widest px-4 py-1 rounded-xl rotate-[-15deg] pointer-events-none z-20">
                LIKE
              </motion.div>
              <motion.div style={{ opacity: nopeOpacity }} className="absolute top-1/3 right-8 border-4 border-error text-error text-4xl font-black uppercase tracking-widest px-4 py-1 rounded-xl rotate-[15deg] pointer-events-none z-20">
                NOPE
              </motion.div>
            </>
          )}
        </div>
        
        {/* Right Side: Content Area */}
        <div className="flex-1 relative flex flex-col h-full overflow-hidden">
          <div className="flex-1 p-6 pb-24 xl:p-8 xl:pb-24 overflow-y-auto feed-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <style>{`
              .feed-scrollbar::-webkit-scrollbar {
                display: none;
              }
            `}</style>
          <div className="mb-4">
            <h2 className="text-3xl font-bold text-white font-sans tracking-tight drop-shadow-md">
              {user.firstName} {user.lastName} <span className="text-2xl text-white/50 font-normal"> {user.age || ""}</span>
            </h2>
            {user.username && <p className="text-primary font-medium text-sm">@{user.username}</p>}
            <p className="text-white/80 font-medium mt-1 leading-snug">
              {user.headline || "Software Developer"}
            </p>
          </div>

          {user.lookingFor && (
            <div className="mb-6 p-4 bg-white/5 rounded-xl flex items-center gap-3 border border-white/10">
              <div className="p-2 bg-black/20 rounded-lg">
                {getLookingForIcon(user.lookingFor)}
              </div>
              <p className="text-white/80 text-sm font-medium">
                Looking for a <span className="text-white font-bold capitalize">{user.lookingFor}</span>
              </p>
            </div>
          )}

          {user.about && (
            <div className="mb-6">
              <h3 className="text-white/50 text-xs uppercase tracking-wider font-bold mb-2">About</h3>
              <p className="text-white/80 text-sm leading-relaxed">{user.about}</p>
            </div>
          )}

          {projects.length > 0 && (
            <div className="mb-6">
              <h3 className="text-white/50 text-xs uppercase tracking-wider font-bold mb-3">Projects</h3>
              <div className="grid grid-cols-1 gap-3">
                {projects.map((project, i) => (
                  <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-xl relative group">
                    <h4 className="text-white font-bold text-sm flex items-center gap-2 pr-6">
                      {project.title}
                    </h4>
                    <p className="text-white/60 text-xs mt-1.5 leading-relaxed">{project.description}</p>
                    {project.link && (
                      <a href={project.link} target="_blank" rel="noreferrer" className="text-white/40 hover:text-primary pointer-events-auto absolute top-3 right-3 transition-colors">
                        <Link size={14} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {skills.length > 0 && (
            <div className="mb-6">
              <h3 className="text-white/50 text-xs uppercase tracking-wider font-bold mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <span key={i} className="px-3 py-1.5 bg-base-300 text-white/90 rounded-lg font-mono text-xs font-semibold">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {interests.length > 0 && (
            <div className="mb-8">
              <h3 className="text-white/50 text-xs uppercase tracking-wider font-bold mb-2">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest, i) => (
                  <span key={i} className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-medium">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-auto mb-16 xl:mb-0">
            {user.githubUrl && (
              <a href={user.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-white/5 text-white/80 rounded-xl text-sm font-medium border border-white/10 pointer-events-auto cursor-pointer hover:bg-white/10 transition-colors">
                <GitBranch size={16} /> GitHub
              </a>
            )}
            {user.linkedinUrl && (
              <a href={user.linkedinUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-white/5 text-white/80 rounded-xl text-sm font-medium border border-white/10 pointer-events-auto cursor-pointer hover:bg-white/10 transition-colors">
                <Link size={16} /> LinkedIn
              </a>
            )}
          </div>
          </div>
          
          {/* Floating Action Buttons placed AT THE BOTTOM right */}
          <div className="absolute bottom-6 right-6 flex justify-end gap-4 pointer-events-none z-20">
            <button 
              onClick={() => handleButtonSwipe("dislike")}
              className="btn btn-circle bg-[#1e1e24] shadow-2xl border border-white/10 text-error hover:bg-error hover:border-error hover:text-white transition-all transform hover:scale-110 pointer-events-auto"
              disabled={index !== 0}
            >
              <X size={24} strokeWidth={3} />
            </button>
            <button 
              onClick={() => handleButtonSwipe("like")}
              className="btn btn-circle bg-[#1e1e24] shadow-2xl border border-white/10 text-success hover:bg-success hover:border-success hover:text-white transition-all transform hover:scale-110 pointer-events-auto"
              disabled={index !== 0}
            >
              <Heart size={24} strokeWidth={3} fill="currentColor" />
            </button>
          </div>

        </div>

      </div>
    </motion.div>
  );
};

const Feed = () => {
  const dispatch = useDispatch();
  const { users, page, hasMore, loading } = useSelector((store) => store.feed);
  const loggedInUser = useSelector((store) => store.user);
  const [showSignupModal, setShowSignupModal] = useState(false);

  useEffect(() => {
    fetchFeed();
  }, [page]);

  const fetchFeed = async () => {
    if (!hasMore && page !== 1) return;
    try {
      dispatch(setFeedLoading(true));
      const endpoint = loggedInUser ? "/user/feed" : "/feed";
      const res = await axiosInstance.get(BASE_URL + `${endpoint}?page=` + page + "&limit=10&t=" + Date.now(), {
        withCredentials: true,
      });
      if (page === 1) {
        dispatch(setFeed({ users: res.data.feed, page, hasMore: res.data.feed.length > 0 }));
      } else {
        dispatch(appendFeed({ users: res.data.feed, hasMore: res.data.feed.length > 0 }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(setFeedLoading(false));
    }
  };

  const handleSwipe = async (action, userId) => {
    if (!loggedInUser) {
      // Just visual remove for unauthenticated users and show modal
      dispatch(removeFromFeed(userId));
      setShowSignupModal(true);
      return;
    }
    
    try {
      dispatch(removeFromFeed(userId));
      await axiosInstance.post(BASE_URL + "/match/" + action + "/" + userId, {}, { withCredentials: true });
    } catch (err) {
      console.error("Swipe error:", err);
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <span className="loading loading-ring loading-lg text-primary"></span>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4">
        <div className="w-48 h-48 bg-base-200 rounded-full flex items-center justify-center mb-6 shadow-inner animate-pulse">
          <Heart size={64} className="text-base-content/20" />
        </div>
        <h2 className="text-2xl font-bold text-base-content mb-2 font-sans tracking-tight">You've caught up!</h2>
        <p className="text-base-content/60 max-w-md">There are no more developers in your area. Come back later for more connections or update your profile to increase visibility.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full flex flex-col justify-center items-center py-6 px-4 overflow-hidden relative">
      <div className="relative w-full max-w-[800px] flex justify-center h-[75vh] max-h-[800px] min-h-[500px]">
        {users.slice(0, 3).reverse().map((user, reversedIndex) => {
          const actualIndex = Math.min(users.length, 3) - 1 - reversedIndex;
          return (
            <UserCard 
              key={user._id} 
              user={user} 
              index={actualIndex}
              onSwipe={handleSwipe}
            />
          );
        })}
      </div>

      {/* Sign Up Modal for Unauthenticated Users */}
      {showSignupModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#1e1e24] p-8 rounded-[2rem] border border-white/10 shadow-2xl max-w-md w-full text-center relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
            
            <button onClick={() => setShowSignupModal(false)} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors">
              <X size={20} />
            </button>

            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart size={32} className="text-primary" />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Don't lose this connection!</h2>
            <p className="text-white/60 mb-8 text-sm leading-relaxed">
              Create an account or login to connect with this developer and start collaborating on awesome projects.
            </p>
            
            <div className="flex flex-col gap-3">
              <a href="/signup" className="px-6 py-3.5 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20 w-full">
                Create Free Account
              </a>
              <a href="/login" className="px-6 py-3.5 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl transition-all border border-white/10 w-full">
                Log In
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;
