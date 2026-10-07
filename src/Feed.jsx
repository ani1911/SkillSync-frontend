import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFeed, removeFromFeed, setFeedLoading, appendFeed } from "./store/feedSlice";
import axiosInstance from "./utils/axios";
import { BASE_URL } from "./utils/constants";
import { motion, useAnimation, useMotionValue, useTransform } from "framer-motion";
import { X, Heart, Calendar, GitBranch, Link, GraduationCap, Users, Briefcase, Code2 } from "lucide-react";

const getLookingForIcon = (type) => {
  switch(type) {
    case 'mentor': return <GraduationCap size={20} className="text-primary" />;
    case 'collaborator': return <Users size={20} className="text-secondary" />;
    case 'project': return <Briefcase size={20} className="text-accent" />;
    case 'internship': return <Code2 size={20} className="text-info" />;
    default: return <Users size={20} className="text-primary" />;
  }
};

const getExperienceColor = (level) => {
  switch(level) {
    case 'advanced': return 'bg-error/20 text-error';
    case 'intermediate': return 'bg-warning/20 text-warning-content';
    case 'beginner': return 'bg-success/20 text-success';
    default: return 'bg-base-300 text-base-content';
  }
};

const UserCard = ({ user, onSwipe, index }) => {
  const controls = useAnimation();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  const opacity = useTransform(x, [-200, 0, 200], [0.8, 1, 0.8]);
  const likeOpacity = useTransform(x, [20, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-20, -100], [0, 1]);

  const handleDragEnd = async (e, info) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    const swipeThreshold = 100;

    if (offset > swipeThreshold || velocity > 500) {
      await controls.start({ x: 500, opacity: 0, transition: { duration: 0.3 } });
      onSwipe("like", user._id);
    } else if (offset < -swipeThreshold || velocity < -500) {
      await controls.start({ x: -500, opacity: 0, transition: { duration: 0.3 } });
      onSwipe("dislike", user._id);
    } else {
      controls.start({ x: 0, transition: { type: "spring", stiffness: 300, damping: 20 } });
    }
  };

  const handleButtonSwipe = async (type) => {
    const direction = type === "like" ? 500 : -500;
    await controls.start({ x: direction, opacity: 0, transition: { duration: 0.3 } });
    onSwipe(type, user._id);
  };

  const scale = 1 - index * 0.05;
  const yOffset = index * 12;

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
      className={`absolute w-full max-w-[450px] h-[750px] max-h-[85vh] will-change-transform ${index === 0 ? "cursor-grab active:cursor-grabbing" : ""}`}
    >
      <div className="w-full h-full bg-[#1e1e24] shadow-2xl overflow-hidden rounded-[2rem] border border-white/5 flex flex-col relative">
        
        {/* Top Image Banner */}
        <div className="relative h-[45%] w-full shrink-0 bg-base-300">
          <img
            src={user.photourl || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
            alt={user.firstName}
            className="w-full h-full object-cover pointer-events-none"
          />
          {/* Gradient to blend image into the dark content area */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1e1e24] via-[#1e1e24]/40 to-transparent pointer-events-none" />
          
          {/* Top Badges */}
          <div className="absolute top-5 left-5 right-5 flex justify-between items-start pointer-events-none">
            {user.experienceLevel && (
              <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${getExperienceColor(user.experienceLevel)}`}>
                {user.experienceLevel.charAt(0).toUpperCase() + user.experienceLevel.slice(1)}
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
              <motion.div style={{ opacity: likeOpacity }} className="absolute top-1/4 left-8 border-4 border-success text-success text-5xl font-black uppercase tracking-widest px-4 py-1 rounded-xl rotate-[-15deg] pointer-events-none z-20">
                LIKE
              </motion.div>
              <motion.div style={{ opacity: nopeOpacity }} className="absolute top-1/4 right-8 border-4 border-error text-error text-5xl font-black uppercase tracking-widest px-4 py-1 rounded-xl rotate-[15deg] pointer-events-none z-20">
                NOPE
              </motion.div>
            </>
          )}
        </div>
        
        {/* Scrollable Content Area - Stops drag propagation for vertical scroll */}
        <div 
          className="flex-1 overflow-y-auto overflow-x-hidden p-6 -mt-10 z-10 scrollbar-hide"
          onPointerDownCapture={(e) => {
            // Let the parent motion.div handle horizontal drag, but allow vertical scrolling here
          }}
        >
          {/* Header */}
          <div className="mb-4">
            <h2 className="text-3xl font-bold text-white font-sans tracking-tight drop-shadow-md">
              {user.firstName} {user.lastName} <span className="text-2xl text-white/50 font-normal"> {user.age || ""}</span>
            </h2>
            {user.username && <p className="text-primary font-medium text-sm">@{user.username}</p>}
            <p className="text-white/80 font-medium mt-1 leading-snug">
              {user.headline || "Software Developer"}
            </p>
          </div>

          {/* About */}
          {user.about && (
            <div className="mb-5">
              <p className="text-white/60 text-sm leading-relaxed">
                {user.about}
              </p>
            </div>
          )}

          {/* Projects */}
          {user.projects && user.projects.length > 0 && (
            <div className="mb-5 space-y-3">
              {user.projects.map((project, i) => (
                <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-xl relative">
                  <h3 className="text-white font-bold text-sm flex items-center gap-2">
                    {project.title}
                    {project.link && (
                      <a href={project.link} target="_blank" rel="noreferrer" className="text-primary hover:text-primary/80 pointer-events-auto absolute top-4 right-4">
                        <Link size={14} />
                      </a>
                    )}
                  </h3>
                  <p className="text-white/60 text-xs mt-1 leading-relaxed">{project.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {user.skills && user.skills.length > 0 && (
            <div className="mb-5 flex flex-wrap gap-2">
              {user.skills.map((skill, i) => (
                <span key={i} className="px-3 py-1.5 bg-white/5 text-white/90 border border-white/10 rounded-lg font-mono text-xs font-semibold">
                  {skill}
                </span>
              ))}
            </div>
          )}

          {/* Interests */}
          {user.interests && user.interests.length > 0 && (
            <div className="mb-5 flex flex-wrap gap-2">
              {user.interests.map((interest, i) => (
                <span key={i} className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-medium">
                  {interest}
                </span>
              ))}
            </div>
          )}

          {/* Looking For */}
          {user.lookingFor && (
            <div className="mb-6 p-4 bg-white/5 rounded-2xl flex items-center gap-3 border border-white/5">
              <div className="p-2 bg-black/20 rounded-xl">
                {getLookingForIcon(user.lookingFor)}
              </div>
              <p className="text-white/70 text-sm font-medium">
                Looking for a <span className="text-white font-bold capitalize">{user.lookingFor}</span>
              </p>
            </div>
          )}

          {/* Links */}
          <div className="flex gap-3 mb-24">
            {user.githubUrl && (
              <a href={user.githubUrl} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-white/10 text-white/80 rounded-xl transition-colors text-sm font-medium border border-white/10 pointer-events-auto">
                <GitBranch size={16} /> GitHub
              </a>
            )}
            {user.linkedinUrl && (
              <a href={user.linkedinUrl} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-white/10 text-white/80 rounded-xl transition-colors text-sm font-medium border border-white/10 pointer-events-auto">
                <Link size={16} /> LinkedIn
              </a>
            )}
          </div>
        </div>

        {/* Floating Action Buttons */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-8 pointer-events-none">
          <button 
            onClick={() => handleButtonSwipe("dislike")}
            className="btn btn-circle w-16 h-16 bg-[#1e1e24] shadow-2xl border-2 border-error/50 text-error hover:bg-error hover:text-white transition-all transform hover:scale-110 pointer-events-auto"
            disabled={index !== 0}
          >
            <X size={32} strokeWidth={3} />
          </button>
          <button 
            onClick={() => handleButtonSwipe("like")}
            className="btn btn-circle w-16 h-16 bg-[#1e1e24] shadow-2xl border-2 border-success/50 text-success hover:bg-success hover:text-white transition-all transform hover:scale-110 pointer-events-auto"
            disabled={index !== 0}
          >
            <Heart size={32} strokeWidth={3} fill="currentColor" />
          </button>
        </div>

      </div>
    </motion.div>
  );
};

const Feed = () => {
  const dispatch = useDispatch();
  const { users, page, hasMore, loading } = useSelector((store) => store.feed);

  useEffect(() => {
    fetchFeed();
  }, [page]);

  const fetchFeed = async () => {
    if (!hasMore && page !== 1) return;
    try {
      dispatch(setFeedLoading(true));
      const res = await axiosInstance.get(BASE_URL + "/user/feed?page=" + page + "&limit=10", {
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
    <div className="flex justify-center items-center h-full min-h-[calc(100vh-80px)] py-6 px-4 overflow-hidden">
      <div className="relative w-full max-w-[450px] h-[750px] max-h-[85vh] flex justify-center">
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
    </div>
  );
};

export default Feed;
